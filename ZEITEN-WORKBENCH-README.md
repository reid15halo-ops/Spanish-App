# Zeiten-Workbench - Spanish Tenses Learning Environment

## Overview
Die **Zeiten-Workbench** ist ein umfassender Lernbereich fuer spanische Zeitformen. Sie bietet Regeln, Signalwoerter, Beispiele und interaktive Tests fuer alle wichtigen spanischen Zeiten.

## Features

### ? Implementierte Zeitformen
1. **Presente** - Gegenwart
2. **Pretérito Indefinido** - Einfache Vergangenheit
3. **Pretérito Imperfecto** - Unvollendete Vergangenheit
4. **Pretérito Perfecto** - Zusammengesetzte Vergangenheit
5. **Pluscuamperfecto** - Vorvergangenheit
6. **Futuro Simple** - Zukunft
7. **Condicional** - Konditional
8. **Presente Progresivo** - Verlaufsform (estar + gerundio)
9. **Perífrasis Verbal** - Nahe Zukunft (ir a + infinitivo)

### ?? Fuer jede Zeitform verfuegbar:

#### 1. **Regel & Erklaerung**
- Spanische Regel
- Deutsche Erklaerung (ASCII-compliant)
- Verwendungszwecke und Kontexte

#### 2. **Signalwoerter**
- Typische Zeitausdruecke (z.B. "ayer", "mientras", "mañana")
- Farblich hervorgehoben und interaktiv
- Hilfe beim Erkennen der richtigen Zeitform

#### 3. **Bildungsregeln**
- Endungen fuer -ar, -er, -ir Verben
- Stamm-Bildung
- Besondere Konstruktionen (Hilfsverben, etc.)

#### 4. **Interaktiver Zeitstrahl**
- Visuelle Darstellung der Zeitform
- Vergangenheit ? Gegenwart ? Zukunft
- Hover-Effekte fuer Details

#### 5. **Beispielsaetze**
- 3 Beispiele pro Zeitform
- Spanischer Originalsatz
- Deutsche Uebersetzung (ASCII-normalisiert)
- **Klick fuer detaillierte Analyse:**
  - Zeitform
  - Person
  - Modus
  - Aspekt
  - Stamm und Endung
  - Hilfsverben (wenn zutreffend)

#### 6. **Konjugationstabelle**
- Dropdown zur Verb-Auswahl
- 20 haeufigste Verben verfuegbar
- Vollstaendige Konjugation fuer alle Personen
- Verwendet den integrierten SpanishConjugator

#### 7. **Mini-Tests**
- Automatisch generierte Uebungsfragen
- Sofortiges Feedback
- Korrektur mit Erklaerung

## Zugriff

### Option 1: Direkter Zugriff
Oeffnen Sie `zeiten-workbench.html` direkt im Browser

### Option 2: Von der Haupt-App
Klicken Sie auf den Button **"?? Zeiten-Workbench"** in der Debug-Toolbar

## Architektur

### Dateien
```
zeiten-workbench.html          # Haupt-HTML-Datei
js/zeiten-data.js              # Daten fuer alle Zeitformen
js/zeiten-workbench.js         # Haupt-Logik und Interaktivitaet
css/zeiten-workbench.css       # Zusaetzliche Styles
```

### Abhaengigkeiten
- `js/utils/ascii.js` - ASCII-Normalisierung
- `js/normalize-es.js` - Spanische Normalisierung
- `js/conjugator.js` - Konjugations-Engine
- `data/verbs.json` - Verb-Datenbank

## Technische Details

### No-Gamification Compliant ?
- Keine Punkte, Badges, oder Achievements
- Keine Progress Bars oder Streaks
- Keine Leaderboards oder Wettbewerbe
- Fokus auf reines Lernen

### ASCII-Compliant ?
- Alle deutschen Texte verwenden ASCII-Normalisierung:
  - ä ? ae
  - ö ? oe
  - ü ? ue
  - ß ? ss
- Spanische Texte behalten Akzente (ñ, á, é, etc.)

### Responsive Design ?
- Mobile-freundlich
- Adaptive Layouts
- Touch-optimiert

### Accessibility ?
- Keyboard-Navigation
- Focus-Indikatoren
- Screen-Reader-freundlich

## Verwendung

### Navigation
Klicken Sie auf die Zeitformen-Buttons oben, um zwischen den Zeiten zu wechseln.

### Beispiele analysieren
Klicken Sie auf einen Beispielsatz, um eine detaillierte grammatische Analyse zu sehen.

### Konjugationen ansehen
1. Waehlen Sie ein Verb aus dem Dropdown
2. Die Tabelle zeigt alle konjugierten Formen
3. Automatische Beruecksichtigung der aktuellen Zeitform

### Tests durchfuehren
1. Lesen Sie die Frage im Mini-Test
2. Geben Sie Ihre Antwort ein
3. Klicken Sie "Ueberpruefen"
4. Erhalten Sie sofortiges Feedback

## Erweiterungsmoeglichkeiten

### Zukuenftige Features (optional)
- [ ] Subjuntivo-Modi (Presente, Imperfecto)
- [ ] Imperativo (Befehlsform)
- [ ] Weitere Perifrasis-Konstruktionen
- [ ] Vergleichstabellen (z.B. Pretérito vs Imperfecto)
- [ ] Druckbare Zusammenfassungen
- [ ] Mehr Beispiele pro Zeitform
- [ ] Erweiterte Tests mit mehreren Fragen

## Browser-Kompatibilitaet
- Chrome/Edge: ? Vollstaendig unterstuetzt
- Firefox: ? Vollstaendig unterstuetzt
- Safari: ? Vollstaendig unterstuetzt
- Mobile Browser: ? Responsive Design

## Performance
- Schnelles Laden (< 1s)
- Keine externen Dependencies
- Lokaler Betrieb moeglich
- Minimale Speichernutzung

## Testing

### Manuelle Tests
1. Oeffnen Sie `zeiten-workbench.html`
2. Navigieren Sie durch alle Zeitformen
3. Klicken Sie auf Beispiele fuer Analysen
4. Testen Sie die Konjugationstabelle
5. Fuehren Sie Mini-Tests durch

### Automatische Tests
```javascript
// Im Browser-Console
workbench.initialize();  // Sollte erfolgreich laden
```

## Changelog

### Version 1.0.0 (Initial Release)
- ? 9 Zeitformen implementiert
- ? 27 Beispiele mit Analysen
- ? Interaktive Zeitstraehle
- ? Konjugationstabellen
- ? Mini-Tests
- ? ASCII-Compliant
- ? No-Gamification

## Support
Bei Fragen oder Problemen:
1. Pruefen Sie die Browser-Konsole auf Fehler
2. Verifizieren Sie, dass alle Dateien geladen wurden
3. Stellen Sie sicher, dass `data/verbs.json` verfuegbar ist

## Lizenz
Teil des Spanish-App Projekts
