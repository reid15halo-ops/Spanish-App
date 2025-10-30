/**
 * Explanation Generator
 *
 * Generates contextual, helpful explanations for user errors
 * Provides multiple explanation formats (simple, detailed, visual)
 */

class ExplanationGenerator {
    constructor() {
        this.explanationTemplates = this.initializeTemplates();
        this.explanationHistory = [];
    }

    /**
     * Initialize explanation templates for all error types
     */
    initializeTemplates() {
        return {
            // Conjugation errors
            'conjugation-person': {
                simple: (details) => `Bei '${details.expectedPerson}' verwendest du eine andere Endung als bei '${details.detectedPerson}'.`,

                detailed: (details) => `
                    <div class="explanation">
                        <h4>Falsche Person verwendet</h4>
                        <p>Du hast die Konjugation für '<strong>${details.detectedPerson}</strong>' verwendet,
                        aber die Aufgabe fragt nach '<strong>${details.expectedPerson}</strong>'.</p>

                        <div class="tip">
                            <strong>Merkhilfe:</strong>
                            <ul>
                                <li>yo → -o (ich)</li>
                                <li>tú → -as/-es (du)</li>
                                <li>él/ella → -a/-e (er/sie)</li>
                                <li>nosotros → -amos/-emos (wir)</li>
                                <li>ellos → -an/-en (sie)</li>
                            </ul>
                        </div>
                    </div>
                `,

                example: (details) => `
                    Beispiel:
                    ✅ Yo hablo (ich spreche)
                    ❌ Yo habla

                    ✅ Tú hablas (du sprichst)
                    ❌ Tú hablo
                `
            },

            'conjugation-tense': {
                simple: () => `Falsche Zeitform verwendet. Achte auf Signalwörter wie 'ayer' (gestern) oder 'mañana' (morgen).`,

                detailed: (details) => `
                    <div class="explanation">
                        <h4>Falsche Zeitform</h4>
                        <p>Die Zeitform passt nicht zum Kontext der Aufgabe.</p>

                        <div class="tip">
                            <strong>Signalwörter:</strong>
                            <ul>
                                <li><strong>Gegenwart:</strong> hoy, ahora, actualmente</li>
                                <li><strong>Vergangenheit:</strong> ayer, la semana pasada, hace un año</li>
                                <li><strong>Zukunft:</strong> mañana, próximo, en el futuro</li>
                            </ul>
                        </div>
                    </div>
                `
            },

            'conjugation-irregular': {
                simple: (details) => `${details.verb} ist ein unregelmäßiges Verb. Die Form '${details.expectedForm}' musst du auswendig lernen.`,

                detailed: (details) => `
                    <div class="explanation">
                        <h4>Unregelmäßiges Verb</h4>
                        <p>'<strong>${details.verb}</strong>' ist unregelmäßig und folgt nicht dem normalen Muster.</p>

                        <div class="irregular-table">
                            <p>Diese Form musst du auswendig lernen: <strong>${details.expectedForm}</strong></p>
                        </div>

                        <div class="tip">
                            <strong>Tipp:</strong> Übe unregelmäßige Verben häufiger, sie kommen sehr oft vor!
                        </div>
                    </div>
                `
            },

            // Ser/Estar errors
            'ser-estar-location': {
                simple: () => `Bei Ortsangaben verwendest du ESTAR, nicht SER.`,

                detailed: (details) => `
                    <div class="explanation">
                        <h4>SER vs. ESTAR: Ortsangaben</h4>
                        <p>Für Orte und Positionen verwendest du <strong>immer ESTAR</strong>.</p>

                        <div class="rule">
                            <strong>Regel:</strong> ${details.rule}
                        </div>

                        <div class="examples">
                            <h5>Beispiele:</h5>
                            <p>✅ Estoy en casa (Ich bin zu Hause)</p>
                            <p>✅ El libro está en la mesa (Das Buch ist auf dem Tisch)</p>
                            <p>❌ Soy en casa</p>
                        </div>

                        <div class="memory-aid">
                            <strong>Merkhilfe:</strong> "Wo bist du?" → ESTAR!
                        </div>
                    </div>
                `,

                example: () => `
                    Kontrast:
                    SER → Identität: "Soy profesor" (Ich bin Lehrer - das bin ICH)
                    ESTAR → Ort: "Estoy en Madrid" (Ich bin in Madrid - da bin ich gerade)
                `
            },

            'ser-estar-condition': {
                simple: () => `Bei temporären Zuständen verwendest du ESTAR, nicht SER.`,

                detailed: (details) => `
                    <div class="explanation">
                        <h4>SER vs. ESTAR: Zustände</h4>
                        <p>Für <strong>temporäre Zustände und Gefühle</strong> verwendest du ESTAR.</p>

                        <div class="rule">
                            ${details.rule}
                        </div>

                        <div class="examples">
                            <h5>Beispiele:</h5>
                            <p>✅ Estoy cansado (Ich bin müde - jetzt gerade)</p>
                            <p>✅ Estás feliz (Du bist glücklich - momentan)</p>
                            <p>❌ Soy cansado</p>
                        </div>

                        <div class="contrast">
                            <h5>Wichtiger Unterschied:</h5>
                            <p><strong>SER</strong> feliz = glücklich sein (Persönlichkeit)</p>
                            <p><strong>ESTAR</strong> feliz = glücklich sein (momentaner Zustand)</p>
                        </div>
                    </div>
                `
            },

            'ser-estar-identity': {
                simple: () => `Bei Identität, Beruf oder Eigenschaften verwendest du SER, nicht ESTAR.`,

                detailed: () => `
                    <div class="explanation">
                        <h4>SER vs. ESTAR: Identität</h4>
                        <p>Für <strong>permanente Eigenschaften, Identität und Beruf</strong> verwendest du SER.</p>

                        <div class="examples">
                            <h5>Beispiele:</h5>
                            <p>✅ Soy profesor (Ich bin Lehrer - das ist mein Beruf)</p>
                            <p>✅ Eres alemán (Du bist Deutscher - das ist deine Nationalität)</p>
                            <p>✅ Es inteligente (Er ist intelligent - das ist seine Eigenschaft)</p>
                            <p>❌ Estoy profesor</p>
                        </div>

                        <div class="memory-aid">
                            <strong>Merkhilfe:</strong> "Wer oder was bist du?" → SER!
                        </div>
                    </div>
                `
            },

            // Tense confusion
            'preterito-imperfecto': {
                simple: (details) => `${details.hint}`,

                detailed: (details) => `
                    <div class="explanation">
                        <h4>Pretérito vs. Imperfecto</h4>
                        <p>Du hast <strong>${details.used}</strong> verwendet, aber hier brauchen wir <strong>${details.expected}</strong>.</p>

                        <div class="rule">
                            <h5>Wann welche Zeit?</h5>
                            <ul>
                                <li><strong>Pretérito:</strong> Abgeschlossene, punktuelle Handlungen
                                    <br>→ "Was ist passiert?"
                                    <br>→ Signalwörter: ayer, la semana pasada, en 2020
                                </li>
                                <li><strong>Imperfecto:</strong> Gewohnheiten, Beschreibungen, Hintergründe
                                    <br>→ "Wie war es? Was war üblich?"
                                    <br>→ Signalwörter: siempre, cada día, normalmente
                                </li>
                            </ul>
                        </div>

                        <div class="examples">
                            <h5>Kontrast-Beispiele:</h5>
                            <p>✅ <strong>Ayer comí pizza</strong> (Gestern aß ich Pizza - einmal, abgeschlossen)</p>
                            <p>✅ <strong>Cuando era niño, comía pizza todos los viernes</strong>
                               (Als ich Kind war, aß ich jeden Freitag Pizza - Gewohnheit)</p>
                        </div>

                        <div class="tip">
                            <strong>${details.hint}</strong>
                        </div>
                    </div>
                `
            },

            'present-past': {
                simple: () => `Du hast Gegenwart verwendet, aber die Aufgabe fragt nach Vergangenheit.`,

                detailed: (details) => `
                    <div class="explanation">
                        <h4>Falsche Zeitform: Gegenwart statt Vergangenheit</h4>
                        <p>Achte auf den Kontext - hier wird nach einer vergangenen Handlung gefragt.</p>

                        <div class="tip">
                            ${details.hint}
                        </div>

                        <div class="examples">
                            <h5>Beispiel:</h5>
                            <p>❌ Ayer <strong>hablo</strong> con María (falsch - Gegenwart)</p>
                            <p>✅ Ayer <strong>hablé</strong> con María (richtig - Pretérito)</p>
                        </div>
                    </div>
                `
            },

            // Preposition errors
            'preposition-por-para': {
                simple: (details) => `Hier brauchst du '${details.expected}', nicht '${details.used}'. ${details.hint}`,

                detailed: (details) => `
                    <div class="explanation">
                        <h4>POR vs. PARA</h4>
                        <p>Du hast '<strong>${details.used}</strong>' verwendet, aber hier brauchen wir '<strong>${details.expected}</strong>'.</p>

                        <div class="rule">
                            <h5>Grundregel:</h5>
                            <p>${details.hint}</p>
                        </div>

                        <div class="usage">
                            <h5>POR verwendet man für:</h5>
                            <ul>
                                <li><strong>Grund/Ursache:</strong> Gracias por tu ayuda (Danke für deine Hilfe)</li>
                                <li><strong>Durchquerung:</strong> Paso por el parque (Ich gehe durch den Park)</li>
                                <li><strong>Zeitraum:</strong> Por la mañana (Am Morgen)</li>
                                <li><strong>Austausch:</strong> Pago 10 euros por esto (Ich zahle 10 Euro dafür)</li>
                            </ul>

                            <h5>PARA verwendet man für:</h5>
                            <ul>
                                <li><strong>Zweck/Ziel:</strong> Estudio para aprender (Ich lerne, um zu lernen)</li>
                                <li><strong>Empfänger:</strong> Este regalo es para ti (Dieses Geschenk ist für dich)</li>
                                <li><strong>Frist:</strong> Para mañana (Für/bis morgen)</li>
                                <li><strong>Richtung:</strong> Voy para Madrid (Ich fahre nach Madrid)</li>
                            </ul>
                        </div>

                        <div class="memory-aid">
                            <strong>Merkhilfe:</strong>
                            <br>POR = <em>Warum? Wegen was? Durch was?</em>
                            <br>PARA = <em>Wofür? Für wen? Wohin?</em>
                        </div>
                    </div>
                `
            },

            // Accent errors
            'accent-missing': {
                simple: (details) => `Fast richtig! Es fehlt nur ein Akzent: ${details.correctForm}`,

                detailed: (details) => `
                    <div class="explanation">
                        <h4>Fehlender Akzent</h4>
                        <p>Deine Antwort ist fast perfekt! Du hast nur den Akzent vergessen.</p>

                        <div class="correct">
                            <p>✅ Richtig: <strong>${details.correctForm}</strong></p>
                        </div>

                        <div class="tip">
                            ${details.hint}
                            <br><br>
                            <strong>Warum sind Akzente wichtig?</strong>
                            <ul>
                                <li>Sie zeigen die Betonung an</li>
                                <li>Sie unterscheiden Wörter:
                                    <br>'esta' (diese) vs. 'está' (er/sie ist)
                                    <br>'si' (wenn) vs. 'sí' (ja)
                                </li>
                            </ul>
                        </div>
                    </div>
                `
            },

            // Typo
            'typo': {
                simple: () => `Das sieht nach einem Tippfehler aus. Überprüfe die Schreibweise.`,

                detailed: () => `
                    <div class="explanation">
                        <h4>Möglicher Tippfehler</h4>
                        <p>Deine Antwort ist sehr nah an der richtigen Lösung.
                        Überprüfe die Schreibweise nochmal genau.</p>

                        <div class="tip">
                            <strong>Tipp:</strong> Lies deine Antwort laut vor - oft fallen Tippfehler dann auf!
                        </div>
                    </div>
                `
            },

            // Subjuntivo
            'subjuntivo-missing': {
                simple: () => `Nach 'que' in diesem Kontext brauchst du Subjuntivo, nicht Indikativ.`,

                detailed: () => `
                    <div class="explanation">
                        <h4>Subjuntivo fehlt</h4>
                        <p>In diesem Satz musst du <strong>Subjuntivo</strong> verwenden, nicht den normalen Indikativ.</p>

                        <div class="rule">
                            <h5>Wann Subjuntivo?</h5>
                            <p>Nach bestimmten Ausdrücken mit 'que':</p>
                            <ul>
                                <li><strong>Wünsche:</strong> Espero que... / Quiero que...</li>
                                <li><strong>Emotionen:</strong> Me alegra que... / Me molesta que...</li>
                                <li><strong>Zweifel:</strong> Dudo que... / No creo que...</li>
                                <li><strong>Empfehlungen:</strong> Recomiendo que...</li>
                            </ul>
                        </div>

                        <div class="examples">
                            <h5>Beispiele:</h5>
                            <p>✅ Espero que <strong>vengas</strong> (Ich hoffe, dass du kommst)</p>
                            <p>❌ Espero que <strong>vienes</strong></p>
                            <br>
                            <p>✅ Quiero que <strong>estudies</strong> (Ich will, dass du lernst)</p>
                            <p>❌ Quiero que <strong>estudias</strong></p>
                        </div>
                    </div>
                `
            },

            // General
            'general': {
                simple: () => `Die Antwort ist nicht ganz richtig. Schau dir die richtige Lösung an und versuche zu verstehen, warum.`,

                detailed: () => `
                    <div class="explanation">
                        <h4>Nicht ganz richtig</h4>
                        <p>Vergleiche deine Antwort mit der richtigen Lösung und überlege, was der Unterschied ist.</p>

                        <div class="tip">
                            <strong>Lernstrategie:</strong>
                            <ol>
                                <li>Vergleiche beide Antworten genau</li>
                                <li>Finde den Unterschied</li>
                                <li>Überlege, welche Regel hier gilt</li>
                                <li>Wiederhole diese Art von Übung</li>
                            </ol>
                        </div>
                    </div>
                `
            }
        };
    }

    /**
     * Generate explanation for an error
     */
    generateExplanation(errorType, details = {}, format = 'detailed') {
        const template = this.explanationTemplates[errorType];

        if (!template) {
            return this.explanationTemplates['general'][format](details);
        }

        const explanation = template[format](details);

        // Record in history
        this.explanationHistory.push({
            timestamp: Date.now(),
            errorType,
            format,
            details
        });

        return explanation;
    }

    /**
     * Generate multi-format explanation
     */
    generateMultiFormat(errorType, details = {}) {
        const template = this.explanationTemplates[errorType];

        if (!template) {
            template = this.explanationTemplates['general'];
        }

        return {
            simple: template.simple ? template.simple(details) : '',
            detailed: template.detailed ? template.detailed(details) : '',
            example: template.example ? template.example(details) : ''
        };
    }

    /**
     * Generate progressive explanation (starts simple, can expand)
     */
    generateProgressive(errorType, details = {}, attemptNumber = 1) {
        if (attemptNumber === 1) {
            return this.generateExplanation(errorType, details, 'simple');
        } else if (attemptNumber === 2) {
            return this.generateExplanation(errorType, details, 'detailed');
        } else {
            // After 3+ attempts, show example
            const multi = this.generateMultiFormat(errorType, details);
            return multi.detailed + (multi.example || '');
        }
    }

    /**
     * Check if user has seen this explanation before
     */
    hasSeenExplanation(errorType, recentOnly = true) {
        const timeWindow = recentOnly ? 24 * 60 * 60 * 1000 : Infinity; // 24 hours
        const cutoff = Date.now() - timeWindow;

        return this.explanationHistory.some(
            entry => entry.errorType === errorType && entry.timestamp > cutoff
        );
    }

    /**
     * Get alternative explanation if user has seen the first one
     */
    getAlternativeExplanation(errorType, details = {}) {
        if (this.hasSeenExplanation(errorType)) {
            // Provide a different angle
            return `
                <div class="alternative-explanation">
                    <h4>Nochmal anders erklärt:</h4>
                    ${this.generateExplanation(errorType, details, 'example') ||
                      this.generateExplanation(errorType, details, 'detailed')}

                    <div class="practice-suggestion">
                        <strong>Übungsvorschlag:</strong>
                        Dieser Fehlertyp kommt öfter vor. Möchtest du gezielte Übungen dazu machen?
                    </div>
                </div>
            `;
        }

        return this.generateExplanation(errorType, details);
    }

    /**
     * Save explanation history
     */
    saveHistory() {
        localStorage.setItem('explanationHistory', JSON.stringify(this.explanationHistory));
    }

    /**
     * Load explanation history
     */
    loadHistory() {
        const saved = localStorage.getItem('explanationHistory');
        if (saved) {
            this.explanationHistory = JSON.parse(saved);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ExplanationGenerator };
}
