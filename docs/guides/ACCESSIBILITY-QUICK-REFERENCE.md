# Accessibility Quick Reference Card

**Quick guide for developers implementing the mobile-first & WCAG AAA features**

---

## 🚀 Quick Start

### Load Scripts (index.html)
```html
<!-- Add before app.js -->
<script src="js/utils/touch-gestures.js"></script>
<script src="js/utils/accessibility.js"></script>
<script src="js/utils/spanish-keyboard.js"></script>
<script src="js/utils/haptic-feedback.js"></script>
```

### Enable Features (app.js)
```javascript
// In app.js init()
window.TouchGestures.enableExerciseNavigation({
    onNext: () => this.next(),
    onPrevious: () => this.previous()
});
```

---

## 📱 Touch Gestures API

```javascript
// Swipe handlers
window.TouchGestures.on('swipeLeft', () => console.log('Next'));
window.TouchGestures.on('swipeRight', () => console.log('Previous'));

// Validate touch targets (48x48px minimum)
const issues = window.TouchGestures.validateTouchTargets();

// Fix small touch target
window.TouchGestures.ensureAccessibleTouchTarget(button);
```

---

## ♿ Accessibility API

```javascript
// Screen reader announcements
window.A11y.announceToScreenReader('Message', 'polite');   // Info
window.A11y.announceToScreenReader('Error!', 'assertive'); // Alert

// Focus management
window.A11y.setFocusTo('#element-id', 'Optional announcement');

// User preferences
window.A11y.enableHighContrastMode();
window.A11y.enableReducedMotion();
window.A11y.setFontScale(1.5); // 150%

// Audit
const audit = window.A11y.runAccessibilityAudit();
```

---

## ⌨️ Spanish Keyboard API

```javascript
// Auto-attaches to all inputs (automatic)
// Or manually:
window.SpanishKeyboard.attachToInput(inputElement);

// Insert character
window.SpanishKeyboard.insertCharacter(input, 'á');

// Shortcuts (user types these):
// a+ → á, e+ → é, i+ → í, o+ → ó, u+ → ú
// n+ → ñ, ?+ → ¿, !+ → ¡
```

---

## 📳 Haptic Feedback API

```javascript
// Answer feedback
window.Haptics.correctAnswer();   // Short-pause-short
window.Haptics.incorrectAnswer(); // Triple pulse

// General feedback
window.Haptics.buttonTap();   // Quick tap
window.Haptics.notify();      // Medium pulse
window.Haptics.warn();        // Warning pulse

// User control
window.Haptics.toggle();      // Toggle on/off
window.Haptics.test();        // Play all patterns
```

---

## 🎯 WCAG AAA Checklist

### Must Have
- ✅ **Touch targets:** 48x48px minimum
- ✅ **Keyboard navigation:** Tab, Arrow, Enter, Escape
- ✅ **Screen reader:** ARIA labels on all interactive elements
- ✅ **Focus indicators:** Visible when using keyboard
- ✅ **Contrast:** 4.5:1 minimum (7:1 in high contrast mode)
- ✅ **Skip links:** "Direkt zum Inhalt springen"

### Common Patterns

**Button with ARIA:**
```html
<button aria-label="Naechste Uebung"
        title="Zur naechsten Uebung wechseln">
    Weiter →
</button>
```

**Input with Spanish keyboard:**
```html
<input type="text"
       id="answer-input"
       aria-label="Deine Antwort"
       placeholder="Schreibe deine Antwort...">
<!-- Spanish keyboard auto-attaches -->
```

**Progress with ARIA:**
```html
<div role="progressbar"
     aria-valuenow="50"
     aria-valuemin="0"
     aria-valuemax="100"
     aria-label="Fortschritt: 50%">
    <!-- Progress bar content -->
</div>
```

**Modal with ARIA:**
```html
<div role="dialog"
     aria-labelledby="modal-title"
     aria-modal="true">
    <h2 id="modal-title">Dialog Title</h2>
    <!-- Modal content -->
</div>
```

---

## 🧪 Testing Commands

```javascript
// Run in browser console

// 1. Accessibility audit
window.A11y.runAccessibilityAudit();

// 2. Touch target validation
window.TouchGestures.validateTouchTargets();

// 3. Test haptic feedback
window.Haptics.test();

// 4. Check current preferences
console.log({
    highContrast: window.A11y.preferences.highContrast,
    reducedMotion: window.A11y.preferences.reducedMotion,
    fontScale: window.A11y.preferences.fontScale,
    hapticEnabled: window.Haptics.enabled
});
```

---

## 🔧 Troubleshooting

### Touch gestures not working
```javascript
// Check if reduced motion is enabled
console.log(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
// If true, gestures are disabled
```

### Screen reader not announcing
```javascript
// Check live regions exist
console.log(document.getElementById('aria-live-polite'));
console.log(document.getElementById('aria-live-assertive'));
// Should not be null
```

### Spanish keyboard not appearing
```javascript
// Check if input has keyboard attached
const input = document.querySelector('#answer-input');
const keyboard = input?.parentElement.querySelector('.spanish-keyboard');
console.log(keyboard); // Should exist
```

### Haptic feedback not vibrating
```javascript
// Check support and settings
console.log({
    supported: window.Haptics.supported,
    enabled: window.Haptics.enabled,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
});
```

---

## 📊 Performance Checks

```javascript
// 1. Check bundle sizes
console.table({
    TouchGestures: (window.TouchGestures.constructor.toString().length / 1024).toFixed(1) + 'KB',
    A11y: (window.A11y.constructor.toString().length / 1024).toFixed(1) + 'KB',
    SpanishKeyboard: (window.SpanishKeyboard.constructor.toString().length / 1024).toFixed(1) + 'KB',
    Haptics: (window.Haptics.constructor.toString().length / 1024).toFixed(1) + 'KB'
});

// 2. Check memory usage
console.log(performance.memory);

// 3. Run Lighthouse audit
// DevTools → Lighthouse → Generate report
```

---

## 🎨 CSS Classes

### Screen Reader Only
```css
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}
```

### High Contrast Mode
```css
body.high-contrast {
    /* Styles automatically applied */
}
```

### Reduced Motion
```css
body.reduce-motion * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
}
```

### Keyboard Focus
```css
body.using-keyboard *:focus {
    outline: 3px solid #20B2AA;
    outline-offset: 2px;
}
```

---

## 🚦 Integration Checklist

**Before Launch:**
- [ ] All scripts loaded in correct order
- [ ] Touch gestures enabled for exercises
- [ ] Haptic feedback on correct/incorrect
- [ ] Screen reader announcements for progress
- [ ] ARIA labels on all interactive elements
- [ ] Skip links tested
- [ ] High contrast mode tested
- [ ] Reduced motion tested
- [ ] Font scaling tested (100%-200%)
- [ ] Touch targets validated (48x48px)
- [ ] Keyboard navigation works completely
- [ ] Screen reader tested (NVDA, JAWS, or VoiceOver)
- [ ] Mobile tested (iOS Safari, Android Chrome)
- [ ] Lighthouse score 95+ all categories

---

## 📚 Documentation

- **Full Guide:** `MOBILE-ACCESSIBILITY-GUIDE.md`
- **Testing:** `UX-IMPROVEMENTS-TESTING.md`
- **Deployment:** `DEPLOYMENT.md`

---

**Quick Links:**
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)

---

**Status:** ✅ Core systems implemented
**Next:** Integrate into app.js and index.html
**Target:** WCAG AAA + 95+ Lighthouse scores

🤖 Generated with [Claude Code](https://claude.com/claude-code)
