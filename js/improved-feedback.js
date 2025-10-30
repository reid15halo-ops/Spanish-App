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
    }

    /**
     * Get or create feedback area
     */
    getFeedbackArea() {
        if (!this.feedbackArea) {
            this.feedbackArea = document.getElementById('feedback-area');
        }
        return this.feedbackArea;
    }

    /**
     * Show validation result with appropriate feedback
     */
    showValidationResult(validationResult, exercise) {
        const feedbackArea = this.getFeedbackArea();
        if (!feedbackArea) return;

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
            const delay = validationResult.styleImprovements.length > 0 ? 4000 : 1500;
            setTimeout(() => {
                if (window.app) {
                    window.app.next();
                }
            }, delay);

        } else {
            // Exercise is incorrect → learning aid
            this.showErrorFeedback(validationResult);
        }
    }

    /**
     * Show success feedback
     */
    showSuccessFeedback(result) {
        const feedbackArea = this.getFeedbackArea();

        const successHTML = `
            <div class="feedback-success">
                <div class="feedback-icon">✅</div>
                <div class="feedback-content">
                    <div class="feedback-message">
                        <strong>${result.feedback.primary}</strong>
                    </div>
                    ${result.feedback.secondary ? `
                        <div class="feedback-secondary">
                            ${result.feedback.secondary}
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

            improvementHTML += `
                <div class="improvement-item ${improvement.type}">
                    <div class="improvement-comparison">
                        <span class="comparison-label">${icon}</span>
                        <span class="user-version">${this.escapeHtml(improvement.userVersion)}</span>
                        <span class="arrow">→</span>
                        <span class="correct-version">${this.escapeHtml(improvement.correctVersion)}</span>
                    </div>
                    <div class="improvement-explanation">
                        ${this.escapeHtml(improvement.explanation)}
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

        const errorHTML = `
            <div class="feedback-error">
                <div class="feedback-icon">❌</div>
                <div class="feedback-content">
                    <div class="feedback-message">
                        <strong>${result.feedback.primary}</strong>
                    </div>
                    ${result.feedback.secondary ? `
                        <div class="feedback-hint">
                            💡 ${result.feedback.secondary}
                        </div>
                    ` : ''}
                    <div class="correct-answer-box">
                        <div class="correct-answer-label">Richtige Antwort:</div>
                        <div class="correct-answer-text">${this.escapeHtml(result.correctAnswer)}</div>
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
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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
