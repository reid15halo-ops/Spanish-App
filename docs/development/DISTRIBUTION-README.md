# Spanish Learning App - Benutzeranleitung

Eine offline-fähige Web-App zum Spanischlernen für deutschsprachige Nutzer.

## 🚀 Schnellstart

**Einfachste Methode:**
1. Doppelklick auf `index.html`
2. Die App öffnet sich in deinem Browser
3. Beginne mit Lektion 1!

**Alternative Methode (mit lokalem Server):**
```bash
python3 -m http.server 8000
# Öffne dann: http://localhost:8000
```

## 📊 Was ist enthalten?

- **332 Übungen** in 7 Lektionen (Phase 1 - A1 Niveau)
- **Adaptive Lernsystem** - passt sich deinem Fortschritt an
- **Offline-Nutzung** - keine Internetverbindung erforderlich
- **Mobile-optimiert** - funktioniert auf Handy, Tablet und Desktop
- **DSGVO-konform** - alle Daten bleiben lokal auf deinem Gerät

## 🎯 Features

### Lernfunktionen
- ✅ Interaktive Übungen (Vokabeln, Lückentexte, Multiple Choice, Übersetzungen)
- ✅ Fortschrittsanzeige und Statistiken
- ✅ Deutsche Brücken-Erklärungen (nutzt dein Deutsch-Wissen)
- ✅ Hinweise nach Fehlversuchen (anpassbar in Einstellungen)
- ✅ Automatisches Speichern - du kannst jederzeit weitermachen

### Technische Features
- ✅ Funktioniert ohne Internet (nach erstem Laden)
- ✅ Responsive Design (passt sich allen Bildschirmgrößen an)
- ✅ Barrierefreiheit (Tastaturnavigation, Screenreader-kompatibel)
- ✅ Datenschutz (keine Tracking, keine Cookies, keine Cloud)

## 📚 Lektionen (Phase 1 - A1)

1. **Sich vorstellen** (45 Übungen)
   - Pronomen: yo, tú
   - Verb SER: soy, eres
   - Name, Herkunft, Beruf

2. **SER - Konjugation** (55 Übungen)
   - Alle Formen von SER
   - Identität und Eigenschaften

3. **ESTAR - Konjugation** (55 Übungen)
   - Alle Formen von ESTAR
   - Orte und Zustände

4. **SER vs ESTAR** (52 Übungen)
   - Wann verwendet man welches?
   - Kontrastive Übungen

5. **TENER** (40 Übungen)
   - Besitz ausdrücken
   - Alter, Hunger, Durst

6. **Grundwortschatz** (40 Übungen)
   - Wichtige Alltagswörter
   - Zahlen, Farben, Familie

7. **Integration** (45 Übungen)
   - Alles zusammen
   - Realistische Dialoge

**Gesamt: 332 Übungen**

## ⚙️ Einstellungen

Klicke auf das ⚙️ Symbol rechts unten:

### Lernhilfe
- **Keine Hilfe** - Keine Hinweise (für Fortgeschrittene)
- **Normal** - Hinweise nach 3 Fehlversuchen (empfohlen)
- **Viel Hilfe** - Hinweise nach 1 Fehlversuch (für Anfänger)

### Datenmanagement
- **Daten exportieren** - Speichere deinen Fortschritt als JSON-Datei
- **Daten importieren** - Lade gespeicherten Fortschritt
- **Alle Daten löschen** - Setzt die App zurück

## 💾 Deine Daten

**Wo werden Daten gespeichert?**
- Alle Daten bleiben **lokal** auf deinem Gerät (im Browser)
- Keine Cloud, keine Server, keine Übertragung
- Du behältst die volle Kontrolle

**Was wird gespeichert?**
- Dein Fortschritt (welche Übungen du gemacht hast)
- Deine Einstellungen (Hilfe-Level, Sidebar-Zustand)
- Deine Statistiken (Richtig/Falsch-Rate)

**DSGVO-Rechte:**
- Recht auf Auskunft (Export-Funktion)
- Recht auf Löschung (Löschen-Button)
- Recht auf Datenübertragbarkeit (Export als JSON)

## 🌐 Browser-Kompatibilität

**Empfohlen:**
- ✅ Chrome/Edge (Version 90+)
- ✅ Firefox (Version 88+)
- ✅ Safari (Version 14+)

**Mobile:**
- ✅ iOS Safari
- ✅ Android Chrome

## 🐛 Probleme?

**App lädt nicht:**
1. Stelle sicher, dass JavaScript aktiviert ist
2. Versuche einen anderen Browser
3. Öffne die Browser-Konsole (F12) für Fehlermeldungen

**Fortschritt geht verloren:**
- Exportiere regelmäßig deine Daten (⚙️ → Daten exportieren)
- Lösche nicht den Browser-Cache ohne vorherigen Export

**Andere Probleme:**
- Öffne die Konsole (F12) und suche nach Fehlern
- Versuche die Seite neu zu laden (Strg+F5 / Cmd+Shift+R)

## 📱 Als App installieren (PWA)

Auf unterstützten Browsern kannst du die App wie eine native App installieren:

**Desktop (Chrome/Edge):**
1. Öffne die App im Browser
2. Klicke auf das ⊕ Symbol in der Adressleiste
3. Wähle "Installieren"

**Mobile (iOS Safari):**
1. Öffne die App in Safari
2. Tippe auf "Teilen" Symbol
3. Wähle "Zum Home-Bildschirm"

**Mobile (Android Chrome):**
1. Öffne die App in Chrome
2. Tippe auf ⋮ (Menü)
3. Wähle "App installieren"

## 📂 Dateistruktur

```
Spanish-App/
├── index.html              # Hauptdatei - DIESE ÖFFNEN!
├── manifest.json           # PWA-Konfiguration
├── sw.js                   # Service Worker (für Offline-Modus)
├── css/
│   └── styles.css         # (optional, inline in index.html)
├── js/
│   ├── app-core.js        # Hauptlogik
│   ├── exercise-data.js   # Alle Übungen (332 Stück)
│   ├── monitoring.js      # Fehler- und Performance-Tracking
│   ├── utils.js           # Hilfsfunktionen
│   └── config/
│       └── environment.js # Konfiguration
├── icons/                 # App-Icons
├── data/                  # (ursprüngliche JSON-Dateien, nicht mehr benötigt)
└── archive/               # Alte Dateien (können gelöscht werden)
```

## 🔄 Weitergabe

**Als ZIP teilen:**
```bash
# Nur wichtige Dateien packen (ohne archive/)
zip -r Spanish-App.zip index.html manifest.json sw.js js/ icons/ css/ -x "js/archive/*"
```

**An Freunde senden:**
1. Erstelle ZIP-Archiv (siehe oben)
2. Sende per E-Mail, USB-Stick oder Cloud
3. Empfänger entpackt und öffnet `index.html`

## 🆕 Updates

Diese App ist **Version 1.0** (Stand: Oktober 2025).

Zukünftige Versionen können enthalten:
- Phase 2 (A1 - weitere Themen)
- Phase 3 (A2 Niveau)
- Audioaufnahmen für Aussprache
- Weitere Übungstypen

## 📄 Lizenz

Diese App ist für **persönlichen und Bildungsgebrauch** gedacht.

**Du darfst:**
- ✅ Die App für dein eigenes Lernen verwenden
- ✅ Die App mit Freunden und Familie teilen
- ✅ Die App im Unterricht verwenden (Schulen, Volkshochschulen)

**Du darfst nicht:**
- ❌ Die App kommerziell verkaufen
- ❌ Die Übungen als deine eigenen ausgeben

## 💬 Feedback

Diese App wurde entwickelt mit Fokus auf:
- Effektives Lernen durch Input-Output-Balance
- Deutsche Muttersprachler (nutzt dein Deutsch-Wissen)
- Wissenschaftlich fundierte Didaktik
- Datenschutz und Offline-Verfügbarkeit

Viel Erfolg beim Spanischlernen! 🇪🇸

---

**Technische Details:**
- Entwickelt mit: Vanilla JavaScript (keine Frameworks)
- Konsolidiert von 71 Dateien auf 5 Kerndateien
- Alle Daten inline (keine Server-Anfragen)
- WCAG AAA Barrierefreiheit
- Mobile-first Design

**Version:** 1.0
**Stand:** Oktober 2025
**Niveau:** A1 (Phase 1)
**Übungen:** 332
