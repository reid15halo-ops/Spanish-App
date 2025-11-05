# Development Setup

Es gibt zwei Möglichkeiten, die App zu verwenden:

## Option 1: Mit Build-System (Empfohlen für Produktion)

Nutzt Vite für optimierte Builds mit Code-Splitting und Minification.

```bash
# Development Server starten
npm install      # Einmalig: Dependencies installieren
npm run dev      # Server auf http://localhost:3000

# Production Build
npm run build    # Erstellt dist/ Ordner
npm run preview  # Testet Production Build
```

**Vorteil**:
- 87% kleinere Bundles (113KB statt 900KB)
- Code Splitting
- Source Maps
- Hot Module Replacement

## Option 2: Ohne Build-System (Lokale Entwicklung)

Funktioniert direkt im Browser ohne Server.

**Datei öffnen**: `index-dev.html` im Browser öffnen (Doppelklick)

Diese Version:
- ✅ Funktioniert mit `file://` Protokoll
- ✅ Keine Installation nötig
- ✅ Alle Features verfügbar
- ⚠️ Keine Build-Optimierungen (größere Dateien)
- ⚠️ Service Worker funktioniert nicht mit `file://`

## Welche Version nutzen?

| Szenario | Datei | Kommando |
|----------|-------|----------|
| **Lokale Entwicklung (ohne npm)** | `index-dev.html` | Datei im Browser öffnen |
| **Development Server** | `index.html` | `npm run dev` |
| **Production Deployment** | `dist/index.html` | `npm run build` |

## Quick Start für Anfänger

**Ohne npm (Einfachste Methode):**
1. Öffne `index-dev.html` im Browser
2. Fertig! 🎉

**Mit npm (Bessere Performance):**
1. Terminal öffnen
2. `npm install` (nur einmal)
3. `npm run dev`
4. Browser öffnet automatisch `http://localhost:3000`

## Unterschiede

### index.html (Build-System)
- Verwendet ES6 Modules (`type="module"`)
- Braucht Webserver (Vite)
- Optimiert für Produktion

### index-dev.html (Standalone)
- Verwendet normale Script-Tags
- Funktioniert ohne Server
- Keine Build-Optimierungen

## Troubleshooting

**"Lädt Übungen..." bleibt hängen**
- Problem: `index.html` braucht einen Webserver
- Lösung: Entweder `npm run dev` starten ODER `index-dev.html` öffnen

**Service Worker Fehler**
- Service Worker funktioniert nicht mit `file://` Protokoll
- Lösung: Nutze `npm run dev` oder deploye auf echten Server

**Module-Fehler im Browser**
- Problem: ES6 Modules funktionieren nicht mit `file://`
- Lösung: Nutze `index-dev.html` für lokale Entwicklung

## Empfehlung

Für **schnelles Testen**: `index-dev.html` öffnen
Für **Entwicklung**: `npm run dev` nutzen
Für **Produktion**: `npm run build` → `dist/` deployen
