# Lehrmethode - Offene Todos

## Status-Überblick

### ✅ Vollständig implementiert

1. **Phase 1 (A1) - Detailliert**
   - 7 Lerneinheiten komplett geplant
   - 225 Übungen spezifiziert
   - Zeitplan (3-4 Wochen)
   - Phase1Controller implementiert
   - Phase1ExerciseGenerator implementiert
   - SER/ESTAR Contrast System
   - Practical Scenarios (5 Szenarien)

2. **Adaptive Learning Systeme**
   - Knowledge Tracker V2 (Ebbinghaus, SM-2)
   - Interleaved Practice System
   - Learning Analytics
   - Error Pattern Detection
   - Explanation Generator
   - Cognitive Load Optimizer

3. **Deutsch-Spanisch Spezialisierung**
   - Contrastive Analysis System
   - German Bridge Explanations
   - False Friends Detection
   - Transfer Analysis (positive/negative)

4. **5-Phasen Gesamtplan**
   - Grobe Struktur A1 → B1
   - Phasen-Überblicke
   - Lernziele definiert

---

## 🔴 Kritisch - Fehlt für Production

### 1. Konkrete Übungsdatenbanken

**Problem:** Exercise Generators existieren, aber keine konkreten Übungsdaten

**Was fehlt:**
```
❌ data/phase1-exercises/
   ├─ unit1-pronouns.json (20 Übungen)
   ├─ unit2-ser.json (35 Übungen)
   ├─ unit3-estar.json (35 Übungen)
   ├─ unit4-ser-estar-contrast.json (40 Übungen)
   ├─ unit5-tener.json (30 Übungen)
   ├─ unit6-vocabulary.json (35 Übungen)
   └─ unit7-integration.json (30 Übungen)
```

**Todo:**
- [ ] 225 konkrete Übungen für Phase 1 erstellen
- [ ] Jede Übung mit Lösung, Erklärung, deutscher Brücke
- [ ] Schwierigkeitsgrade zuweisen
- [ ] Kontextvariationen hinzufügen

**Priorität:** HOCH
**Aufwand:** ~20 Stunden

---

### 2. Vokabular-Datenbank vervollständigen

**Problem:** phase1-vocabulary.json ist nur Template

**Was fehlt:**
```
✅ data/phase1-vocabulary.json existiert (120 Wörter geplant)
❌ Nicht alle Wörter haben:
   - Beispielsätze
   - Audio-Referenzen
   - Mnemonics (Eselsbrücken)
   - Deutsche Kognate-Hinweise
```

**Todo:**
- [ ] Alle 120 Vokabeln komplett ausfüllen
- [ ] Beispielsätze für jeden Eintrag
- [ ] Schwierigkeitsstufen validieren
- [ ] Deutsche Verbindungen explizit machen
- [ ] Thematische Gruppen optimieren

**Priorität:** HOCH
**Aufwand:** ~8 Stunden

---

### 3. Phase 2-5 Detaillierung

**Problem:** Nur grobe Planung existiert

**Was fehlt:**
```
❌ PHASE-2-A1-DETAILLIERT.md
❌ PHASE-3-A2-DETAILLIERT.md
❌ PHASE-4-A2-DETAILLIERT.md
❌ PHASE-5-B1-DETAILLIERT.md
```

**Todo für jede Phase:**
- [ ] Detaillierte Einheitenpläne (wie Phase 1)
- [ ] Anzahl Übungen pro Konzept
- [ ] Zeitplanung
- [ ] Deutsche Kontrastiv-Analyse
- [ ] Komplexitäts-Scores
- [ ] Exercise Generators

**Priorität:** MITTEL
**Aufwand:** ~40 Stunden (10h pro Phase)

---

### 4. Conversation Practice System

**Problem:** conversation-builder.js existiert, aber keine Implementierung

**Was fehlt:**
```
✅ conversation-builder.js (Template-System)
❌ Keine konkreten Dialoge
❌ Keine Übungsvariationen
❌ Keine Progression
```

**Todo:**
- [ ] 50+ konkrete Dialoge erstellen (Phase 1-5)
- [ ] Variationen mit Blanks
- [ ] Audio-Transkripte vorbereiten
- [ ] Deutsche Übersetzungen
- [ ] Kultur-Kontext-Hinweise

**Priorität:** MITTEL
**Aufwand:** ~15 Stunden

---

## 🟡 Wichtig - Fehlt für optimale Lehrmethode

### 5. Pronunciation/Audio System

**Problem:** Keine Audio-Komponente

**Was fehlt:**
```
❌ Audio-Dateien für Vokabeln
❌ Audio-Dateien für Beispielsätze
❌ Aussprache-Übungen
❌ IPA (International Phonetic Alphabet) Notationen
```

**Todo:**
- [ ] Entscheidung: TTS (Text-to-Speech) oder native Audio?
- [ ] Audio-Dateistruktur planen
- [ ] Pronunciation-Trainer System
- [ ] Sprachaufnahme-Feature (optional)

**Priorität:** MITTEL
**Aufwand:** ~20 Stunden (+ Audio-Produktion)

**Note:** Kann mit TTS (z.B. Web Speech API) temporär gelöst werden

---

### 6. Grammar Reference System

**Problem:** Grammatik wird in Übungen gelehrt, aber keine Referenz

**Was fehlt:**
```
❌ Grammatik-Nachschlagewerk
❌ Konjugationstabellen für alle Verben
❌ Grammatik-Regeln mit deutschen Vergleichen
❌ Schnellreferenz-Karten
```

**Todo:**
- [ ] Grammatik-Datenbank erstellen (JSON)
- [ ] Alle Verb-Konjugationen
- [ ] Grammatik-Regeln mit Beispielen
- [ ] Deutsche Kontrastiv-Grammatik
- [ ] Suchbares Grammar Reference UI (später)

**Priorität:** MITTEL
**Aufwand:** ~12 Stunden

---

### 7. Progress Persistence & Cloud Sync

**Problem:** Nur localStorage, kein Cloud-Backup

**Was fehlt:**
```
✅ localStorage Speicherung
❌ Cloud-Synchronisation
❌ Export/Import von Progress
❌ Backup-System
```

**Todo:**
- [ ] Export/Import Funktionen implementieren
- [ ] JSON-basiertes Backup-Format
- [ ] Optional: Cloud-Sync (Firebase, Supabase, etc.)
- [ ] Migrations-System für Updates

**Priorität:** MITTEL
**Aufwand:** ~8 Stunden (ohne Cloud)

---

### 8. Motivation & Gamification

**Problem:** Nur Milestones, keine umfassende Gamification

**Was fehlt:**
```
✅ Basic Milestones (7-day streak, 90% accuracy, etc.)
❌ XP/Level System
❌ Achievements/Badges
❌ Daily Goals
❌ Streaks mit Reminders
❌ Leaderboards (optional)
```

**Todo:**
- [ ] XP-System designen (pro Übung, Genauigkeit, Streak)
- [ ] Achievement-System (20-30 Achievements)
- [ ] Daily Goals mit Tracking
- [ ] Streak-Kalender
- [ ] Motivations-Nachrichten

**Priorität:** NIEDRIG
**Aufwand:** ~10 Stunden

---

## 🟢 Nice-to-Have - Zusätzliche Features

### 9. Spaced Repetition Flashcards

**Problem:** SRS existiert, aber kein dediziertes Flashcard-System

**Todo:**
- [ ] Flashcard-Modus für Vokabeln
- [ ] Bildkarten für visuelles Lernen
- [ ] Custom Flashcard Sets
- [ ] Printable Flashcards

**Priorität:** NIEDRIG
**Aufwand:** ~6 Stunden

---

### 10. Reading Comprehension

**Problem:** Fokus auf Vokabeln/Grammatik, wenig Leseverständnis

**Todo:**
- [ ] Kurze Texte (A1-B1)
- [ ] Fragen zum Textverständnis
- [ ] Vokabelhilfen im Kontext
- [ ] Progressive Schwierigkeit

**Priorität:** NIEDRIG
**Aufwand:** ~15 Stunden

---

### 11. Writing Practice

**Problem:** Fokus auf Multiple-Choice/Fill-Blanks

**Todo:**
- [ ] Freies Schreiben (Sätze, Absätze)
- [ ] Automatische Korrektur (Basic)
- [ ] Template-basierte Schreibübungen
- [ ] Journal-Feature

**Priorität:** NIEDRIG
**Aufwand:** ~12 Stunden

---

### 12. Cultural Context

**Problem:** Nur Sprache, keine Kultur

**Todo:**
- [ ] Kultur-Notizen bei Vokabeln
- [ ] Regionale Unterschiede (España vs Latinoamérica)
- [ ] Kultur-Quiz
- [ ] Landeskunde-Einheiten

**Priorität:** NIEDRIG
**Aufwand:** ~8 Stunden

---

## Zusammenfassung & Empfehlung

### Minimum Viable Product (MVP)
**Für funktionsfähiges System:**
```
🔴 KRITISCH (3 Todos):
1. Konkrete Übungsdatenbanken (Phase 1: 225 Übungen)
2. Vokabular-Datenbank vervollständigen (120 Wörter)
3. Conversation Practice implementieren

Gesamtaufwand: ~43 Stunden
```

### Voll-funktionale Version
**Für produktionsreifes System:**
```
+ Phase 2-5 Detaillierung (40h)
+ Pronunciation/Audio System (20h)
+ Grammar Reference (12h)
+ Progress Persistence (8h)

Gesamtaufwand: +80 Stunden = 123 Stunden total
```

### Optimale Version
**Mit allen Nice-to-Haves:**
```
+ Gamification (10h)
+ Flashcards (6h)
+ Reading (15h)
+ Writing (12h)
+ Cultural Context (8h)

Gesamtaufwand: +51 Stunden = 174 Stunden total
```

---

## Nächste Schritte - Empfehlung

### Priorität 1: MVP fertigstellen

1. **Woche 1-2:** Übungsdatenbank Phase 1
   - 225 konkrete Übungen erstellen
   - Mit Lösungen, Erklärungen, deutschen Brücken

2. **Woche 2-3:** Vokabular vervollständigen
   - 120 Wörter komplett ausfüllen
   - Beispiele, Mnemonics, deutsche Verbindungen

3. **Woche 3-4:** Conversation Practice
   - 20-30 Dialoge für Phase 1
   - Übungsvariationen

**Ergebnis:** Funktionsfähiges Phase-1-System mit allen Übungen

### Priorität 2: Expansion

4. **Woche 5-8:** Phase 2 detaillieren
   - Wie Phase 1, aber für A1-Vertiefung

5. **Woche 9:** Audio-System
   - TTS-Integration für Anfang

6. **Woche 10:** Grammar Reference
   - Nachschlagewerk erstellen

**Ergebnis:** 2 vollständige Phasen + Support-Systeme

### Priorität 3: Polish

7. **Woche 11+:** Nice-to-Haves nach Bedarf

---

## Fragen an dich

1. **Soll ich mit den kritischen Todos (Übungsdatenbanken) anfangen?**
   - 225 Übungen für Phase 1 erstellen?

2. **Welche Priorität haben Phase 2-5?**
   - Erstmal nur Phase 1 perfekt machen?
   - Oder alle Phasen grob implementieren?

3. **Audio/Pronunciation wichtig?**
   - Kann mit TTS temporär gelöst werden
   - Oder erstmal ohne?

4. **Gamification gewünscht?**
   - XP/Levels/Achievements?
   - Oder Fokus auf reine Lehrmethode?

Lass mich wissen welche Richtung du bevorzugst!
