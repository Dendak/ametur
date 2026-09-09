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

Das Formular heißt **„AMETUR – Anmeldung"** und liegt in Microsoft Forms
(Konto Denis Holub). Es hat eine Frage mit allen anmeldepflichtigen Veranstaltungen
als Mehrfachauswahl, dazu Name, Kontakt, Personenzahl und Anmerkungen. Antworten
darf **jede Person** (anonym, ohne Anmeldung) – sonst kämen Eltern nicht hinein.

Die allgemeine Adresse steht als `FORMS_URL` im `<script>` am Seitenende.
Zusätzlich trägt **jede** anmeldepflichtige Veranstaltung ein eigenes
`data-form="…"` – einen vorausgefüllten Link, bei dem genau diese Veranstaltung
schon angekreuzt ist. `data-form` sticht `FORMS_URL`.

Aufbau eines solchen Links:

    https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=<Formular-ID>
      &rdcf9fc59ab6b40e59a7c4eecb5c9d3fb=<URL-kodiert: "[\"Optionstext\"]">

`rdcf9…` ist die ID der Veranstaltungsfrage. Der Optionstext muss **zeichengenau**
mit der Antwortmöglichkeit in Forms übereinstimmen, sonst bleibt das Kästchen leer.

Kommt eine Veranstaltung dazu: erst die Antwortmöglichkeit in Forms ergänzen,
dann denselben Text hier als `data-form`-Link einsetzen. Ändert sich das Formular
komplett, werden `FORMS_URL` und die `data-form`-Links getauscht – die gedruckten
Plakate bleiben gültig, weil der QR-Code auf diese Seite zeigt.

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
