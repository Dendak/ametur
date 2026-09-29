#!/usr/bin/env node
// Baut die Wissensbasis: liest alle Transkripte aus ../transcripts/,
// zerlegt sie in Frage-Antwort-Abschnitte und schreibt index.json.
//
// Aufruf:  node build-index.mjs
//
// Erwartetes Transkript-Format (Markdown):
//   - Folge: <Nummer>
//   ## <Thema>
//   [hh:mm:ss] I: <Frage>
//   [hh:mm:ss] P: <Antwort>

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const transcriptsDir = path.join(here, "..", "transcripts");
const outFile = path.join(here, "index.json");

const LINE = /^\[(\d{2}:\d{2}:\d{2})\]\s*([IP]):\s*(.+)$/;

function parseTranscript(file) {
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);

  let folge = null;
  let thema = "";
  const chunks = [];
  let current = null; // { timestamp, frage, antwort }

  const flush = () => {
    if (current && current.antwort) {
      chunks.push({
        folge,
        thema,
        timestamp: current.timestamp,
        frage: current.frage,
        text: current.antwort,
      });
    }
    current = null;
  };

  for (const raw of lines) {
    const line = raw.trim();

    const meta = line.match(/^-\s*Folge:\s*(\d+)/);
    if (meta) { folge = Number(meta[1]); continue; }

    const heading = line.match(/^##\s+(.+)$/);
    if (heading) { flush(); thema = heading[1].trim(); continue; }

    const m = line.match(LINE);
    if (!m) continue;
    const [, timestamp, speaker, content] = m;

    if (speaker === "I") {
      flush();
      current = { timestamp, frage: content, antwort: "" };
    } else if (speaker === "P") {
      if (!current) current = { timestamp, frage: "", antwort: "" };
      current.timestamp = current.antwort ? current.timestamp : timestamp;
      current.antwort += (current.antwort ? " " : "") + content;
    }
  }
  flush();
  return chunks;
}

const files = fs
  .readdirSync(transcriptsDir)
  .filter((f) => f.endsWith(".md"))
  .sort();

const index = [];
for (const f of files) {
  const chunks = parseTranscript(path.join(transcriptsDir, f));
  for (const c of chunks) {
    index.push({ id: `${f}#${index.length}`, quelle: f, ...c });
  }
}

fs.writeFileSync(outFile, JSON.stringify(index, null, 2) + "\n", "utf8");
console.log(`${index.length} Abschnitte aus ${files.length} Transkript(en) → ${path.relative(process.cwd(), outFile)}`);
