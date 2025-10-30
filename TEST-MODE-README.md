# Test-Modus Dokumentation

## Übersicht

Der Test-Modus ist eine vollständige Testumgebung für die Spanish Learning App mit folgenden Funktionen:

- **30-Minuten Timer**: Automatischer Countdown mit visuellen Warnungen
- **Fragennavigation**: Direkter Zugriff auf alle Fragen über ein visuelles Grid
- **Antwort-Tracking**: Speicherung aller Antworten während des Tests
- **Automatische Submission**: Test wird automatisch abgegeben wenn die Zeit abläuft
- **Ergebnis-Dashboard**: Detaillierte Analyse mit Schwachstellen-Visualisierung

## Zugriff

### Von der Hauptseite
Klicken Sie auf den Button **"📝 Test-Modus"** in der unteren Aktionsleiste der Hauptseite.

### Direkt
Öffnen Sie `test-mode.html` in Ihrem Browser.

## Funktionen im Detail

### 1. Test-Oberfläche

#### Timer
- **Startet automatisch** beim Laden der Seite
- **30 Minuten** Gesamtzeit
- **Warnung** bei 5 Minuten verbleibend (orange)
- **Kritisch** bei 1 Minute verbleibend (rot, blinkend)
- **Automatische Abgabe** wenn Zeit abläuft

#### Fragennavigation
- **Visuelle Grid-Ansicht** aller Fragen (nummeriert)
- **Farbcodierung**:
  - Grün: Beantwortet
  - Blau: Aktuell
  - Weiß: Offen
- **Direkt-Navigation**: Klicken Sie auf eine Fragennummer um direkt zu dieser Frage zu springen
- **Legende** erklärt die Status-Farben

#### Fortschrittsbalken
- Zeigt visuell den Prozentsatz der beantworteten Fragen
- Aktualisiert sich in Echtzeit

### 2. Fragen-Typen

Der Test-Modus unterstützt alle Übungstypen der Hauptapp:
- **Multiple Choice**: Klicken Sie auf die richtige Antwort
- **Textantworten**: Tippen Sie Ihre Antwort ein
- **Vokabelkarten**: Geben Sie die deutsche Übersetzung ein
- **Lückentexte**: Füllen Sie die fehlenden Wörter aus
- **Übersetzungen**: Übersetzen Sie Sätze

### 3. Navigation

#### Tastatur-Shortcuts
- **Pfeil Links (←)**: Vorherige Frage
- **Pfeil Rechts (→)**: Nächste Frage
- **Enter**: Bei Texteingaben zur nächsten Frage

#### Buttons
- **← Zurück**: Zur vorherigen Frage
- **Weiter →**: Zur nächsten Frage
- **Test Abgeben**: Test beenden und Ergebnisse anzeigen

### 4. Test-Abgabe

#### Bestätigung
- System warnt wenn noch Fragen unbeantwortet sind
- Bestätigung erforderlich vor Abgabe

#### Automatische Abgabe
- Erfolgt automatisch wenn Timer auf 0:00 läuft
- Alle bis dahin beantworteten Fragen werden gewertet

## Ergebnis-Dashboard

### Zusammenfassung

Vier Haupt-Kennzahlen:
1. **Punktzahl**: Prozentsatz der richtigen Antworten
2. **Zeit**: Benötigte Zeit (von 30:00)
3. **Richtig**: Anzahl korrekter Antworten
4. **Falsch**: Anzahl falscher Antworten

### Schwachstellen-Analyse

#### Nach Kategorie
- Zeigt Performance in verschiedenen Themenbereichen
- **Schwachstellen** (< 70%) werden rot markiert
- **Stärken** (≥ 90%) werden grün markiert
- Sortiert nach schlechtester Performance zuerst

#### Nach Schwierigkeitsgrad
- Aufschlüsselung nach Schwierigkeitsstufen (1-5)
- Hilft zu identifizieren ob bestimmte Schwierigkeitsgrade problematisch sind

#### Nach Lerneinheit
- Zeigt welche Units am besten/schlechtesten abschneiden
- Empfiehlt fokussiertes Lernen basierend auf den Ergebnissen

#### Nach Übungstyp
- Analyse nach Übungstyp (Multiple Choice, Lückentext, etc.)
- Identifiziert welche Übungsformate am schwierigsten sind

### Visualisierungen

Alle Analysen enthalten:
- **Balkendiagramme**: Visuelle Darstellung der Performance
- **Prozentangaben**: Genauer Erfolgsrate
- **Anzahl-Angaben**: Richtig/Gesamt für jede Kategorie

### Detaillierte Fragen-Übersicht

#### Filter
- **Alle**: Zeigt alle Fragen
- **Falsch**: Nur falsch beantwortete Fragen
- **Richtig**: Nur richtig beantwortete Fragen

#### Für jede Frage
- Fragennummer und Text
- Status (✓ Richtig / ✗ Falsch)
- Ihre Antwort
- Korrekte Antwort (bei falschen Antworten)
- Kategorie und Schwierigkeitsgrad

## Funktionen nach dem Test

### Ergebnisse exportieren
- Exportiert alle Ergebnisse als JSON-Datei
- Enthält:
  - Datum und Uhrzeit
  - Punktzahl und Statistiken
  - Alle Fragen mit Antworten
  - Kategorisierung

### Nochmal versuchen
- Startet einen neuen Test mit neuen zufälligen Fragen
- Vorherige Ergebnisse werden nicht gespeichert

### Zurück zur Hauptseite
- Kehrt zur normalen Lern-App zurück

## Test-Zusammenstellung

### Fragenauswahl
- **40 Fragen** pro Test
- **Ausgewogen** über alle Units verteilt
- **Zufällige Auswahl** jedes Mal neu
- **Verschiedene Schwierigkeitsgrade** gemischt

### Optimiert für
- **30 Minuten** Testdauer
- **Diversity** in Themen und Typen
- **Repräsentative** Stichprobe des gesamten Materials

## Technische Details

### Browser-Kompatibilität
- Moderne Browser (Chrome, Firefox, Safari, Edge)
- Mobile Browser unterstützt
- Responsive Design für alle Bildschirmgrößen

### Offline-Funktionalität
- Funktioniert vollständig offline
- Keine Server-Verbindung erforderlich
- Daten werden nur lokal gespeichert

### Datenschutz
- Alle Daten bleiben auf Ihrem Gerät
- Keine externe Übertragung
- Export optional und unter Ihrer Kontrolle

## Tipps für beste Ergebnisse

1. **Vorbereitung**: Lernen Sie vorher mit der Hauptapp
2. **Ruhige Umgebung**: Minimieren Sie Ablenkungen
3. **Zeit-Management**: 30 Minuten für 40 Fragen = ~45 Sekunden pro Frage
4. **Alle beantworten**: Versuchen Sie alle Fragen zu beantworten
5. **Schwachstellen nutzen**: Nutzen Sie die Analyse zum gezielten Lernen

## Fehlerbehebung

### Test lädt nicht
- Überprüfen Sie ob `js/exercise-data.js` geladen ist
- Browser-Konsole auf Fehler prüfen
- Seite neu laden

### Timer stoppt nicht
- Browser-Tab aktiv halten
- Keine Power-Saving-Modi während des Tests

### Ergebnisse falsch
- Akzente und Sonderzeichen werden normalisiert
- Groß-/Kleinschreibung wird ignoriert
- Leerzeichen werden getrimmt

## Support

Bei Problemen oder Fragen:
1. Browser-Konsole prüfen (F12)
2. GitHub Issues erstellen
3. Dokumentation überprüfen
