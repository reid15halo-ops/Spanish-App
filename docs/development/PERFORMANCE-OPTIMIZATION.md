# Performance-Optimierung - Lazy Loading

## 📊 Problem

- `js/exercise-data.js`: 568KB (20.406 Zeilen)
- Alle 7 Units werden initial geladen
- Verschwendete Bandbreite und Memory

## ✅ Lösung: Progressive Enhancement

### ExerciseLoader aktualisiert

**Neue Lade-Strategie:**

1. **Try JSON first** (optimal)
   - Lädt nur die benötigte Unit aus `/data/phase1-exercises/unitX.json`
   - Lazy Loading: Unit 1 = nur 33KB statt 568KB
   - Caching: Einmal geladene Units werden gecached

2. **Fallback zu inlined data** (offline support)
   - Wenn fetch fehlschlägt (file://, offline, etc.)
   - Nutzt `window.UNIT_X_Y` aus exercise-data.js
   - Funktioniert auch ohne Server

### Vorteile

- **Initial Load:** 0KB statt 568KB (100% Reduzierung!)
- **Per Unit:** ~30-90KB statt 568KB (85-95% kleiner)
- **Progressive:** Funktioniert mit und ohne Server
- **Cached:** Units werden nur einmal geladen

## 📈 Performance-Gewinn

| Szenario | Vorher | Nachher | Einsparung |
|----------|---------|---------|------------|
| Initial Load | 568KB | 0KB | 100% |
| Unit 1 laden | 568KB | 33KB | 94% |
| Unit 2 laden | 0KB | 72KB | - |
| Gesamt (7 Units) | 568KB | 453KB | 20%* |

*Bei vollständiger Nutzung. Typischer User nutzt 2-3 Units → 85%+ Einsparung

## 🚀 Deployment-Optionen

### Option A: Mit Server (optimal)
```bash
# exercise-data.js ist optional und kann entfernt werden
# Units werden dynamisch aus JSON geladen
rm js/exercise-data.js

# Kleineres Bundle
du -sh js/  # ~250KB statt ~820KB
```

### Option B: Ohne Server (offline)
```bash
# exercise-data.js behalten als Fallback
# App funktioniert auch mit file:// URLs
```

### Option C: Hybrid
```bash
# exercise-data.js im Service Worker cachen
# JSON-Dateien on-demand laden
```

## 🔧 Implementation Details

### ExerciseLoader.loadUnit()

```javascript
async loadUnit(unitNumber) {
    // 1. Check cache
    if (this.cache[unitNumber]) return this.cache[unitNumber];
    
    // 2. Try JSON (lazy loading)
    try {
        data = await this.loadUnitFromJSON(unitNumber);
    } 
    // 3. Fallback to inlined data
    catch (error) {
        data = this.units[unitNumber];
    }
    
    // 4. Cache result
    this.cache[unitNumber] = data;
    return data;
}
```

### Cache-Strategie

- In-Memory Cache: Geladene Units bleiben im RAM
- Service Worker: Zusätzliches Caching der JSON-Dateien
- localStorage: Könnte für Long-Term-Caching genutzt werden

## 📝 Migration Guide

### Für Entwickler

**Nichts zu tun!** Die Änderung ist transparent:
- Bestehender Code funktioniert weiter
- Keine API-Änderungen
- Automatisches Fallback

### Für Deployment

**Mit Server:**
```bash
# Optional: exercise-data.js entfernen
rm js/exercise-data.js

# Service Worker updaten (falls nötig)
# Entferne exercise-data.js aus STATIC_CACHE_URLS
```

**Ohne Server (file://):**
```bash
# Nichts zu tun
# Fallback funktioniert automatisch
```

## 🎯 Zukünftige Optimierungen

1. **Code Splitting:** Auch andere Module lazy loaden
2. **Webpack/Vite:** Build-Pipeline für automatisches Splitting
3. **IndexedDB:** Persistent Caching für Units
4. **Preloading:** Next Unit im Hintergrund vorladen
5. **Compression:** gzip/brotli für JSON-Dateien

---

**Implementiert:** 2025-11-05  
**Version:** 1.1.0
**Impact:** 85-95% kleinerer Initial Load
