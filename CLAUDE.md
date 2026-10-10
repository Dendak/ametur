# CLAUDE.md – AMETUR

## Zweck
Statische Programmseite „AMETUR – Menschenbild und Spiritualität" (Schuljahr 2026/27,
Privatgymnasium der Herz-Jesu-Missionare). Der QR-Code auf den gedruckten Plakaten zeigt
auf diese Seite; Anmeldungen laufen über verlinkte Microsoft-Forms-Formulare.

## Stack
Reines HTML/CSS/Vanilla-JS in einer Datei. Kein Framework, kein Build, keine Abhängigkeiten,
keine Serverlogik. Gehostet über GitHub Pages.

## Struktur
- `index.html` – gesamte Seite: CSS im `<style>`, Programm als HTML, Skript am Seitenende
  (baut „Nächste Termine" aus `data-date`/`data-end`/`data-at`/`data-title`/`data-time`,
  hängt Anmelde-Buttons aus `data-form` an, schaltet Impulstexte per `data-ab` zeitgesteuert frei).
- `ametur-logo.png` (Original, og:image), `ametur-logo-web.png` (400 px, Logo im Kopf),
  `favicon.png`, `apple-touch-icon.png` (aus dem Original verkleinert),
  `koernung.png` (Papier-Körnung als Hintergrundkachel).
- `CNAME` – Custom Domain. `.nojekyll` – Jekyll aus.
- `README.md` – Doku zu Aufbau und Pflege (teilweise veraltet, siehe docs/POZNAMKY.md).

## Befehle
- Kein Build. Ansehen: `index.html` direkt im Browser öffnen.
- Keine Tests. „Nächste Termine" und Impulse hängen vom aktuellen Datum/Uhrzeit des Browsers ab.

## Deployment
GitHub Pages (legacy) aus `main`, Root-Verzeichnis, Repo `Dendak/ametur` (öffentlich).
Live unter https://ametur.herzjesugym.at/ . **Jeder Push auf `main` ist sofort live.**
Kein GitHub-Actions-Workflow; andere Branches deployen nicht.

## Vorsicht
- Push auf `main` = Live-Deployment für alle, die den Plakat-QR-Code scannen.
- `CNAME` nicht löschen/ändern, sonst verliert Pages die Custom Domain.
- Pfade relativ halten (kein führendes `/ametur/`). `.nojekyll` behalten. Ausnahme: `canonical`
  und `og:*` im `<head>` brauchen absolute Adressen, sonst fehlt das Bild in Link-Vorschauen.
- Repo muss öffentlich bleiben (Pages + Custom Domain im Gratis-Plan) – also nichts
  Vertrauliches committen, auch nicht auf Nebenbranches.
- Personenbezogene Daten: Namen von Referent:innen und Lehrkräften (u. a. Herz-Jesu-Freitag)
  stehen öffentlich in `index.html`; README nennt das Forms-Konto. Nur Freigegebenes ergänzen.
- `data-form`-Links sind die öffentlichen Formular-Adressen; beim Tauschen pro Veranstaltung prüfen.
- Keine API-Keys/Secrets auf `main` gefunden (Stand 2026-10-07). Frontend ist komplett öffentlich –
  nie Schlüssel in `index.html` oder JS legen.
- Remote-Branch `claude/windows-boot-secure-boot-jkg2eu` enthält eine eigene `CLAUDE.md`
  (Pater-Chatbot) – Konflikt beim Mergen beachten.

## Arbeit über mehrere Geräte
- GitHub ist die Quelle der Wahrheit. Repo lokal unter `C:\Users\holub\code\ametur`, nie in OneDrive.
- Session-Start: `git pull`, dann diese Datei und [docs/POZNAMKY.md](docs/POZNAMKY.md) lesen.
- Session-Ende: `docs/POZNAMKY.md` aktualisieren (Offen + Verlauf), committen, pushen.
- Größere oder riskante Änderungen über Branch + Pull Request, weil `main` live deployt.
