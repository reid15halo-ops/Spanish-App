/**
 * Spanish Sentence Analyzer
 * Rule-based sentence analysis without NLP server
 * Detects: person, number, subject-verb agreement, time markers
 * ASCII-compliant, No-Gamification
 */

class SpanishSentenceAnalyzer {
    constructor(conjugator) {
        this.conjugator = conjugator;
        
        // Time markers with tense associations
        this.timeMarkers = {
            // Presente
            presente: [
                'ahora', 'hoy', 'actualmente', 'en este momento',
                'siempre', 'nunca', 'normalmente', 'generalmente',
                'a menudo', 'a veces', 'cada día', 'todos los días'
            ],
            
            // Pretérito Indefinido (completed past)
            preterito: [
                'ayer', 'anteayer', 'anoche', 'la semana pasada',
                'el año pasado', 'el mes pasado', 'hace dos días',
                'el lunes pasado', 'en 1990', 'aquel día', 'entonces'
            ],
            
            // Imperfecto (habitual/descriptive past)
            imperfecto: [
                'mientras', 'cuando era pequeño', 'antes', 'siempre',
                'cada día', 'todos los días', 'de niño', 'de joven',
                'normalmente', 'generalmente', 'a menudo', 'frecuentemente'
            ],
            
            // Perfecto (recent past with present relevance)
            perfecto: [
                'hoy', 'esta mañana', 'esta tarde', 'esta semana',
                'este mes', 'este año', 'ya', 'todavía no', 'aún no',
                'recientemente', 'últimamente'
            ],
            
            // Pluscuamperfecto (past before past)
            pluscuamperfecto: [
                'ya había', 'todavía no había', 'antes de', 'después de que',
                'cuando llegué ya', 'nunca había'
            ],
            
            // Futuro
            futuro: [
                'mañana', 'pasado mañana', 'la próxima semana',
                'el próximo año', 'el próximo mes', 'dentro de',
                'en el futuro', 'pronto', 'luego', 'después'
            ],
            
            // Condicional
            condicional: [
                'si tuviera', 'si fuera', 'en tu lugar', 'yo que tú',
                'me gustaría', 'quisiera', 'debería', 'podría'
            ]
        };
        
        // Subject pronouns with person/number
        this.pronouns = {
            'yo': { person: 'yo', number: 'singular', personNum: 1 },
            'tú': { person: 'tu', number: 'singular', personNum: 2 },
            'tu': { person: 'tu', number: 'singular', personNum: 2 },
            'usted': { person: 'el', number: 'singular', personNum: 3, formal: true },
            'él': { person: 'el', number: 'singular', personNum: 3 },
            'el': { person: 'el', number: 'singular', personNum: 3 },
            'ella': { person: 'el', number: 'singular', personNum: 3 },
            'nosotros': { person: 'nosotros', number: 'plural', personNum: 1 },
            'nosotras': { person: 'nosotros', number: 'plural', personNum: 1 },
            'vosotros': { person: 'vosotros', number: 'plural', personNum: 2 },
            'vosotras': { person: 'vosotros', number: 'plural', personNum: 2 },
            'ustedes': { person: 'ellos', number: 'plural', personNum: 3, formal: true },
            'ellos': { person: 'ellos', number: 'plural', personNum: 3 },
            'ellas': { person: 'ellos', number: 'plural', personNum: 3 }
        };
        
        // Articles with gender/number
        this.articles = {
            'el': { gender: 'masculine', number: 'singular', type: 'definite' },
            'la': { gender: 'feminine', number: 'singular', type: 'definite' },
            'los': { gender: 'masculine', number: 'plural', type: 'definite' },
            'las': { gender: 'feminine', number: 'plural', type: 'definite' },
            'un': { gender: 'masculine', number: 'singular', type: 'indefinite' },
            'una': { gender: 'feminine', number: 'singular', type: 'indefinite' },
            'unos': { gender: 'masculine', number: 'plural', type: 'indefinite' },
            'unas': { gender: 'feminine', number: 'plural', type: 'indefinite' }
        };
        
        // Common verb endings to detect verbs
        this.verbEndings = [
            // Present
            'o', 'as', 'a', 'amos', 'áis', 'an',
            'es', 'e', 'emos', 'éis', 'en',
            'imos', 'ís',
            // Preterito
            'é', 'aste', 'ó', 'asteis', 'aron',
            'í', 'iste', 'ió', 'isteis', 'ieron',
            // Imperfecto
            'aba', 'abas', 'ábamos', 'abais', 'aban',
            'ía', 'ías', 'íamos', 'íais', 'ían'
        ];
    }

    /**
     * Main analysis method
     * @param {string} sentence - Spanish sentence to analyze
     * @returns {Object} Analysis results
     */
    analyze(sentence) {
        const normalized = this.normalize(sentence);
        const tokens = this.tokenize(normalized);
        
        return {
            original: sentence,
            normalized: normalized,
            tokens: tokens,
            
            // Structural analysis
            subject: this.findSubject(tokens),
            verbs: this.findVerbs(tokens),
            
            // Time markers
            timeMarkers: this.detectTimeMarkers(normalized),
            suggestedTense: this.suggestTenseFromMarkers(normalized),
            
            // Agreement checks
            agreement: this.checkAgreement(tokens),
            
            // Sentence structure
            structure: this.analyzeStructure(tokens),
            
            // Hints
            hints: this.generateHints(tokens, normalized)
        };
    }

    /**
     * Normalize sentence (lowercase, trim)
     */
    normalize(sentence) {
        return sentence.toLowerCase().trim();
    }

    /**
     * Simple tokenizer
     */
    tokenize(sentence) {
        // Split by spaces and punctuation, keeping punctuation
        const rawTokens = sentence.match(/[\wáéíóúñü]+|[.,!?;:]/g) || [];
        
        return rawTokens.map((token, index) => {
            const pos = this.guessPartOfSpeech(token);
            
            return {
                text: token,
                index: index,
                pos: pos,
                isPronoun: this.isPronoun(token),
                isArticle: this.isArticle(token),
                isVerb: this.isLikelyVerb(token),
                metadata: this.getTokenMetadata(token)
            };
        });
    }

    /**
     * Guess part of speech (naive heuristic)
     */
    guessPartOfSpeech(token) {
        // Pronouns
        if (this.pronouns[token]) return 'PRONOUN';
        
        // Articles
        if (this.articles[token]) return 'ARTICLE';
        
        // Verbs (by ending)
        if (this.isLikelyVerb(token)) return 'VERB';
        
        // Prepositions
        if (['a', 'de', 'en', 'con', 'por', 'para', 'sin', 'sobre'].includes(token)) {
            return 'PREPOSITION';
        }
        
        // Conjunctions
        if (['y', 'e', 'o', 'u', 'pero', 'sino', 'que', 'porque'].includes(token)) {
            return 'CONJUNCTION';
        }
        
        // Adverbs
        if (token.endsWith('mente')) return 'ADVERB';
        
        // Punctuation
        if (['.', ',', '!', '?', ';', ':'].includes(token)) return 'PUNCTUATION';
        
        // Default: noun/adjective
        return 'NOUN';
    }

    /**
     * Check if token is a pronoun
     */
    isPronoun(token) {
        return !!this.pronouns[token];
    }

    /**
     * Check if token is an article
     */
    isArticle(token) {
        return !!this.articles[token];
    }

    /**
     * Check if token is likely a verb
     */
    isLikelyVerb(token) {
        // Check if ends with common verb endings
        return this.verbEndings.some(ending => token.endsWith(ending));
    }

    /**
     * Get token metadata
     */
    getTokenMetadata(token) {
        if (this.pronouns[token]) {
            return { ...this.pronouns[token], type: 'pronoun' };
        }
        
        if (this.articles[token]) {
            return { ...this.articles[token], type: 'article' };
        }
        
        return null;
    }

    /**
     * Find subject in tokens
     */
    findSubject(tokens) {
        // Look for pronouns at start or after verb
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            
            if (token.isPronoun && token.metadata) {
                return {
                    token: token.text,
                    person: token.metadata.person,
                    number: token.metadata.number,
                    position: i,
                    confidence: 'high'
                };
            }
            
            // Subject can also be a noun with article
            if (token.isArticle && i + 1 < tokens.length) {
                const nextToken = tokens[i + 1];
                if (nextToken.pos === 'NOUN') {
                    return {
                        token: `${token.text} ${nextToken.text}`,
                        person: 'el', // 3rd person
                        number: token.metadata.number,
                        position: i,
                        confidence: 'medium'
                    };
                }
            }
        }
        
        // Implicit subject (common in Spanish)
        return {
            token: '(implicit)',
            person: null,
            number: null,
            position: -1,
            confidence: 'low'
        };
    }

    /**
     * Find verbs in tokens
     */
    findVerbs(tokens) {
        const verbs = [];
        
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            
            if (token.isVerb) {
                // Try to analyze verb form
                const analysis = this.analyzeVerbForm(token.text);
                
                verbs.push({
                    token: token.text,
                    position: i,
                    analysis: analysis
                });
            }
        }
        
        return verbs;
    }

    /**
     * Analyze verb form (person, tense)
     */
    analyzeVerbForm(verbForm) {
        if (!this.conjugator) {
            return { detected: false };
        }
        
        try {
            // Try to analyze using conjugator
            const result = this.conjugator.analyzeForm(verbForm);
            
            if (result && result.infinitivo) {
                return {
                    detected: true,
                    infinitivo: result.infinitivo,
                    tiempo: result.tiempo,
                    persona: result.persona,
                    confidence: 'high'
                };
            }
        } catch (error) {
            // Fallback: naive analysis
        }
        
        // Naive analysis by ending
        return this.naiveVerbAnalysis(verbForm);
    }

    /**
     * Naive verb analysis by endings
     */
    naiveVerbAnalysis(verbForm) {
        const analysis = {
            detected: true,
            confidence: 'low'
        };
        
        // Presente indicators
        if (verbForm.endsWith('o') && verbForm.length > 2) {
            analysis.tiempo = 'presente';
            analysis.persona = 'yo';
        } else if (verbForm.endsWith('as') || verbForm.endsWith('es')) {
            analysis.tiempo = 'presente';
            analysis.persona = 'tu';
        } else if (verbForm.endsWith('amos') || verbForm.endsWith('emos') || verbForm.endsWith('imos')) {
            analysis.tiempo = 'presente';
            analysis.persona = 'nosotros';
        }
        
        // Preterito indicators
        else if (verbForm.endsWith('é') || verbForm.endsWith('í')) {
            analysis.tiempo = 'preterito';
            analysis.persona = 'yo';
        } else if (verbForm.endsWith('ó') || verbForm.endsWith('ió')) {
            analysis.tiempo = 'preterito';
            analysis.persona = 'el';
        }
        
        // Imperfecto indicators
        else if (verbForm.endsWith('aba') || verbForm.endsWith('ía')) {
            analysis.tiempo = 'imperfecto';
            analysis.persona = 'yo'; // or el/ella
        }
        
        return analysis;
    }

    /**
     * Detect time markers in sentence
     */
    detectTimeMarkers(sentence) {
        const detected = [];
        
        for (const [tense, markers] of Object.entries(this.timeMarkers)) {
            for (const marker of markers) {
                if (sentence.includes(marker)) {
                    detected.push({
                        marker: marker,
                        tense: tense,
                        position: sentence.indexOf(marker)
                    });
                }
            }
        }
        
        return detected;
    }

    /**
     * Suggest tense based on time markers
     */
    suggestTenseFromMarkers(sentence) {
        const markers = this.detectTimeMarkers(sentence);
        
        if (markers.length === 0) {
            return {
                suggested: null,
                confidence: 'none',
                reason: 'No time markers detected'
            };
        }
        
        // Count by tense
        const tenseCounts = {};
        markers.forEach(m => {
            tenseCounts[m.tense] = (tenseCounts[m.tense] || 0) + 1;
        });
        
        // Get most common
        const sorted = Object.entries(tenseCounts).sort((a, b) => b[1] - a[1]);
        const [suggestedTense, count] = sorted[0];
        
        return {
            suggested: suggestedTense,
            confidence: count > 1 ? 'high' : 'medium',
            reason: `Detected ${count} marker(s) for ${suggestedTense}`,
            markers: markers.filter(m => m.tense === suggestedTense)
        };
    }

    /**
     * Check subject-verb agreement
     */
    checkAgreement(tokens) {
        const subject = this.findSubject(tokens);
        const verbs = this.findVerbs(tokens);
        
        const issues = [];
        
        if (subject.person && verbs.length > 0) {
            verbs.forEach(verb => {
                if (verb.analysis.persona && verb.analysis.persona !== subject.person) {
                    issues.push({
                        type: 'person-mismatch',
                        subject: subject,
                        verb: verb,
                        message: `Subject person "${subject.person}" does not match verb person "${verb.analysis.persona}"`
                    });
                }
            });
        }
        
        return {
            checked: true,
            issues: issues,
            correct: issues.length === 0
        };
    }

    /**
     * Analyze sentence structure
     */
    analyzeStructure(tokens) {
        const structure = {
            hasSubject: false,
            hasVerb: false,
            hasPunctuation: false,
            wordCount: 0,
            pattern: []
        };
        
        tokens.forEach(token => {
            if (token.isPronoun || token.pos === 'NOUN') {
                structure.hasSubject = true;
                structure.pattern.push('S');
            } else if (token.isVerb) {
                structure.hasVerb = true;
                structure.pattern.push('V');
            } else if (token.pos === 'PUNCTUATION') {
                structure.hasPunctuation = true;
            } else if (token.pos !== 'PUNCTUATION') {
                structure.pattern.push('O'); // Other
            }
            
            if (token.pos !== 'PUNCTUATION') {
                structure.wordCount++;
            }
        });
        
        structure.patternString = structure.pattern.join('-');
        
        return structure;
    }

    /**
     * Generate hints based on analysis
     */
    generateHints(tokens, sentence) {
        const hints = [];
        
        // Check for time markers
        const timeMarkers = this.detectTimeMarkers(sentence);
        if (timeMarkers.length > 0) {
            const suggestion = this.suggestTenseFromMarkers(sentence);
            hints.push({
                type: 'time-marker',
                message: `Zeitmarker gefunden: "${timeMarkers[0].marker}" deutet auf ${suggestion.suggested} hin`,
                severity: 'info'
            });
        }
        
        // Check agreement
        const agreement = this.checkAgreement(tokens);
        if (!agreement.correct) {
            agreement.issues.forEach(issue => {
                hints.push({
                    type: 'agreement',
                    message: `Kongruenz-Problem: Subjekt (${issue.subject.person}) stimmt nicht mit Verb (${issue.verb.analysis.persona}) ueberein`,
                    severity: 'warning'
                });
            });
        }
        
        // Check structure
        const structure = this.analyzeStructure(tokens);
        if (!structure.hasVerb) {
            hints.push({
                type: 'structure',
                message: 'Kein Verb gefunden - unvollstaendiger Satz?',
                severity: 'warning'
            });
        }
        
        return hints;
    }

    /**
     * Quick check: does tense match time markers?
     */
    checkTenseMarkerMatch(sentence, tiempo) {
        const suggestion = this.suggestTenseFromMarkers(sentence);
        
        if (!suggestion.suggested) {
            return {
                match: null,
                reason: 'No markers to compare'
            };
        }
        
        const match = suggestion.suggested === tiempo;
        
        return {
            match: match,
            expected: suggestion.suggested,
            actual: tiempo,
            confidence: suggestion.confidence,
            reason: match ? 
                `Zeitform passt zu Markern` : 
                `Marker deuten auf ${suggestion.suggested}, aber ${tiempo} verwendet`,
            markers: suggestion.markers
        };
    }

    /**
     * Generate analysis report
     */
    generateReport(analysis) {
        let report = `SENTENCE ANALYSIS REPORT\n`;
        report += `${'='.repeat(50)}\n\n`;
        
        report += `Original: ${analysis.original}\n`;
        report += `Normalized: ${analysis.normalized}\n\n`;
        
        report += `TOKENS (${analysis.tokens.length}):\n`;
        analysis.tokens.forEach((token, i) => {
            report += `  ${i + 1}. "${token.text}" [${token.pos}]`;
            if (token.metadata) {
                report += ` - ${JSON.stringify(token.metadata)}`;
            }
            report += `\n`;
        });
        report += `\n`;
        
        report += `SUBJECT:\n`;
        report += `  Token: ${analysis.subject.token}\n`;
        report += `  Person: ${analysis.subject.person || 'unknown'}\n`;
        report += `  Number: ${analysis.subject.number || 'unknown'}\n`;
        report += `  Confidence: ${analysis.subject.confidence}\n\n`;
        
        report += `VERBS (${analysis.verbs.length}):\n`;
        analysis.verbs.forEach((verb, i) => {
            report += `  ${i + 1}. "${verb.token}"\n`;
            if (verb.analysis.detected) {
                report += `     Tiempo: ${verb.analysis.tiempo || 'unknown'}\n`;
                report += `     Persona: ${verb.analysis.persona || 'unknown'}\n`;
                report += `     Confidence: ${verb.analysis.confidence}\n`;
            }
        });
        report += `\n`;
        
        report += `TIME MARKERS (${analysis.timeMarkers.length}):\n`;
        analysis.timeMarkers.forEach((marker, i) => {
            report += `  ${i + 1}. "${marker.marker}" ? ${marker.tense}\n`;
        });
        if (analysis.suggestedTense.suggested) {
            report += `  Suggested tense: ${analysis.suggestedTense.suggested} (${analysis.suggestedTense.confidence})\n`;
        }
        report += `\n`;
        
        report += `AGREEMENT:\n`;
        report += `  Correct: ${analysis.agreement.correct ? 'Yes' : 'No'}\n`;
        if (analysis.agreement.issues.length > 0) {
            report += `  Issues:\n`;
            analysis.agreement.issues.forEach((issue, i) => {
                report += `    ${i + 1}. ${issue.message}\n`;
            });
        }
        report += `\n`;
        
        report += `HINTS (${analysis.hints.length}):\n`;
        analysis.hints.forEach((hint, i) => {
            report += `  ${i + 1}. [${hint.severity.toUpperCase()}] ${hint.message}\n`;
        });
        
        return report;
    }
}

// Export for use
if (typeof window !== 'undefined') {
    window.SpanishSentenceAnalyzer = SpanishSentenceAnalyzer;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpanishSentenceAnalyzer;
}
