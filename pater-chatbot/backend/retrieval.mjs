// Einfache Volltextsuche über die Wissensbasis (index.json).
// Bewusst ohne Embeddings/Vektordatenbank – bei der aktuellen Datenmenge
// reicht Termüberlappung (siehe CLAUDE.md, Architekturentscheidung).
// Wächst die Wissensbasis stark, hier auf Embeddings umstellen.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const INDEX_FILE = path.join(here, "..", "knowledge-base", "index.json");

const STOPWORDS = new Set([
  "aber", "als", "am", "an", "auch", "auf", "aus", "bei", "bin", "bis", "das",
  "dass", "dem", "den", "der", "des", "die", "doch", "dort", "ein", "eine",
  "einem", "einen", "einer", "er", "es", "für", "gab", "hat", "hatte", "haben",
  "ich", "ihr", "ihre", "im", "in", "ist", "ja", "kann", "man", "mein", "mich",
  "mir", "mit", "nach", "nicht", "noch", "nur", "oder", "sein", "seine", "sie",
  "sind", "so", "über", "um", "und", "uns", "vom", "von", "vor", "war", "waren",
  "was", "wenn", "wie", "wir", "wird", "wo", "zu", "zum", "zur",
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .normalize("NFC")
    .replace(/[^a-zäöüß0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

let index = null;

export function loadIndex() {
  if (!index) {
    index = JSON.parse(fs.readFileSync(INDEX_FILE, "utf8")).map((chunk) => ({
      ...chunk,
      tokens: new Set(tokenize(`${chunk.thema} ${chunk.frage} ${chunk.text}`)),
    }));
  }
  return index;
}

// Liefert die bestpassenden Abschnitte zur Frage, Score > 0, max. `limit`.
export function search(question, limit = 3) {
  const terms = tokenize(question);
  if (terms.length === 0) return [];

  const scored = loadIndex().map((chunk) => {
    let score = 0;
    for (const term of terms) {
      if (chunk.tokens.has(term)) {
        score += 2; // exakter Worttreffer
      } else {
        // Teilwort-Treffer fängt Flexionen ab (Kindheit/Kindheitserinnerung)
        for (const token of chunk.tokens) {
          if (token.includes(term) || term.includes(token)) { score += 1; break; }
        }
      }
    }
    return { chunk, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.chunk);
}
