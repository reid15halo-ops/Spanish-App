# 📝 Issue Templates

Diese Issue Templates helfen dabei, strukturierte und vollständige Issues zu erstellen.

## 📋 Verfügbare Templates

### 1. 🎨 UX Enhancement
**Datei**: `ux-enhancement.yml`
**Verwendung**: Verbesserungen der Nutzerfreundlichkeit

**Enthält**:
- Priorität (P0-P3)
- UX-Kategorie (Onboarding, Navigation, Feedback, etc.)
- Problem / Pain Point
- Lösungsvorschlag
- Acceptance Criteria
- Testing Checklist
- Aufwandsschätzung

**Ideal für**:
- Onboarding-Verbesserungen
- Navigation-Optimierung
- Feedback-Systeme (Toasts, Animationen)
- Error Handling
- Help-System

---

### 2. 🪟 Windows 11 Feature
**Datei**: `windows11-feature.yml`
**Verwendung**: Windows 11-spezifische Optimierungen

**Enthält**:
- Feature-Typ (Fluent Design, DPI, Notifications, etc.)
- Windows 11 Guidelines / Referenzen
- Technischer Ansatz
- Plattform-Testing Checklist
- Windows 11-Features Checklist

**Ideal für**:
- Fluent Design System Integration
- DPI-Awareness / High-DPI Support
- Multi-Monitor Support
- Native Windows Notifications
- Acrylic/Mica Effekte
- File System Integration

---

### 3. 🐛 Bug Report
**Datei**: `bug-report.yml`
**Verwendung**: Fehler oder unerwartetes Verhalten melden

**Enthält**:
- Schweregrad (Kritisch → Niedrig)
- Schritte zum Reproduzieren
- Erwartetes vs. Tatsächliches Verhalten
- Screenshots / Videos
- Browser Console Fehler
- Browser & OS Information
- DPI-Skalierung
- Reproduzierbarkeits-Checklist

**Ideal für**:
- Crashes / Freezes
- Feature funktioniert nicht
- Unerwartetes Verhalten
- Performance-Probleme
- Darstellungsfehler

---

### 4. ♿ Accessibility Issue
**Datei**: `accessibility.yml`
**Verwendung**: Barrierefreiheits-Probleme oder -Verbesserungen

**Enthält**:
- Issue-Typ (Bug / Enhancement / Audit)
- WCAG-Level (A / AA / AAA)
- A11y-Kategorie (Keyboard, Screen Reader, Visual, etc.)
- WCAG-Richtlinie
- Betroffene Nutzergruppen
- Testing-Tools Checklist
- Test-Ergebnisse

**Ideal für**:
- WCAG-Verstöße
- Keyboard-Navigation Probleme
- Screen-Reader Probleme
- Farbkontrast-Issues
- Focus-Management
- ARIA-Annotations
- Accessibility Audits

---

### 5. ✨ Feature Request
**Datei**: `feature-request.yml`
**Verwendung**: Neue Features oder größere Verbesserungen vorschlagen

**Enthält**:
- Feature-Kategorie
- Problem / Use Case
- Lösungsvorschlag
- Alternative Lösungen
- Mockups / Screenshots
- Acceptance Criteria
- Policy-Check (No-Gamification, ASCII, Privacy)
- Breaking Changes Checklist

**Ideal für**:
- Neue Übungstypen
- Content-Features
- SRS-System Erweiterungen
- Export/Import-Funktionen
- Statistiken
- Integrationen

---

## 🎯 Wann welches Template?

### Flowchart zur Template-Auswahl

```
Ist es ein Fehler?
├─ JA → 🐛 Bug Report
└─ NEIN
    ├─ Barrierefreiheit?
    │  └─ JA → ♿ Accessibility Issue
    └─ NEIN
        ├─ Windows 11-spezifisch?
        │  └─ JA → 🪟 Windows 11 Feature
        └─ NEIN
            ├─ UX-Verbesserung?
            │  └─ JA → 🎨 UX Enhancement
            └─ NEIN
                └─ Neues Feature → ✨ Feature Request
```

---

## 📊 Labels & Prioritäten

### Prioritäts-Labels
- **P0** 🔴 - KRITISCH (Must-Have, Blocker)
- **P1** 🟠 - HOCH (Should-Have)
- **P2** 🟡 - MITTEL (Nice-to-Have)
- **P3** 🟢 - NIEDRIG (Future)

### Kategorie-Labels
- `UX` - User Experience
- `Windows11` - Windows 11-spezifisch
- `accessibility` - Barrierefreiheit
- `bug` - Fehler
- `enhancement` - Verbesserung
- `onboarding` - Onboarding/Tutorial
- `mobile` - Mobile-spezifisch
- `performance` - Performance
- `documentation` - Dokumentation
- `quick-win` - Schnell umsetzbar

---

## 🚀 Wie verwenden?

### Auf GitHub
1. Gehe zu: https://github.com/reid15halo-ops/Spanish-App/issues/new/choose
2. Wähle passendes Template
3. Fülle alle Pflichtfelder aus
4. Füge Screenshots/Mockups hinzu
5. Wähle passende Labels
6. Assign zu Milestone (optional)
7. Submit Issue

### Tipps für gute Issues
- ✅ **Sei spezifisch**: "Progress Bar animiert nicht" statt "Irgendwas kaputt"
- ✅ **Screenshots**: Ein Bild sagt mehr als 1000 Worte
- ✅ **Reproduzierbar**: Schritte zum Reproduzieren angeben
- ✅ **Kontext**: Browser, OS, DPI, etc. angeben
- ✅ **Acceptance Criteria**: Wann ist das Issue gelöst?

---

## 🔍 Beispiele

### Beispiel 1: UX Enhancement
```
Title: [UX] Debug-Toolbar in Production verstecken
Template: 🎨 UX Enhancement
Priority: P0
Category: Navigation
Labels: UX, P0, quick-win

Problem:
Debug-Toolbar ist immer sichtbar und verwirrt normale Nutzer.

Lösung:
Development-Modus Detection implementieren.
Toolbar nur bei localhost oder ?debug=true anzeigen.

Acceptance Criteria:
- [ ] Toolbar versteckt in Production
- [ ] ?debug=true Override funktioniert
- [ ] README aktualisiert
```

### Beispiel 2: Bug Report
```
Title: [BUG] SRS-Toggle speichert Zustand nicht
Template: 🐛 Bug Report
Severity: HOCH
Labels: bug

Steps to Reproduce:
1. Öffne App
2. Aktiviere SRS-Toggle
3. Lade Seite neu
4. SRS ist wieder deaktiviert

Expected: SRS-Zustand sollte gespeichert werden
Actual: SRS ist nach Reload deaktiviert

Browser: Chrome 120
OS: Windows 11
```

### Beispiel 3: Accessibility Issue
```
Title: [A11y] Buttons fehlen ARIA-Labels
Template: ♿ Accessibility Issue
WCAG Level: AA
Category: Screen Reader
Labels: accessibility, P1

Problem:
Check-Button hat kein aria-label.
Screen Reader liest nur "Button" vor.

WCAG Guideline:
WCAG 4.1.2 Name, Role, Value (Level A)

Current:
<button onclick="check()">Prüfen</button>

Expected:
<button onclick="check()" aria-label="Antwort prüfen">
  Prüfen
</button>

Testing Tools:
- [x] axe DevTools (3 Violations gefunden)
- [x] NVDA (liest "Button")
```

---

## 📚 Ressourcen

### WCAG Guidelines
- **WCAG 2.1 Quick Reference**: https://www.w3.org/WAI/WCAG21/quickref/
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **axe DevTools**: Chrome Extension für A11y-Testing

### Windows 11 Design
- **Fluent Design**: https://fluent2.microsoft.design/
- **Windows 11 Design Principles**: https://docs.microsoft.com/windows/apps/design/

### UX Best Practices
- **Material Design**: https://material.io/design
- **Nielsen Norman Group**: https://www.nngroup.com/

---

## 🤝 Contribution Guidelines

### Vor dem Erstellen eines Issues
1. ✅ Suche nach existierenden Issues (Duplikate vermeiden)
2. ✅ Prüfe Dokumentation (README, ROADMAP)
3. ✅ Teste in aktuellem Master-Branch
4. ✅ Sammle alle relevanten Informationen

### Nach dem Erstellen
1. 📋 Warte auf Feedback / Triage
2. 💬 Beantworte Rückfragen
3. 🔄 Update Issue bei neuen Erkenntnissen
4. ✅ Schließe Issue wenn gelöst

---

## 🎯 Milestones

Issues werden zu Milestones zugeordnet:

- **v0.1 - User-Friendly** (2 Wochen)
  - Quick Wins (P0)
  - Onboarding & Hilfe (P1)

- **v0.2 - Windows 11 & Polish** (4 Wochen)
  - Windows 11 Features (P2)
  - UX Polish (P2)

- **Future**
  - Advanced Features (P3)
  - Backlog

---

## 📞 Fragen?

Bei Fragen zu den Templates:
- 💬 Öffne eine Discussion: https://github.com/reid15halo-ops/Spanish-App/discussions
- 📧 Oder kommentiere in einem Issue

---

**Happy Issue Creating! 🎉**
