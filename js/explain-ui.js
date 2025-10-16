/**
 * Error Explanation UI Component
 * Displays compact error explanations with links to rules
 * ASCII-compliant, No-Gamification
 */

class ErrorExplanationUI {
    constructor(explainer) {
        this.explainer = explainer;
        this.container = null;
    }

    /**
     * Show error explanation
     * @param {Object} errorData - {input, expected, tiempo, persona, verbo}
     * @param {HTMLElement} container - Container element
     */
    showExplanation(errorData, container) {
        this.container = container;
        
        // Classify error
        const classification = this.explainer.classifyError(errorData);
        
        // Render explanation
        this.render(classification);
    }

    /**
     * Render explanation UI
     */
    render(classification) {
        if (!this.container) return;
        
        const html = `
            <div class="error-explanation">
                <div class="error-explanation-header">
                    <span class="error-icon">??</span>
                    <span class="error-category-name">${classification.name}</span>
                </div>
                
                <div class="error-comparison">
                    <div class="error-input">
                        <span class="label">Ihre Eingabe:</span>
                        <span class="value incorrect">${classification.errorDetails.eingabe}</span>
                    </div>
                    <div class="error-expected">
                        <span class="label">Richtig:</span>
                        <span class="value correct">${classification.errorDetails.erwartet}</span>
                    </div>
                </div>
                
                <div class="error-rule">
                    <strong>Regel:</strong> ${classification.rule}
                </div>
                
                <div class="error-tip">
                    <strong>Tipp:</strong> ${classification.tipp}
                </div>
                
                ${classification.examples.length > 0 ? `
                    <div class="error-examples">
                        <strong>Beispiele:</strong>
                        <ul>
                            ${classification.examples.map(ex => `<li>${ex}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <div class="error-actions">
                    <button class="rule-link-btn" onclick="errorUI.openWorkbench('${classification.workbenchLink}')">
                        ?? Regel in Workbench anzeigen
                    </button>
                    <button class="close-btn" onclick="errorUI.close()">
                        Schliessen
                    </button>
                </div>
            </div>
        `;
        
        this.container.innerHTML = html;
        this.container.style.display = 'block';
        
        // Add animation
        setTimeout(() => {
            this.container.querySelector('.error-explanation').classList.add('show');
        }, 10);
    }

    /**
     * Open Workbench at specific section
     */
    openWorkbench(anchor) {
        const url = `zeiten-workbench.html${anchor}`;
        window.open(url, '_blank');
    }

    /**
     * Close explanation
     */
    close() {
        if (this.container) {
            this.container.style.display = 'none';
            this.container.innerHTML = '';
        }
    }

    /**
     * Show inline tip (compact version)
     */
    showInlineTip(errorData, targetElement) {
        const classification = this.explainer.classifyError(errorData);
        
        const tipHTML = `
            <div class="inline-tip">
                <span class="tip-icon">??</span>
                <span class="tip-text">${classification.tipp}</span>
                <button class="tip-more-btn" onclick="errorUI.showFullExplanation(${JSON.stringify(errorData).replace(/"/g, '&quot;')})">
                    Mehr
                </button>
            </div>
        `;
        
        // Insert after target element
        targetElement.insertAdjacentHTML('afterend', tipHTML);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            const tip = targetElement.nextElementSibling;
            if (tip && tip.classList.contains('inline-tip')) {
                tip.remove();
            }
        }, 10000);
    }

    /**
     * Show full explanation from inline tip
     */
    showFullExplanation(errorData) {
        // Find or create explanation container
        let container = document.getElementById('error-explanation-modal');
        
        if (!container) {
            container = document.createElement('div');
            container.id = 'error-explanation-modal';
            container.className = 'error-explanation-modal';
            document.body.appendChild(container);
        }
        
        this.showExplanation(errorData, container);
    }

    /**
     * Add styles dynamically
     */
    static addStyles() {
        if (document.getElementById('error-explanation-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'error-explanation-styles';
        style.textContent = `
            .error-explanation {
                background: white;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                max-width: 600px;
                margin: 20px auto;
                opacity: 0;
                transform: translateY(-10px);
                transition: all 0.3s ease;
            }
            
            .error-explanation.show {
                opacity: 1;
                transform: translateY(0);
            }
            
            .error-explanation-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 15px;
                padding-bottom: 15px;
                border-bottom: 2px solid #e9ecef;
            }
            
            .error-icon {
                font-size: 1.5em;
            }
            
            .error-category-name {
                font-size: 1.2em;
                font-weight: bold;
                color: #667eea;
            }
            
            .error-comparison {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin: 15px 0;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 6px;
            }
            
            .error-input, .error-expected {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .error-comparison .label {
                font-size: 0.9em;
                color: #666;
            }
            
            .error-comparison .value {
                font-size: 1.2em;
                font-weight: bold;
                padding: 8px;
                border-radius: 4px;
            }
            
            .error-comparison .value.incorrect {
                background: #f8d7da;
                color: #721c24;
            }
            
            .error-comparison .value.correct {
                background: #d4edda;
                color: #155724;
            }
            
            .error-rule, .error-tip {
                margin: 15px 0;
                padding: 12px;
                background: #e7f3ff;
                border-left: 4px solid #0056b3;
                border-radius: 4px;
            }
            
            .error-rule strong, .error-tip strong {
                color: #0056b3;
            }
            
            .error-examples {
                margin: 15px 0;
                padding: 12px;
                background: #fff3cd;
                border-left: 4px solid #ffc107;
                border-radius: 4px;
            }
            
            .error-examples strong {
                color: #856404;
            }
            
            .error-examples ul {
                margin: 10px 0 0 20px;
                padding: 0;
            }
            
            .error-examples li {
                margin: 5px 0;
            }
            
            .error-actions {
                display: flex;
                gap: 10px;
                margin-top: 20px;
                padding-top: 15px;
                border-top: 2px solid #e9ecef;
            }
            
            .rule-link-btn, .close-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s ease;
            }
            
            .rule-link-btn {
                background: #667eea;
                color: white;
                flex: 1;
            }
            
            .rule-link-btn:hover {
                background: #5a6fd8;
            }
            
            .close-btn {
                background: #6c757d;
                color: white;
            }
            
            .close-btn:hover {
                background: #5a6268;
            }
            
            /* Inline tip styles */
            .inline-tip {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px 15px;
                background: #fff3cd;
                border-left: 4px solid #ffc107;
                border-radius: 4px;
                margin: 10px 0;
                animation: slideIn 0.3s ease;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            .tip-icon {
                font-size: 1.2em;
            }
            
            .tip-text {
                flex: 1;
                color: #856404;
            }
            
            .tip-more-btn {
                padding: 5px 15px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.9em;
            }
            
            .tip-more-btn:hover {
                background: #5a6fd8;
            }
            
            /* Modal styles */
            .error-explanation-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                display: none;
                z-index: 10000;
                padding: 20px;
                overflow-y: auto;
            }
            
            .error-explanation-modal .error-explanation {
                margin: 50px auto;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .error-comparison {
                    grid-template-columns: 1fr;
                }
                
                .error-actions {
                    flex-direction: column;
                }
                
                .rule-link-btn {
                    width: 100%;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Initialize global instance
if (typeof window !== 'undefined') {
    window.ErrorExplanationUI = ErrorExplanationUI;
    
    // Add styles on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            ErrorExplanationUI.addStyles();
        });
    } else {
        ErrorExplanationUI.addStyles();
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorExplanationUI;
}
