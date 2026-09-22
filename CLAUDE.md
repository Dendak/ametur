# CLAUDE.md – Projektkontext: Pater-Chatbot

Dieser Kontext beschreibt ein Projekt von Denis Holub (Lehrer/IT-Leiter, Privatgymnasium der Herz-Jesu-Missionare, Salzburg).

## Kurzfassung für Claude Code

Projekt: Podcast/Interview-Reihe mit einem Pater (jahrzehntelang auf Mission), aus der gleichzeitig ein KI-Chatbot für die Schul-/Missionswebseite entsteht. Der Bot soll in seinem Sprachstil antworten und Fragen zu seinem Leben beantworten – basierend auf echten Interview-Aussagen, nicht frei erfunden.

Deadline: Live auf der Webseite bis 24.12.2026 (heutiges Datum bei Planungsstand: 22.9.2026).

Architekturentscheidung: **Kein Fine-Tuning.** Stattdessen Retrieval-Augmented Generation (RAG):

- Whisper-Transkription der Roh-Interviews (nicht der geschnittenen Podcast-Version)
- Transkripte in thematische Abschnitte gegliedert, mit Zeitstempeln
- Wissensbasis: Embeddings + Vektordatenbank (z. B. Chroma/Pinecone) oder bei kleiner Datenmenge einfache Volltextsuche
- Backend (Node.js oder Python): Nutzerfrage → Suche in Wissensbasis → Anfrage an Claude API mit Persona-System-Prompt → Antwort
- Frontend: einfaches Chat-Widget (HTML/JS), eingebettet in die bestehende Schul-/Projektwebseite
- Hosting-Optionen: Vercel, Cloudflare Workers oder bestehendes Schul-Webhosting

Offene Punkte (mit dem Pater zu klären, nicht technisch):

- Welche Themen der Bot beantworten darf/nicht darf
- Öffentlich vs. nur intern zugänglich
- Verfügbarkeitsdauer nach Veröffentlichung

## Stand in diesem Repository

Dieses Repo ist primär die statische AMETUR-Seite (GitHub Pages, siehe `README.md`).
Der Chatbot-Prototyp liegt vollständig unter **`pater-chatbot/`**, damit die
statische Seite unberührt bleibt:

```
pater-chatbot/
  transcripts/       Rohtranskripte je Interview (mit Zeitstempeln) – aktuell BEISPIELDATEN
  knowledge-base/    build-index.mjs erzeugt index.json (segmentierte Abschnitte)
  backend/           Node.js-API: Volltextsuche + Claude-API-Aufruf (@anthropic-ai/sdk)
  frontend/          Chat-Widget (HTML/JS), einbettbar; demo.html zum lokalen Testen
```

**Wichtig – öffentliches Repo:** GitHub Pages mit Custom Domain verlangt, dass dieses
Repo öffentlich bleibt. **Echte Interview-Transkripte dürfen daher nicht hier
committet werden**, solange der Pater der Veröffentlichung des Rohtextes nicht
ausdrücklich zugestimmt hat. Die Beispieldaten in `transcripts/` sind fiktive
Platzhalter und als solche markiert. Für echte Daten: privates Repo oder Ablage
direkt beim Backend-Hosting.

Das Backend läuft **nicht** auf GitHub Pages (nur statische Dateien) – es wird
separat gehostet (Vercel, Cloudflare Workers, Schul-Webhosting mit Node); das
Widget spricht es per `data-backend`-URL an.

## Workflow: von der Aufnahme zum Chatbot

| Schritt | Beschreibung |
|---|---|
| 1. Aufnehmen | Interviews/Podcast-Gespräche aufnehmen; Rohaufnahmen aufheben (nicht nur die geschnittene Version) |
| 2. Schneiden fürs Podcast | Fertige Podcast-/Video-Folgen wie gewohnt schneiden und veröffentlichen |
| 3. Rohaufnahmen transkribieren | Parallel die ungeschnittenen Aufnahmen automatisiert transkribieren (z. B. mit Whisper) – das ist die eigentliche Textgrundlage für den Chatbot |
| 4. Transkripte aufbereiten | Grob korrigieren, in thematische Abschnitte gliedern (Kindheit, Ausbildung, Missionsjahre, ...), mit Zeitstempeln versehen für Rückverlinkung zur Podcast-Stelle |
| 5. Wissensbasis (RAG) aufbauen | Aufbereitete Texte durchsuchbar machen (Embeddings/Vektordatenbank oder bei kleiner Menge einfache Textsuche) |
| 6. Backend bauen | Nimmt Nutzerfrage entgegen, sucht passende Zitate, schickt sie mit Persona-Prompt an die Claude-API |
| 7. Chat-Widget auf der Webseite | Einfache Chat-Oberfläche (HTML/JS) einbetten, verbunden mit dem Backend |
| 8. Testen, absichern, veröffentlichen | Kostenlimit/Rate-Limiting, Missbrauchsschutz, ausgiebiger Test durch den Pater selbst |

Vorteil dieses kombinierten Ansatzes: Der Chatbot kann bei einer Antwort auf die passende Podcast-Folge verlinken („Mehr dazu in Folge 3") – erhöht Glaubwürdigkeit und lenkt Traffic zum Podcast.

## Vergleichbare Projekte

| Projekt | Ansatz | Relevanz |
|---|---|---|
| Digitales Exilarchiv-Interview (Kurt S. Maier, Inge Auerbacher) | Original-Interviewantworten, keine generative KI, online nach Anmeldung testbar | Kostenlos live ausprobierbar, deutschsprachig |
| LediZ (LMU München/TU Chemnitz, Abba Naor) | Chatbot explizit für den Schulunterricht entwickelt | Sehr nahe am eigenen Anwendungsfall (Bildungskontext, ein Zeitzeuge im Zentrum) |
| Dimensions in Testimony (USC Shoah Foundation) | Pionierprojekt, stundenlange Interviews, Echtzeit-Fragen, teils als Hologramm | Zeigt die Langzeitperspektive/Skalierung eines solchen Projekts |
| StoryFile | Kommerzielles Tool, auch für Privatpersonen („StoryFile Life") | Fertige Lösung ohne eigene Entwicklung, falls Kauf statt Eigenbau gewünscht |

Alle vier Projekte setzen auf echte, aufgezeichnete Antworten statt frei erfundener KI-Antworten – das ist auch für dieses Projekt der empfohlene Ansatz.

## Technische Architektur

Kein klassisches Fine-Tuning nötig. Statt ein eigenes Modell zu trainieren (aufwendig, braucht große Datenmengen), wird ein bestehendes Sprachmodell (über die Claude-API) mit Retrieval-Augmented Generation (RAG) kombiniert: Bei jeder Frage sucht das System zuerst passende Original-Textstellen aus den Transkripten und gibt sie dem Modell als Kontext mit.

Komponenten:

- **Wissensbasis:** Transkripte, in Abschnitte zerlegt, durchsuchbar (Vektordatenbank wie Pinecone/Chroma, oder bei kleiner Menge eine einfache Volltextsuche)
- **Persona-/System-Prompt:** Anweisungen zu Sprechweise, Tonfall, welche Themen er gerne/ungern bespricht
- **Backend:** kleine API (Node.js), verbindet Nutzerfrage → Suche in der Wissensbasis → Anfrage an die Claude-API → Antwort zurück; hostbar z. B. auf Vercel, Cloudflare Workers oder dem Schul-Webhosting
- **Frontend:** einfaches Chat-Widget (HTML/JS) auf der Webseite eingebettet

Kosten: Transkription ist meist günstig/kostenlos selbst hostbar (Whisper), Claude-API-Kosten pro Antwort liegen im Centbereich – relevant erst bei sehr vielen gleichzeitigen Nutzer:innen.

## Einverständnis & Grenzen

Da der Pater noch lebt, sollte er selbst vor der Veröffentlichung festlegen:

- Welche Themen der Bot beantworten darf und welche nicht
- Ob der Bot nur intern (Gemeinschaft/Schule) oder öffentlich zugänglich ist
- Wie lange und für wen der Bot nach Veröffentlichung verfügbar bleibt
- Wer im Streitfall (z. B. missverständliche Antwort) Ansprechpartner ist

## Zeitplan (bis Weihnachten)

Ziel: Chatbot bis 24.12.2026 live auf der Webseite. Ausgehend vom Planungsstand (22.9.2026) bleiben ca. 13 Wochen.

| Zeitraum | Meilenstein |
|---|---|
| 22.9.–5.10. | Einverständnis & Rahmen mit dem Pater klären; Fragenkatalog für Interviews erstellen |
| 6.10.–19.10. | Erste Interviewtermine, erste Aufnahmen |
| 20.10.–2.11. | Weitere Interviews; parallel Transkription der ersten Aufnahmen starten |
| 3.11.–9.11. | Erste Podcast-Folge schneiden & veröffentlichen; Transkripte thematisch aufbereiten |
| 10.11.–23.11. | Wissensbasis (RAG) aufbauen; Backend-Prototyp mit Claude-API |
| 24.11.–30.11. | Chat-Widget bauen und mit Backend verbinden |
| 1.12.–7.12. | Testen mit dem Pater, Antworten und Persona-Prompt feinjustieren |
| 8.12.–14.12. | Absicherung (Rate-Limiting, Missbrauchsschutz), letzte Korrekturen |
| 15.12.–21.12. | Veröffentlichung auf der Webseite, Abnahmetest |
| bis 24.12. | Fertig – live |

Engster Punkt im Plan: Genug Interviewmaterial bis Anfang November zu haben, da Transkription, Wissensbasis und Backend darauf aufbauen. Bei Verzögerung hier zuerst nachsteuern.
