# Notizen – AMETUR

Laufende Arbeitsnotizen zum Repo: offene Punkte und Verlauf der Sessions, damit die Arbeit auf jedem Gerät nahtlos weitergeht.

## Offen / nächste Schritte

- README veraltet:
  - Abschnitt „Anmeldung" beschreibt ein gemeinsames Formular mit `FORMS_URL` und vorausgefüllten
    Links; im Code gibt es kein `FORMS_URL` mehr, jede Veranstaltung hat ein eigenes Formular per `data-form`.
  - „Nächste Termine" nennt fünf Einträge, im Skript ist `MAX = 6`.
  - Taizégebet wird als Eintrag ohne `data-date` genannt; inzwischen sind Termine eingetragen.
  - „Offene Schritte" (DNS, Custom Domain, HTTPS, Forms-URL in `cta`) wirken erledigt – prüfen und
    streichen; „Pages-URL (vorläufig)" ggf. anpassen. Optional: `data-end`, `data-at`, `data-ziel`,
    `data-art`, `data-ab` dokumentieren.
- In anmeldepflichtigen Bereichen ohne `data-form` (kein Anmelde-Button): Vortrag „Widerstand aus
  Berufung" (14.4.27), „Den Schatz der Eucharistie (neu) entdecken" (25.4.27), Filme „Die Hütte"
  (10.5.27) und „Soul" (24.6.27), Taizégebet, Exerzitien im Alltag, Marien-/Maiandachten – klären,
  ob Formulare folgen.
- Termine ohne Datum: Exerzitien im Alltag („Fastenzeit"), Leitsprüche – `data-date` ergänzen, sobald fix.
- Remote-Branches: `claude/new-repo-ukt-fevt1o` (Wartungsprotokoll-App, auf main revertiert) und
  `claude/windows-boot-secure-boot-jkg2eu` (Pater-Chatbot-Prototyp mit eigener CLAUDE.md und
  Interview-Transkripten, im öffentlichen Repo sichtbar) – entscheiden: behalten, auslagern oder löschen.

## Verlauf

### 2026-10-07
Repo nach C:\Users\holub\code geklont, CLAUDE.md und diese Datei angelegt.
Stand: `2c91bdf` – Impulstexte als Zitat: Serifenschrift mit Anfuehrungszeichen statt kursiv
