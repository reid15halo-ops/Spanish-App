# 🎨 UX-VERBESSERUNGEN ROADMAP
## Spanish Learning App - Nutzerfreundlichkeits-Optimierung

**Erstellt**: 21. Oktober 2025
**Status**: Planungsphase
**Ziel**: App extrem nutzerfreundlich machen

---

## 📋 ÜBERSICHT

Diese Roadmap kombiniert:
- ✅ UX-Analyse der bestehenden App
- ✅ Windows 11-Optimierungsplan (Phase 3)
- ✅ Accessibility-Best-Practices
- ✅ Moderne UI/UX-Patterns

**Gesamtaufgaben**: 30 Tasks
**Geschätzte Gesamtdauer**: 3-4 Wochen
**Priorität**: Hoch (Production-Critical) → Niedrig (Nice-to-Have)

---

## 🚀 PHASE 1: QUICK WINS (Priorität: HOCH)
**Zeitaufwand**: 2-3 Tage
**Ziel**: Sofort sichtbare Verbesserungen

### 1.1 Production-Bereinigung 🧹

#### Task 1.1.1: Debug-Toolbar verstecken
**Priorität**: ⚠️ KRITISCH
**Aufwand**: 30 Minuten
**Dateien**: `index.html`, `js/app.js`, `css/style.css`

**Problem**:
```html
<!-- Aktuell IMMER sichtbar -->
<div id="debug-toolbar">
  <select id="mode-selector">...</select>
  <select id="force-type">...</select>
  <button id="load-from-csv-btn">...</button>
</div>
```

**Lösung**:
```javascript
// Development-Modus Detection
const isDevelopment =
  window.location.hostname === 'localhost' ||
  window.location.search.includes('debug=true');

if (!isDevelopment) {
  document.getElementById('debug-toolbar').style.display = 'none';
}
```

**Acceptance Criteria**:
- [ ] Debug-Toolbar nur bei localhost ODER ?debug=true sichtbar
- [ ] Production-Build zeigt clean Header
- [ ] Dokumentation in README aktualisiert

---

#### Task 1.1.2: Developer-Banner entfernen
**Priorität**: ⚠️ KRITISCH
**Aufwand**: 20 Minuten
**Dateien**: `index.html`, `js/app.js`

**Problem**:
- "ASCII-ONLY Version" Banner verwirrt normale Nutzer
- No-Gamification Status-Indikator ist Developer-fokussiert
- Nogame-Banner zeigt bei Verstößen roten Alert

**Lösung**:
```javascript
// Nur im Development-Modus
if (isDevelopment) {
  initNoGameGuard();
  initAsciiCompliance();
} else {
  // Produktions-Nutzer sehen nichts davon
  document.querySelector('.nogame-banner')?.remove();
  document.querySelector('.ascii-notice')?.remove();
}
```

**Acceptance Criteria**:
- [ ] Normale Nutzer sehen keine technischen Banner
- [ ] Development-Modus behält alle Guards
- [ ] Console-Warnings bleiben für Entwickler

---

#### Task 1.1.3: Loading States hinzufügen
**Priorität**: 🔴 HOCH
**Aufwand**: 2 Stunden
**Dateien**: `js/app.js`, `css/style.css`

**Problem**:
- Keine sichtbaren Ladeindikatoren
- DB-Operationen wirken "frozen"
- Nutzer wissen nicht, ob App reagiert

**Lösung**:
```html
<!-- Loading Spinner Component -->
<div id="loading-overlay" class="loading-overlay hidden">
  <div class="spinner"></div>
  <p class="loading-text">Lade Vokabeln...</p>
</div>
```

```css
.spinner {
  border: 4px solid rgba(0,0,0,0.1);
  border-left-color: var(--accent-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

```javascript
// Verwendung
async function loadItems() {
  showLoading('Lade Vokabeln...');
  try {
    const items = await fetch('data/items.json');
    // ...
  } finally {
    hideLoading();
  }
}
```

**Acceptance Criteria**:
- [ ] Spinner bei allen async Operationen
- [ ] Skeleton Screens für Exercise-Container
- [ ] Contextual Loading Messages ("Lade Verben...", "Generiere Übung...")

---

### 1.2 Klarere UI-Elemente 🎯

#### Task 1.2.1: Context-Aware Button Labels
**Priorität**: 🔴 HOCH
**Aufwand**: 1 Stunde
**Dateien**: `js/app.js`

**Problem**:
```html
<!-- Immer gleich, egal welcher Übungstyp -->
<button id="check-btn">Ueberpruefen</button>
```

**Lösung**:
```javascript
function updateCheckButtonLabel(exerciseType) {
  const labels = {
    'choice': 'Antwort pruefen',
    'typing': 'Eingabe pruefen',
    'match': 'Zuordnung pruefen',
    'conjugation': 'Konjugation pruefen'
  };

  document.getElementById('check-btn').textContent =
    labels[exerciseType] || 'Pruefen';
}
```

**Acceptance Criteria**:
- [ ] Button-Text passt sich Übungstyp an
- [ ] Visuell hervorgehoben (Primär-Button-Stil)
- [ ] Keyboard Shortcut angezeigt (z.B. "Pruefen (Enter)")

---

#### Task 1.2.2: Visueller Progress Bar
**Priorität**: 🔴 HOCH
**Aufwand**: 1.5 Stunden
**Dateien**: `js/app.js`, `css/style.css`

**Problem**:
```html
<!-- Aktuell: Text-basiert -->
<div id="status-bar">SRS-Modus | 5/10</div>
```

**Lösung**:
```html
<div class="progress-container">
  <div class="progress-header">
    <span class="progress-label">Lernfortschritt</span>
    <span class="progress-stats">5 von 10</span>
  </div>
  <div class="progress-bar">
    <div class="progress-fill" style="width: 50%;"></div>
  </div>
  <div class="progress-footer">
    <span class="progress-mode">📚 SRS-Modus aktiv</span>
  </div>
</div>
```

```css
.progress-bar {
  height: 8px;
  background: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg,
    var(--accent-color),
    var(--accent-color-hover));
  transition: width 0.3s ease;
}
```

**Acceptance Criteria**:
- [ ] Animierter Progress Bar
- [ ] Prozent-Anzeige (50%)
- [ ] Verbleibende Items (5 von 10)
- [ ] Klares Mode-Label (SRS vs. Normal)

---

## 🎓 PHASE 2: ONBOARDING & HILFE (Priorität: HOCH)
**Zeitaufwand**: 3-4 Tage
**Ziel**: Erstnutzer abholen und durch App führen

### 2.1 Welcome Screen 👋

#### Task 2.1.1: Willkommens-Dialog erstellen
**Priorität**: 🔴 HOCH
**Aufwand**: 3 Stunden
**Dateien**: `js/onboarding.js` (NEU), `css/onboarding.css` (NEU)

**Mockup**:
```html
<div id="welcome-modal" class="modal">
  <div class="modal-content welcome-content">
    <h2>Willkommen bei deiner Spanisch-Lern-App!</h2>

    <div class="welcome-feature">
      <div class="feature-icon">📚</div>
      <h3>4 Uebungstypen</h3>
      <p>Multiple Choice, Typing, Matching, Konjugation</p>
    </div>

    <div class="welcome-feature">
      <div class="feature-icon">🧠</div>
      <h3>Intelligentes SRS-System</h3>
      <p>Wiederhole genau dann, wenn du es brauchst</p>
    </div>

    <div class="welcome-feature">
      <div class="feature-icon">🌙</div>
      <h3>Dark Mode & Offline</h3>
      <p>Lerne wann und wo du willst</p>
    </div>

    <div class="welcome-actions">
      <button class="btn-primary" onclick="startTutorial()">
        Tutorial starten
      </button>
      <button class="btn-secondary" onclick="skipTutorial()">
        Direkt loslegen
      </button>
    </div>
  </div>
</div>
```

**Logic**:
```javascript
// Prüfe ob Erstnutzer
if (!localStorage.getItem('hasSeenWelcome')) {
  showWelcomeModal();
  localStorage.setItem('hasSeenWelcome', 'true');
}
```

**Acceptance Criteria**:
- [ ] Zeigt nur beim ersten Besuch
- [ ] "Tutorial starten" führt zu 2.2
- [ ] "Direkt loslegen" schließt Modal
- [ ] Schönes Design mit Icons/Illustrationen
- [ ] Responsive für Mobile

---

#### Task 2.1.2: Interaktives Tutorial
**Priorität**: 🟡 MITTEL
**Aufwand**: 4 Stunden
**Dateien**: `js/tutorial.js` (NEU), `css/tutorial.css` (NEU)

**Flow**:
1. **Schritt 1**: "Das ist eine Multiple-Choice-Übung"
   - Overlay über Exercise-Container
   - Highlight der Antwort-Buttons
   - "Wähle die richtige Übersetzung"

2. **Schritt 2**: "Hier ist der Prüfen-Button"
   - Highlight des Check-Buttons
   - "Drücke hier oder Enter-Taste"

3. **Schritt 3**: "Feedback erscheint hier"
   - Zeige Beispiel-Feedback
   - Erkläre Grün=Richtig, Rot=Falsch

4. **Schritt 4**: "Progress wird hier angezeigt"
   - Highlight Progress Bar
   - Erkläre Fortschritts-Tracking

5. **Schritt 5**: "SRS-System erklärt"
   - Was ist SRS?
   - Wie funktioniert die Box-Logik?
   - Toggle-Button zeigen

**Implementation**:
```javascript
class Tutorial {
  constructor() {
    this.steps = [
      {
        target: '#exercise-container',
        title: 'Das ist eine Uebung',
        content: 'Waehle die richtige Uebersetzung...',
        position: 'bottom'
      },
      // ...
    ];
    this.currentStep = 0;
  }

  show() {
    this.createOverlay();
    this.highlightElement(this.steps[0].target);
    this.showTooltip(this.steps[0]);
  }

  next() {
    this.currentStep++;
    if (this.currentStep >= this.steps.length) {
      this.complete();
    } else {
      this.showTooltip(this.steps[this.currentStep]);
    }
  }
}
```

**Acceptance Criteria**:
- [ ] 5-7 Tutorial-Schritte
- [ ] Dunkel-Overlay mit Spotlight auf aktuellem Element
- [ ] "Weiter" / "Zurück" / "Tutorial beenden" Buttons
- [ ] Speichert "Tutorial abgeschlossen" in localStorage

---

### 2.2 Hilfe-System 🆘

#### Task 2.2.1: Hilfe-Button im Header
**Priorität**: 🟡 MITTEL
**Aufwand**: 2 Stunden
**Dateien**: `index.html`, `js/help-system.js` (NEU)

**UI**:
```html
<div class="app-header">
  <h1>Spanisch Lernen</h1>

  <div class="header-actions">
    <button id="help-btn" class="icon-btn"
            aria-label="Hilfe oeffnen">
      ❓
    </button>
    <button id="dark-mode-toggle" class="icon-btn"
            aria-label="Dark Mode umschalten">
      🌙
    </button>
  </div>
</div>
```

**Hilfe-Modal**:
```html
<div id="help-modal" class="modal">
  <div class="modal-content help-content">
    <h2>Hilfe & Tastaturkuerzel</h2>

    <section class="help-section">
      <h3>Uebungstypen</h3>
      <ul>
        <li><strong>Multiple Choice:</strong> Waehle die richtige Antwort</li>
        <li><strong>Typing:</strong> Gib die Uebersetzung ein</li>
        <li><strong>Match:</strong> Verbinde Paare</li>
        <li><strong>Konjugation:</strong> Konjugiere Verben</li>
      </ul>
    </section>

    <section class="help-section">
      <h3>SRS-System</h3>
      <p>Spaced Repetition: Items werden zur optimalen Zeit wiederholt</p>
      <ul>
        <li>Box 1-5: Je hoeher, desto seltener Wiederholung</li>
        <li>Richtige Antwort: Box hoch</li>
        <li>Falsche Antwort: Zurueck zu Box 1</li>
      </ul>
    </section>

    <section class="help-section">
      <h3>Tastaturkuerzel</h3>
      <table class="shortcuts-table">
        <tr><td><kbd>Enter</kbd></td><td>Antwort pruefen</td></tr>
        <tr><td><kbd>R</kbd></td><td>Uebung wiederholen</td></tr>
        <tr><td><kbd>D</kbd></td><td>Dark Mode umschalten</td></tr>
        <tr><td><kbd>?</kbd></td><td>Hilfe oeffnen</td></tr>
      </table>
    </section>
  </div>
</div>
```

**Acceptance Criteria**:
- [ ] Help-Button immer sichtbar (außer bei Tutorial)
- [ ] Shortcut `?` öffnet Hilfe
- [ ] Schließen mit ESC oder Klick außerhalb
- [ ] Übersichtliche Kategorisierung
- [ ] Suchfunktion (optional)

---

#### Task 2.2.2: Kontextsensitive Tooltips
**Priorität**: 🟢 NIEDRIG
**Aufwand**: 2 Stunden
**Dateien**: `js/tooltip-system.js` (NEU), `css/tooltips.css` (NEU)

**Implementation**:
```html
<!-- Tooltip auf verschiedenen Elementen -->
<button class="srs-toggle"
        data-tooltip="SRS-Modus: Intelligente Wiederholung basierend auf deinem Fortschritt">
  SRS
</button>

<div class="srs-box-indicator"
     data-tooltip="Box 3: Naechste Wiederholung in 7 Tagen">
  Box 3
</div>
```

```javascript
// Auto-Tooltip System
document.querySelectorAll('[data-tooltip]').forEach(el => {
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.textContent = el.dataset.tooltip;

  el.addEventListener('mouseenter', () => {
    document.body.appendChild(tooltip);
    positionTooltip(tooltip, el);
  });

  el.addEventListener('mouseleave', () => {
    tooltip.remove();
  });
});
```

**Acceptance Criteria**:
- [ ] Tooltips auf allen wichtigen UI-Elementen
- [ ] Touch-freundlich (Tap hält Tooltip)
- [ ] Accessible (role="tooltip", aria-describedby)
- [ ] Auto-Positionierung (oben/unten je nach Platz)

---

## 🎨 PHASE 3: VISUELLES FEEDBACK (Priorität: MITTEL-HOCH)
**Zeitaufwand**: 2-3 Tage
**Ziel**: Emotionale Bindung durch besseres Feedback

### 3.1 Toast-Notification-System 🔔

#### Task 3.1.1: Toast-Component erstellen
**Priorität**: 🔴 HOCH
**Aufwand**: 3 Stunden
**Dateien**: `js/toast.js` (NEU), `css/toast.css` (NEU)

**Types**:
- **Success**: Grün, Checkmark-Icon ✓
- **Error**: Rot, X-Icon ✗
- **Info**: Blau, Info-Icon ℹ
- **Warning**: Orange, Warning-Icon ⚠

**Implementation**:
```javascript
class ToastSystem {
  show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = this.getIcon(type);
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    document.getElementById('toast-container').appendChild(toast);

    setTimeout(() => toast.classList.add('toast-show'), 10);

    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  success(msg) { this.show(msg, 'success'); }
  error(msg) { this.show(msg, 'error'); }
  info(msg) { this.show(msg, 'info'); }
  warning(msg) { this.show(msg, 'warning'); }
}

const toast = new ToastSystem();
```

**Verwendung**:
```javascript
// Bei Erfolg
toast.success('Richtig! Box 2 → Box 3');

// Bei Fehler
toast.error('Falsch. Zurueck zu Box 1');

// Bei Info
toast.info('5 neue Vokabeln freigeschaltet');

// Bei SRS-Update
toast.info('Naechste Wiederholung: morgen');
```

**Styling**:
```css
.toast {
  position: fixed;
  top: 80px;
  right: 20px;
  min-width: 300px;
  max-width: 400px;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px var(--shadow-color);
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0;
  transform: translateX(400px);
  transition: all 0.3s ease;
  z-index: 10000;
}

.toast-show {
  opacity: 1;
  transform: translateX(0);
}

.toast-success {
  background: var(--correct-color);
  color: white;
}

.toast-error {
  background: var(--incorrect-color);
  color: white;
}
```

**Acceptance Criteria**:
- [ ] Smooth Slide-in Animation von rechts
- [ ] Auto-Close nach 3 Sekunden
- [ ] Manuelles Schließen möglich
- [ ] Stapelbar (mehrere Toasts gleichzeitig)
- [ ] Accessible (ARIA live region)
- [ ] Mobile-optimiert (volle Breite auf kleinen Screens)

---

#### Task 3.1.2: Toast-Integration in App-Logic
**Priorität**: 🟡 MITTEL
**Aufwand**: 2 Stunden
**Dateien**: `js/app.js`

**Use Cases**:
```javascript
// Nach Antwort-Check
function checkAnswer() {
  const isCorrect = validateAnswer(userInput, correctAnswer);

  if (isCorrect) {
    toast.success(`Richtig! ${item.de} = ${item.es}`);
    srs.promote(item);

    if (item.srsBox === 5) {
      toast.info('🎉 Mastered! Naechste Wiederholung in 30 Tagen');
    }
  } else {
    toast.error(`Falsch. Richtige Antwort: ${correctAnswer}`);
    srs.demote(item);
  }
}

// Bei Session-Ende
function endSession() {
  const stats = getSessionStats();
  toast.success(
    `Session beendet! ${stats.correct}/${stats.total} richtig (${stats.accuracy}%)`
  );
  showSessionSummary(stats);
}

// Bei Daten-Load
async function loadItems() {
  try {
    const items = await fetchItems();
    toast.success(`${items.length} Vokabeln geladen`);
  } catch (error) {
    toast.error('Fehler beim Laden der Vokabeln');
  }
}
```

**Acceptance Criteria**:
- [ ] Toasts bei allen wichtigen Events
- [ ] Keine redundanten Toasts (Deduplizierung)
- [ ] Hilfreiche Nachrichten (nicht nur "Success")
- [ ] Emojis für emotionale Ansprache (🎉, 📚, ⚠️)

---

### 3.2 Animationen & Übergänge ✨

#### Task 3.2.1: Smooth Exercise Transitions
**Priorität**: 🟡 MITTEL
**Aufwand**: 2 Stunden
**Dateien**: `js/app.js`, `css/animations.css` (NEU)

**Problem**:
- Übungen erscheinen abrupt
- Kein visueller Flow

**Lösung**:
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOutDown {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.exercise-container.entering {
  animation: fadeInUp 0.3s ease;
}

.exercise-container.leaving {
  animation: fadeOutDown 0.3s ease;
}
```

```javascript
async function loadNextExercise() {
  const container = document.getElementById('exercise-container');

  // Fade out alte Übung
  container.classList.add('leaving');
  await delay(300);

  // Neue Übung rendern
  renderExercise(nextExercise);

  // Fade in neue Übung
  container.classList.remove('leaving');
  container.classList.add('entering');

  setTimeout(() => container.classList.remove('entering'), 300);
}
```

**Acceptance Criteria**:
- [ ] Smooth Fade-Transitions zwischen Übungen
- [ ] Respektiert `prefers-reduced-motion`
- [ ] Keine Ruckler/Janks
- [ ] 60 FPS Animation

---

#### Task 3.2.2: Celebration Animations
**Priorität**: 🟢 NIEDRIG
**Aufwand**: 3 Stunden
**Dateien**: `js/celebrations.js` (NEU), `css/celebrations.css` (NEU)

**Trigger**:
- Item erreicht Box 5 (Mastered)
- 10 richtige Antworten in Folge
- Session mit 100% Accuracy
- Alle Items einer Kategorie gemeistert

**Implementation**:
```javascript
function celebrate(type = 'success') {
  if (type === 'mastered') {
    // Confetti-Animation
    createConfetti();

    // Sound (optional)
    playSound('success.mp3');

    // Toast
    toast.success('🎉 Vokabel gemeistert!');
  }

  if (type === 'perfect-session') {
    // Fireworks-Animation
    createFireworks();
    toast.success('🌟 Perfekte Session! 100% richtig!');
  }
}

function createConfetti() {
  const confettiCount = 50;
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 0.3 + 's';

    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 3000);
  }
}
```

**CSS**:
```css
.confetti {
  position: fixed;
  width: 10px;
  height: 10px;
  top: -10px;
  z-index: 9999;
  animation: confetti-fall 3s linear;
}

@keyframes confetti-fall {
  to {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}
```

**Acceptance Criteria**:
- [ ] Subtile, nicht störende Animationen
- [ ] Respektiert `prefers-reduced-motion`
- [ ] Keine Gamification-Violations (keine XP/Level!)
- [ ] Celebriert echte Lern-Erfolge

---

### 3.3 Session Summary 📊

#### Task 3.3.1: End-of-Session Screen
**Priorität**: 🟡 MITTEL
**Aufwand**: 3 Stunden
**Dateien**: `js/session-summary.js` (NEU), `css/summary.css` (NEU)

**Mockup**:
```html
<div id="session-summary-modal" class="modal">
  <div class="modal-content summary-content">
    <h2>Session beendet! 🎓</h2>

    <div class="summary-stats">
      <div class="stat-card">
        <div class="stat-value">15</div>
        <div class="stat-label">Uebungen</div>
      </div>

      <div class="stat-card stat-success">
        <div class="stat-value">12</div>
        <div class="stat-label">Richtig</div>
      </div>

      <div class="stat-card stat-error">
        <div class="stat-value">3</div>
        <div class="stat-label">Falsch</div>
      </div>

      <div class="stat-card">
        <div class="stat-value">80%</div>
        <div class="stat-label">Genauigkeit</div>
      </div>
    </div>

    <div class="summary-details">
      <h3>SRS-Updates</h3>
      <ul>
        <li>📈 5 Items aufgestiegen</li>
        <li>📉 2 Items abgestiegen</li>
        <li>🎯 1 Item gemeistert (Box 5)</li>
      </ul>
    </div>

    <div class="summary-categories">
      <h3>Kategorien</h3>
      <div class="category-bar">
        <span>Essen</span>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 75%;"></div>
        </div>
        <span>75%</span>
      </div>
      <div class="category-bar">
        <span>Farben</span>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 100%;"></div>
        </div>
        <span>100%</span>
      </div>
    </div>

    <div class="summary-actions">
      <button class="btn-primary" onclick="startNewSession()">
        Neue Session starten
      </button>
      <button class="btn-secondary" onclick="closeApp()">
        Beenden
      </button>
    </div>
  </div>
</div>
```

**Logic**:
```javascript
class SessionTracker {
  constructor() {
    this.stats = {
      total: 0,
      correct: 0,
      incorrect: 0,
      srsPromotions: 0,
      srsDemotions: 0,
      masteredItems: 0,
      categoriesStats: {}
    };
  }

  recordAnswer(isCorrect, item, srsChange) {
    this.stats.total++;
    if (isCorrect) {
      this.stats.correct++;
      if (srsChange === 'promoted') this.stats.srsPromotions++;
      if (item.srsBox === 5) this.stats.masteredItems++;
    } else {
      this.stats.incorrect++;
      if (srsChange === 'demoted') this.stats.srsDemotions++;
    }

    // Category-Tracking
    const cat = item.category || 'Allgemein';
    if (!this.stats.categoriesStats[cat]) {
      this.stats.categoriesStats[cat] = { correct: 0, total: 0 };
    }
    this.stats.categoriesStats[cat].total++;
    if (isCorrect) this.stats.categoriesStats[cat].correct++;
  }

  getSummary() {
    return {
      ...this.stats,
      accuracy: Math.round((this.stats.correct / this.stats.total) * 100)
    };
  }
}
```

**Acceptance Criteria**:
- [ ] Zeigt am Ende jeder Session (10+ Übungen)
- [ ] Übersichtliche Statistiken
- [ ] Kategorie-Breakdown
- [ ] Motivierende Nachrichten ("Gut gemacht!", "Weiter so!")
- [ ] Option für neue Session oder Beenden

---

## 🖥️ PHASE 4: WINDOWS 11-OPTIMIERUNG (Priorität: MITTEL)
**Zeitaufwand**: 4-5 Tage
**Ziel**: Native Windows 11-Look & Feel

### 4.1 Fluent Design System 🎨

#### Task 4.1.1: Fluent Colors & Typography
**Priorität**: 🟡 MITTEL
**Aufwand**: 3 Stunden
**Dateien**: `css/fluent-theme.css` (NEU)

**Windows 11 Color Palette**:
```css
:root {
  /* Fluent Design Colors */
  --fluent-bg-primary: #F3F3F3;
  --fluent-bg-secondary: #FAFAFA;
  --fluent-bg-tertiary: #FFFFFF;

  /* Accent (from Windows Registry - später dynamisch) */
  --fluent-accent: #0078D4;
  --fluent-accent-hover: #106EBE;
  --fluent-accent-pressed: #005A9E;

  /* Text Colors */
  --fluent-text-primary: #000000E6; /* 90% opacity */
  --fluent-text-secondary: #00000099; /* 60% opacity */
  --fluent-text-tertiary: #00000066; /* 40% opacity */

  /* Border Radius (Windows 11 standard) */
  --fluent-radius-small: 4px;
  --fluent-radius-medium: 8px;
  --fluent-radius-large: 12px;

  /* Shadows */
  --fluent-shadow-elevation-low: 0 2px 4px rgba(0,0,0,0.08);
  --fluent-shadow-elevation-medium: 0 4px 8px rgba(0,0,0,0.12);
  --fluent-shadow-elevation-high: 0 8px 16px rgba(0,0,0,0.16);
}

[data-theme="dark"] {
  --fluent-bg-primary: #202020;
  --fluent-bg-secondary: #2C2C2C;
  --fluent-bg-tertiary: #282828;

  --fluent-text-primary: #FFFFFFE6;
  --fluent-text-secondary: #FFFFFF99;
  --fluent-text-tertiary: #FFFFFF66;
}
```

**Segoe UI Variable Font**:
```css
@font-face {
  font-family: 'Segoe UI Variable';
  src: local('Segoe UI Variable Display'),
       local('Segoe UI');
  font-weight: 100 900;
}

body {
  font-family: 'Segoe UI Variable',
               'Segoe UI',
               -apple-system,
               BlinkMacSystemFont,
               sans-serif;
}

/* Typography Scale */
.text-display {
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
}

.text-title {
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
}

.text-subtitle {
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
}

.text-body {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}

.text-caption {
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
}
```

**Acceptance Criteria**:
- [ ] Windows 11-konforme Farben
- [ ] Segoe UI Variable als primäre Schrift
- [ ] Fluent Design Shadows
- [ ] Rounded Corners (4-12px)
- [ ] Dark Mode mit Fluent-Palette

---

#### Task 4.1.2: Acrylic/Mica Background Effekte
**Priorität**: 🟢 NIEDRIG
**Aufwand**: 4 Stunden
**Dateien**: `css/fluent-effects.css` (NEU)

**Acrylic Simulation**:
```css
.acrylic-background {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(30px) saturate(150%);
  -webkit-backdrop-filter: blur(30px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

[data-theme="dark"] .acrylic-background {
  background: rgba(44, 44, 44, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Mica (subtiler) */
.mica-background {
  background: linear-gradient(
    135deg,
    rgba(255,255,255,0.9) 0%,
    rgba(250,250,250,0.9) 100%
  );
  backdrop-filter: blur(10px);
}
```

**Verwendung**:
```html
<div class="modal-content acrylic-background">
  <!-- Modal-Inhalt -->
</div>

<div class="app-header mica-background">
  <!-- Header -->
</div>
```

**Acceptance Criteria**:
- [ ] Acrylic-Effekt auf Modals
- [ ] Mica-Effekt auf Header/Footer
- [ ] Fallback für Browser ohne backdrop-filter
- [ ] Performance-optimiert (GPU-beschleunigt)

---

### 4.2 High-DPI & Multi-Monitor 📺

#### Task 4.2.1: Per-Monitor DPI-Awareness
**Priorität**: 🟡 MITTEL
**Aufwand**: 4 Stunden
**Dateien**: `js/dpi-manager.js` (NEU)

**Problem**:
- App nicht DPI-aware auf 4K-Displays
- Icons und Text zu klein auf High-DPI

**Lösung**:
```javascript
class DPIManager {
  constructor() {
    this.currentDPI = window.devicePixelRatio || 1;
    this.scalingFactor = 1;
    this.init();
  }

  init() {
    this.applyScaling();
    this.watchDPIChanges();
  }

  applyScaling() {
    const dpi = this.currentDPI;

    // Scaling basierend auf DPI
    if (dpi >= 3) {
      // 300% (4K/8K)
      this.scalingFactor = 1.5;
    } else if (dpi >= 2) {
      // 200% (Retina)
      this.scalingFactor = 1.25;
    } else if (dpi >= 1.5) {
      // 150%
      this.scalingFactor = 1.1;
    } else {
      // 100%
      this.scalingFactor = 1;
    }

    document.documentElement.style.setProperty(
      '--scale-factor',
      this.scalingFactor
    );
  }

  watchDPIChanges() {
    // Monitor DPI-Änderungen (z.B. Fenster zwischen Monitoren verschoben)
    const media = matchMedia(`(resolution: ${this.currentDPI}dppx)`);
    media.addListener(() => {
      this.currentDPI = window.devicePixelRatio;
      this.applyScaling();
    });
  }
}

const dpiManager = new DPIManager();
```

**CSS**:
```css
:root {
  --scale-factor: 1;
  --base-font-size: 14px;
}

body {
  font-size: calc(var(--base-font-size) * var(--scale-factor));
}

.icon {
  width: calc(24px * var(--scale-factor));
  height: calc(24px * var(--scale-factor));
}
```

**Acceptance Criteria**:
- [ ] Auto-Scaling auf 4K/8K-Displays
- [ ] Crisp Text und Icons
- [ ] Reagiert auf Monitor-Wechsel
- [ ] Unterstützt 100%, 125%, 150%, 200%, 250% DPI

---

#### Task 4.2.2: Responsive Breakpoints
**Priorität**: 🟡 MITTEL
**Aufwand**: 3 Stunden
**Dateien**: `css/responsive.css` (NEU)

**Breakpoints**:
```css
/* Mobile: < 768px */
@media (max-width: 767px) {
  .exercise-container {
    max-width: 100%;
    padding: 15px;
  }

  .debug-toolbar {
    flex-direction: column;
  }
}

/* Tablet: 768px - 1399px */
@media (min-width: 768px) and (max-width: 1399px) {
  .exercise-container {
    max-width: 700px;
  }

  .stats-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 1400px - 1919px */
@media (min-width: 1400px) and (max-width: 1919px) {
  .exercise-container {
    max-width: 800px;
  }

  .app-layout {
    display: grid;
    grid-template-columns: 250px 1fr;
  }
}

/* Large Desktop: >= 1920px */
@media (min-width: 1920px) {
  .exercise-container {
    max-width: 900px;
  }

  .app-layout {
    grid-template-columns: 300px 1fr 300px;
  }

  /* Zeige zusätzliche Sidebar für Stats */
  .stats-sidebar {
    display: block;
  }
}
```

**Acceptance Criteria**:
- [ ] Mobile-First Design
- [ ] Tablet-optimiertes Layout
- [ ] Desktop nutzt verfügbaren Platz
- [ ] Large Desktop zeigt erweiterte UI

---

### 4.3 Native Windows 11-Features 🪟

#### Task 4.3.1: Windows Toast Notifications
**Priorität**: 🟢 NIEDRIG
**Aufwand**: 5 Stunden
**Dateien**: `js/windows-notifications.js` (NEU)

**Implementation** (via Electron/Tauri oder Web Notifications API):
```javascript
class WindowsNotifications {
  constructor() {
    this.supported = 'Notification' in window;
    this.requestPermission();
  }

  async requestPermission() {
    if (this.supported && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }

  send(title, options = {}) {
    if (!this.supported || Notification.permission !== 'granted') {
      console.log('Notifications nicht verfügbar');
      return;
    }

    const notification = new Notification(title, {
      body: options.body || '',
      icon: options.icon || '/icon-192.png',
      badge: '/icon-badge.png',
      tag: options.tag || 'spanish-app',
      requireInteraction: options.requireInteraction || false,
      ...options
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
      if (options.onClick) options.onClick();
    };
  }

  // Vordefinierte Notifications
  sessionComplete(stats) {
    this.send('Session beendet!', {
      body: `${stats.correct}/${stats.total} richtig (${stats.accuracy}%)`,
      icon: '/icons/success.png',
      requireInteraction: false
    });
  }

  masteredItem(item) {
    this.send('Vokabel gemeistert! 🎉', {
      body: `${item.es} - ${item.de}`,
      icon: '/icons/trophy.png'
    });
  }

  reviewDue(count) {
    this.send(`${count} Vokabeln zur Wiederholung`, {
      body: 'Zeit für eine neue Lernsession!',
      icon: '/icons/reminder.png',
      requireInteraction: true,
      onClick: () => window.location.href = '/index.html?mode=srs'
    });
  }
}

const winNotifications = new WindowsNotifications();
```

**Acceptance Criteria**:
- [ ] Permission-Request beim ersten Start
- [ ] Toast bei Session-Ende
- [ ] Toast bei Mastered Items
- [ ] Reminder-Notifications (optional)
- [ ] Klick öffnet App

---

#### Task 4.3.2: File System Integration
**Priorität**: 🟢 NIEDRIG
**Aufwand**: 4 Stunden
**Dateien**: `js/file-integration.js` (NEU)

**Features**:
- Import/Export von Vokabeln (.json/.csv)
- Recent Files in Windows Jump List
- File Associations (.spanish-session)

**Implementation**:
```javascript
class FileIntegration {
  async exportSession(session) {
    const data = JSON.stringify(session, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `session-${Date.now()}.spanish-session`;
    a.click();

    URL.revokeObjectURL(url);

    // Add to Recent Files (Windows API - needs Electron/Tauri)
    if (window.electronAPI) {
      window.electronAPI.addRecentDocument(a.download);
    }
  }

  async importSession() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.spanish-session,.json';

    input.onchange = async (e) => {
      const file = e.target.files[0];
      const text = await file.text();
      const session = JSON.parse(text);

      // Load session
      loadSession(session);
      toast.success(`Session "${session.name}" geladen`);
    };

    input.click();
  }
}
```

**Acceptance Criteria**:
- [ ] Export als .spanish-session
- [ ] Import von .spanish-session
- [ ] Recent Files (wenn Electron/Tauri)
- [ ] Modern File Dialogs

---

## ⌨️ PHASE 5: USABILITY-VERBESSERUNGEN (Priorität: MITTEL)
**Zeitaufwand**: 2-3 Tage

### 5.1 Undo-Funktion ↩️

#### Task 5.1.1: Undo für Antworten
**Priorität**: 🟡 MITTEL
**Aufwand**: 3 Stunden
**Dateien**: `js/undo-system.js` (NEU)

**Use Case**:
- User klickt falsche Multiple-Choice-Antwort versehentlich
- User drückt zu früh "Enter"
- User will Antwort ändern

**Implementation**:
```javascript
class UndoSystem {
  constructor() {
    this.history = [];
    this.maxHistory = 10;
  }

  recordAction(action) {
    this.history.push({
      type: action.type,
      timestamp: Date.now(),
      data: action.data,
      undo: action.undo
    });

    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  canUndo() {
    return this.history.length > 0;
  }

  undo() {
    if (!this.canUndo()) return;

    const action = this.history.pop();
    action.undo(action.data);

    toast.info('Aktion rueckgaengig gemacht');
  }
}

const undoSystem = new UndoSystem();

// Usage
function checkAnswer() {
  const previousState = saveCurrentState();

  undoSystem.recordAction({
    type: 'check-answer',
    data: previousState,
    undo: (state) => restoreState(state)
  });

  // ... check logic
}

// Keyboard Shortcut
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    e.preventDefault();
    undoSystem.undo();
  }
});
```

**UI**:
```html
<button id="undo-btn"
        class="icon-btn"
        disabled
        aria-label="Rueckgaengig (Strg+Z)">
  ↩️
</button>
```

**Acceptance Criteria**:
- [ ] Undo-Button in Header
- [ ] Keyboard: Ctrl+Z
- [ ] Disabled wenn nichts zum Undo
- [ ] Max 10 Actions im History
- [ ] Visual Feedback (Toast)

---

### 5.2 Keyboard Shortcuts ⌨️

#### Task 5.2.1: Erweiterte Tastatur-Steuerung
**Priorität**: 🟡 MITTEL
**Aufwand**: 2 Stunden
**Dateien**: `js/keyboard-shortcuts.js` (NEU)

**Shortcuts**:
```javascript
const shortcuts = {
  'Enter': () => checkAnswer(),
  'r': () => repeatExercise(),
  'd': () => toggleDarkMode(),
  '?': () => openHelp(),
  'Escape': () => closeModal(),
  'n': () => nextExercise(),
  's': () => toggleSRS(),
  'Ctrl+z': () => undo(),
  'Ctrl+s': () => saveProgress(),
  '1-4': () => selectMultipleChoice(number)
};
```

**Implementation**:
```javascript
class KeyboardShortcuts {
  constructor() {
    this.shortcuts = new Map();
    this.init();
  }

  register(key, callback, description) {
    this.shortcuts.set(key.toLowerCase(), {
      callback,
      description
    });
  }

  init() {
    // Register shortcuts
    this.register('Enter', () => this.checkAnswer(), 'Antwort pruefen');
    this.register('r', () => this.repeat(), 'Wiederholen');
    this.register('d', () => this.toggleDarkMode(), 'Dark Mode');
    this.register('?', () => this.openHelp(), 'Hilfe oeffnen');
    this.register('n', () => this.nextExercise(), 'Naechste Uebung');

    // Numbers 1-4 für Multiple Choice
    for (let i = 1; i <= 4; i++) {
      this.register(String(i), () => this.selectChoice(i-1),
                    `Antwort ${i} waehlen`);
    }

    // Listen
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
  }

  handleKeydown(e) {
    // Ignore wenn in Input-Field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    let key = e.key.toLowerCase();

    // Modifier
    if (e.ctrlKey) key = 'ctrl+' + key;
    if (e.metaKey) key = 'cmd+' + key;

    const shortcut = this.shortcuts.get(key);
    if (shortcut) {
      e.preventDefault();
      shortcut.callback();
    }
  }

  getShortcutList() {
    return Array.from(this.shortcuts.entries()).map(([key, data]) => ({
      key,
      description: data.description
    }));
  }
}

const keyboard = new KeyboardShortcuts();
```

**Visual Hints**:
```html
<button id="check-btn" class="btn-primary">
  Pruefen
  <kbd class="shortcut-hint">Enter</kbd>
</button>

<button id="repeat-btn" class="btn-secondary">
  Wiederholen
  <kbd class="shortcut-hint">R</kbd>
</button>
```

**CSS**:
```css
.shortcut-hint {
  display: inline-block;
  padding: 2px 6px;
  margin-left: 8px;
  background: rgba(0,0,0,0.1);
  border-radius: 3px;
  font-size: 0.8em;
  font-family: monospace;
}
```

**Acceptance Criteria**:
- [ ] Alle wichtigen Aktionen haben Shortcuts
- [ ] Visual Hints auf Buttons
- [ ] Shortcuts-Übersicht in Hilfe
- [ ] Keine Konflikte mit Browser-Shortcuts
- [ ] Funktioniert nicht in Input-Feldern

---

### 5.3 Better Error Recovery 🔧

#### Task 5.3.1: Graceful Error Handling
**Priorität**: 🟡 MITTEL
**Aufwand**: 2 Stunden
**Dateien**: `js/error-handler.js` (NEU)

**Problem**:
- Unhandled Errors crashen App
- Nutzer wissen nicht, was zu tun ist

**Lösung**:
```javascript
class ErrorHandler {
  constructor() {
    this.setupGlobalHandlers();
  }

  setupGlobalHandlers() {
    // Uncaught Errors
    window.addEventListener('error', (e) => {
      this.handleError(e.error);
    });

    // Unhandled Promise Rejections
    window.addEventListener('unhandledrejection', (e) => {
      this.handleError(e.reason);
    });
  }

  handleError(error) {
    console.error('Error caught:', error);

    // User-friendly error messages
    const userMessage = this.getUserMessage(error);

    this.showErrorDialog({
      title: 'Ein Fehler ist aufgetreten',
      message: userMessage,
      error: error.message,
      actions: this.getRecoveryActions(error)
    });
  }

  getUserMessage(error) {
    // Map technical errors to user-friendly messages
    if (error.message.includes('fetch')) {
      return 'Daten konnten nicht geladen werden.';
    }
    if (error.message.includes('IndexedDB')) {
      return 'Fehler beim Speichern deines Fortschritts.';
    }
    return 'Ein unerwarteter Fehler ist aufgetreten.';
  }

  getRecoveryActions(error) {
    const actions = [
      {
        label: 'Neu laden',
        callback: () => location.reload()
      }
    ];

    if (error.message.includes('fetch')) {
      actions.push({
        label: 'Offline-Modus aktivieren',
        callback: () => this.enableOfflineMode()
      });
    }

    if (error.message.includes('IndexedDB')) {
      actions.push({
        label: 'Cache leeren',
        callback: () => this.clearCache()
      });
    }

    return actions;
  }

  showErrorDialog(config) {
    const modal = document.createElement('div');
    modal.className = 'modal error-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h2>${config.title}</h2>
        <p>${config.message}</p>

        <details>
          <summary>Technische Details</summary>
          <pre>${config.error}</pre>
        </details>

        <div class="error-actions">
          ${config.actions.map(action => `
            <button class="btn-primary" onclick="${action.callback}">
              ${action.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }
}

const errorHandler = new ErrorHandler();
```

**Acceptance Criteria**:
- [ ] Alle Errors werden abgefangen
- [ ] User-friendly Fehlermeldungen
- [ ] Recovery-Actions angeboten
- [ ] Technische Details versteckbar
- [ ] Keine leeren Screens

---

## ♿ PHASE 6: ACCESSIBILITY (Priorität: MITTEL-NIEDRIG)
**Zeitaufwand**: 2 Tage

### 6.1 Enhanced ARIA Support

#### Task 6.1.1: Vollständige ARIA-Annotationen
**Priorität**: 🟡 MITTEL
**Aufwand**: 3 Stunden
**Dateien**: `js/a11y-enhanced.js` (NEU)

**Improvements**:
```html
<!-- Exercise Container -->
<div id="exercise-container"
     role="region"
     aria-label="Aktuelle Uebung"
     aria-live="polite">

  <!-- Question -->
  <div class="question"
       role="heading"
       aria-level="2">
    Übersetze: <span lang="es">hola</span>
  </div>

  <!-- Multiple Choice Options -->
  <div role="radiogroup"
       aria-label="Antwortmoeglichkeiten">
    <button role="radio"
            aria-checked="false"
            aria-label="Antwort A: hallo">
      hallo
    </button>
    <!-- ... -->
  </div>
</div>

<!-- Feedback -->
<div id="feedback-container"
     role="status"
     aria-live="assertive"
     aria-atomic="true">
  <!-- Dynamic feedback -->
</div>

<!-- Progress -->
<div id="progress-bar"
     role="progressbar"
     aria-valuenow="50"
     aria-valuemin="0"
     aria-valuemax="100"
     aria-label="Fortschritt: 5 von 10 Uebungen">
</div>
```

**JavaScript Updates**:
```javascript
function updateProgress(current, total) {
  const progressBar = document.getElementById('progress-bar');
  const percent = Math.round((current / total) * 100);

  progressBar.setAttribute('aria-valuenow', percent);
  progressBar.setAttribute('aria-label',
    `Fortschritt: ${current} von ${total} Uebungen (${percent}%)`);
}

function showFeedback(isCorrect, message) {
  const feedback = document.getElementById('feedback-container');

  // Update ARIA
  feedback.setAttribute('role', isCorrect ? 'status' : 'alert');
  feedback.textContent = message;

  // Screen Reader announcement
  announceToScreenReader(message);
}
```

**Acceptance Criteria**:
- [ ] Alle interaktiven Elemente haben ARIA-Labels
- [ ] Live Regions für dynamische Inhalte
- [ ] Semantic HTML wo möglich
- [ ] ARIA-Validierung mit axe DevTools

---

### 6.2 Fokus-Management

#### Task 6.2.1: Intelligentes Focus-Handling
**Priorität**: 🟡 MITTEL
**Aufwand**: 2 Stunden
**Dateien**: `js/focus-manager.js` (NEU)

**Features**:
- Auto-Focus auf wichtigstes Element
- Focus-Trap in Modals
- Focus-Wiederherstellung nach Modal

**Implementation**:
```javascript
class FocusManager {
  constructor() {
    this.focusHistory = [];
  }

  // Speichere aktuellen Focus
  saveFocus() {
    this.focusHistory.push(document.activeElement);
  }

  // Stelle Focus wieder her
  restoreFocus() {
    const lastFocus = this.focusHistory.pop();
    if (lastFocus && lastFocus.focus) {
      lastFocus.focus();
    }
  }

  // Focus-Trap für Modals
  trapFocus(container) {
    const focusable = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];

    container.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift+Tab
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    });

    // Initial focus
    firstFocusable.focus();
  }

  // Auto-Focus nach Exercise-Load
  focusExercise() {
    const exerciseType = getCurrentExerciseType();

    if (exerciseType === 'typing') {
      // Focus Input-Field
      document.getElementById('answer-input').focus();
    } else if (exerciseType === 'choice') {
      // Focus erste Antwort
      document.querySelector('.choice-btn').focus();
    }
  }
}

const focusManager = new FocusManager();

// Usage
function showModal(modalId) {
  focusManager.saveFocus();

  const modal = document.getElementById(modalId);
  modal.classList.add('show');

  focusManager.trapFocus(modal);
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove('show');

  focusManager.restoreFocus();
}
```

**Acceptance Criteria**:
- [ ] Auto-Focus auf Input bei Typing-Übungen
- [ ] Focus-Trap in allen Modals
- [ ] Focus-Wiederherstellung nach Modal-Close
- [ ] Visible Focus-Outlines (3px solid)

---

### 6.3 Farb-Kontrast Optimierung

#### Task 6.3.1: WCAG AAA Kontrast-Prüfung
**Priorität**: 🟢 NIEDRIG
**Aufwand**: 2 Stunden
**Dateien**: `css/a11y-colors.css` (NEU)

**Aktuelle Kontraste prüfen**:
```css
/* Zu niedrige Kontraste fixen */

/* VORHER: Secondary Text */
.secondary-text {
  color: #546e7a; /* Kontrast 4.2:1 - WCAG AA ❌ AAA */
}

/* NACHHER */
.secondary-text {
  color: #3e5159; /* Kontrast 7:1 - WCAG AAA ✓ */
}

/* VORHER: Accent Color */
.accent {
  color: #007bff; /* Kontrast 4.5:1 auf weiß */
}

/* NACHHER */
.accent {
  color: #0056b3; /* Kontrast 7:1 */
}

/* Dark Mode */
[data-theme="dark"] .secondary-text {
  color: #c5cfd6; /* Kontrast 7:1 auf #121212 */
}
```

**Kontrast-Checker Tool**:
```javascript
function checkContrast(color1, color2) {
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);

  const ratio = (Math.max(luminance1, luminance2) + 0.05) /
                (Math.min(luminance1, luminance2) + 0.05);

  return {
    ratio: ratio.toFixed(2),
    AA: ratio >= 4.5,
    AAA: ratio >= 7,
    AAA_Large: ratio >= 4.5
  };
}

// Test all color combinations
const colors = {
  primary: '#1c1e21',
  secondary: '#3e5159',
  accent: '#0056b3',
  background: '#ffffff'
};

console.table({
  'Primary on BG': checkContrast(colors.primary, colors.background),
  'Secondary on BG': checkContrast(colors.secondary, colors.background),
  'Accent on BG': checkContrast(colors.accent, colors.background)
});
```

**Acceptance Criteria**:
- [ ] Alle Text-Farben haben 7:1 Kontrast (AAA)
- [ ] Große Texte haben min. 4.5:1 (AAA Large)
- [ ] Dark Mode ebenfalls AAA-konform
- [ ] High-Contrast Mode unterstützt

---

## 📱 PHASE 7: MOBILE UX (Priorität: MITTEL)
**Zeitaufwand**: 2 Tage

### 7.1 Touch-Gesten

#### Task 7.1.1: Swipe-Navigation
**Priorität**: 🟡 MITTEL
**Aufwand**: 3 Stunden
**Dateien**: `js/touch-gestures.js` (NEU)

**Gesten**:
- **Swipe Left**: Nächste Übung
- **Swipe Right**: Vorherige Übung (Undo)
- **Swipe Down**: Hilfe öffnen

**Implementation**:
```javascript
class TouchGestures {
  constructor(element) {
    this.element = element;
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
    this.minSwipeDistance = 50;

    this.init();
  }

  init() {
    this.element.addEventListener('touchstart', (e) => {
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
    }, { passive: true });

    this.element.addEventListener('touchend', (e) => {
      this.endX = e.changedTouches[0].clientX;
      this.endY = e.changedTouches[0].clientY;

      this.handleSwipe();
    }, { passive: true });
  }

  handleSwipe() {
    const deltaX = this.endX - this.startX;
    const deltaY = this.endY - this.startY;

    // Horizontal Swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > this.minSwipeDistance) {
        if (deltaX > 0) {
          this.onSwipeRight();
        } else {
          this.onSwipeLeft();
        }
      }
    }
    // Vertical Swipe
    else {
      if (Math.abs(deltaY) > this.minSwipeDistance) {
        if (deltaY > 0) {
          this.onSwipeDown();
        } else {
          this.onSwipeUp();
        }
      }
    }
  }

  onSwipeLeft() {
    console.log('Swipe Left: Next Exercise');
    nextExercise();
  }

  onSwipeRight() {
    console.log('Swipe Right: Previous/Undo');
    if (undoSystem.canUndo()) {
      undoSystem.undo();
    }
  }

  onSwipeDown() {
    console.log('Swipe Down: Open Help');
    openHelp();
  }

  onSwipeUp() {
    console.log('Swipe Up: Close Modal');
    if (document.querySelector('.modal.show')) {
      closeModal();
    }
  }
}

// Initialize on exercise container
const gestures = new TouchGestures(
  document.getElementById('exercise-container')
);
```

**Visual Feedback**:
```css
/* Swipe Indicator */
.swipe-indicator {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 48px;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}

.swipe-indicator.left {
  right: 20px;
}

.swipe-indicator.right {
  left: 20px;
}

.swiping-left .swipe-indicator.left {
  opacity: 0.5;
}

.swiping-right .swipe-indicator.right {
  opacity: 0.5;
}
```

**Acceptance Criteria**:
- [ ] Smooth Swipe-Detection
- [ ] Visual Feedback während Swipe
- [ ] Nur auf Touch-Devices
- [ ] Keine Konflikte mit Scrolling

---

### 7.2 Mobile-Optimized Input

#### Task 7.2.1: Besseres Virtual Keyboard Handling
**Priorität**: 🟡 MITTEL
**Aufwand**: 2 Stunden
**Dateien**: `js/mobile-input.js` (NEU)

**Probleme**:
- Virtual Keyboard verdeckt Input
- Spanische Sonderzeichen schwer einzugeben

**Lösungen**:
```html
<!-- Spanish Character Helper -->
<div class="spanish-keyboard">
  <button class="char-btn" data-char="á">á</button>
  <button class="char-btn" data-char="é">é</button>
  <button class="char-btn" data-char="í">í</button>
  <button class="char-btn" data-char="ó">ó</button>
  <button class="char-btn" data-char="ú">ú</button>
  <button class="char-btn" data-char="ñ">ñ</button>
  <button class="char-btn" data-char="¿">¿</button>
  <button class="char-btn" data-char="¡">¡</button>
</div>
```

```javascript
// Insert character at cursor position
document.querySelectorAll('.char-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const char = btn.dataset.char;
    const input = document.getElementById('answer-input');

    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;

    input.value = text.slice(0, start) + char + text.slice(end);
    input.selectionStart = input.selectionEnd = start + 1;
    input.focus();
  });
});

// Adjust viewport when keyboard opens
window.visualViewport.addEventListener('resize', () => {
  const input = document.activeElement;
  if (input.tagName === 'INPUT') {
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});
```

**Acceptance Criteria**:
- [ ] Spanish Char Keyboard immer sichtbar bei Typing-Übungen
- [ ] Input bleibt sichtbar wenn Virtual Keyboard erscheint
- [ ] Char-Insertion an Cursor-Position
- [ ] Touch-freundliche Buttons (min 44px)

---

## 🎯 PRIORISIERUNGS-MATRIX

### Must-Have (Woche 1) ⚠️
1. Debug-Toolbar verstecken
2. Developer-Banner entfernen
3. Loading States
4. Context-Aware Button Labels
5. Visueller Progress Bar
6. Willkommens-Dialog

### Should-Have (Woche 2) 🔴
7. Interaktives Tutorial
8. Hilfe-System
9. Toast-Notifications
10. Exercise Transitions
11. Session Summary
12. Undo-Funktion

### Nice-to-Have (Woche 3) 🟡
13. Fluent Design Colors
14. DPI-Awareness
15. Responsive Breakpoints
16. Keyboard Shortcuts
17. Touch-Gesten
18. Focus-Management

### Future (Woche 4+) 🟢
19. Acrylic Effekte
20. Windows Notifications
21. File Integration
22. Celebration Animations
23. Kontextsensitive Tooltips
24. Mobile Input Optimierung
25. Farb-Kontrast AAA
26. ARIA Enhanced

---

## 📊 ERFOLGS-METRIKEN

Nach Implementierung messen:

### User Experience
- [ ] **Time to First Interaction**: < 2 Sekunden
- [ ] **Task Completion Rate**: > 95%
- [ ] **User Error Rate**: < 5%
- [ ] **Help System Usage**: Messung der Nutzung

### Accessibility
- [ ] **WCAG Score**: AAA
- [ ] **Lighthouse A11y Score**: 100/100
- [ ] **Keyboard Navigation**: 100% Coverage
- [ ] **Screen Reader Compatibility**: NVDA, JAWS tested

### Performance
- [ ] **TTI (Time to Interactive)**: < 2s
- [ ] **FCP (First Contentful Paint)**: < 1s
- [ ] **FPS**: Constant 60 FPS
- [ ] **Bundle Size**: < 500 KB

### Engagement
- [ ] **Session Duration**: +30% (durch bessere UX)
- [ ] **Retention Rate**: +20%
- [ ] **Error Recovery Success**: > 90%

---

## 🔄 ITERATIVES VORGEHEN

### Sprint 1 (Woche 1)
- Tasks 1-6 implementieren
- User Testing mit 3-5 Personen
- Feedback sammeln
- Quick Fixes

### Sprint 2 (Woche 2)
- Tasks 7-12 implementieren
- A/B Testing (alte vs. neue Version)
- Performance-Messungen
- Optimierungen

### Sprint 3 (Woche 3)
- Tasks 13-18 implementieren
- Windows 11 Native Testing
- Cross-Browser Testing
- Polish & Bug Fixes

### Sprint 4 (Woche 4)
- Tasks 19-26 nach Bedarf
- Final Testing
- Documentation Update
- Release

---

## ✅ DEFINITION OF DONE

Jede Task ist "done" wenn:
- [ ] Code implementiert & getestet
- [ ] Responsive auf allen Breakpoints
- [ ] Accessible (WCAG AA minimum)
- [ ] Dark Mode kompatibel
- [ ] Performance-optimiert (keine Ruckler)
- [ ] Code dokumentiert (Comments + README)
- [ ] User-tested (min. 2 Personen)
- [ ] Git committed mit sinnvoller Message

---

**NEXT STEPS**:
1. Review dieser Roadmap
2. Priorisierung bestätigen
3. Sprint 1 Tasks starten
4. Daily Progress Updates

---

**VERSION**: 1.0
**LAST UPDATED**: 21. Oktober 2025
**MAINTAINER**: Spanish-App Team
