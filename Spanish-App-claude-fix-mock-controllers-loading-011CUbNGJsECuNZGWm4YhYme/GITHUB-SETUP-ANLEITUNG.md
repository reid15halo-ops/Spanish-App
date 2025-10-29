# 🚀 GitHub Setup-Anleitung

**Zweck**: Issue Templates und Labels manuell zu GitHub hinzufügen
**Zeitaufwand**: 15-20 Minuten

---

## ✅ SCHRITT 1: Issue Templates hochladen

Die Issue Templates sind bereits im Branch `feature/ux-improvements` committet und befinden sich im Ordner `.github/ISSUE_TEMPLATE/`.

### Option A: Automatisch (empfohlen)
Die Templates werden automatisch aktiv, sobald der Branch zu `master` gemerged wird.

**Merge-Prozess**:
1. Gehe zu: https://github.com/reid15halo-ops/Spanish-App/pull/new/feature/ux-improvements
2. Erstelle Pull Request
3. Review & Merge to master
4. ✅ Templates sind jetzt automatisch verfügbar!

### Option B: Manuell (falls du Templates testen willst)
Falls du die Templates vorher testen möchtest:

1. **Gehe zu GitHub Repository**
   ```
   https://github.com/reid15halo-ops/Spanish-App
   ```

2. **Wechsle zu Branch `feature/ux-improvements`**
   - Dropdown "master" → "feature/ux-improvements"

3. **Templates sind bereits da!**
   - Die Templates wurden bereits gepusht
   - GitHub erkennt sie automatisch im `.github/ISSUE_TEMPLATE/` Ordner

4. **Teste Templates**
   - Gehe zu: https://github.com/reid15halo-ops/Spanish-App/issues/new/choose
   - Du solltest jetzt die Template-Auswahl sehen

**Hinweis**: Templates funktionieren auch auf Branches! GitHub zeigt automatisch alle Templates aus dem aktuellen Branch.

---

## ✅ SCHRITT 2: Labels erstellen

GitHub bietet keine automatische Label-Erstellung, daher manuell:

### 2.1 Gehe zu Labels-Seite
```
https://github.com/reid15halo-ops/Spanish-App/labels
```

### 2.2 Erstelle folgende Labels

#### Prioritäts-Labels

| Label | Farbe | Beschreibung |
|-------|-------|--------------|
| `P0` | `#B60205` (Rot) | Kritisch - Must-Have, Blocker |
| `P1` | `#D93F0B` (Orange) | Hoch - Should-Have |
| `P2` | `#FBCA04` (Gelb) | Mittel - Nice-to-Have |
| `P3` | `#0E8A16` (Grün) | Niedrig - Future |

**Schritte pro Label**:
1. Klicke "New label"
2. Label name: `P0`
3. Description: `Kritisch - Must-Have, Blocker`
4. Color: `B60205` (ohne #)
5. Create label
6. Wiederhole für P1, P2, P3

#### Kategorie-Labels

| Label | Farbe | Beschreibung |
|-------|-------|--------------|
| `UX` | `#1D76DB` (Blau) | User Experience Improvement |
| `Windows11` | `#5319E7` (Lila) | Windows 11 Optimization |
| `onboarding` | `#C5DEF5` (Hellblau) | Onboarding & Tutorial |
| `mobile` | `#F9D0C4` (Rosa) | Mobile-spezifisch |
| `accessibility` | `#D4C5F9` (Lavendel) | Barrierefreiheit (WCAG) |
| `quick-win` | `#0E8A16` (Grün) | Schnell umsetzbar (< 2h) |
| `performance` | `#FEF2C0` (Hellgelb) | Performance-Optimierung |
| `documentation` | `#D4C5F9` (Lavendel) | Dokumentation |

**Bestehende Labels behalten**:
- `bug` (sollte schon existieren)
- `enhancement` (sollte schon existieren)
- `help wanted` (optional)
- `good first issue` (optional)

---

## ✅ SCHRITT 3: Milestones erstellen

### 3.1 Gehe zu Milestones-Seite
```
https://github.com/reid15halo-ops/Spanish-App/milestones
```

### 3.2 Erstelle Milestones

#### Milestone 1: v0.1 - User-Friendly
- **Title**: `v0.1 - User-Friendly`
- **Due date**: 2 Wochen ab heute (z.B. 4. November 2025)
- **Description**:
  ```
  ## Quick Wins + Onboarding

  **Ziel**: App extrem nutzerfreundlich machen

  ### Features
  - 🧹 Production Cleanup (Debug-Toolbar verstecken)
  - ⏳ Loading States
  - 📊 Visueller Progress Bar
  - 👋 Welcome Dialog
  - 🎓 Interaktives Tutorial
  - 🔔 Toast-Notifications

  ### Success Criteria
  - [ ] Alle P0-Issues (#1-#6) abgeschlossen
  - [ ] Mind. 4 P1-Issues (#7-#12) abgeschlossen
  - [ ] User Testing Score > 8/10
  - [ ] Lighthouse Score > 90
  ```

#### Milestone 2: v0.2 - Windows 11 & Polish
- **Title**: `v0.2 - Windows 11 & Polish`
- **Due date**: 4 Wochen ab heute (z.B. 18. November 2025)
- **Description**:
  ```
  ## Windows 11 Optimization + UX Polish

  **Ziel**: Native Windows 11-Look & Feel

  ### Features
  - 🎨 Fluent Design System
  - 📺 DPI-Awareness
  - 📱 Responsive Breakpoints
  - ⌨️ Keyboard Shortcuts
  - 🎯 Focus Management
  - 🔧 Error Handling

  ### Success Criteria
  - [ ] Windows 11-konforme Optik (Fluent Design)
  - [ ] 4K/8K-Display Support
  - [ ] Responsive auf allen Breakpoints
  - [ ] WCAG AAA erreicht
  ```

#### Milestone 3: Future
- **Title**: `Future`
- **Due date**: Kein Datum (Backlog)
- **Description**:
  ```
  ## Advanced Features & Backlog

  Zukünftige Features und niedrig-priorisierte Verbesserungen.

  ### Kandidaten
  - Acrylic/Mica Effekte
  - Windows Toast Notifications
  - Celebration Animations
  - File System Integration
  - Advanced Mobile Features
  ```

---

## ✅ SCHRITT 4: Project Board erstellen (Optional)

### 4.1 Gehe zu Projects
```
https://github.com/reid15halo-ops/Spanish-App/projects
```

### 4.2 Erstelle neues Board
1. Klicke "New project"
2. **Name**: `UX Improvements`
3. **Template**: `Board`
4. **Visibility**: Public (oder Private)
5. Create

### 4.3 Spalten einrichten

Erstelle folgende Spalten (in dieser Reihenfolge):

1. **📋 Backlog**
   - Description: "Alle geplanten Issues"
   - Automation: Issue opened → Add to Backlog

2. **🎯 Sprint 1 (Quick Wins)**
   - Description: "P0-Issues (Must-Have)"
   - Manual: Ziehe Issues #1-#6 hierher

3. **🚧 In Progress**
   - Description: "Aktuell in Arbeit"
   - Automation: Issue assigned → Move to In Progress

4. **👀 Review**
   - Description: "Code Review / Testing"
   - Automation: PR opened → Move to Review

5. **✅ Done**
   - Description: "Abgeschlossen"
   - Automation: Issue closed → Move to Done

### 4.4 Automation einrichten

GitHub Projects V2 hat Auto-Workflows:

1. Klicke auf Board → "..." → "Workflows"
2. Aktiviere:
   - ✅ "Item added to project" → "Set status to Backlog"
   - ✅ "Item closed" → "Set status to Done"
   - ✅ "Pull request merged" → "Set status to Done"

---

## ✅ SCHRITT 5: Erste Issues erstellen

### Option 1: Templates verwenden (empfohlen)

1. Gehe zu: https://github.com/reid15halo-ops/Spanish-App/issues/new/choose
2. Wähle Template (z.B. "UX Enhancement")
3. Fülle Formular aus
4. Wähle Labels (P0, UX, quick-win)
5. Wähle Milestone (v0.1)
6. Assign zu dir selbst
7. Create Issue

### Option 2: Aus create-github-issues.md kopieren

Falls Templates noch nicht funktionieren:

1. Öffne `create-github-issues.md`
2. Kopiere Issue #1 (Debug-Toolbar)
3. Gehe zu: https://github.com/reid15halo-ops/Spanish-App/issues/new
4. Paste Description
5. Füge Labels & Milestone hinzu
6. Create Issue

**Erste 6 Issues (Quick Wins)**:
- [ ] Issue #1: Debug-Toolbar verstecken
- [ ] Issue #2: Developer-Banner entfernen
- [ ] Issue #3: Loading States
- [ ] Issue #4: Context-Aware Buttons
- [ ] Issue #5: Progress Bar
- [ ] Issue #6: Welcome Dialog

---

## ✅ SCHRITT 6: Pull Request für Branch erstellen

### 6.1 Erstelle PR
```
https://github.com/reid15halo-ops/Spanish-App/pull/new/feature/ux-improvements
```

### 6.2 PR Details
- **Title**: `🎨 UX-Verbesserungen Roadmap`
- **Description**: (Verwende `pr-description.md`)
- **Labels**: `documentation`, `planning`
- **Reviewers**: Dich selbst (Self-Review)
- **Milestone**: (keins - ist Dokumentation)

### 6.3 NICHT mergen!
⚠️ **WICHTIG**: Diesen PR NICHT mergen!

Dieser PR ist nur zur **Dokumentation und Review**.

Die eigentliche Implementierung erfolgt in separaten Feature-Branches:
- `ux/debug-toolbar-hide`
- `ux/loading-states`
- `ux/progress-bar`
- etc.

Diese werden dann zu `feature/ux-improvements` gemerged.

Am Ende merged man `feature/ux-improvements` → `master`.

---

## 🎯 SETUP-CHECKLIST

Kopiere diese Checklist und arbeite sie ab:

```markdown
## GitHub Setup
- [ ] Issue Templates sind im Branch (automatisch nach Merge)
  - [ ] config.yml
  - [ ] ux-enhancement.yml
  - [ ] windows11-feature.yml
  - [ ] bug-report.yml
  - [ ] accessibility.yml
  - [ ] feature-request.yml

- [ ] Labels erstellt
  - [ ] P0 (Rot #B60205)
  - [ ] P1 (Orange #D93F0B)
  - [ ] P2 (Gelb #FBCA04)
  - [ ] P3 (Grün #0E8A16)
  - [ ] UX (Blau #1D76DB)
  - [ ] Windows11 (Lila #5319E7)
  - [ ] onboarding (Hellblau #C5DEF5)
  - [ ] mobile (Rosa #F9D0C4)
  - [ ] accessibility (Lavendel #D4C5F9)
  - [ ] quick-win (Grün #0E8A16)
  - [ ] performance (Hellgelb #FEF2C0)
  - [ ] documentation (Lavendel #D4C5F9)

- [ ] Milestones erstellt
  - [ ] v0.1 - User-Friendly (Due: 2 Wochen)
  - [ ] v0.2 - Windows 11 & Polish (Due: 4 Wochen)
  - [ ] Future (Backlog)

- [ ] Project Board erstellt (optional)
  - [ ] Board "UX Improvements"
  - [ ] Spalten: Backlog, Sprint 1, In Progress, Review, Done
  - [ ] Automation aktiviert

- [ ] Erste Issues erstellt
  - [ ] Issue #1: Debug-Toolbar verstecken (P0, UX, quick-win)
  - [ ] Issue #2: Developer-Banner entfernen (P0, UX, quick-win)
  - [ ] Issue #3: Loading States (P0, UX)
  - [ ] Issue #4: Context-Aware Buttons (P0, UX)
  - [ ] Issue #5: Progress Bar (P0, UX)
  - [ ] Issue #6: Welcome Dialog (P0, UX, onboarding)

- [ ] Pull Request erstellt
  - [ ] Title: "🎨 UX-Verbesserungen Roadmap"
  - [ ] Description aus pr-description.md
  - [ ] Labels: documentation, planning
  - [ ] NICHT gemerged (nur Dokumentation)

## Ready to Start!
- [ ] Alles Setup abgeschlossen
- [ ] Sprint 1 kann starten (Issues #1-#6)
- [ ] NAECHSTE-SCHRITTE.md gelesen
```

---

## 📸 SCREENSHOTS ZUR HILFE

### Labels-Seite
Nach dem Erstellen solltest du so etwas sehen:
```
P0          [ROT]      Kritisch - Must-Have
P1          [ORANGE]   Hoch - Should-Have
P2          [GELB]     Mittel - Nice-to-Have
P3          [GRÜN]     Niedrig - Future
UX          [BLAU]     User Experience
Windows11   [LILA]     Windows 11 Optimization
...
```

### Issue Template Chooser
Bei "New Issue" solltest du sehen:
```
🎨 UX Enhancement
   Verbesserung der Nutzerfreundlichkeit

🪟 Windows 11 Feature
   Windows 11-spezifische Optimierung

🐛 Bug Report
   Melde einen Fehler

♿ Accessibility Issue
   Barrierefreiheits-Problem

✨ Feature Request
   Neues Feature vorschlagen
```

---

## 🆘 TROUBLESHOOTING

### Templates erscheinen nicht
**Problem**: Issue Templates sind nicht sichtbar bei "New Issue"

**Lösungen**:
1. **Warte 1-2 Minuten** - GitHub braucht Zeit zum Processing
2. **Hard Refresh** - Ctrl+F5 oder Cmd+Shift+R
3. **Branch prüfen** - Bist du im richtigen Branch?
4. **Pfad prüfen** - Templates müssen in `.github/ISSUE_TEMPLATE/` liegen
5. **YML-Syntax** - Prüfe ob YAML valide ist (https://www.yamllint.com/)

### Labels haben falsche Farbe
**Problem**: Label-Farbe sieht anders aus

**Lösung**:
- Farbe OHNE `#` eingeben (z.B. `B60205` statt `#B60205`)
- Oder Label editieren und Farbe korrigieren

### Milestones sortieren
**Problem**: Milestones sind nicht sortiert

**Lösung**:
- Milestones werden nach Due Date sortiert
- "Future" ohne Datum erscheint am Ende

---

## 🎉 GESCHAFFT!

Wenn alle Checklisten-Punkte abgehakt sind, ist das GitHub-Setup komplett!

**Nächste Schritte**:
→ Öffne **NAECHSTE-SCHRITTE.md** und starte Sprint 1!

---

**Viel Erfolg! 🚀**
