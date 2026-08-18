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

## Papier-Körnung

Der orange Hintergrund trägt die Körnung des Plakats. Sie steckt in `koernung.png`
– einer nahtlos kachelbaren Rauschkachel aus der Texturebene des Original-PDFs – und
wird per `background-blend-mode: overlay` mit dem Orange verrechnet. Sie liegt
**hinter** dem Inhalt, die farbigen Blöcke bleiben glatt.

## „Nächste Termine"

Oben auf der Seite steht eine Liste der nächsten fünf Veranstaltungen. Sie wird beim
Öffnen der Seite im Browser aus dem Programm darunter gebaut – es gibt keine zweite
Terminliste, die gepflegt werden müsste.

Grundlage ist das Attribut `data-date="JJJJ-MM-TT"` an einem Listeneintrag. Ergänzend:

- `data-time` – kurze Zeit-/Ortsangabe für die Übersicht
- `data-title` – Titel, wenn der Eintrag kein `<h3>` hat (z. B. Filme, Rorate)

Einträge ohne `data-date` (Taizégebet „im Oktober", Exerzitien „Fastenzeit",
Leitsprüche) erscheinen nur im Programm, nicht in der Übersicht. Sobald ein Datum
feststeht, genügt das Attribut – die Übersicht nimmt es automatisch auf.
Ohne JavaScript bleibt die Box ausgeblendet, das Programm ist trotzdem vollständig da.

## Anmeldung

Angemeldet wird nur bei **Vorträgen & Gesprächen**, **Filmen** und
**Gebet & Spiritualität**. Diese drei Bereiche tragen im HTML das Attribut
`data-anmeldung` an ihrem `<section class="block">`; jede Veranstaltung darin
bekommt automatisch einen „Anmelden"-Button, ebenso ihre Zeile in „Nächste Termine".

Die Adresse des Formulars steht **an genau einer Stelle** – im `<script>` am Ende
der Datei:

    var FORMS_URL = "https://forms.office.com/";

Soll ein Eintrag auf einen eigenen Link zeigen (z. B. auf einen in Microsoft Forms
vorausgefüllten Link, bei dem die Veranstaltung schon angekreuzt ist), bekommt sein
`<li>` zusätzlich `data-form="https://…"`. Das sticht `FORMS_URL` für diesen Eintrag.

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
