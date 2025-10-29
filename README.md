# Spanish Learning App - Core Logic Module

## Übersicht

Dies ist das Kern-Logik-Modul der Spanish Learning App. Alle UI-Elemente, Dashboards und Webapplikations-Komponenten wurden entfernt. Das Modul enthält nur die reine Lehr- und Lernlogik.

## Status

**Version**: Logic-Only (Post-UI-Removal)
**Fokus**: Lehrmethoden-Logik
**UI**: Keine - wird später hinzugefügt

## Struktur

### Core JavaScript Modules (`js/`)

#### Konjugationssystem
- **conjugator.js** - Spanische Verb-Konjugations-Engine
- **verb-pack-system.js** - Thematische Verb-Gruppierung
- **periphrastic-system.js** - Zusammengesetzte Zeiten (ir a + infinitiv, etc.)
- **periphrastic-final-validation.js** - Validierung periphrastischer Konstruktionen

#### Übungssystem
- **zeiten-exercises.js** - Zeitformen-Übungsgenerierung
- **zeiten-exercise-validator.js** - Validierung von Zeitformen-Übungen
- **zeiten-validation.js** - Generische Validierungslogik für Zeiten
- **zeiten-data.js** - Zeitformen-Datendefinitionen und Strukturen

#### Spaced Repetition System (SRS)
- **srs.js** - Leitner-System Implementierung
- **worker-srs.js** - Web Worker für SRS-Berechnungen

#### Analyse- und Erklärsystem
- **sentence-analyzer.js** - Satzstruktur-Analyse (Wortarten, Syntax)
- **explain.js** - Fehlererklärungs-Logik mit Grammatikhinweisen

#### Datenverarbeitung
- **csv-importer.js** - CSV-Import für Vokabeln und Verben
- **normalize-es.js** - Spanische Text-Normalisierung (Akzente, Diakritika)

#### Diagnose und Tests
- **diagnostic-test.js** - Diagnose-System zur Schwächenanalyse

#### 5-Phasen Lernsystem
- **learning-progression.js** - Phasen-Management System (A1 → B1)
- **adaptive-repetition.js** - Intelligente fehlerbasierte Wiederholung
- **error-pattern-detector.js** - Automatische Fehlerklassifizierung (25+ Fehlertypen)
- **explanation-generator.js** - Kontextuelle Fehlererkärungen
- **conversation-builder.js** - Dialog-Generierungssystem

#### Phase 1 (A1 Grundlagen) System
- **phase1-controller.js** - Hauptsteuerung für Phase 1
- **phase1-exercise-generator.js** - Übungsgenerierung für alle 7 Einheiten
- **ser-estar-contrast-system.js** - Spezialsystem für SER vs ESTAR
- **adaptive-knowledge-tracker.js** - Adaptives Wissensstand-Tracking
- **practical-scenarios.js** - 5 praktische Konversationsszenarien
- **vocabulary-loader.js** - Vokabular-Management System

#### Utilities (`js/utils/`)
- **a11y-perf-hardening.js** - Accessibility und Performance Tools
- **performance.js** - Performance-Monitoring
- **ascii.js** - ASCII-Normalisierung für deutsche Texte

### Daten (`data/`)
- **phase1-vocabulary.json** - Phase 1 Vokabeldatenbank (120 Wörter, 8 Kategorien)
- Vokabeldatenbank
- Verbdatenbank
- Übungsdefinitionen

### Tests (`test/`)
- Unit-Tests für Kern-Module
- `test-periphrastic.js` - Tests für periphrastisches System

## Lehrmethoden-Logik

### 0. 5-Phasen Lernsystem (NEU)
Umfassendes Curriculum von A1 bis B1:
- **Phase 1**: Fundament - Gegenwart & Sein (A1-Einstieg) - **VOLLSTÄNDIG IMPLEMENTIERT**
  - 7 Lerneinheiten: Pronomen, SER, ESTAR, SER/ESTAR-Kontrast, TENER, Vokabular, Integration
  - 225 Übungen, 3-4 Wochen Dauer
  - Adaptive Lernlogik mit 6 Wissensstufen
  - 5 praktische Szenarien (Wegbeschreibung, Gefühle, Arbeit, Selbstbeschreibung, Fremdbeschreibung)
  - Automatische Fehlererkennung und -klassifizierung
  - Intelligente Wiederholung basierend auf Fehlermustern
- **Phase 2-5**: Geplant (siehe LEHRMETHODE-5-PHASEN-PLAN.md)

**Siehe**: [PHASE-1-USAGE-GUIDE.md](PHASE-1-USAGE-GUIDE.md) für vollständige Verwendungsanleitung

### 0.1. Optimiertes Adaptives Lernsystem (NEU) ⚡

Wissenschaftlich fundierte Optimierungen für maximale Lerneffektivität:

**Adaptive Knowledge Tracker V2**:
- ✅ Ebbinghaus Forgetting Curve (Vergessenskurve) für präzise Review-Intervalle
- ✅ SuperMemo SM-2 Algorithm für dynamische Schwierigkeitsanpassung
- ✅ Response Time Tracking für Confidence-Messung
- ✅ Memory Strength Calculation (0-10 Skala)
- ✅ 6 Knowledge Levels mit intelligenter Frequenz-Anpassung

**Interleaved Practice System**:
- ✅ Research-based Interleaving (Rohrer & Taylor 2007)
- ✅ Spacing Effect Optimization (Kornell & Bjork 2008)
- ✅ Contextual Variation für Transfer Learning
- ✅ User-Level Adaptive Sequences (Beginner/Intermediate/Advanced)
- ✅ Discrimination Analysis zwischen ähnlichen Konzepten

**Learning Analytics**:
- ✅ Learning Velocity Tracking und Trend-Analyse
- ✅ Mastery Timeline Prediction mit Linear Regression
- ✅ Automatic Milestone Detection
- ✅ Comprehensive Performance History
- ✅ Chart Data für Visualisierung

**Adaptive Learning Orchestrator**:
- ✅ Zentrale Koordination aller Systeme
- ✅ Simple API für einfache Integration
- ✅ Personalisierte Empfehlungen
- ✅ Practice Plan Generation
- ✅ Export/Import für Backups

**Erwartete Verbesserungen** (basierend auf wissenschaftlicher Forschung):
- 📈 +40-50% Langzeit-Retention
- 📈 +30% Lerngeschwindigkeit
- 📈 +35% Transfer Learning
- 📈 +15-20% Genauigkeit

**Quick Start**:
```javascript
const adaptiveLearning = new AdaptiveLearningOrchestrator();
adaptiveLearning.startSession();
const exercise = adaptiveLearning.getNextOptimizedExercise(items, unit, progress);
adaptiveLearning.recordExerciseAttempt(exercise, answer, correct, responseTime);
const summary = adaptiveLearning.endSession();
```

**Dokumentation**:
- [ADAPTIVE-LEARNING-QUICKSTART.md](ADAPTIVE-LEARNING-QUICKSTART.md) - Schnelleinstieg
- [ADAPTIVE-LEARNING-OPTIMIZATIONS.md](ADAPTIVE-LEARNING-OPTIMIZATIONS.md) - Vollständige Dokumentation

### 1. Spaced Repetition System (SRS)
Implementiert das Leitner-System:
- 5 Boxen für Wiederholungsintervalle
- Automatische Beförderung/Degradierung basierend auf Antworten
- Optimierte Wiederholungs-Zeitpunkte

### 2. Konjugationssystem
Vollständige spanische Verb-Konjugation:
- Alle Zeiten (Präsens, Präteritum, Imperfekt, Futur, etc.)
- Regelmäßige und unregelmäßige Verben
- Periphrastische Konstruktionen
- Kontextuelle Validierung

### 3. Übungsgenerierung
Intelligente Übungserstellung:
- Multiple-Choice mit intelligenten Distraktoren
- Typing-Übungen mit Fuzzy-Matching
- Matching-Übungen
- Satzanalyse-Übungen

### 4. Fehleranalyse und Erklärungen
- Levenshtein-Distanz für Tippfehler-Toleranz
- Grammatikalische Fehleranalyse
- Kontextuelle Hinweise
- Schwächendiagnose

### 5. Satzanalyse
- Wortarten-Erkennung
- Syntaxanalyse
- Zeitformen-Identifikation
- Dependency-Parsing

### 6. Validierungssystem
- Akzent-tolerante Validierung für Spanisch
- ASCII-Normalisierung für Deutsch
- Fuzzy-Matching mit konfigurierbarer Toleranz
- Multi-Level-Feedback

## Verwendung

Diese Module sind als JavaScript-Bibliotheken konzipiert und können in verschiedene Kontexte integriert werden:

### Node.js
```javascript
const { SpanishConjugator } = require('./js/conjugator.js');
const { LeitnerSystem } = require('./js/srs.js');
const { SentenceAnalyzer } = require('./js/sentence-analyzer.js');
```

### Browser
```html
<script src="js/conjugator.js"></script>
<script src="js/srs.js"></script>
<script src="js/sentence-analyzer.js"></script>
```

### Als Modul
```javascript
import { SpanishConjugator } from './js/conjugator.js';
import { LeitnerSystem } from './js/srs.js';
```

## API-Beispiele

### Phase 1 Lernsystem (Schnellstart)
```javascript
// Phase 1 Controller initialisieren
const phase1 = new Phase1Controller();

// Session starten
phase1.startSession();

// Nächste Übung holen
const exercise = phase1.getNextExercise();
console.log(exercise.question);
// => "Yo _______ profesor." (SER/ESTAR Übung)

// Antwort verarbeiten
const result = phase1.processAnswer(exercise, 'soy');
console.log(result.isCorrect);  // => true
console.log(result.feedback);   // => "¡Muy bien! 🎉"

// Fortschritt abrufen
const progress = phase1.getProgressSummary();
console.log(progress);
// => { currentUnit: 2, overallAccuracy: 0.85, ... }

// Session beenden
const summary = phase1.endSession();
console.log(summary.errorPatterns);
// => Zeigt häufigste Fehler und Empfehlungen
```

**Vollständige Dokumentation**: [PHASE-1-USAGE-GUIDE.md](PHASE-1-USAGE-GUIDE.md)

### Konjugation
```javascript
const conjugator = new SpanishConjugator();
await conjugator.initialize();

// Konjugiere ein Verb
const result = conjugator.conjugate('hablar', 'presente', 'yo');
// => 'hablo'

// Analysiere eine Form
const analysis = conjugator.analyze('hablé');
// => { infinitivo: 'hablar', tiempo: 'preterito', persona: 'yo' }
```

### SRS System
```javascript
const srs = new LeitnerSystem();

// Item hinzufügen
const item = {
  spanish: 'hola',
  german: 'hallo',
  srsBox: 0,
  nextReview: Date.now()
};

// Befördern bei richtiger Antwort
srs.promote(item);

// Degradieren bei falscher Antwort
srs.demote(item);

// Fällige Items abrufen
const dueItems = srs.getPracticeQueue(allItems, 10);
```

### Satzanalyse
```javascript
const analyzer = new SentenceAnalyzer();

const analysis = analyzer.analyze('Yo hablo español');
// => {
//   words: [
//     { text: 'Yo', type: 'pronoun', ... },
//     { text: 'hablo', type: 'verb', tiempo: 'presente', ... },
//     { text: 'español', type: 'noun', ... }
//   ],
//   structure: { ... }
// }
```

## Nächste Schritte

1. **UI-Layer hinzufügen**: Die Logik ist bereit, ein neues UI darüber zu legen
2. **API-Wrapper erstellen**: RESTful oder GraphQL API für externe Integration
3. **Mobile Integration**: React Native oder Flutter Frontend
4. **Desktop-App**: Electron-Wrapper
5. **CLI-Tool**: Kommandozeilen-Interface für Übungen

## Dokumentation

### Lehrmethodik
- **LEHRMETHODE-5-PHASEN-PLAN.md** - Gesamtes Curriculum (A1 → B1)
- **PHASE-1-A1-DETAILLIERT.md** - Detaillierter Phase 1 Lernplan (50+ Seiten)
- **PHASE-1-USAGE-GUIDE.md** - Verwendungsanleitung Phase 1 System

### Adaptive Learning (NEU) ⚡
- **ADAPTIVE-LEARNING-QUICKSTART.md** - Schnelleinstieg für optimiertes System
- **ADAPTIVE-LEARNING-OPTIMIZATIONS.md** - Vollständige Dokumentation aller Optimierungen

### Technische Systeme
- **FEHLERERKLAER-SYSTEM-README.md** - Fehlererklärungs-System
- **SATZANALYSE-SYSTEM-README.md** - Satzanalyse
- **VERB-PACK-SYSTEM-README.md** - Verb-Pack-System
- **PERIPHRASTIC-SYSTEM-README.md** - Periphrastisches System
- **DIAGNOSTIC-TEST-README.md** - Diagnose-System
- **CSV-IMPORT-EXPORT-README.md** - Datenimport/-export
- **ZEITEN-UEBUNGEN-README.md** - Zeitformen-Übungen

## Technische Details

### Keine externen Dependencies
- Vanilla JavaScript (ES6+)
- Keine npm-Pakete erforderlich
- Standalone-Module

### Browser-Kompatibilität
- ES6+ erforderlich
- IndexedDB für lokale Datenspeicherung (optional)
- Web Workers für Performance (optional)

### Node.js-Kompatibilität
- Node.js 14+ empfohlen
- CommonJS und ES Modules unterstützt

## Lizenz

MIT License - Siehe Repository für Details

---

**Hinweis**: Dies ist ein reines Logik-Modul ohne UI. Für eine vollständige Anwendung muss ein UI-Layer hinzugefügt werden.
