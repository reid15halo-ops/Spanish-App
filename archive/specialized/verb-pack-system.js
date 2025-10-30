/**
 * Verb Pack System
 * Manages irregular verb packs for targeted practice
 * ASCII-compliant, No-Gamification
 */

class VerbPackSystem {
    constructor() {
        // Define verb packs
        this.packs = {
            'essential-irregular': {
                name: 'Essentielle Unregelmaessige Verben',
                description: '15 wichtigste unregelmaessige Verben',
                priority: 1,
                verbs: [
                    'ser', 'estar', 'haber', 'ir', 'tener',
                    'hacer', 'poder', 'poner', 'decir', 'ver',
                    'dar', 'querer', 'venir', 'saber', 'traer'
                ],
                color: '#dc3545'
            },
            'stem-changing': {
                name: 'Stammwechselnde Verben',
                description: 'Verben mit Vokalwechsel (e>ie, o>ue, e>i)',
                priority: 2,
                verbs: [
                    'poder', 'querer', 'venir', 'pensar', 'sentir',
                    'dormir', 'empezar', 'seguir', 'encontrar', 'recordar',
                    'perder', 'entender', 'comenzar', 'conseguir', 'jugar'
                ],
                color: '#ffc107'
            },
            'communication': {
                name: 'Kommunikation',
                description': 'Verben fuer Sprechen und Kommunikation',
                priority: 3,
                verbs: [
                    'decir', 'hablar', 'llamar', 'escribir', 'leer',
                    'escuchar', 'preguntar', 'responder'
                ],
                color: '#17a2b8'
            },
            'movement': {
                name: 'Bewegung',
                description: 'Verben fuer Bewegung und Reisen',
                priority: 4,
                verbs: [
                    'ir', 'venir', 'salir', 'caminar', 'correr',
                    'subir', 'bajar', 'entrar'
                ],
                color: '#28a745'
            },
            'daily-actions': {
                name: 'Taegliche Handlungen',
                description: 'Verben fuer alltaegliche Aktivitaeten',
                priority: 5,
                verbs: [
                    'hacer', 'tener', 'comer', 'beber', 'dormir',
                    'trabajar', 'estudiar', 'comprar', 'vender'
                ],
                color: '#6c757d'
            }
        };
    }

    /**
     * Get all pack names
     */
    getAllPackNames() {
        return Object.keys(this.packs);
    }

    /**
     * Get pack information
     */
    getPackInfo(packName) {
        return this.packs[packName] || null;
    }

    /**
     * Get verbs in pack
     */
    getVerbsInPack(packName) {
        const pack = this.packs[packName];
        return pack ? pack.verbs : [];
    }

    /**
     * Check if verb is in pack
     */
    isVerbInPack(infinitivo, packName) {
        const verbs = this.getVerbsInPack(packName);
        return verbs.includes(infinitivo);
    }

    /**
     * Get all packs a verb belongs to
     */
    getPacksForVerb(infinitivo) {
        const result = [];
        
        for (const [packName, pack] of Object.entries(this.packs)) {
            if (pack.verbs.includes(infinitivo)) {
                result.push({
                    name: packName,
                    displayName: pack.name,
                    priority: pack.priority
                });
            }
        }
        
        return result.sort((a, b) => a.priority - b.priority);
    }

    /**
     * Filter verb list by pack
     */
    filterVerbsByPack(verbList, packName) {
        const packVerbs = this.getVerbsInPack(packName);
        
        return verbList.filter(verb => 
            packVerbs.includes(verb.infinitivo)
        );
    }

    /**
     * Filter verb list by multiple packs
     */
    filterVerbsByPacks(verbList, packNames) {
        const allPackVerbs = new Set();
        
        packNames.forEach(packName => {
            const packVerbs = this.getVerbsInPack(packName);
            packVerbs.forEach(v => allPackVerbs.add(v));
        });
        
        return verbList.filter(verb => 
            allPackVerbs.has(verb.infinitivo)
        );
    }

    /**
     * Get statistics for pack
     */
    getPackStats(packName, verbList) {
        const packVerbs = this.getVerbsInPack(packName);
        const availableVerbs = verbList.filter(v => packVerbs.includes(v.infinitivo));
        
        return {
            packName: packName,
            totalInPack: packVerbs.length,
            availableInList: availableVerbs.length,
            coverage: (availableVerbs.length / packVerbs.length) * 100,
            verbs: availableVerbs.map(v => v.infinitivo)
        };
    }

    /**
     * Generate pack overview
     */
    generatePackOverview(verbList) {
        const overview = {};
        
        for (const packName of this.getAllPackNames()) {
            overview[packName] = this.getPackStats(packName, verbList);
        }
        
        return overview;
    }

    /**
     * Validate pack coverage in verb list
     */
    validatePackCoverage(verbList) {
        const results = {
            totalPacks: this.getAllPackNames().length,
            fullyCovered: 0,
            partiallyCovered: 0,
            notCovered: 0,
            details: []
        };
        
        for (const packName of this.getAllPackNames()) {
            const stats = this.getPackStats(packName, verbList);
            
            let status;
            if (stats.coverage === 100) {
                status = 'full';
                results.fullyCovered++;
            } else if (stats.coverage > 0) {
                status = 'partial';
                results.partiallyCovered++;
            } else {
                status = 'none';
                results.notCovered++;
            }
            
            results.details.push({
                pack: packName,
                status: status,
                coverage: stats.coverage,
                available: stats.availableInList,
                total: stats.totalInPack
            });
        }
        
        return results;
    }

    /**
     * Generate exercises from pack
     */
    generatePackExercises(packName, verbList, count = 100, options = {}) {
        const packVerbs = this.filterVerbsByPack(verbList, packName);
        
        if (packVerbs.length === 0) {
            throw new Error(`No verbs available for pack: ${packName}`);
        }
        
        const exercises = [];
        const tiempos = options.tiempos || ['presente', 'preterito', 'imperfecto', 'futuro', 'perfecto'];
        const personas = options.personas || ['yo', 'tu', 'el', 'nosotros', 'vosotros', 'ellos'];
        
        for (let i = 0; i < count; i++) {
            // Random verb from pack
            const verb = packVerbs[Math.floor(Math.random() * packVerbs.length)];
            
            // Random tense and person
            const tiempo = tiempos[Math.floor(Math.random() * tiempos.length)];
            const persona = personas[Math.floor(Math.random() * personas.length)];
            
            exercises.push({
                infinitivo: verb.infinitivo,
                tiempo: tiempo,
                persona: persona,
                pack: packName,
                verb: verb
            });
        }
        
        return exercises;
    }

    /**
     * Create pack selector UI
     */
    createPackSelectorHTML() {
        let html = '<div class="pack-selector">';
        html += '<h3>Verb-Packs auswaehlen:</h3>';
        html += '<div class="pack-list">';
        
        for (const [packName, pack] of Object.entries(this.packs)) {
            html += `
                <div class="pack-item" data-pack="${packName}">
                    <input type="checkbox" id="pack-${packName}" value="${packName}">
                    <label for="pack-${packName}">
                        <span class="pack-color" style="background: ${pack.color}"></span>
                        <span class="pack-name">${pack.name}</span>
                        <span class="pack-count">(${pack.verbs.length} Verben)</span>
                    </label>
                    <div class="pack-description">${pack.description}</div>
                </div>
            `;
        }
        
        html += '</div>';
        html += '<button id="apply-pack-filter" class="btn btn-primary">Filter anwenden</button>';
        html += '</div>';
        
        return html;
    }

    /**
     * Get CSS for pack system
     */
    static getCSS() {
        return `
            .pack-selector {
                padding: 20px;
                background: #f8f9fa;
                border-radius: 8px;
                margin: 20px 0;
            }
            
            .pack-selector h3 {
                margin-bottom: 15px;
                color: #333;
            }
            
            .pack-list {
                display: grid;
                gap: 15px;
            }
            
            .pack-item {
                background: white;
                padding: 15px;
                border-radius: 6px;
                border: 2px solid #e9ecef;
                transition: all 0.3s ease;
            }
            
            .pack-item:hover {
                border-color: #667eea;
                box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
            }
            
            .pack-item label {
                display: flex;
                align-items: center;
                gap: 10px;
                cursor: pointer;
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            .pack-color {
                display: inline-block;
                width: 20px;
                height: 20px;
                border-radius: 50%;
            }
            
            .pack-name {
                flex: 1;
            }
            
            .pack-count {
                color: #666;
                font-size: 0.9em;
            }
            
            .pack-description {
                margin-left: 30px;
                color: #666;
                font-size: 0.9em;
            }
            
            .pack-item input[type="checkbox"]:checked ~ label {
                color: #667eea;
            }
            
            #apply-pack-filter {
                margin-top: 20px;
                width: 100%;
            }
            
            .pack-badge {
                display: inline-block;
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 0.8em;
                font-weight: bold;
                color: white;
                margin: 2px;
            }
        `;
    }
}

// Export for use
if (typeof window !== 'undefined') {
    window.VerbPackSystem = VerbPackSystem;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = VerbPackSystem;
}
