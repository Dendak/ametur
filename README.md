# AMETUR

Statische Seite zum Jahresprogramm „AMETUR – Menschenbild und Spiritualität"
(Schuljahr 2026/27), Privatgymnasium der Herz-Jesu-Missionare.

Inhalt: alle Termine des Plakats (Vorträge, Gottesdienste & Liturgie, Musik,
Besondere Angebote, Film, Gebet & Spiritualität, Gemeinschaft & Austausch),
Farben und Logo aus dem A1-Plakatentwurf übernommen.

Zweck: Der gedruckte QR-Code zeigt auf diese Seite, nicht direkt auf das
Microsoft-Forms-Formular. Ändert sich das Formular, wird nur der Link in
`index.html` getauscht – die Plakate bleiben gültig.

## Adressen

| | |
|---|---|
| Ziel-Domain | https://ametur.herzjesugym.at/ |
| Pages-URL (vorläufig) | https://dendak.github.io/ametur/ |

## Aufbau

`index.html` plus `ametur-logo.png` (aus dem Plakat-PDF extrahiert). Kein Build, kein Framework, keine Serverlogik –
GitHub Pages liefert nur statische Dateien aus.

## Regeln für Änderungen

- **Pfade relativ halten.** Mit der Custom Domain liegt die Seite im Wurzel-
  verzeichnis (`/`), nicht unter `/ametur/`. `style.css` funktioniert in beiden
  Fällen, `/ametur/style.css` bricht.
- **`CNAME`-Datei nicht löschen**, sobald sie existiert – sonst vergisst Pages
  beim nächsten Deploy die Custom Domain.
- `.nojekyll` liegt im Root, damit Jekyll Dateien und Ordner mit `_` nicht
  ignoriert.
- Repo muss **öffentlich** bleiben: Pages mit Custom Domain gibt es im
  Gratis-Plan nur für öffentliche Repos.

## Offene Schritte

1. DNS bei easyname: `CNAME` mit Name `ametur` → `dendak.github.io.` (TTL 3600).
   Bestehende MX-, TXT/SPF- und autodiscover-Einträge nicht anfassen.
   Die Subdomain **nicht** zusätzlich unter Webhosting → Subdomains anlegen.
2. Prüfen: `nslookup ametur.herzjesugym.at`
3. GitHub → Settings → Pages → Custom domain = `ametur.herzjesugym.at`
4. Nach Zertifikatsausstellung „Enforce HTTPS" aktivieren, erst dann den
   QR-Code mit `https://` erzeugen.
5. Forms-URL in `index.html` eintragen (Abschnitt mit der Klasse `cta`).
