/**
 * GDPR Compliance Module
 *
 * Implements GDPR requirements for European users
 * - Right to access
 * - Right to deletion
 * - Right to data portability
 * - Consent management
 */

class GDPRCompliance {
    constructor() {
        this.consentGiven = this.loadConsent();
        this.init();
    }

    init() {
        // Show consent banner if not given
        if (!this.consentGiven) {
            this.showConsentBanner();
        }
    }

    /**
     * Show GDPR consent banner
     */
    showConsentBanner() {
        const banner = document.createElement('div');
        banner.id = 'gdpr-banner';
        banner.innerHTML = `
            <div style="position: fixed; bottom: 0; left: 0; right: 0; background: #333; color: white; padding: 20px; z-index: 10000;">
                <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px;">
                    <div style="flex: 1; min-width: 300px;">
                        <p style="margin: 0; font-size: 14px;">
                            Diese App speichert Lerndaten lokal auf deinem Gerät. Wir sammeln keine persönlichen Daten.
                            <a href="#" id="gdpr-details" style="color: #20B2AA; text-decoration: underline;">Mehr erfahren</a>
                        </p>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button id="gdpr-accept" style="background: #20B2AA; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                            Akzeptieren
                        </button>
                        <button id="gdpr-decline" style="background: transparent; color: white; border: 1px solid white; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                            Ablehnen
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        document.getElementById('gdpr-accept').addEventListener('click', () => {
            this.giveConsent();
            banner.remove();
        });

        document.getElementById('gdpr-decline').addEventListener('click', () => {
            this.declineConsent();
            banner.remove();
        });

        document.getElementById('gdpr-details').addEventListener('click', (e) => {
            e.preventDefault();
            this.showPrivacyPolicy();
        });
    }

    /**
     * Give consent
     */
    giveConsent() {
        localStorage.setItem('gdpr-consent', JSON.stringify({
            given: true,
            timestamp: Date.now()
        }));
        this.consentGiven = true;
    }

    /**
     * Decline consent
     */
    declineConsent() {
        localStorage.setItem('gdpr-consent', JSON.stringify({
            given: false,
            timestamp: Date.now()
        }));
        this.consentGiven = false;
    }

    /**
     * Load consent
     */
    loadConsent() {
        try {
            const stored = localStorage.getItem('gdpr-consent');
            if (stored) {
                const consent = JSON.parse(stored);
                return consent.given;
            }
        } catch (error) {
            console.error('Failed to load consent:', error);
        }
        return false;
    }

    /**
     * Right to access - Export all user data
     */
    async exerciseRightToAccess() {
        const userData = {
            exportDate: new Date().toISOString(),
            dataSubject: 'User',
            data: {
                settings: this.getStoredData('spanish-app-settings'),
                progress: this.getStoredData('spanish-app-progress'),
                adaptiveData: this.getStoredData('adaptive-knowledge'),
                learningProgress: this.getStoredData('learning-progress'),
                sessionHistory: this.getStoredData('session-history'),
                stats: this.getStoredData('learning-stats'),
                personalPatterns: this.getStoredData('personal-patterns')
            }
        };

        // Create downloadable file
        const blob = new Blob([JSON.stringify(userData, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `my-data-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        return userData;
    }

    /**
     * Right to deletion - Delete all user data
     */
    async exerciseRightToDeletion() {
        if (window.DataBackup) {
            return await window.DataBackup.clearAllData(true);
        }

        // Fallback
        const confirm = window.confirm('Delete all your data permanently?');
        if (!confirm) return { cancelled: true };

        const keys = Object.keys(localStorage);
        keys.forEach(key => localStorage.removeItem(key));

        return { success: true, message: 'All data deleted' };
    }

    /**
     * Right to data portability
     */
    async exerciseRightToPortability() {
        if (window.DataBackup) {
            return await window.DataBackup.exportBackup(false);
        }

        return await this.exerciseRightToAccess();
    }

    /**
     * Get stored data safely
     */
    getStoredData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Show privacy policy
     */
    showPrivacyPolicy() {
        window.open('privacy-policy.html', '_blank');
    }
}

window.GDPR = new GDPRCompliance();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GDPRCompliance };
}
