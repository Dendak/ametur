# Pater-Chatbot – Prototyp

Prototyp für den KI-Chatbot aus dem Podcast-/Interviewprojekt
(Gesamtkontext: `../CLAUDE.md`). Pipeline: Transkript → Wissensbasis →
Backend (RAG + Claude-API) → Chat-Widget.

**Die Transkripte in `transcripts/` sind fiktive Beispieldaten**, damit sich
das Prinzip testen lässt, bevor echte Interviews vorliegen. Echte Transkripte
gehören **nicht** in dieses öffentliche Repo (siehe Hinweis in `../CLAUDE.md`).

## Ordner

| Ordner | Inhalt |
|---|---|
| `transcripts/` | Ein Markdown-Transkript pro Interview, mit Zeitstempeln `[hh:mm:ss]`, Sprechern `I:`/`P:` und `## Thema`-Überschriften |
| `knowledge-base/` | `build-index.mjs` zerlegt die Transkripte in Frage-Antwort-Abschnitte → `index.json` |
| `backend/` | Node.js-Server: `/api/chat` = Volltextsuche + Claude-API-Aufruf (`@anthropic-ai/sdk`) |
| `frontend/` | `chat-widget.js` (einbettbar) und `demo.html` (lokale Testseite) |

## Lokal ausprobieren

Voraussetzung: Node.js ≥ 18 und ein Anthropic-API-Key
(<https://console.anthropic.com/>).

```bash
cd pater-chatbot/backend
npm install
npm run build-index          # Wissensbasis aus den Transkripten bauen
ANTHROPIC_API_KEY=sk-ant-... npm start
```

Dann <http://localhost:3000/> öffnen – die Demo-Seite bindet das Widget ein.

## Neues Transkript hinzufügen

1. Markdown-Datei nach dem Muster der Beispieldateien in `transcripts/` legen
   (`- Folge: N`, `## Thema`, `[hh:mm:ss] I: …` / `[hh:mm:ss] P: …`).
2. `npm run build-index` ausführen – fertig, der Server liest `index.json`
   beim nächsten Start.

## Einbettung in die Webseite

```html
<script src="https://<seite>/chat-widget.js"
        data-backend="https://<backend-host>" defer></script>
```

`data-backend` zeigt auf das separat gehostete Backend (GitHub Pages liefert
nur statische Dateien). Beim Backend `ALLOWED_ORIGIN` auf die Seiten-Domain
setzen, z. B. `https://ametur.herzjesugym.at`.

## Eingebaute Absicherung (Prototyp-Niveau)

- Rate-Limiting: max. 10 Anfragen pro Minute und IP
- Fragen auf 500 Zeichen begrenzt, Verlauf auf die letzten 6 Runden
- Ohne Treffer in der Wissensbasis wird gar kein API-Aufruf gemacht
- Persona-Prompt verbietet erfundene Lebensereignisse und lenkt bei
  themenfremden Fragen zurück

Vor dem Livegang zusätzlich klären/ergänzen: Themen-Sperrliste des Paters,
Kostenlimit im Anthropic-Dashboard, Logging/Monitoring, Hosting-Entscheidung
(Vercel / Cloudflare Workers / Schul-Webhosting).
