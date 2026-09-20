# UKT Wartungsprotokoll (Prototyp)

Mobile Web-App für Servicetechniker: Wartungsprotokoll für Klimaanlagen
(Lidl Markt / Lager) direkt vor Ort am Handy ausfüllen, als PDF erzeugen
und per Mail / WhatsApp / Teilen-Menü verschicken.

Digitalisiert das bisherige Papierformular der
Kammerlander Umwelt- und Klimatechnik GmbH (ukt.at) 1:1:

- Auftragsdaten (Datum, Bestellnummer, Lidl-Auftragsnummer, FM-Region, Filiale, Wartungsart)
- Wartungsunternehmen inkl. F-Gase-Zertifikatsnummern
- Bis zu drei Anlagen (Typ, Regelung, Hersteller, Seriennummer, …)
- Checkliste der durchgeführten Wartungsarbeiten
- Mängel mit Priorität und Maßnahme/Frist
- Ergebnis, Bemerkungen
- **Unterschriften per Finger** (Techniker + Auftraggebervertreter)
- **PDF-Erzeugung komplett im Browser** (jsPDF, kein Server nötig)
- **Teilen/Senden** über das native Teilen-Menü des Handys, sonst Download

## Technik

- Eine einzige `index.html` (kein Build-Schritt, keine Abhängigkeiten außer `vendor/jspdf.umd.min.js`)
- PWA: `manifest.webmanifest` + `sw.js` → funktioniert offline und lässt sich
  „Zum Startbildschirm hinzufügen“ (sieht dann aus wie eine echte App)
- Entwürfe und Techniker-Stammdaten werden per `localStorage` auf dem Gerät gemerkt

## Betreiben / Hosten

Beliebiges statisches Hosting reicht, z. B. GitHub Pages:
Repo-Einstellungen → Pages → Branch wählen. HTTPS ist Voraussetzung für
Service Worker (offline) und Web Share API (Teilen).

## Lokal testen

```bash
cd ukt
python3 -m http.server 8000
# dann http://localhost:8000 am Handy im selben WLAN öffnen
```

## Nächste Ausbaustufen (optional)

- Fotos (vorher/nachher, Typenschild) mit ins PDF
- Automatischer Mailversand + Archiv über ein kleines Backend
- Filial-Stammdaten (Adresse automatisch aus Filialnummer)
