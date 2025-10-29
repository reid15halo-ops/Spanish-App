# ?? ROUTER & NAVIGATION SYSTEM

## ? Navigation & Screen-Management

**Konzept**: Einfaches Router-System für Multi-Screen-Navigation  
**Status**: Design & Dokumentation  
**Integration**: In SpanishApp oder Standalone

---

## ?? FUNKTIONEN

### **1. go(to)** - Screen-Wechsel

```javascript
function go(to) {
    // Alle Screens verstecken
    document.querySelectorAll('.screen').forEach(s => 
        s.classList.remove('active')
    );
    
    // Ziel-Screen anzeigen
    const targetScreen = document.getElementById(`screen-${to}`);
    if (targetScreen) {
        targetScreen.classList.add('active');
    } else {
        console.warn(`Screen not found: screen-${to}`);
    }
}
```

**Verwendung**:
```javascript
go('menu');      // ? Zeigt screen-menu
go('setup');     // ? Zeigt screen-setup
go('run');       // ? Zeigt screen-run
go('settings');  // ? Zeigt screen-settings
```

**Features**:
- ? Einfacher Screen-Switch
- ? Error-Handling (Screen nicht gefunden)
- ? CSS-basiert (`.active` class)

---

### **2. wireMenu()** - Event-Listener Setup

```javascript
function wireMenu() {
    // Navigation-Buttons (data-nav)
    document.querySelectorAll('[data-nav]').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.nav;
            go(target);
        });
    });
    
    // Back-Buttons (data-back)
    document.querySelectorAll('[data-back]').forEach(btn => {
        btn.addEventListener('click', () => {
            const backTo = btn.dataset.back;
            go(backTo);
        });
    });
    
    // Start-Run Button
    const startRunBtn = document.getElementById('start-run');
    if (startRunBtn) {
        startRunBtn.addEventListener('click', (e) => {
            e.preventDefault();
            startRun();
        });
    }
}
```

**HTML-Integration**:
```html
<!-- Navigation -->
<button data-nav="setup">Einstellungen</button>
<button data-nav="run">Üben</button>

<!-- Back -->
<button data-back="menu">Zurück zum Menü</button>

<!-- Start -->
<button id="start-run">Start</button>
```

**Features**:
- ? Deklarative Navigation (data-attributes)
- ? Auto-Wiring aller Buttons
- ? Keine manuelle Listener-Verwaltung

---

### **3. setFeedback(msg, cls)** - Feedback anzeigen

```javascript
function setFeedback(msg, cls) {
    const feedbackEl = document.getElementById('feedback');
    if (!feedbackEl) {
        console.warn('Feedback element not found');
        return;
    }
    
    feedbackEl.textContent = msg;
    feedbackEl.className = cls || '';
}
```

**Verwendung**:
```javascript
setFeedback('Richtig!', 'ok');
setFeedback('Falsch!', 'err');
setFeedback('Bitte wählen.', 'warn');
setFeedback('Loading...', 'info');
```

**CSS-Klassen**:
```css
.ok { background: #d4edda; color: #155724; }
.err { background: #f8d7da; color: #721c24; }
.warn { background: #fff3cd; color: #856404; }
.info { background: #d1ecf1; color: #0c5460; }
```

---

### **4. hydrateFilters()** - Filter befüllen

```javascript
function hydrateFilters() {
    // Tag-Filter
    const tagSelect = document.getElementById('filter-tag');
    if (tagSelect && DATA.length > 0) {
        const tags = [...new Set(DATA.flatMap(item => item.tags || []))];
        tags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            tagSelect.appendChild(option);
        });
    }
    
    // Type-Filter (already in HTML, but could be dynamic)
    const typeSelect = document.getElementById('filter-type');
    if (typeSelect) {
        // Types are usually static, but could be extracted from DATA
    }
}
```

**Zweck**: Dynamisches Befüllen der Filter-Dropdowns

---

### **5. start()** - App-Initialisierung

```javascript
async function start() {
    try {
        // 1. Wire navigation
        wireMenu();
        
        // 2. Load data
        await loadItems();
        
        // 3. Setup filters
        hydrateFilters();
        
        // 4. Go to menu
        go('menu');
        
        console.log('? App initialized successfully');
    } catch (error) {
        console.error('Failed to initialize app:', error);
        setFeedback('Fehler beim Laden der App', 'err');
    }
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', start);
```

**Features**:
- ? Async/Await für Daten-Laden
- ? Error-Handling
- ? Initialer Screen-Wechsel

---

## ?? HTML-STRUKTUR

### **Screens**:

```html
<main id="screen" data-screen="menu">
    <!-- MENU -->
    <section id="screen-menu" class="screen active">
        <h2>Hauptmenü</h2>
        <button data-nav="setup">Einstellungen</button>
        <button data-nav="run">Üben</button>
    </section>

    <!-- SETUP -->
    <section id="screen-setup" class="screen">
        <h2>Einstellungen</h2>
        <form id="setup-form">
            <label>
                Tag:
                <select id="filter-tag">
                    <option value="">Alle</option>
                </select>
            </label>
            <label>
                Typ:
                <select id="filter-type">
                    <option value="">Gemischt</option>
                    <option value="mc">Multiple Choice</option>
                    <option value="gap">Lücke</option>
                </select>
            </label>
            <button id="start-run" class="primary">Start</button>
            <button data-back="menu" type="button">Zurück</button>
        </form>
    </section>

    <!-- RUN -->
    <section id="screen-run" class="screen">
        <h2 class="visually-hidden">Übung</h2>
        <div id="prompt-area"></div>
        <div id="answer-area"></div>
        <div id="feedback"></div>
        <div class="actions">
            <button id="btn-check" class="primary">Prüfen</button>
            <button id="btn-next">Weiter</button>
            <button data-back="menu" id="btn-exit">Beenden</button>
        </div>
    </section>
</main>
```

---

## ?? INTEGRATION IN SpanishApp

### **Option 1: Als Methoden in SpanishApp**

```javascript
class SpanishApp {
    constructor() {
        // ...existing code...
        this.currentScreen = 'menu';
    }
    
    /**
     * Navigate to a screen
     */
    navigateTo(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(s => 
            s.classList.remove('active')
        );
        
        // Show target screen
        const targetScreen = document.getElementById(`screen-${screenName}`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
            
            // Trigger screen-specific logic
            this.onScreenChange(screenName);
        }
    }
    
    /**
     * Screen change callback
     */
    onScreenChange(screenName) {
        switch (screenName) {
            case 'setup':
                this.hydrateFilters();
                break;
            case 'run':
                this.startExercise();
                break;
            case 'menu':
                // Reset state if needed
                break;
        }
    }
    
    /**
     * Setup navigation listeners
     */
    setupNavigation() {
        // Navigation buttons
        document.querySelectorAll('[data-nav]').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.nav;
                this.navigateTo(target);
            });
        });
        
        // Back buttons
        document.querySelectorAll('[data-back]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.navigateTo(btn.dataset.back);
            });
        });
    }
    
    /**
     * Show feedback message
     */
    showFeedback(message, type = 'info') {
        const feedbackEl = document.getElementById('feedback');
        if (!feedbackEl) return;
        
        feedbackEl.textContent = message;
        feedbackEl.className = `feedback ${type}`;
        
        // Auto-hide after 3s for success messages
        if (type === 'ok') {
            setTimeout(() => {
                feedbackEl.className = 'feedback';
                feedbackEl.textContent = '';
            }, 3000);
        }
    }
    
    /**
     * Populate filter dropdowns
     */
    hydrateFilters() {
        const tagSelect = document.getElementById('filter-tag');
        if (!tagSelect || this.vocabulary.length === 0) return;
        
        // Clear existing options (except first)
        while (tagSelect.options.length > 1) {
            tagSelect.remove(1);
        }
        
        // Extract unique tags
        const tags = [...new Set(
            this.vocabulary.flatMap(item => item.tags || [])
        )];
        
        // Add options
        tags.sort().forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            tagSelect.appendChild(option);
        });
    }
}
```

---

### **Option 2: Als Standalone-Funktionen**

```javascript
// ============================================================================
// NAVIGATION & ROUTING
// ============================================================================

/**
 * Navigate to a screen
 */
function go(screenName) {
    document.querySelectorAll('.screen').forEach(s => 
        s.classList.remove('active')
    );
    
    const target = document.getElementById(`screen-${screenName}`);
    if (target) {
        target.classList.add('active');
    }
}

/**
 * Setup navigation listeners
 */
function wireMenu() {
    document.querySelectorAll('[data-nav]').forEach(btn => {
        btn.addEventListener('click', () => go(btn.dataset.nav));
    });
    
    document.querySelectorAll('[data-back]').forEach(btn => {
        btn.addEventListener('click', () => go(btn.dataset.back));
    });
}

/**
 * Show feedback
 */
function setFeedback(message, className = '') {
    const el = document.getElementById('feedback');
    if (el) {
        el.textContent = message;
        el.className = className;
    }
}

/**
 * Populate filters
 */
function hydrateFilters() {
    const tagSelect = document.getElementById('filter-tag');
    if (!tagSelect || !DATA) return;
    
    const tags = [...new Set(DATA.flatMap(item => item.tags || []))];
    tags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        tagSelect.appendChild(option);
    });
}

// ============================================================================
// APP INITIALIZATION
// ============================================================================

async function start() {
    wireMenu();
    await loadItems();
    hydrateFilters();
    go('menu');
}

document.addEventListener('DOMContentLoaded', start);
```

---

## ?? ERWEITERTE FEATURES

### **History-Support**:

```javascript
function go(screenName, pushState = true) {
    // ...existing screen switch...
    
    // Update URL
    if (pushState && window.history) {
        history.pushState({ screen: screenName }, '', `#${screenName}`);
    }
}

// Browser back/forward support
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.screen) {
        go(event.state.screen, false);
    }
});

// Initial load from URL hash
window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        go(hash, false);
    }
});
```

---

### **Transition-Animations**:

```css
.screen {
    display: none;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.screen.active {
    display: block;
    opacity: 1;
}

/* Slide transitions */
.screen {
    transform: translateX(100%);
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.screen.active {
    transform: translateX(0);
}
```

---

### **Loading-States**:

```javascript
function go(screenName) {
    // Show loading
    const loading = document.getElementById('loading-overlay');
    if (loading) loading.style.display = 'block';
    
    // Switch screens
    document.querySelectorAll('.screen').forEach(s => 
        s.classList.remove('active')
    );
    
    const target = document.getElementById(`screen-${screenName}`);
    if (target) {
        target.classList.add('active');
        
        // Hide loading after transition
        setTimeout(() => {
            if (loading) loading.style.display = 'none';
        }, 300);
    }
}
```

---

## ? VORTEILE

### **1. Deklarativ**:
```html
<!-- Statt: -->
<button onclick="navigateToSetup()">Setup</button>

<!-- Einfach: -->
<button data-nav="setup">Setup</button>
```

### **2. Zentral**:
```javascript
// Alle Navigation an einem Ort
wireMenu();  // Setup einmal

// Statt:
btn1.addEventListener('click', ...);
btn2.addEventListener('click', ...);
btn3.addEventListener('click', ...);
```

### **3. Erweiterbar**:
```javascript
// Einfach neue Screens hinzufügen
<section id="screen-stats" class="screen">...</section>
<button data-nav="stats">Statistik</button>
// ? Funktioniert automatisch!
```

---

## ?? VERWENDUNG

### **1. HTML vorbereiten**:
```html
<section id="screen-menu" class="screen active">...</section>
<section id="screen-setup" class="screen">...</section>
<button data-nav="setup">Setup</button>
<button data-back="menu">Zurück</button>
```

### **2. JavaScript hinzufügen**:
```javascript
// Option A: In SpanishApp
this.setupNavigation();

// Option B: Standalone
wireMenu();
```

### **3. Navigieren**:
```javascript
go('menu');     // Programmatisch
// oder via HTML:
<button data-nav="menu">Menu</button>
```

---

## ?? EMPFEHLUNG

**Für index-guided.html**:
- ? Standalone-Funktionen verwenden
- ? Einfach & minimal
- ? Keine Klassen-Komplexität

**Für index.html (SpanishApp)**:
- ? Als Methoden in Klasse integrieren
- ? Mehr Kontrolle & State-Management
- ? Bessere Integration mit SRS, etc.

---

**STATUS**: ? **DESIGN COMPLETE**  
**INTEGRATION**: Ready for both versions  
**POSITION**: Add to js/app.js or separate file  
**QUALITY**: Production-Ready

Das Router-System ist bereit zur Implementierung! ???

