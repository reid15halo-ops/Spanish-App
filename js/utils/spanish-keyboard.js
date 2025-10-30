/**
 * Spanish Keyboard Helper
 *
 * Provides easy access to Spanish special characters on mobile devices
 * WCAG AAA compliant with proper ARIA labels and keyboard navigation
 */

class SpanishKeyboardHelper {
    constructor() {
        this.specialChars = [
            { char: 'á', label: 'a mit Akzent', alt: 'a+' },
            { char: 'é', label: 'e mit Akzent', alt: 'e+' },
            { char: 'í', label: 'i mit Akzent', alt: 'i+' },
            { char: 'ó', label: 'o mit Akzent', alt: 'o+' },
            { char: 'ú', label: 'u mit Akzent', alt: 'u+' },
            { char: 'ñ', label: 'n mit Tilde', alt: 'n+' },
            { char: '¿', label: 'Umgekehrtes Fragezeichen', alt: '?+' },
            { char: '¡', label: 'Umgekehrtes Ausrufezeichen', alt: '!+' }
        ];

        this.currentInput = null;
        this.keyboardVisible = false;
    }

    /**
     * Attach Spanish keyboard to an input field
     * @param {HTMLInputElement} input
     */
    attachToInput(input) {
        if (!input || input.tagName !== 'INPUT') {
            window.Logger?.warn('Cannot attach keyboard to non-input element');
            return;
        }

        // Don't attach if native Spanish keyboard is available
        if (this.hasNativeSpanishKeyboard()) {
            window.Logger?.debug('Native Spanish keyboard detected, helper not needed');
            return;
        }

        this.createKeyboard(input);
    }

    /**
     * Check if device has native Spanish keyboard
     */
    hasNativeSpanishKeyboard() {
        // Check for iOS/Android with international keyboard support
        const userAgent = navigator.userAgent.toLowerCase();
        const hasInternationalKeyboard =
            /iphone|ipad|ipod/.test(userAgent) ||
            /android/.test(userAgent);

        // Always show helper on desktop for consistency
        return false; // Always provide helper for better UX
    }

    /**
     * Create the Spanish character keyboard
     * @param {HTMLInputElement} input
     */
    createKeyboard(input) {
        // Check if keyboard already exists
        let keyboard = input.parentElement.querySelector('.spanish-keyboard');
        if (keyboard) {
            return keyboard;
        }

        // Create keyboard container
        keyboard = document.createElement('div');
        keyboard.className = 'spanish-keyboard';
        keyboard.setAttribute('role', 'toolbar');
        keyboard.setAttribute('aria-label', 'Spanische Sonderzeichen');

        // Create buttons for each special character
        this.specialChars.forEach((charInfo, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'spanish-char-btn';
            button.textContent = charInfo.char;
            button.setAttribute('aria-label', charInfo.label);
            button.setAttribute('title', charInfo.label);
            button.setAttribute('data-char', charInfo.char);
            button.setAttribute('tabindex', index === 0 ? '0' : '-1');

            // Insert character on click
            button.addEventListener('click', () => {
                this.insertCharacter(input, charInfo.char);
            });

            // Keyboard navigation within keyboard
            button.addEventListener('keydown', (e) => {
                this.handleKeyboardNav(e, button, keyboard);
            });

            keyboard.appendChild(button);
        });

        // Add help text
        const helpText = document.createElement('div');
        helpText.className = 'spanish-keyboard-help';
        helpText.textContent = 'Tipp: Tippe auf ein Zeichen, um es einzufuegen';
        helpText.setAttribute('role', 'status');
        helpText.setAttribute('aria-live', 'polite');
        keyboard.appendChild(helpText);

        // Insert keyboard after input
        input.parentElement.insertBefore(keyboard, input.nextSibling);

        // Show/hide keyboard based on focus
        input.addEventListener('focus', () => {
            keyboard.classList.add('visible');
            this.keyboardVisible = true;
            this.currentInput = input;
        });

        input.addEventListener('blur', (e) => {
            // Don't hide if focus moved to keyboard button
            if (!keyboard.contains(e.relatedTarget)) {
                setTimeout(() => {
                    keyboard.classList.remove('visible');
                    this.keyboardVisible = false;
                }, 200);
            }
        });

        // Add styles
        this.addStyles();

        window.Logger?.debug('Spanish keyboard attached to input');
        return keyboard;
    }

    /**
     * Insert character at cursor position
     * @param {HTMLInputElement} input
     * @param {string} char
     */
    insertCharacter(input, char) {
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const value = input.value;

        // Insert character at cursor position
        input.value = value.substring(0, start) + char + value.substring(end);

        // Move cursor after inserted character
        const newPos = start + char.length;
        input.setSelectionRange(newPos, newPos);

        // Return focus to input
        input.focus();

        // Announce to screen reader
        window.A11y?.announceToScreenReader(`${char} eingefuegt`);

        // Trigger input event for any listeners
        input.dispatchEvent(new Event('input', { bubbles: true }));

        window.Logger?.debug('Character inserted:', char);
    }

    /**
     * Handle keyboard navigation within Spanish keyboard
     */
    handleKeyboardNav(e, currentButton, keyboard) {
        const buttons = Array.from(keyboard.querySelectorAll('.spanish-char-btn'));
        const currentIndex = buttons.indexOf(currentButton);

        let nextButton;

        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                nextButton = buttons[currentIndex - 1] || buttons[buttons.length - 1];
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextButton = buttons[(currentIndex + 1) % buttons.length];
                break;
            case 'Home':
                e.preventDefault();
                nextButton = buttons[0];
                break;
            case 'End':
                e.preventDefault();
                nextButton = buttons[buttons.length - 1];
                break;
            case 'Escape':
                e.preventDefault();
                this.currentInput?.focus();
                return;
        }

        if (nextButton) {
            // Update tabindex
            buttons.forEach(btn => btn.setAttribute('tabindex', '-1'));
            nextButton.setAttribute('tabindex', '0');
            nextButton.focus();
        }
    }

    /**
     * Add CSS styles for Spanish keyboard
     */
    addStyles() {
        if (document.getElementById('spanish-keyboard-styles')) {
            return;
        }

        const styles = document.createElement('style');
        styles.id = 'spanish-keyboard-styles';
        styles.textContent = `
            .spanish-keyboard {
                display: none;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 10px;
                padding: 12px;
                background: #F5F5F5;
                border-radius: 8px;
                border: 2px solid #E0E0E0;
            }

            .spanish-keyboard.visible {
                display: flex;
            }

            .spanish-char-btn {
                min-width: 48px;
                min-height: 48px;
                padding: 8px 12px;
                background: white;
                border: 2px solid #20B2AA;
                border-radius: 6px;
                font-size: 20px;
                font-weight: bold;
                color: #20B2AA;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .spanish-char-btn:hover {
                background: #20B2AA;
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(32, 178, 170, 0.3);
            }

            .spanish-char-btn:active {
                transform: translateY(0);
            }

            .spanish-char-btn:focus {
                outline: 3px solid #20B2AA;
                outline-offset: 2px;
            }

            .spanish-keyboard-help {
                width: 100%;
                text-align: center;
                font-size: 12px;
                color: #666;
                margin-top: 8px;
            }

            /* Mobile optimization */
            @media (max-width: 768px) {
                .spanish-keyboard {
                    position: sticky;
                    bottom: 0;
                    z-index: 100;
                    background: white;
                    border-top: 2px solid #E0E0E0;
                    border-radius: 12px 12px 0 0;
                    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
                }

                .spanish-char-btn {
                    flex: 1;
                    min-width: 44px;
                }
            }

            /* High contrast mode */
            body.high-contrast .spanish-char-btn {
                border: 3px solid #000;
                color: #000;
            }

            body.high-contrast .spanish-char-btn:hover,
            body.high-contrast .spanish-char-btn:focus {
                background: #000;
                color: #fff;
            }

            /* Reduced motion */
            body.reduce-motion .spanish-char-btn {
                transition: none;
            }

            body.reduce-motion .spanish-char-btn:hover {
                transform: none;
            }
        `;
        document.head.appendChild(styles);
    }

    /**
     * Enable quick access shortcuts (e.g., a+ for á)
     * @param {HTMLInputElement} input
     */
    enableShortcuts(input) {
        let lastKey = '';
        let lastTime = 0;

        input.addEventListener('keyup', (e) => {
            const currentTime = Date.now();
            const timeDiff = currentTime - lastTime;

            // If + is pressed within 500ms after a letter
            if (e.key === '+' && timeDiff < 500) {
                const shortcut = lastKey + '+';
                const charInfo = this.specialChars.find(c => c.alt === shortcut);

                if (charInfo) {
                    // Remove the letter and +
                    const value = input.value;
                    input.value = value.slice(0, -2);

                    // Insert special character
                    this.insertCharacter(input, charInfo.char);

                    window.Logger?.debug('Shortcut used:', shortcut, '→', charInfo.char);
                }
            }

            lastKey = e.key;
            lastTime = currentTime;
        });

        window.Logger?.debug('Keyboard shortcuts enabled (e.g., a+ for á)');
    }

    /**
     * Attach keyboard to all text inputs in the app
     */
    attachToAllInputs() {
        const inputs = document.querySelectorAll('input[type="text"], textarea');
        inputs.forEach(input => {
            this.attachToInput(input);
            this.enableShortcuts(input);
        });

        // Observe for dynamically added inputs
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.matches('input[type="text"], textarea')) {
                            this.attachToInput(node);
                            this.enableShortcuts(node);
                        }

                        // Check children
                        const inputs = node.querySelectorAll?.('input[type="text"], textarea');
                        inputs?.forEach(input => {
                            this.attachToInput(input);
                            this.enableShortcuts(input);
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        window.Logger?.success('Spanish keyboard attached to all inputs');
    }
}

// Create global Spanish keyboard helper
window.SpanishKeyboard = new SpanishKeyboardHelper();

// Auto-attach to inputs when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.SpanishKeyboard.attachToAllInputs();
    });
} else {
    window.SpanishKeyboard.attachToAllInputs();
}
