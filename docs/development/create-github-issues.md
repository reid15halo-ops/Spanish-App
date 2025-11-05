# GitHub Issues für UX-Verbesserungen

**Repository**: https://github.com/reid15halo-ops/Spanish-App
**Branch**: feature/ux-improvements
**Milestone**: v0.1 - User-Friendly

---

## PHASE 1: QUICK WINS (Must-Have)

### Issue #1: 🧹 Debug-Toolbar in Production verstecken
**Priority**: P0 (KRITISCH)
**Labels**: `enhancement`, `P0`, `UX`, `quick-win`
**Assignee**: -
**Milestone**: v0.1
**Estimate**: 30 min

**Description**:
```markdown
## Problem
Der Debug-Toolbar ist aktuell IMMER sichtbar und verwirrt normale Nutzer mit technischen Controls:
- mode-selector (Learn/SRS/Conjugation)
- force-type (Choice/Typing/Match)
- CSV-Loader Button

## Lösung
Development-Modus Detection implementieren:
```javascript
const isDevelopment =
  window.location.hostname === 'localhost' ||
  window.location.search.includes('debug=true');

if (!isDevelopment) {
  document.getElementById('debug-toolbar').style.display = 'none';
}
```

## Acceptance Criteria
- [ ] Debug-Toolbar nur bei `localhost` ODER `?debug=true` sichtbar
- [ ] Production-Build zeigt clean Header
- [ ] README aktualisiert mit Debug-Modus-Anleitung

## Related Files
- `index.html`
- `js/app.js`
- `css/style.css`

## Screenshots
[Vor] Debug-Toolbar immer sichtbar
[Nach] Clean Production Header
```

---

### Issue #2: 🚫 Developer-Banner entfernen
**Priority**: P0 (KRITISCH)
**Labels**: `enhancement`, `P0`, `UX`, `quick-win`
**Milestone**: v0.1
**Estimate**: 20 min

**Description**:
```markdown
## Problem
Normale Nutzer sehen verwirrende Developer-Banner:
- "ASCII-ONLY Version" Banner
- No-Gamification Status-Indikator
- Nogame-Banner (roter Alert bei Verstößen)

## Lösung
Diese Banner nur im Development-Modus anzeigen:
```javascript
if (isDevelopment) {
  initNoGameGuard();
  initAsciiCompliance();
} else {
  document.querySelector('.nogame-banner')?.remove();
  document.querySelector('.ascii-notice')?.remove();
}
```

## Acceptance Criteria
- [ ] Normale Nutzer sehen keine technischen Banner
- [ ] Development-Modus behält alle Guards
- [ ] Console-Warnings bleiben für Entwickler

## Related Files
- `index.html`
- `js/app.js`
```

---

### Issue #3: ⏳ Loading States hinzufügen
**Priority**: P0 (HOCH)
**Labels**: `enhancement`, `P0`, `UX`, `performance`
**Milestone**: v0.1
**Estimate**: 2 hours

**Description**:
```markdown
## Problem
- Keine sichtbaren Ladeindikatoren
- DB-Operationen wirken "frozen"
- Nutzer wissen nicht, ob App reagiert

## Lösung
Implementiere globales Loading-System:
```html
<div id="loading-overlay" class="loading-overlay hidden">
  <div class="spinner"></div>
  <p class="loading-text">Lade Vokabeln...</p>
</div>
```

## Components
1. **Spinner Component** (CSS-Animation)
2. **Skeleton Screens** für Exercise-Container
3. **Contextual Messages** ("Lade Verben...", "Generiere Übung...")

## Acceptance Criteria
- [ ] Spinner bei allen async Operationen (fetch, IndexedDB)
- [ ] Skeleton Screens während Exercise-Load
- [ ] Contextual Loading Messages
- [ ] Smooth Fade-In/Out

## Related Files
- `js/app.js` (loadItems, generateExercise)
- `css/style.css` (Spinner, Skeleton)
```

---

### Issue #4: 🎯 Context-Aware Button Labels
**Priority**: P0 (HOCH)
**Labels**: `enhancement`, `P0`, `UX`
**Milestone**: v0.1
**Estimate**: 1 hour

**Description**:
```markdown
## Problem
Check-Button zeigt immer "Ueberpruefen", egal welcher Übungstyp.

## Lösung
Button-Text dynamisch anpassen:
```javascript
const labels = {
  'choice': 'Antwort pruefen',
  'typing': 'Eingabe pruefen',
  'match': 'Zuordnung pruefen',
  'conjugation': 'Konjugation pruefen'
};
```

## Acceptance Criteria
- [ ] Button-Text passt sich Übungstyp an
- [ ] Visuell hervorgehoben (Primary Button Stil)
- [ ] Keyboard Shortcut angezeigt ("Pruefen (Enter)")

## Related Files
- `js/app.js` (generateExercise)
```

---

### Issue #5: 📊 Visueller Progress Bar
**Priority**: P0 (HOCH)
**Labels**: `enhancement`, `P0`, `UX`
**Milestone**: v0.1
**Estimate**: 1.5 hours

**Description**:
```markdown
## Problem
Status-Bar ist text-basiert: "SRS-Modus | 5/10"
Nicht intuitiv für Nutzer.

## Lösung
Implementiere visuellen Progress Bar:
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

## Acceptance Criteria
- [ ] Animierter Progress Bar
- [ ] Prozent-Anzeige (50%)
- [ ] Verbleibende Items (5 von 10)
- [ ] Klares Mode-Label (SRS vs. Normal)

## Related Files
- `js/app.js`
- `css/style.css`
```

---

### Issue #6: 👋 Willkommens-Dialog für Erstnutzer
**Priority**: P0 (HOCH)
**Labels**: `enhancement`, `P0`, `UX`, `onboarding`
**Milestone**: v0.1
**Estimate**: 3 hours

**Description**:
```markdown
## Problem
Erstnutzer werden direkt in Übung geworfen ohne Erklärung.

## Lösung
Welcome-Modal beim ersten Besuch:
```javascript
if (!localStorage.getItem('hasSeenWelcome')) {
  showWelcomeModal();
  localStorage.setItem('hasSeenWelcome', 'true');
}
```

## Features
- 📚 Übersicht der 4 Übungstypen
- 🧠 SRS-System Erklärung
- 🌙 Dark Mode & Offline Hinweis
- CTA: "Tutorial starten" / "Direkt loslegen"

## Acceptance Criteria
- [ ] Zeigt nur beim ersten Besuch
- [ ] "Tutorial starten" führt zu Interactive Tutorial
- [ ] "Direkt loslegen" schließt Modal
- [ ] Schönes Design mit Icons
- [ ] Responsive für Mobile

## Related Files
- `js/onboarding.js` (NEU)
- `css/onboarding.css` (NEU)
- `index.html`
```

---

## PHASE 2: ONBOARDING & HILFE (Should-Have)

### Issue #7: 🎓 Interaktives Tutorial
**Priority**: P1 (HOCH)
**Labels**: `enhancement`, `P1`, `UX`, `onboarding`
**Milestone**: v0.1
**Estimate**: 4 hours

**Description**:
```markdown
## Flow
1. **Schritt 1**: Multiple-Choice-Übung erklärt
2. **Schritt 2**: Prüfen-Button Highlight
3. **Schritt 3**: Feedback-Container erklärt
4. **Schritt 4**: Progress Bar erklärt
5. **Schritt 5**: SRS-System erklärt

## Implementation
```javascript
class Tutorial {
  steps = [
    { target: '#exercise-container', title: '...', content: '...' },
    // ...
  ];

  show() {
    this.createOverlay();
    this.highlightElement(this.steps[0].target);
    this.showTooltip(this.steps[0]);
  }
}
```

## Acceptance Criteria
- [ ] 5-7 Tutorial-Schritte
- [ ] Dunkel-Overlay mit Spotlight
- [ ] "Weiter" / "Zurück" / "Beenden" Buttons
- [ ] Speichert Completion in localStorage

## Related Files
- `js/tutorial.js` (NEU)
- `css/tutorial.css` (NEU)
```

---

### Issue #8: 🆘 Hilfe-System implementieren
**Priority**: P1 (MITTEL)
**Labels**: `enhancement`, `P1`, `UX`, `documentation`
**Milestone**: v0.1
**Estimate**: 2 hours

**Description**:
```markdown
## Features
- Hilfe-Button im Header (❓)
- Modal mit:
  - Übungstypen-Erklärung
  - SRS-System-Erklärung
  - Tastatur-Shortcuts Tabelle
- Keyboard Shortcut: `?` öffnet Hilfe
- Schließen mit ESC

## Acceptance Criteria
- [ ] Help-Button immer sichtbar (außer bei Tutorial)
- [ ] Shortcut `?` öffnet Hilfe
- [ ] Übersichtliche Kategorisierung
- [ ] Suchfunktion (optional)

## Related Files
- `js/help-system.js` (NEU)
- `index.html`
```

---

### Issue #9: 🔔 Toast-Notification-System
**Priority**: P1 (HOCH)
**Labels**: `enhancement`, `P1`, `UX`, `feedback`
**Milestone**: v0.1
**Estimate**: 3 hours

**Description**:
```markdown
## Toast Types
- **Success**: Grün, ✓ Icon
- **Error**: Rot, ✗ Icon
- **Info**: Blau, ℹ Icon
- **Warning**: Orange, ⚠ Icon

## Use Cases
```javascript
// Bei Erfolg
toast.success('Richtig! Box 2 → Box 3');

// Bei Fehler
toast.error('Falsch. Zurueck zu Box 1');

// Bei Session-Ende
toast.success('Session beendet! 12/15 richtig (80%)');
```

## Acceptance Criteria
- [ ] Smooth Slide-in von rechts
- [ ] Auto-Close nach 3 Sekunden
- [ ] Manuelles Schließen möglich
- [ ] Stapelbar (mehrere gleichzeitig)
- [ ] ARIA live region

## Related Files
- `js/toast.js` (NEU)
- `css/toast.css` (NEU)
- `js/app.js` (Integration)
```

---

### Issue #10: ✨ Smooth Exercise Transitions
**Priority**: P1 (MITTEL)
**Labels**: `enhancement`, `P1`, `UX`, `animations`
**Milestone**: v0.1
**Estimate**: 2 hours

**Description**:
```markdown
## Problem
Übungen erscheinen abrupt ohne visuellen Flow.

## Lösung
Fade-In/Out Animationen:
```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

## Acceptance Criteria
- [ ] Smooth Fade-Transitions zwischen Übungen
- [ ] Respektiert `prefers-reduced-motion`
- [ ] Keine Ruckler (60 FPS)
- [ ] 300ms Transition Duration

## Related Files
- `css/animations.css` (NEU)
- `js/app.js` (loadNextExercise)
```

---

### Issue #11: 📊 Session Summary Screen
**Priority**: P1 (MITTEL)
**Labels**: `enhancement`, `P1`, `UX`, `gamification`
**Milestone**: v0.1
**Estimate**: 3 hours

**Description**:
```markdown
## Features
- **Statistiken**: 15 Übungen, 12 richtig, 3 falsch, 80% Genauigkeit
- **SRS-Updates**: 5 Items aufgestiegen, 2 abgestiegen, 1 gemeistert
- **Kategorien-Breakdown**: Essen 75%, Farben 100%
- **Actions**: "Neue Session starten" / "Beenden"

## Acceptance Criteria
- [ ] Zeigt am Ende jeder Session (10+ Übungen)
- [ ] Übersichtliche Stats-Cards
- [ ] Kategorie-Progress Bars
- [ ] Motivierende Nachrichten

## Related Files
- `js/session-summary.js` (NEU)
- `css/summary.css` (NEU)
```

---

### Issue #12: ↩️ Undo-Funktion implementieren
**Priority**: P1 (MITTEL)
**Labels**: `enhancement`, `P1`, `UX`
**Milestone**: v0.1
**Estimate**: 3 hours

**Description**:
```markdown
## Use Cases
- Falsche Multiple-Choice-Antwort versehentlich geklickt
- Zu früh "Enter" gedrückt
- Antwort ändern wollen

## Implementation
```javascript
class UndoSystem {
  history = [];

  recordAction(action) {
    this.history.push({
      type: action.type,
      data: action.data,
      undo: action.undo
    });
  }

  undo() {
    const action = this.history.pop();
    action.undo(action.data);
  }
}
```

## Acceptance Criteria
- [ ] Undo-Button in Header
- [ ] Keyboard: Ctrl+Z
- [ ] Disabled wenn nichts zum Undo
- [ ] Max 10 Actions im History

## Related Files
- `js/undo-system.js` (NEU)
```

---

## PHASE 3: WINDOWS 11-OPTIMIERUNG (Nice-to-Have)

### Issue #13: 🎨 Fluent Design Colors & Typography
**Priority**: P2 (MITTEL)
**Labels**: `enhancement`, `P2`, `Windows11`, `design`
**Milestone**: v0.2
**Estimate**: 3 hours

**Description**:
```markdown
## Windows 11 Palette
- Background: #F3F3F3 (Light), #202020 (Dark)
- Accent: #0078D4 (später: Registry-Wert)
- Text: #000000E6 (90% opacity)
- Rounded Corners: 4px-8px

## Typography
- Font: Segoe UI Variable
- Display: 28px/600
- Title: 20px/600
- Body: 14px/400

## Acceptance Criteria
- [ ] Windows 11-konforme Farben
- [ ] Segoe UI Variable Schrift
- [ ] Fluent Shadows
- [ ] Dark Mode mit Fluent-Palette

## Related Files
- `css/fluent-theme.css` (NEU)
```

---

### Issue #14: 📺 Per-Monitor DPI-Awareness
**Priority**: P2 (MITTEL)
**Labels**: `enhancement`, `P2`, `Windows11`, `accessibility`
**Milestone**: v0.2
**Estimate**: 4 hours

**Description**:
```markdown
## Problem
App nicht DPI-aware auf 4K-Displays → Text und Icons zu klein

## Lösung
```javascript
class DPIManager {
  applyScaling() {
    const dpi = window.devicePixelRatio;
    const scalingFactor = dpi >= 3 ? 1.5 : (dpi >= 2 ? 1.25 : 1);
    document.documentElement.style.setProperty('--scale-factor', scalingFactor);
  }
}
```

## Acceptance Criteria
- [ ] Auto-Scaling auf 4K/8K
- [ ] Crisp Text und Icons
- [ ] Reagiert auf Monitor-Wechsel
- [ ] 100%, 125%, 150%, 200%, 250% DPI

## Related Files
- `js/dpi-manager.js` (NEU)
```

---

### Issue #15: 📱 Responsive Breakpoints
**Priority**: P2 (MITTEL)
**Labels**: `enhancement`, `P2`, `responsive`, `mobile`
**Milestone**: v0.2
**Estimate**: 3 hours

**Description**:
```markdown
## Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1399px
- **Desktop**: 1400px - 1919px
- **Large Desktop**: >= 1920px

## Features
- Mobile: Single-column, volle Breite
- Tablet: 2-column Stats Grid
- Desktop: Sidebar + Main Content
- Large: Main + 2 Sidebars (Stats + Info)

## Acceptance Criteria
- [ ] Mobile-First Design
- [ ] Tablet-optimiert
- [ ] Desktop nutzt Platz
- [ ] Large Desktop zeigt Sidebars

## Related Files
- `css/responsive.css` (NEU)
```

---

### Issue #16: ⌨️ Erweiterte Keyboard Shortcuts
**Priority**: P2 (NIEDRIG)
**Labels**: `enhancement`, `P2`, `UX`, `accessibility`
**Milestone**: v0.2
**Estimate**: 2 hours

**Description**:
```markdown
## Shortcuts
- `Enter`: Antwort prüfen
- `R`: Wiederholen
- `D`: Dark Mode
- `?`: Hilfe
- `N`: Nächste Übung
- `S`: SRS Toggle
- `Ctrl+Z`: Undo
- `1-4`: Multiple Choice Antwort

## Features
- Visual Hints auf Buttons: `<kbd>Enter</kbd>`
- Shortcuts-Übersicht in Hilfe
- Keine Konflikte mit Browser

## Acceptance Criteria
- [ ] Alle wichtigen Aktionen haben Shortcuts
- [ ] Visual Hints auf Buttons
- [ ] Dokumentiert in Hilfe
- [ ] Funktioniert nicht in Input-Feldern

## Related Files
- `js/keyboard-shortcuts.js` (NEU)
```

---

### Issue #17: 👆 Touch-Gesten (Mobile)
**Priority**: P2 (NIEDRIG)
**Labels**: `enhancement`, `P2`, `mobile`, `UX`
**Milestone**: v0.2
**Estimate**: 3 hours

**Description**:
```markdown
## Gesten
- **Swipe Left**: Nächste Übung
- **Swipe Right**: Vorherige / Undo
- **Swipe Down**: Hilfe öffnen
- **Swipe Up**: Modal schließen

## Implementation
```javascript
class TouchGestures {
  handleSwipe() {
    const deltaX = this.endX - this.startX;
    if (deltaX > 50) this.onSwipeRight();
    else if (deltaX < -50) this.onSwipeLeft();
  }
}
```

## Acceptance Criteria
- [ ] Smooth Swipe-Detection
- [ ] Visual Feedback
- [ ] Nur auf Touch-Devices
- [ ] Keine Konflikte mit Scrolling

## Related Files
- `js/touch-gestures.js` (NEU)
```

---

### Issue #18: 🎯 Intelligentes Focus-Management
**Priority**: P2 (NIEDRIG)
**Labels**: `enhancement`, `P2`, `accessibility`, `UX`
**Milestone**: v0.2
**Estimate**: 2 hours

**Description**:
```markdown
## Features
- Auto-Focus auf wichtigstes Element (Input bei Typing-Übung)
- Focus-Trap in Modals
- Focus-Wiederherstellung nach Modal-Close

## Implementation
```javascript
class FocusManager {
  trapFocus(container) {
    // Cycle focus within modal
  }

  focusExercise() {
    if (type === 'typing') {
      document.getElementById('answer-input').focus();
    }
  }
}
```

## Acceptance Criteria
- [ ] Auto-Focus auf Input bei Typing
- [ ] Focus-Trap in Modals
- [ ] Focus-Restore nach Close
- [ ] Visible Focus Outlines (3px)

## Related Files
- `js/focus-manager.js` (NEU)
```

---

## PHASE 4: POLISH & FUTURE (Low Priority)

### Issue #19: ✨ Acrylic/Mica Background Effekte
**Priority**: P3 (NIEDRIG)
**Labels**: `enhancement`, `P3`, `Windows11`, `polish`
**Milestone**: Future
**Estimate**: 4 hours

---

### Issue #20: 🔔 Windows Toast Notifications
**Priority**: P3 (NIEDRIG)
**Labels**: `enhancement`, `P3`, `Windows11`
**Milestone**: Future
**Estimate**: 5 hours

---

### Issue #21: 📁 File System Integration
**Priority**: P3 (NIEDRIG)
**Labels**: `enhancement`, `P3`, `Windows11`
**Milestone**: Future
**Estimate**: 4 hours

---

### Issue #22: 🎉 Celebration Animations
**Priority**: P3 (NIEDRIG)
**Labels**: `enhancement`, `P3`, `UX`, `polish`
**Milestone**: Future
**Estimate**: 3 hours

---

### Issue #23: 💬 Kontextsensitive Tooltips
**Priority**: P3 (NIEDRIG)
**Labels**: `enhancement`, `P3`, `UX`
**Milestone**: Future
**Estimate**: 2 hours

---

### Issue #24: 📱 Mobile Input Optimierung
**Priority**: P3 (NIEDRIG)
**Labels**: `enhancement`, `P3`, `mobile`
**Milestone**: Future
**Estimate**: 2 hours

---

### Issue #25: 🎨 WCAG AAA Farb-Kontrast
**Priority**: P3 (NIEDRIG)
**Labels**: `enhancement`, `P3`, `accessibility`
**Milestone**: Future
**Estimate**: 2 hours

---

### Issue #26: ♿ Enhanced ARIA Support
**Priority**: P3 (NIEDRIG)
**Labels**: `enhancement`, `P3`, `accessibility`
**Milestone**: Future
**Estimate**: 3 hours

---

### Issue #27: 🔧 Graceful Error Handling
**Priority**: P2 (MITTEL)
**Labels**: `enhancement`, `P2`, `UX`, `error-handling`
**Milestone**: v0.2
**Estimate**: 2 hours

**Description**:
```markdown
## Features
- Global Error Handler
- User-friendly Fehlermeldungen
- Recovery-Actions ("Neu laden", "Offline-Modus", "Cache leeren")
- Technical Details versteckbar

## Acceptance Criteria
- [ ] Alle Errors abgefangen
- [ ] User-friendly Messages
- [ ] Recovery-Actions
- [ ] Keine leeren Screens

## Related Files
- `js/error-handler.js` (NEU)
```

---

### Issue #28: 🌐 Spanish Character Keyboard (Mobile)
**Priority**: P2 (MITTEL)
**Labels**: `enhancement`, `P2`, `mobile`, `i18n`
**Milestone**: v0.2
**Estimate**: 2 hours

**Description**:
```markdown
## Features
Quick-Insert Buttons für: á, é, í, ó, ú, ñ, ¿, ¡

## Acceptance Criteria
- [ ] Immer sichtbar bei Typing-Übungen
- [ ] Insert an Cursor-Position
- [ ] Touch-friendly (44px min)

## Related Files
- `js/mobile-input.js` (NEU)
```

---

### Issue #29: 🎯 Better Fuzzy-Match Feedback
**Priority**: P2 (MITTEL)
**Labels**: `enhancement`, `P2`, `UX`, `pedagogy`
**Milestone**: v0.2
**Estimate**: 1.5 hours

**Description**:
```markdown
## Problem
Partial-Credit wird akzeptiert, aber User versteht nicht warum.

## Lösung
Zeige Confidence-Score und Erklärung:
```javascript
if (score >= 0.7) {
  toast.success('Fast richtig! (85% Match)');
  showSuggestion(correctAnswer);
}
```

## Related Files
- `js/app.js` (validateSpanishAnswer)
```

---

### Issue #30: 📈 Auto-Save Funktion
**Priority**: P2 (MITTEL)
**Labels**: `enhancement`, `P2`, `UX`, `data`
**Milestone**: v0.2
**Estimate**: 2 hours

**Description**:
```markdown
## Features
- Kontinuierliche Sicherung des Progress
- Auto-Save alle 30 Sekunden
- Visual Indicator ("Gespeichert um 14:32")

## Acceptance Criteria
- [ ] Auto-Save alle 30s
- [ ] Manual Save Button
- [ ] Save Indicator
- [ ] Recovery bei Crash

## Related Files
- `js/auto-save.js` (NEU)
```

---

## 📊 ZUSAMMENFASSUNG

**Gesamt**: 30 Issues
- **P0 (KRITISCH)**: 6 Issues - Must-Have für v0.1
- **P1 (HOCH)**: 6 Issues - Should-Have für v0.1
- **P2 (MITTEL)**: 10 Issues - Nice-to-Have für v0.2
- **P3 (NIEDRIG)**: 8 Issues - Future

**Milestones**:
- **v0.1** (Woche 1-2): Issues #1-#12
- **v0.2** (Woche 3-4): Issues #13-#18, #27-#30
- **Future**: Issues #19-#26

---

## 🚀 NÄCHSTE SCHRITTE

1. **Manuell Issues erstellen**: Kopiere Issues von oben auf https://github.com/reid15halo-ops/Spanish-App/issues/new
2. **Labels erstellen**: `P0`, `P1`, `P2`, `P3`, `UX`, `Windows11`, `onboarding`, `mobile`, `accessibility`
3. **Milestones erstellen**: `v0.1`, `v0.2`, `Future`
4. **Project Board**: Kanban mit Spalten "Backlog", "Sprint 1", "In Progress", "Review", "Done"
5. **Start Sprint 1**: Issues #1-#6 (Quick Wins)

---

## 📋 ALTERNATIVE: GitHub CLI Installation

Falls du `gh` CLI installieren möchtest:

### Windows (winget):
```powershell
winget install GitHub.cli
```

### Oder Download:
https://cli.github.com/

### Dann Issues per Script erstellen:
```bash
cd Spanish-App
chmod +x create-issues.sh
./create-issues.sh
```

---

**VERSION**: 1.0
**CREATED**: 21. Oktober 2025
