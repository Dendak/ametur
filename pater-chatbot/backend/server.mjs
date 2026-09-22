// Pater-Chatbot – Backend-Prototyp
//
// Ablauf pro Frage (RAG, siehe CLAUDE.md):
//   Nutzerfrage → Volltextsuche in der Wissensbasis → Claude-API mit
//   Persona-System-Prompt + gefundenen Originalzitaten → Antwort.
//
// Start:   ANTHROPIC_API_KEY=... node server.mjs
// Konfig:  PORT (Standard 3000), ALLOWED_ORIGIN (Standard *; für den
//          Livegang auf https://ametur.herzjesugym.at setzen)

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";
import { search } from "./retrieval.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const frontendDir = path.join(here, "..", "frontend");

const PORT = Number(process.env.PORT || 3000);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";
const MODEL = "claude-opus-5";
const MAX_HISTORY_TURNS = 6; // Kostenbremse: nur die letzten Runden mitsenden

const client = new Anthropic(); // liest ANTHROPIC_API_KEY aus der Umgebung

// Persona-Prompt: stabil halten (wird gecacht); die variablen Zitate
// wandern in die User-Nachricht, damit der Cache-Präfix erhalten bleibt.
const SYSTEM_PROMPT = `Du beantwortest Fragen im Namen eines Paters der Herz-Jesu-Missionare, der jahrzehntelang auf Mission war. Grundlage sind ausschließlich Original-Auszüge aus Interviews mit ihm, die dir bei jeder Frage mitgegeben werden.

Regeln:
- Antworte in der Ich-Form, in seinem Ton: ruhig, warmherzig, bescheiden, mit einfachen Bildern aus dem Alltag. Kurze Antworten (2–5 Sätze), Deutsch.
- Stütze dich NUR auf die mitgelieferten Auszüge. Erfinde keine Lebensereignisse, Orte, Namen oder Jahreszahlen dazu.
- Steht die Antwort nicht in den Auszügen, sage ehrlich, dass du dazu in den bisherigen Gesprächen nichts erzählt hast – und lade ein, eine andere Frage zu stellen.
- Wenn ein Auszug eine Folgen-Nummer trägt, darfst du am Ende auf die Podcast-Folge verweisen (z. B. "Mehr dazu erzähle ich in Folge 2.").
- Bei Fragen, die nichts mit dem Leben des Paters zu tun haben (Technik, Politik, Hausaufgaben ...), lenke freundlich zurück zum Thema.
- Dies ist ein KI-Chatbot auf Basis echter Interviews; wirst du direkt danach gefragt, bestätige das offen.`;

function contextBlock(chunks) {
  return chunks
    .map(
      (c) =>
        `<auszug folge="${c.folge}" thema="${c.thema}" zeit="${c.timestamp}">\n` +
        `Frage im Interview: ${c.frage}\n${c.text}\n</auszug>`,
    )
    .join("\n\n");
}

// --- einfaches Rate-Limiting pro IP (Missbrauchsschutz für den Prototyp) ---
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 10;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_REQUESTS_PER_WINDOW;
}

// --- HTTP-Helfer -----------------------------------------------------------
function sendJson(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c) => {
      data += c;
      if (data.length > 16_384) { reject(new Error("payload too large")); req.destroy(); }
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

// Verlauf vom Client übernehmen, aber nur Text und gültige Rollen.
function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter(
      (m) =>
        m && (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" && m.content.length < 2000,
    )
    .slice(-MAX_HISTORY_TURNS * 2)
    .map((m) => ({ role: m.role, content: m.content }));
}

async function handleChat(req, res) {
  const ip = req.socket.remoteAddress || "?";
  if (rateLimited(ip)) {
    return sendJson(res, 429, { error: "Zu viele Anfragen – bitte kurz warten." });
  }

  let payload;
  try {
    payload = JSON.parse(await readBody(req));
  } catch {
    return sendJson(res, 400, { error: "Ungültige Anfrage." });
  }
  const question = typeof payload.question === "string" ? payload.question.trim() : "";
  if (!question || question.length > 500) {
    return sendJson(res, 400, { error: "Bitte eine Frage mit höchstens 500 Zeichen stellen." });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return sendJson(res, 500, { error: "Der Chatbot ist gerade nicht erreichbar (Konfiguration)." });
  }

  const chunks = search(question, 3);
  if (chunks.length === 0) {
    // Kein Treffer in der Wissensbasis → ohne API-Aufruf ehrlich antworten.
    return sendJson(res, 200, {
      answer:
        "Dazu habe ich in den bisherigen Gesprächen nichts erzählt. " +
        "Fragen Sie mich gern etwas über meine Kindheit, meine Berufung oder die Missionsjahre.",
      quellen: [],
    });
  }

  const messages = [
    ...sanitizeHistory(payload.history),
    {
      role: "user",
      content: `Interview-Auszüge zur aktuellen Frage:\n\n${contextBlock(chunks)}\n\nFrage der Besucherin/des Besuchers: ${question}`,
    },
  ];

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 2048, // Antworten sind bewusst kurz (2–5 Sätze)
      system: [
        { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
      ],
      messages,
    });

    if (response.stop_reason === "refusal") {
      return sendJson(res, 200, {
        answer: "Diese Frage möchte ich hier nicht beantworten. Stellen Sie mir gern eine andere Frage zu meinem Leben.",
        quellen: [],
      });
    }

    const answer = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    sendJson(res, 200, {
      answer,
      quellen: chunks.map((c) => ({ folge: c.folge, thema: c.thema, timestamp: c.timestamp })),
    });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      console.error("ANTHROPIC_API_KEY fehlt oder ist ungültig.");
      return sendJson(res, 500, { error: "Der Chatbot ist gerade nicht erreichbar (Konfiguration)." });
    }
    if (error instanceof Anthropic.RateLimitError) {
      return sendJson(res, 503, { error: "Gerade viel los – bitte in einer Minute noch einmal versuchen." });
    }
    if (error instanceof Anthropic.APIError) {
      console.error(`Claude-API-Fehler ${error.status}:`, error.message);
      return sendJson(res, 502, { error: "Der Chatbot ist gerade nicht erreichbar." });
    }
    console.error("Unerwarteter Fehler:", error);
    sendJson(res, 500, { error: "Interner Fehler." });
  }
}

// --- statische Auslieferung des Widgets (nur für lokales Testen) ------------
const STATIC = {
  "/": ["demo.html", "text/html; charset=utf-8"],
  "/demo.html": ["demo.html", "text/html; charset=utf-8"],
  "/chat-widget.js": ["chat-widget.js", "text/javascript; charset=utf-8"],
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }

  if (req.method === "POST" && url.pathname === "/api/chat") {
    return handleChat(req, res);
  }

  if (req.method === "GET" && STATIC[url.pathname]) {
    const [file, type] = STATIC[url.pathname];
    res.writeHead(200, { "Content-Type": type });
    return res.end(fs.readFileSync(path.join(frontendDir, file)));
  }

  sendJson(res, 404, { error: "Nicht gefunden." });
});

server.listen(PORT, () => {
  console.log(`Pater-Chatbot-Backend läuft auf http://localhost:${PORT}`);
  console.log(`Demo-Seite:  http://localhost:${PORT}/`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("Hinweis: ANTHROPIC_API_KEY ist nicht gesetzt – Chat-Anfragen werden fehlschlagen.");
  }
});
