/**
 * Settings Controller
 * Manages app settings including help levels and hint configuration
 */

class SettingsController {
    constructor() {
        this.storageKey = 'spanish-app-settings';
        this.settings = this.loadSettings();
        this.callbacks = {
            onSettingsChanged: null
        };
    }

    /**
     * Get default settings
     */
    getDefaultSettings() {
        return {
            helpLevel: 'normal', // 'keine' | 'normal' | 'viel'
            hintsConfig: {
                keine: 999,      // Praktisch deaktiviert
                normal: 3,       // Standard - Hinweise nach 3 Fehlversuchen
                viel: 1          // Frühe Hilfe - Hinweise nach 1 Fehlversuch
            },
            retryHintsAfter: 5,  // Bei Wiederholungen: Hinweise nach 5 Versuchen
            version: '1.0'
        };
    }

    /**
     * Load settings from localStorage
     */
    loadSettings() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Merge with defaults to ensure all keys exist
                return { ...this.getDefaultSettings(), ...parsed };
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
        return this.getDefaultSettings();
    }

    /**
     * Save settings to localStorage
     */
    saveSettings(newSettings = null) {
        try {
            const toSave = newSettings || this.settings;
            localStorage.setItem(this.storageKey, JSON.stringify(toSave));
            this.settings = toSave;

            // Trigger callback if registered
            if (this.callbacks.onSettingsChanged) {
                this.callbacks.onSettingsChanged(this.settings);
            }

            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            return false;
        }
    }

    /**
     * Update a specific setting
     */
    updateSetting(key, value) {
        this.settings[key] = value;
        return this.saveSettings();
    }

    /**
     * Get current help level
     */
    getHelpLevel() {
        return this.settings.helpLevel;
    }

    /**
     * Set help level
     */
    setHelpLevel(level) {
        if (!['keine', 'normal', 'viel'].includes(level)) {
            console.error('Invalid help level:', level);
            return false;
        }
        return this.updateSetting('helpLevel', level);
    }

    /**
     * Get maximum attempts before hint for current help level
     * @param {boolean} isRetry - Whether this is a retry attempt
     */
    getMaxAttemptsBeforeHint(isRetry = false) {
        if (isRetry) {
            return this.settings.retryHintsAfter;
        }
        const level = this.settings.helpLevel;
        return this.settings.hintsConfig[level];
    }

    /**
     * Check if hints are enabled
     */
    areHintsEnabled() {
        return this.settings.helpLevel !== 'keine';
    }

    /**
     * Get all settings
     */
    getAllSettings() {
        return { ...this.settings };
    }

    /**
     * Reset to default settings
     */
    resetToDefaults() {
        this.settings = this.getDefaultSettings();
        return this.saveSettings();
    }

    /**
     * Export settings as JSON string
     */
    exportSettings() {
        return JSON.stringify(this.settings, null, 2);
    }

    /**
     * Import settings from JSON string
     */
    importSettings(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            this.settings = { ...this.getDefaultSettings(), ...imported };
            return this.saveSettings();
        } catch (error) {
            console.error('Error importing settings:', error);
            return false;
        }
    }

    /**
     * Register callback for settings changes
     */
    onSettingsChanged(callback) {
        this.callbacks.onSettingsChanged = callback;
    }

    /**
     * Initialize UI bindings
     */
    initializeUI() {
        // Radio button bindings
        const radioButtons = document.querySelectorAll('input[name="help-level"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.setHelpLevel(e.target.value);
                this.showSaveConfirmation();
            });

            // Set initial checked state
            if (radio.value === this.settings.helpLevel) {
                radio.checked = true;
            }
        });

        // Save button (if exists)
        const saveButton = document.getElementById('save-settings-btn');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                const checkedRadio = document.querySelector('input[name="help-level"]:checked');
                if (checkedRadio) {
                    this.setHelpLevel(checkedRadio.value);
                }
                this.showSaveConfirmation();
            });
        }

        // Reset button (if exists)
        const resetButton = document.getElementById('reset-settings-btn');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                if (confirm('Möchtest du wirklich alle Einstellungen zurücksetzen?')) {
                    this.resetToDefaults();
                    this.initializeUI(); // Refresh UI
                    this.showSaveConfirmation('Einstellungen zurückgesetzt!');
                }
            });
        }

        // Update info text based on current setting
        this.updateHelpLevelInfo();
    }

    /**
     * Update help level information text
     */
    updateHelpLevelInfo() {
        const infoElement = document.getElementById('help-level-info');
        if (!infoElement) return;

        const level = this.settings.helpLevel;
        const infoTexts = {
            keine: 'Du erhältst keine Hinweise. Ideal für Fortgeschrittene, die sich selbst herausfordern möchten.',
            normal: 'Hinweise erscheinen nach 3 Fehlversuchen. Empfohlen für die meisten Lernenden.',
            viel: 'Hinweise erscheinen nach dem ersten Fehlversuch. Ideal für Anfänger oder schwierige Themen.'
        };

        infoElement.textContent = infoTexts[level] || '';
        infoElement.style.display = 'block';
    }

    /**
     * Show save confirmation message
     */
    showSaveConfirmation(message = 'Einstellungen gespeichert!') {
        const confirmElement = document.getElementById('settings-save-confirmation');
        if (confirmElement) {
            confirmElement.textContent = message;
            confirmElement.style.display = 'block';
            confirmElement.classList.add('fade-in');

            setTimeout(() => {
                confirmElement.classList.remove('fade-in');
                confirmElement.classList.add('fade-out');

                setTimeout(() => {
                    confirmElement.style.display = 'none';
                    confirmElement.classList.remove('fade-out');
                }, 300);
            }, 2000);
        }
    }

    /**
     * Get human-readable help level name
     */
    getHelpLevelName(level = null) {
        const l = level || this.settings.helpLevel;
        const names = {
            keine: 'Keine Hilfe',
            normal: 'Normal',
            viel: 'Viel Hilfe'
        };
        return names[l] || 'Unbekannt';
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SettingsController;
}
