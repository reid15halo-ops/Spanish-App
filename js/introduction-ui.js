/**
 * Introduction UI - Progressive Disclosure System
 *
 * Handles displaying unit introductions with progressive disclosure:
 * - Preview: Quick 30-60 second overview (shown by default)
 * - Full Introduction: Comprehensive 8-18 minute deep dive (optional)
 */

class IntroductionUI {
    constructor() {
        this.currentMode = 'preview'; // 'preview' or 'full'
    }

    /**
     * Show introduction for a unit
     * @param {Object} unitData - Unit data including introduction
     * @param {Function} onComplete - Callback when user proceeds to exercises
     */
    showIntroduction(unitData, onComplete) {
        const introduction = unitData.introduction;

        if (!introduction) {
            // No introduction available, proceed directly to exercises
            if (onComplete) onComplete();
            return;
        }

        const container = document.getElementById('exercise-area');
        if (!container) return;

        // Clear container
        container.innerHTML = '';

        // Create introduction wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'introduction-wrapper';
        wrapper.style.cssText = `
            max-width: 800px;
            margin: 0 auto;
            animation: fadeIn 0.3s ease;
        `;

        // Start with preview mode
        this.currentMode = 'preview';
        wrapper.innerHTML = this.renderPreview(introduction, unitData.metadata);

        container.appendChild(wrapper);

        // Setup event listeners
        this.setupEventListeners(introduction, unitData.metadata, onComplete);
    }

    /**
     * Render preview mode
     */
    renderPreview(introduction, metadata) {
        const preview = introduction.preview;

        return `
            <div class="introduction-preview">
                <div class="intro-header" style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: var(--primary); font-size: 28px; margin-bottom: 10px;">
                        ${introduction.title || metadata.title}
                    </h1>
                    ${introduction.subtitle ? `
                        <p style="color: var(--text-muted); font-size: 18px; font-style: italic;">
                            ${introduction.subtitle}
                        </p>
                    ` : ''}
                    <div style="margin-top: 15px; padding: 8px 16px; background: rgba(32, 178, 170, 0.1); border-radius: 20px; display: inline-block;">
                        <span style="font-size: 14px; color: var(--primary);">
                            ⏱️ Schnellübersicht: ${preview.estimatedPreviewTime || '60 Sekunden'}
                        </span>
                    </div>
                </div>

                <div class="preview-content" style="background: var(--bg); padding: 30px; border-radius: var(--radius); box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    ${preview.summary ? `
                        <div style="margin-bottom: 25px;">
                            <h3 style="color: var(--primary); margin-bottom: 12px; font-size: 18px;">
                                📖 Was lernst du hier?
                            </h3>
                            <p style="font-size: 16px; line-height: 1.6; color: var(--text);">
                                ${preview.summary}
                            </p>
                        </div>
                    ` : ''}

                    ${preview.keyPoints && preview.keyPoints.length > 0 ? `
                        <div style="margin-bottom: 25px;">
                            <h3 style="color: var(--primary); margin-bottom: 12px; font-size: 18px;">
                                🎯 Die wichtigsten Punkte
                            </h3>
                            <ul style="list-style: none; padding: 0; margin: 0;">
                                ${preview.keyPoints.map(point => `
                                    <li style="padding: 12px; margin: 8px 0; background: var(--bg-secondary); border-left: 4px solid var(--primary); border-radius: 6px; font-size: 15px;">
                                        ${point}
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    ${preview.whyImportant ? `
                        <div style="margin-bottom: 25px;">
                            <h3 style="color: var(--primary); margin-bottom: 12px; font-size: 18px;">
                                💡 Warum ist das wichtig?
                            </h3>
                            <p style="font-size: 15px; line-height: 1.6; color: var(--text); background: rgba(255, 152, 0, 0.1); padding: 15px; border-radius: 6px; border-left: 4px solid #FF9800;">
                                ${preview.whyImportant}
                            </p>
                        </div>
                    ` : ''}

                    ${preview.learningGoals && preview.learningGoals.length > 0 ? `
                        <div style="margin-bottom: 25px;">
                            <h3 style="color: var(--primary); margin-bottom: 12px; font-size: 18px;">
                                🎓 Lernziele
                            </h3>
                            <ul style="list-style: none; padding: 0; margin: 0;">
                                ${preview.learningGoals.map(goal => `
                                    <li style="padding: 10px; margin: 6px 0; font-size: 14px; display: flex; align-items: center; gap: 10px;">
                                        <span style="color: var(--success); font-size: 18px;">✓</span>
                                        <span>${goal}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    <div class="intro-actions" style="display: flex; gap: 12px; margin-top: 30px; flex-wrap: wrap;">
                        <button id="show-full-intro-btn" class="btn-primary" style="flex: 1; min-width: 200px;">
                            📖 Mehr lesen ${introduction.readingTime ? `(${introduction.readingTime})` : ''}
                        </button>
                        <button id="skip-to-exercises-btn" class="btn-primary" style="flex: 1; min-width: 200px; background: var(--success);">
                            ▶️ Zu den Übungen
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render full introduction mode
     */
    renderFullIntroduction(introduction, metadata) {
        const sections = introduction.sections || [];

        return `
            <div class="introduction-full">
                <div class="intro-header" style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: var(--primary); font-size: 28px; margin-bottom: 10px;">
                        ${introduction.title || metadata.title}
                    </h1>
                    ${introduction.subtitle ? `
                        <p style="color: var(--text-muted); font-size: 18px; font-style: italic;">
                            ${introduction.subtitle}
                        </p>
                    ` : ''}
                    <div style="margin-top: 15px; padding: 8px 16px; background: rgba(32, 178, 170, 0.1); border-radius: 20px; display: inline-block;">
                        <span style="font-size: 14px; color: var(--primary);">
                            ⏱️ Lesezeit: ${introduction.readingTime || '10-12 Minuten'}
                        </span>
                    </div>
                </div>

                <div class="full-content" style="background: var(--bg); padding: 30px; border-radius: var(--radius); box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 20px;">
                    ${sections.map((section, index) => `
                        <div class="intro-section" style="margin-bottom: ${index < sections.length - 1 ? '35px' : '0'};">
                            ${section.heading ? `
                                <h2 style="color: var(--primary); font-size: 22px; margin-bottom: 15px; border-bottom: 2px solid var(--border); padding-bottom: 10px;">
                                    ${section.heading}
                                </h2>
                            ` : ''}

                            ${section.content ? `
                                <div style="font-size: 16px; line-height: 1.8; color: var(--text); margin-bottom: 20px; white-space: pre-wrap;">
                                    ${section.content}
                                </div>
                            ` : ''}

                            ${section.examples && section.examples.length > 0 ? `
                                <div class="section-examples" style="margin-top: 20px;">
                                    ${section.examples.map(ex => `
                                        <div class="example-item" style="background: var(--bg-secondary); padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid var(--primary);">
                                            <div style="font-weight: 600; font-size: 16px; color: var(--text); margin-bottom: 5px;">
                                                🇪🇸 ${ex.spanish}
                                            </div>
                                            <div style="color: var(--text-muted); font-size: 15px; margin-bottom: 5px;">
                                                🇩🇪 ${ex.german}
                                            </div>
                                            ${ex.note ? `
                                                <div style="color: var(--primary); font-size: 14px; font-style: italic; margin-top: 8px;">
                                                    💡 ${ex.note}
                                                </div>
                                            ` : ''}
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>

                <div class="intro-actions" style="display: flex; gap: 12px; position: sticky; bottom: 20px; background: var(--bg); padding: 15px; border-radius: var(--radius); box-shadow: 0 -2px 10px rgba(0,0,0,0.1); flex-wrap: wrap;">
                    <button id="back-to-preview-btn" class="btn-primary" style="flex: 1; min-width: 150px; background: var(--bg); border: 2px solid var(--border); color: var(--text);">
                        ← Zurück zur Übersicht
                    </button>
                    <button id="proceed-to-exercises-btn" class="btn-primary" style="flex: 2; min-width: 200px; background: var(--success);">
                        ▶️ Zu den Übungen starten
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Setup event listeners for buttons
     */
    setupEventListeners(introduction, metadata, onComplete) {
        // Show full introduction button
        const showFullBtn = document.getElementById('show-full-intro-btn');
        if (showFullBtn) {
            showFullBtn.addEventListener('click', () => {
                this.showFullMode(introduction, metadata, onComplete);
            });
        }

        // Skip to exercises button (from preview)
        const skipBtn = document.getElementById('skip-to-exercises-btn');
        if (skipBtn) {
            skipBtn.addEventListener('click', () => {
                if (onComplete) onComplete();
            });
        }

        // Back to preview button (from full)
        const backBtn = document.getElementById('back-to-preview-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showPreviewMode(introduction, metadata, onComplete);
            });
        }

        // Proceed to exercises button (from full)
        const proceedBtn = document.getElementById('proceed-to-exercises-btn');
        if (proceedBtn) {
            proceedBtn.addEventListener('click', () => {
                if (onComplete) onComplete();
            });
        }
    }

    /**
     * Show full introduction mode
     */
    showFullMode(introduction, metadata, onComplete) {
        this.currentMode = 'full';
        const container = document.getElementById('exercise-area');
        if (!container) return;

        const wrapper = container.querySelector('.introduction-wrapper');
        if (wrapper) {
            wrapper.innerHTML = this.renderFullIntroduction(introduction, metadata);
            this.setupEventListeners(introduction, metadata, onComplete);

            // Scroll to top
            wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /**
     * Show preview mode
     */
    showPreviewMode(introduction, metadata, onComplete) {
        this.currentMode = 'preview';
        const container = document.getElementById('exercise-area');
        if (!container) return;

        const wrapper = container.querySelector('.introduction-wrapper');
        if (wrapper) {
            wrapper.innerHTML = this.renderPreview(introduction, metadata);
            this.setupEventListeners(introduction, metadata, onComplete);

            // Scroll to top
            wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /**
     * Check if user has seen introduction for this unit
     * @param {number} unitNumber
     * @returns {boolean}
     */
    hasSeenIntroduction(unitNumber) {
        try {
            const key = `intro-seen-unit-${unitNumber}`;
            return localStorage.getItem(key) === 'true';
        } catch (error) {
            return false;
        }
    }

    /**
     * Mark introduction as seen
     * @param {number} unitNumber
     */
    markIntroductionSeen(unitNumber) {
        try {
            const key = `intro-seen-unit-${unitNumber}`;
            localStorage.setItem(key, 'true');
        } catch (error) {
            console.error('Error marking introduction as seen:', error);
        }
    }
}

// Make globally available
window.IntroductionUI = IntroductionUI;
