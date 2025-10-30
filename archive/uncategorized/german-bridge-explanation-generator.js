/**
 * German Bridge Explanation Generator
 *
 * Generiert Erklärungen die explizit Brücken zwischen Deutsch und Spanisch bauen.
 * Nutzt deutsches Grammatikwissen als Anker für neues Lernen.
 *
 * Basierend auf:
 * - Schema Theory (Bartlett, 1932) - nutze existierendes Wissen
 * - Anchored Instruction (CTGV, 1990) - verankere neues in bekanntem
 * - Cognitive Load Theory (Sweller, 1988) - reduziere unnötige kognitive Last
 */

class GermanBridgeExplanationGenerator {
    constructor(contrastiveSystem) {
        this.contrastiveSystem = contrastiveSystem;
        this.explanationTemplates = this.initializeTemplates();
    }

    /**
     * Initialize explanation templates
     */
    initializeTemplates() {
        return {
            // SER vs ESTAR - größte Herausforderung
            'ser-conjugation': {
                germanBridge: `
                    <div class="bridge-explanation">
                        <div class="bridge-header">
                            <span class="flag">🇩🇪</span> Was du schon kennst
                        </div>
                        <div class="german-knowledge">
                            Im Deutschen: <strong>"sein"</strong><br>
                            ich bin, du bist, er/sie/es ist, wir sind, ihr seid, sie sind
                        </div>

                        <div class="bridge-arrow">⬇️ Ähnlich, aber es gibt ZWEI Verben!</div>

                        <div class="bridge-header">
                            <span class="flag">🇪🇸</span> Neu im Spanischen
                        </div>
                        <div class="spanish-new">
                            <strong>SER</strong> (für permanente Dinge):<br>
                            yo soy, tú eres, él/ella/usted es<br>
                            <em>Wie "ich BIN Deutscher, ich BIN Lehrer"</em>
                        </div>

                        <div class="key-difference">
                            <strong>⚡ Hauptunterschied:</strong><br>
                            Deutsch hat nur "sein" für ALLES<br>
                            Spanisch teilt es auf: SER (permanent) + ESTAR (temporär/Ort)
                        </div>

                        <div class="memory-aid">
                            <strong>💡 Eselsbrücke:</strong><br>
                            SER = <strong>S</strong>ehr <strong>E</strong>igenschaften <strong>R</strong>egelmäßig<br>
                            → Identität, Beruf, Herkunft (ändert sich nicht!)
                        </div>
                    </div>
                `,
                progression: [
                    'Du kennst bereits "sein" aus dem Deutschen',
                    'Spanisch hat zwei Formen: SER und ESTAR',
                    'SER ist wie "sein" für dauerhafte Dinge',
                    'Nutze SER für: wer du BIST, wo du HERKOMMST, was dein BERUF ist'
                ]
            },

            'estar-conjugation': {
                germanBridge: `
                    <div class="bridge-explanation">
                        <div class="bridge-header">
                            <span class="flag">🇩🇪</span> Deutsch: Alles ist "sein"
                        </div>
                        <div class="german-knowledge">
                            "Ich <strong>bin</strong> zu Hause"<br>
                            "Ich <strong>bin</strong> müde"<br>
                            "Ich <strong>bin</strong> glücklich"<br>
                            → Immer das gleiche Verb!
                        </div>

                        <div class="bridge-arrow">⬇️ Im Spanischen ANDERS!</div>

                        <div class="bridge-header">
                            <span class="flag">🇪🇸</span> Spanisch: ESTAR für Zustand/Ort
                        </div>
                        <div class="spanish-new">
                            <strong>ESTAR</strong> (für temporäre Dinge und Orte):<br>
                            yo estoy, tú estás, él/ella/usted está<br>
                            <br>
                            "Estoy en casa" = Ich bin zu Hause<br>
                            "Estoy cansado" = Ich bin müde<br>
                            "Estoy feliz" = Ich bin glücklich
                        </div>

                        <div class="key-difference">
                            <strong>⚡ Wann ESTAR statt SER?</strong><br>
                            <strong>PLACE</strong>-Regel:<br>
                            <strong>P</strong>osition/Ort (estoy en Madrid)<br>
                            <strong>L</strong>ocation (está aquí)<br>
                            <strong>A</strong>ction in Progress (estoy trabajando)<br>
                            <strong>C</strong>ondition/Zustand (estoy cansado)<br>
                            <strong>E</strong>motion (estoy feliz)
                        </div>

                        <div class="contrast-examples">
                            <table>
                                <tr>
                                    <th>Deutsch (ein "sein")</th>
                                    <th>Spanisch (ESTAR)</th>
                                </tr>
                                <tr>
                                    <td>Ich bin zu Hause</td>
                                    <td>Estoy en casa</td>
                                </tr>
                                <tr>
                                    <td>Du bist müde</td>
                                    <td>Estás cansado</td>
                                </tr>
                                <tr>
                                    <td>Sie ist in Berlin</td>
                                    <td>Está en Berlín</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                `,
                progression: [
                    'Im Deutschen sagst du immer "bin" - egal wofür',
                    'Im Spanischen gibt es ESTAR für Orte und Zustände',
                    'ESTAR benutzt du wenn sich etwas ändern kann',
                    'Merke: ORT = immer ESTAR!'
                ]
            },

            'personal-a': {
                germanBridge: `
                    <div class="bridge-explanation">
                        <div class="bridge-header">
                            <span class="flag">🇩🇪</span> Im Deutschen gibt es das NICHT!
                        </div>
                        <div class="german-knowledge">
                            "Ich sehe <strong>Maria</strong>" ← kein Extra-Wort!<br>
                            "Ich kenne <strong>Peter</strong>" ← direkt nach dem Verb<br>
                            "Ich suche <strong>meinen Bruder</strong>" ← normal
                        </div>

                        <div class="bridge-arrow">⬇️ Spanisch braucht "a"!</div>

                        <div class="bridge-header">
                            <span class="flag">🇪🇸</span> Spanisch: "a" vor Personen
                        </div>
                        <div class="spanish-new">
                            <strong>Die Regel:</strong><br>
                            Wenn das Objekt eine PERSON ist → "a" davor!<br>
                            <br>
                            "Veo <strong>a</strong> Maria" = Ich sehe Maria<br>
                            "Conozco <strong>a</strong> Pedro" = Ich kenne Peter<br>
                            "Busco <strong>a</strong> mi hermano" = Ich suche meinen Bruder
                        </div>

                        <div class="key-difference">
                            <strong>⚡ Warum gibt es das?</strong><br>
                            Das "a" markiert dass es sich um eine PERSON handelt<br>
                            (nicht um ein Ding).<br>
                            <br>
                            Im Deutschen brauchen wir das nicht - wir erkennen es am Kontext.<br>
                            Im Spanischen ist das "a" wie ein Signal: "Achtung, Person!"
                        </div>

                        <div class="memory-aid">
                            <strong>💡 Merkhilfe:</strong><br>
                            Denk an "A" wie "<strong>A</strong>chtung Person!"<br>
                            <br>
                            Verben die oft "a" brauchen:<br>
                            • ver (sehen)<br>
                            • conocer (kennen)<br>
                            • buscar (suchen)<br>
                            • querer (lieben/wollen)<br>
                            • llamar (anrufen)
                        </div>

                        <div class="practice-box">
                            <strong>Übung:</strong> Setze immer wenn du eine Person siehst/kennst/suchst<br>
                            automatisch ein "a" davor!
                        </div>
                    </div>
                `
            },

            'double-negation': {
                germanBridge: `
                    <div class="bridge-explanation">
                        <div class="bridge-header">
                            <span class="flag">🇩🇪</span> Deutsche Regel: Einfache Verneinung
                        </div>
                        <div class="german-knowledge">
                            "Ich habe <strong>nichts</strong>" ← eine Verneinung<br>
                            "Ich sehe <strong>niemanden</strong>" ← eine Verneinung<br>
                            <br>
                            ⚠️ "Ich habe nicht nichts" = bedeutet ich HABE etwas!<br>
                            (Doppelte Verneinung = positiv)
                        </div>

                        <div class="bridge-arrow">⬇️ Spanisch ist ANDERS!</div>

                        <div class="bridge-header">
                            <span class="flag">🇪🇸</span> Spanische Regel: Doppelte Verneinung ist NORMAL
                        </div>
                        <div class="spanish-new">
                            <strong>Im Spanischen:</strong> "no" + "nada/nadie/ningún" ist RICHTIG!<br>
                            <br>
                            "<strong>No</strong> tengo <strong>nada</strong>" = Ich habe nichts ✓<br>
                            "<strong>No</strong> veo a <strong>nadie</strong>" = Ich sehe niemanden ✓<br>
                            "<strong>No</strong> tengo <strong>ningún</strong> problema" = Ich habe kein Problem ✓
                        </div>

                        <div class="key-difference">
                            <strong>⚡ Das musst du umlernen!</strong><br>
                            Im Deutschen: 2 Verneinungen = positiv<br>
                            Im Spanischen: 2 Verneinungen = trotzdem negativ!<br>
                            <br>
                            Das ist schwer für Deutsche - aber du musst es akzeptieren!
                        </div>

                        <div class="memory-aid">
                            <strong>💡 Denk so:</strong><br>
                            Spanisch liebt es, die Verneinung zu betonen:<br>
                            "NO tengo NADA" = "NEIN ich habe NICHTS" - doppelt hält besser!
                        </div>

                        <div class="examples-table">
                            <table>
                                <tr>
                                    <th>Deutsch</th>
                                    <th>Spanisch</th>
                                </tr>
                                <tr>
                                    <td>Ich habe nichts</td>
                                    <td>No tengo nada</td>
                                </tr>
                                <tr>
                                    <td>Ich kenne niemanden</td>
                                    <td>No conozco a nadie</td>
                                </tr>
                                <tr>
                                    <td>Ich will nichts</td>
                                    <td>No quiero nada</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                `
            },

            'adjective-position': {
                germanBridge: `
                    <div class="bridge-explanation">
                        <div class="bridge-header">
                            <span class="flag">🇩🇪</span> Deutsche Wortstellung
                        </div>
                        <div class="german-knowledge">
                            Im Deutschen: <strong>Adjektiv VOR Nomen</strong><br>
                            <br>
                            Das <strong>rote</strong> Auto<br>
                            Ein <strong>großes</strong> Haus<br>
                            Die <strong>schöne</strong> Frau<br>
                            <br>
                            → Adjektiv kommt zuerst!
                        </div>

                        <div class="bridge-arrow">⬇️ Spanisch: UMGEKEHRT!</div>

                        <div class="bridge-header">
                            <span class="flag">🇪🇸</span> Spanische Wortstellung
                        </div>
                        <div class="spanish-new">
                            Im Spanischen: <strong>Nomen VOR Adjektiv</strong><br>
                            <br>
                            El coche <strong>rojo</strong><br>
                            Una casa <strong>grande</strong><br>
                            La mujer <strong>hermosa</strong><br>
                            <br>
                            → Nomen kommt zuerst!
                        </div>

                        <div class="key-difference">
                            <strong>⚡ Merkregel:</strong><br>
                            Im Spanischen kommt das WICHTIGERE zuerst!<br>
                            Das Nomen ist wichtiger → steht vorne<br>
                            Das Adjektiv beschreibt nur → steht hinten
                        </div>

                        <div class="memory-aid">
                            <strong>💡 Visualisierung:</strong><br>
                            <br>
                            Deutsch: 🔴 🚗 (rot Auto)<br>
                            Spanisch: 🚗 🔴 (Auto rot)<br>
                            <br>
                            Denk an ein Fotografie: Erst das Objekt, dann die Farbe!
                        </div>

                        <div class="exceptions">
                            <strong>Ausnahmen (kommen VOR das Nomen):</strong><br>
                            • bueno → buen (guter)<br>
                            • malo → mal (schlechter)<br>
                            • grande → gran (großer)<br>
                            <br>
                            "Un buen día" (nicht "un bueno día")<br>
                            "Una gran casa" (nicht "una grande casa")
                        </div>
                    </div>
                `
            },

            'pronoun-dropping': {
                germanBridge: `
                    <div class="bridge-explanation">
                        <div class="bridge-header">
                            <span class="flag">🇩🇪</span> Im Deutschen: Pronomen sind PFLICHT
                        </div>
                        <div class="german-knowledge">
                            <strong>Ich</strong> spreche Spanisch ← "Ich" ist notwendig<br>
                            <strong>Du</strong> gehst nach Hause ← "Du" ist notwendig<br>
                            <strong>Er</strong> ist nett ← "Er" ist notwendig<br>
                            <br>
                            Ohne Pronomen wäre es falsch:<br>
                            ❌ "Spreche Spanisch" - unvollständig!
                        </div>

                        <div class="bridge-arrow">⬇️ Spanisch: Pronomen oft ÜBERFLÜSSIG!</div>

                        <div class="bridge-header">
                            <span class="flag">🇪🇸</span> Im Spanischen: Pronomen meist weglassen
                        </div>
                        <div class="spanish-new">
                            Pronomen sind in der Verbform enthalten!<br>
                            <br>
                            "Hablo español" = Ich spreche Spanisch<br>
                            → "hablo" zeigt schon dass ICH es bin!<br>
                            <br>
                            "Vas a casa" = Du gehst nach Hause<br>
                            → "vas" zeigt schon dass DU es bist!<br>
                            <br>
                            "Es simpático" = Er ist nett<br>
                            → "es" zeigt schon dass ER es ist!
                        </div>

                        <div class="key-difference">
                            <strong>⚡ Wann braucht man Pronomen?</strong><br>
                            Nur zur BETONUNG oder bei UNKLARHEIT:<br>
                            <br>
                            "<strong>Yo</strong> hablo español, pero <strong>él</strong> no"<br>
                            = <strong>ICH</strong> spreche Spanisch, aber ER nicht<br>
                            → Betonung des Gegensatzes
                        </div>

                        <div class="memory-aid">
                            <strong>💡 Faustregel für Deutsche:</strong><br>
                            Wenn du auf Deutsch das Pronomen BETONEN würdest<br>
                            → dann auch im Spanischen verwenden<br>
                            <br>
                            Sonst: Weglassen! Die Verbendung reicht.
                        </div>

                        <div class="comparison-table">
                            <table>
                                <tr>
                                    <th>Zu deutsch</th>
                                    <th>Besser (natürlicher)</th>
                                </tr>
                                <tr>
                                    <td>Yo hablo español</td>
                                    <td>Hablo español</td>
                                </tr>
                                <tr>
                                    <td>Tú eres alemán</td>
                                    <td>Eres alemán</td>
                                </tr>
                                <tr>
                                    <td>Nosotros vivimos aquí</td>
                                    <td>Vivimos aquí</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                `
            },

            'reflexive-verbs': {
                germanBridge: `
                    <div class="bridge-explanation">
                        <div class="bridge-header">
                            <span class="flag">🇩🇪</span> Reflexive Verben im Deutschen
                        </div>
                        <div class="german-knowledge">
                            Es gibt einige reflexive Verben:<br>
                            • sich waschen<br>
                            • sich setzen<br>
                            • sich freuen<br>
                            <br>
                            "Ich wasche <strong>mich</strong>"<br>
                            "Du setzt <strong>dich</strong>"<br>
                            "Er freut <strong>sich</strong>"
                        </div>

                        <div class="bridge-arrow">⬇️ Spanisch hat VIEL MEHR!</div>

                        <div class="bridge-header">
                            <span class="flag">🇪🇸</span> Im Spanischen: Oft reflexiv wo Deutsch nicht
                        </div>
                        <div class="spanish-new">
                            Viele alltägliche Verben sind reflexiv:<br>
                            <br>
                            • <strong>llamarse</strong> = heißen<br>
                            "Me llamo Pedro" = Ich heiße Peter<br>
                            (wörtlich: "Ich nenne mich Peter")<br>
                            <br>
                            • <strong>levantarse</strong> = aufstehen<br>
                            "Me levanto" = Ich stehe auf<br>
                            <br>
                            • <strong>acostarse</strong> = sich hinlegen<br>
                            "Me acuesto" = Ich lege mich hin
                        </div>

                        <div class="key-difference">
                            <strong>⚡ Wichtig zu wissen:</strong><br>
                            Im Deutschen: "Ich heiße Peter" - NICHT reflexiv<br>
                            Im Spanischen: "Me llamo Pedro" - REFLEXIV<br>
                            <br>
                            Du musst lernen welche Verben im Spanischen reflexiv sind,<br>
                            auch wenn sie es im Deutschen nicht sind!
                        </div>

                        <div class="reflexive-pronouns">
                            <strong>Reflexivpronomen:</strong><br>
                            <table>
                                <tr><td>yo</td><td>me</td><td>(mich)</td></tr>
                                <tr><td>tú</td><td>te</td><td>(dich)</td></tr>
                                <tr><td>él/ella</td><td>se</td><td>(sich)</td></tr>
                                <tr><td>nosotros</td><td>nos</td><td>(uns)</td></tr>
                                <tr><td>vosotros</td><td>os</td><td>(euch)</td></tr>
                                <tr><td>ellos</td><td>se</td><td>(sich)</td></tr>
                            </table>
                        </div>
                    </div>
                `
            }
        };
    }

    /**
     * Generate explanation with German bridge
     */
    generateExplanation(concept, errorDetails = {}, userLevel = 'beginner') {
        const template = this.explanationTemplates[concept];

        if (!template) {
            return this.generateGenericExplanation(concept, errorDetails);
        }

        let explanation = template.germanBridge;

        // Add progression steps for beginners
        if (userLevel === 'beginner' && template.progression) {
            explanation += `
                <div class="learning-steps">
                    <h4>📚 Lernschritte:</h4>
                    <ol>
                        ${template.progression.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
            `;
        }

        // Add contrastive analysis if available
        const contrastive = this.contrastiveSystem?.analyzeExercise({concept}, '', '');
        if (contrastive && contrastive.recommendations.length > 0) {
            explanation += `
                <div class="additional-info">
                    <h4>ℹ️ Zusätzliche Hinweise:</h4>
                    ${contrastive.recommendations.map(rec => `
                        <div class="recommendation ${rec.type}">
                            ${rec.message}
                        </div>
                    `).join('')}
                </div>
            `;
        }

        return explanation;
    }

    /**
     * Generate generic explanation with German reference
     */
    generateGenericExplanation(concept, errorDetails) {
        return `
            <div class="bridge-explanation">
                <div class="bridge-header">
                    <span class="flag">🇩🇪</span> Vergleich zum Deutschen
                </div>
                <div class="info">
                    Konzept: <strong>${concept}</strong><br>
                    Im Deutschen funktioniert das ähnlich oder anders.<br>
                    Achte auf die Unterschiede!
                </div>
                <div class="tip">
                    <strong>💡 Tipp:</strong> Überlege wie du es auf Deutsch sagen würdest,<br>
                    dann prüfe ob die spanische Struktur gleich ist.
                </div>
            </div>
        `;
    }

    /**
     * Generate comparison table for two concepts
     */
    generateComparisonTable(concept1, concept2, examples) {
        return `
            <div class="comparison-table">
                <h4>Vergleich: ${concept1} vs ${concept2}</h4>
                <table>
                    <tr>
                        <th>🇩🇪 Deutsch</th>
                        <th>🇪🇸 ${concept1}</th>
                        <th>🇪🇸 ${concept2}</th>
                    </tr>
                    ${examples.map(ex => `
                        <tr>
                            <td>${ex.de}</td>
                            <td>${ex.es1}</td>
                            <td>${ex.es2}</td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        `;
    }

    /**
     * Generate mnemonic using German
     */
    generateGermanMnemonic(concept, spanishWord, germanMeaning) {
        const mnemonics = {
            'ser-estar': {
                ser: 'SER = <strong>S</strong>ehr <strong>E</strong>igenschaften <strong>R</strong>egelmäßig',
                estar: 'ESTAR = <strong>STA</strong>ndort (Ort)'
            },
            'por-para': {
                por: 'POR = durch, für (Ursache)',
                para: 'PARA = für (Ziel) - wie "fahren nach"'
            }
        };

        return mnemonics[concept] || null;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GermanBridgeExplanationGenerator };
}
