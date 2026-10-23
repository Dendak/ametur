# Notizen – AMETUR

Laufende Arbeitsnotizen zum Repo: offene Punkte und Verlauf der Sessions, damit die Arbeit auf jedem Gerät nahtlos weitergeht.

## Nächster Schritt

1. Kalender-Buttons auf echten Handys testen (bisher nur am PC in Chromium):
   - iPhone/Safari: „Apple-Kalender / Outlook" soll direkt den Eintragen-Dialog zeigen
     (Seite nutzt dort eine `data:text/calendar`-Adresse ohne Download).
   - Android: „Google Kalender" soll den vorausgefüllten Termin öffnen.
   - Klappt etwas nicht: Verhalten notieren und im Skript (`kalenderZeigen`) anpassen.
2. Vom Nutzer Angaben einholen für die offenen Punkte 7–10 der Verbesserungsliste (unten).

## Verbesserungsliste der Seite (Review vom 2026-10-10)

Erledigt und live:
- [x] 1 „Nächste Termine" am selben Tag nach Uhrzeit sortieren (PR #3)
- [x] 2 Vergangene Termine im Programm ausgrauen („· vorbei"), ohne Anmelde-Button (PR #3)
- [x] 3 Anmelde-Hinweis korrigiert („Wo die Anmeldung bereits möglich ist …") (PR #3)
- [x] 4 „Widerstand aus Berufung (für Klassen)" vom Abendvortrag unterscheidbar (PR #3)
- [x] 5 Nachtwallfahrt mit `data-end` 22.5.27 (PR #3)
- [x] 6 „In den Kalender"-Buttons (.ics + Google) bei jedem kommenden Termin (PR #4)
- [x] 11 Link-Vorschau: og:image/og:url absolut, canonical (PR #3)
- [x] 12 Logo verkleinert (366 → 138 KB), eigenes Favicon + Apple-Touch-Icon (PR #3)
- [x] 13 (teilweise) Kontrast: Kopfzeile und Fußzeile dunkel statt hell auf Orange (PR #3)

Offen – braucht Angaben/Entscheidung des Nutzers:
- [ ] 7 Adresse/Anfahrt: Schuladresse mit Kartenlink; Externe kennen „Theatersaal",
      „Chevaliersaal", „Josefskapelle" nicht. Ggf. auch Pfarrkirche Taxham, Maria Kirchental.
- [ ] 8 Kurzer Einleitungstext oben: Was ist AMETUR, für wen, Eintritt frei?
- [ ] 9 Kontakt (E-Mail) und Link zur Schulhomepage – fehlen ganz.
- [ ] 10 Impressum/Offenlegung (§ 5 ECG, § 25 MedienG) + Datenschutzhinweis (GitHub Pages loggt
      IPs, Formulare bei Microsoft). Vorschlag: Links auf Impressum/Datenschutz der Schulwebsite,
      falls diese AMETUR abdecken – an der Schule prüfen lassen.
- [ ] 13 (Rest, optional) Bereichsüberschriften hell auf Orange (ca. 2,5:1) – bewusst im Plakat-Look belassen.

## Weitere offene Punkte

- README veraltet:
  - Abschnitt „Anmeldung" beschreibt ein gemeinsames Formular mit `FORMS_URL` und vorausgefüllten
    Links; im Code gibt es kein `FORMS_URL` mehr, jede Veranstaltung hat ein eigenes Formular per `data-form`.
  - „Nächste Termine" nennt fünf Einträge, im Skript ist `MAX = 6`.
  - Taizégebet wird als Eintrag ohne `data-date` genannt; inzwischen sind Termine eingetragen.
  - „Offene Schritte" (DNS, Custom Domain, HTTPS, Forms-URL in `cta`) wirken erledigt – prüfen und
    streichen; „Pages-URL (vorläufig)" ggf. anpassen. Optional: `data-end`, `data-at`, `data-ziel`,
    `data-art`, `data-ab`, Kalender-Regeln und „vorbei"-Logik dokumentieren (Kurzfassung steht in CLAUDE.md).
- In anmeldepflichtigen Bereichen ohne `data-form` (kein Anmelde-Button): Filme „Die Hütte"
  (10.5.27) und „Soul" (24.6.27), Taizégebet, Exerzitien im Alltag, Marien-/Maiandachten – klären,
  ob Formulare folgen. Rorate bewusst ohne Anmeldung.
- Neue Formulare entstehen als Kopie eines bestehenden AMETUR-Formulars (Forms-Konto Denis Holub),
  Titel „AMETUR · T.M.JJ · Titel", Mitbearbeiter: Roman Neumayer und Edith Aigner
  (Bestimmte Personen der Schule). Stand 2026-10-23: alle 24 AMETUR-Formulare mit beiden geteilt.
  Beim Kopieren werden Mitbearbeiter nicht übernommen – nach jeder Kopie neu teilen.
- Termine ohne Datum: Exerzitien im Alltag („Fastenzeit"), Leitsprüche – `data-date` ergänzen, sobald fix.
- Remote-Branches: `claude/new-repo-ukt-fevt1o` (Wartungsprotokoll-App, auf main revertiert) und
  `claude/windows-boot-secure-boot-jkg2eu` (Pater-Chatbot-Prototyp mit eigener CLAUDE.md und
  Interview-Transkripten, im öffentlichen Repo sichtbar) – entscheiden: behalten, auslagern oder löschen.

## Hinweise zum Testen

- Das Browser-Fenster der Claude-App öffnet keine `file://`-Adressen. Lokal testen über einen kleinen
  Webserver plus `.claude/launch.json` (nicht committen). Auf dem Windows-PC vom 2026-10-10 gab es weder
  Python noch Node, dort lief ein PowerShell-`HttpListener` auf Port 8765.
- Andere Daten simulieren: im Browser `Date` überschreiben und die Seite neu schreiben
  (`document.write` des per `fetch` geladenen HTML mit vorangestelltem Skript).

## Verlauf

### 2026-10-23 (2)
Herz-Jesu-Freitag mit Anmeldung: 5 Formulare (6.11.26, 8.1.27, 5.2.27, 5.3.27, 2.4.27), Bereich
„Gemeinschaft & Austausch" mit `data-anmeldung`, Hinweistext ergänzt. Alle älteren AMETUR-Formulare
(inkl. „Spirituelle Impulse", nicht auf der Seite verlinkt) zusätzlich mit Roman Neumayer geteilt;
Edith Aigner war dort schon Mitbearbeiterin. Juno-Formular hat einen alten „Als Vorlage teilen"-Link.

### 2026-10-23
Anmeldung auch für alle Vorträge und Gottesdienste (außer Rorate): 4 neue Forms-Formulare
(Widerstand aus Berufung 14.4.27, Schatz der Eucharistie 25.4.27, Nachtwallfahrt 21.5.27,
Dankgottesdienst 9.7.27), mit Roman Neumayer und Edith Aigner geteilt; `data-form` eingetragen,
Gottesdienste-Bereich mit `data-anmeldung`, Anmelde-Hinweis ergänzt. Direkt auf `main`, live.

### 2026-10-13
Schluss auf diesem Gerät (Wechsel auf anderen PC). Notizen vervollständigt: Verbesserungsliste mit
Stand, nächster Schritt (Handy-Test der Kalender-Buttons, Angaben für Punkte 7–10). Keine
unfertigen Änderungen an `index.html`, keine offenen Branches dieser Session.

### 2026-10-11
PR #4 (Kalender-Buttons) gemergt und live (`dac302e`). Live-Prüfung erledigt: 47 Kalender-Buttons
(41 im Programm + 6 in „Nächste Termine"), 16 Anmelde-Buttons (13 + 3), Auswahlfenster mit
korrekten Angaben. Nicht geprüft: echte Handys (iPhone/Android).

### 2026-10-10 (2)
Kalender-Buttons (Branch `kalender-buttons`, PR #4): jeder kommende Termin im Programm und in
„Nächste Termine" hat einen Kalender-Button; Auswahl „Apple-Kalender / Outlook" (.ics, auf iOS
direkt geöffnet) oder „Google Kalender". Stabile Sprunganker aus Datum + Titel. Stundengebet:
Ort Klosterkirche in `data-time` ergänzt. Buttons in Listen brechen auf dem Handy sauber um.

### 2026-10-10
Neues Gerät eingerichtet (keine lokalen/ignorierten Dateien nötig). PR #3 (`498c655`, gemergt, live):
„Nächste Termine" am selben Tag nach Uhrzeit sortiert; vergangene Termine im Programm ausgegraut
(„· vorbei"), ohne Anmelde-Button; Anmelde-Hinweis korrigiert; „Widerstand aus Berufung" (Klassen)
eigener Titel; Nachtwallfahrt mit `data-end`; og:-Tags absolut + canonical; Logo verkleinert
(366 → 138 KB), eigenes Favicon/Apple-Touch-Icon; Kopfzeile und Fußzeile dunkel statt hell (Kontrast).

### 2026-10-07
Repo nach C:\Users\holub\code geklont, CLAUDE.md und diese Datei angelegt.
Stand: `2c91bdf` – Impulstexte als Zitat: Serifenschrift mit Anfuehrungszeichen statt kursiv
