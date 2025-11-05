/**
 * Improved Feedback System
 *
 * Provides enhanced, user-friendly feedback for answers:
 * - Success feedback with optional style improvements
 * - Error feedback with helpful hints
 * - Smooth animations and transitions
 * - Clear visual distinction between types of feedback
 */

class ImprovedFeedbackSystem {
    constructor() {
        this.feedbackArea = null;
        this.currentTimeout = null; // Track current timeout
    }

    /**
     * Clear any active auto-advance timeout
     */
    clearAutoAdvance() {
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
            this.currentTimeout = null;
            window.Logger?.debug('[ImprovedFeedbackSystem] Cleared auto-advance timeout');
        }
    }

    /**
     * Get feedback area (always fresh lookup)
     */
    getFeedbackArea() {
        // Always get fresh reference since exercises are re-rendered
        return document.getElementById('feedback-area');
    }

    /**
     * Show validation result with appropriate feedback
     */
    showValidationResult(validationResult, exercise) {
        const feedbackArea = this.getFeedbackArea();
        if (!feedbackArea) {
            window.Logger?.error('[ImprovedFeedbackSystem] feedback-area element not found!');
            return;
        }

        window.Logger?.debug('[ImprovedFeedbackSystem] Showing validation result:', validationResult);

        // Clear any existing auto-advance timeout
        this.clearAutoAdvance();

        // Clear previous feedback
        feedbackArea.innerHTML = '';
        feedbackArea.className = 'feedback-area';

        if (validationResult.isCorrect) {
            // Exercise is correct → positive reinforcement
            this.showSuccessFeedback(validationResult);

            // Show style improvements if present
            if (validationResult.styleImprovements.length > 0) {
                setTimeout(() => {
                    this.showStyleImprovements(validationResult.styleImprovements);
                }, 800);
            }

            // Auto-advance after short pause
            this.setupAutoAdvance(validationResult.styleImprovements.length > 0 ? 4000 : 1500);

        } else {
            // Exercise is incorrect → learning aid
            this.showErrorFeedback(validationResult);
        }
    }

    /**
     * Setup auto-advance with proper error handling
     */
    setupAutoAdvance(delay) {
        // Clear any existing timeout first
        this.clearAutoAdvance();

        // Verify window.app exists
        if (!window.app) {
            window.Logger?.error('[ImprovedFeedbackSystem] window.app is not defined, cannot setup auto-advance');
            return;
        }

        // Verify window.app.next is a function
        if (typeof window.app.next !== 'function') {
            window.Logger?.error('[ImprovedFeedbackSystem] window.app.next is not a function');
            return;
        }

        window.Logger?.debug('[ImprovedFeedbackSystem] Setting auto-advance timeout with delay:', delay);

        this.currentTimeout = setTimeout(() => {
            window.Logger?.debug('[ImprovedFeedbackSystem] Auto-advance timeout triggered!');

            // Double-check window.app still exists
            if (window.app && typeof window.app.next === 'function') {
                try {
                    window.app.next();
                } catch (error) {
                    window.Logger?.error('[ImprovedFeedbackSystem] Error calling window.app.next():', error);
                }
            } else {
                window.Logger?.error('[ImprovedFeedbackSystem] window.app.next() no longer available');
            }

            // Clear the timeout reference
            this.currentTimeout = null;
        }, delay);

        // Also store in window.app for backward compatibility
        if (window.app) {
            window.app.autoAdvanceTimeout = this.currentTimeout;
        }

        window.Logger?.debug('[ImprovedFeedbackSystem] Auto-advance timeout set:', this.currentTimeout);
    }

    /**
     * Show success feedback
     */
    showSuccessFeedback(result) {
        const feedbackArea = this.getFeedbackArea();

        // Sanitize feedback to prevent XSS (allow safe formatting tags)
        const safePrimary = window.sanitizeHtml
            ? window.sanitizeHtml(result.feedback.primary)
            : result.feedback.primary;
        const safeSecondary = window.sanitizeHtml
            ? window.sanitizeHtml(result.feedback.secondary)
            : result.feedback.secondary;

        const successHTML = `
            <div class="feedback-success">
                <div class="feedback-icon">✅</div>
                <div class="feedback-content">
                    <div class="feedback-message">
                        <strong>${safePrimary}</strong>
                    </div>
                    ${result.feedback.secondary ? `
                        <div class="feedback-secondary">
                            ${safeSecondary}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        feedbackArea.innerHTML = successHTML;
        feedbackArea.classList.add('correct');

        // Animate in
        feedbackArea.style.opacity = '0';
        feedbackArea.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            feedbackArea.style.transition = 'all 0.3s ease';
            feedbackArea.style.opacity = '1';
            feedbackArea.style.transform = 'translateY(0)';
        }, 10);
    }

    /**
     * Show style improvements (accents, punctuation)
     */
    showStyleImprovements(improvements) {
        if (improvements.length === 0) return;

        const feedbackArea = this.getFeedbackArea();
        if (!feedbackArea) return;

        // Create improvements container
        const improvementContainer = document.createElement('div');
        improvementContainer.className = 'style-improvements';

        let improvementHTML = `
            <div class="improvement-header">
                <span class="improvement-icon">💡</span>
                <span class="improvement-title">Kleine ${improvements.length === 1 ? 'Verbesserung' : 'Verbesserungen'}:</span>
            </div>
        `;

        improvements.forEach(improvement => {
            const icon = this.getImprovementIcon(improvement.type);

            // Escape improvement text to prevent XSS
            const safeUserVer = window.escapeHtml ? window.escapeHtml(improvement.userVersion) : improvement.userVersion;
            const safeCorrectVer = window.escapeHtml ? window.escapeHtml(improvement.correctVersion) : improvement.correctVersion;
            const safeExplanation = window.escapeHtml ? window.escapeHtml(improvement.explanation) : improvement.explanation;

            improvementHTML += `
                <div class="improvement-item ${improvement.type}">
                    <div class="improvement-comparison">
                        <span class="comparison-label">${icon}</span>
                        <span class="user-version">${safeUserVer}</span>
                        <span class="arrow">→</span>
                        <span class="correct-version">${safeCorrectVer}</span>
                    </div>
                    <div class="improvement-explanation">
                        ${safeExplanation}
                    </div>
                </div>
            `;
        });

        improvementContainer.innerHTML = improvementHTML;

        // Append to feedback area
        feedbackArea.appendChild(improvementContainer);

        // Smooth animation
        improvementContainer.style.opacity = '0';
        improvementContainer.style.transform = 'translateY(10px)';

        setTimeout(() => {
            improvementContainer.style.transition = 'all 0.4s ease';
            improvementContainer.style.opacity = '1';
            improvementContainer.style.transform = 'translateY(0)';
        }, 100);
    }

    /**
     * Get icon for improvement type
     */
    getImprovementIcon(type) {
        const icons = {
            'accent': '◌́',
            'punctuation': '¿',
            'capitalization': 'Aa'
        };
        return icons[type] || '•';
    }

    /**
     * Show error feedback
     */
    showErrorFeedback(result) {
        const feedbackArea = this.getFeedbackArea();

        // Sanitize all user-facing content
        const safePrimary = window.sanitizeHtml
            ? window.sanitizeHtml(result.feedback.primary)
            : result.feedback.primary;
        const safeSecondary = window.sanitizeHtml
            ? window.sanitizeHtml(result.feedback.secondary)
            : result.feedback.secondary;
        const safeAnswer = window.escapeHtml
            ? window.escapeHtml(result.correctAnswer)
            : result.correctAnswer;

        const errorHTML = `
            <div class="feedback-error">
                <div class="feedback-icon">❌</div>
                <div class="feedback-content">
                    <div class="feedback-message">
                        <strong>${safePrimary}</strong>
                    </div>
                    ${result.feedback.secondary ? `
                        <div class="feedback-hint">
                            💡 ${safeSecondary}
                        </div>
                    ` : ''}
                    <div class="correct-answer-box">
                        <div class="correct-answer-label">Richtige Antwort:</div>
                        <div class="correct-answer-text">${safeAnswer}</div>
                    </div>
                </div>
            </div>
        `;

        feedbackArea.innerHTML = errorHTML;
        feedbackArea.classList.add('incorrect');

        // Animate in
        feedbackArea.style.opacity = '0';
        feedbackArea.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            feedbackArea.style.transition = 'all 0.3s ease';
            feedbackArea.style.opacity = '1';
            feedbackArea.style.transform = 'translateY(0)';
        }, 10);

        // Show "Continue" button for incorrect answers
        this.showContinueButton();
    }

    /**
     * Show continue button (for incorrect answers)
     */
    showContinueButton() {
        const feedbackArea = this.getFeedbackArea();
        if (!feedbackArea) return;

        // Check if button already exists
        if (feedbackArea.querySelector('.btn-continue')) return;

        const continueBtn = document.createElement('button');
        continueBtn.className = 'btn-primary btn-continue';
        continueBtn.textContent = 'Verstanden, weiter →';
        continueBtn.style.marginTop = '15px';

        continueBtn.onclick = () => {
            if (window.app) {
                window.app.next();
            }
        };

        feedbackArea.appendChild(continueBtn);

        // Focus button for keyboard accessibility
        setTimeout(() => continueBtn.focus(), 300);
    }

    /**
     * Clear all feedback
     */
    clearFeedback() {
        const feedbackArea = this.getFeedbackArea();
        if (feedbackArea) {
            feedbackArea.innerHTML = '';
            feedbackArea.className = 'feedback-area hidden';
        }
    }
}

// Make available globally
window.ImprovedFeedbackSystem = ImprovedFeedbackSystem;
