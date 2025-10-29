/**
 * Vocabulary Database - Categorized Spanish Vocabulary
 *
 * Organized by:
 * - Verbs (conjugations, categories)
 * - Nouns (categories, gender)
 * - Adjectives (common, emotions, descriptions)
 * - Places, Countries, etc.
 */

class VocabularyDatabase {
    constructor() {
        this.data = {
            // Core verbs with conjugations
            verbs: {
                ser: {
                    infinitive: 'ser',
                    english: 'to be (permanent)',
                    german: 'sein (dauerhaft)',
                    type: 'irregular',
                    present: {
                        yo: 'soy',
                        tu: 'eres',
                        el: 'es',
                        nosotros: 'somos',
                        vosotros: 'sois',
                        ellos: 'son'
                    },
                    usage: 'DOCTOR',
                    difficulty: 1
                },
                estar: {
                    infinitive: 'estar',
                    english: 'to be (temporary)',
                    german: 'sein (vorübergehend)',
                    type: 'irregular',
                    present: {
                        yo: 'estoy',
                        tu: 'estás',
                        el: 'está',
                        nosotros: 'estamos',
                        vosotros: 'estáis',
                        ellos: 'están'
                    },
                    usage: 'LECH',
                    difficulty: 1
                },
                tener: {
                    infinitive: 'tener',
                    english: 'to have',
                    german: 'haben',
                    type: 'irregular',
                    present: {
                        yo: 'tengo',
                        tu: 'tienes',
                        el: 'tiene',
                        nosotros: 'tenemos',
                        vosotros: 'tenéis',
                        ellos: 'tienen'
                    },
                    usage: 'possession, age, expressions',
                    difficulty: 1
                },
                hacer: {
                    infinitive: 'hacer',
                    english: 'to do/make',
                    german: 'machen',
                    type: 'irregular',
                    present: {
                        yo: 'hago',
                        tu: 'haces',
                        el: 'hace',
                        nosotros: 'hacemos',
                        vosotros: 'hacéis',
                        ellos: 'hacen'
                    },
                    difficulty: 2
                },
                ir: {
                    infinitive: 'ir',
                    english: 'to go',
                    german: 'gehen',
                    type: 'irregular',
                    present: {
                        yo: 'voy',
                        tu: 'vas',
                        el: 'va',
                        nosotros: 'vamos',
                        vosotros: 'vais',
                        ellos: 'van'
                    },
                    difficulty: 2
                },
                hablar: {
                    infinitive: 'hablar',
                    english: 'to speak',
                    german: 'sprechen',
                    type: 'regular-ar',
                    present: {
                        yo: 'hablo',
                        tu: 'hablas',
                        el: 'habla',
                        nosotros: 'hablamos',
                        vosotros: 'habláis',
                        ellos: 'hablan'
                    },
                    difficulty: 1
                },
                comer: {
                    infinitive: 'comer',
                    english: 'to eat',
                    german: 'essen',
                    type: 'regular-er',
                    present: {
                        yo: 'como',
                        tu: 'comes',
                        el: 'come',
                        nosotros: 'comemos',
                        vosotros: 'coméis',
                        ellos: 'comen'
                    },
                    difficulty: 1
                },
                vivir: {
                    infinitive: 'vivir',
                    english: 'to live',
                    german: 'leben/wohnen',
                    type: 'regular-ir',
                    present: {
                        yo: 'vivo',
                        tu: 'vives',
                        el: 'vive',
                        nosotros: 'vivimos',
                        vosotros: 'vivís',
                        ellos: 'viven'
                    },
                    difficulty: 1
                }
            },

            // Nouns by category
            nouns: {
                food: [
                    { es: 'manzana', de: 'Apfel', en: 'apple', gender: 'f', emoji: '🍎', difficulty: 1 },
                    { es: 'naranja', de: 'Orange', en: 'orange', gender: 'f', emoji: '🍊', difficulty: 1 },
                    { es: 'plátano', de: 'Banane', en: 'banana', gender: 'm', emoji: '🍌', difficulty: 1 },
                    { es: 'pan', de: 'Brot', en: 'bread', gender: 'm', emoji: '🍞', difficulty: 1 },
                    { es: 'agua', de: 'Wasser', en: 'water', gender: 'f', emoji: '💧', difficulty: 1 },
                    { es: 'café', de: 'Kaffee', en: 'coffee', gender: 'm', emoji: '☕', difficulty: 1 },
                    { es: 'pizza', de: 'Pizza', en: 'pizza', gender: 'f', emoji: '🍕', difficulty: 1 },
                    { es: 'hamburguesa', de: 'Hamburger', en: 'hamburger', gender: 'f', emoji: '🍔', difficulty: 2 },
                    { es: 'helado', de: 'Eis', en: 'ice cream', gender: 'm', emoji: '🍦', difficulty: 1 },
                    { es: 'chocolate', de: 'Schokolade', en: 'chocolate', gender: 'm', emoji: '🍫', difficulty: 1 }
                ],
                places: [
                    { es: 'casa', de: 'Haus', en: 'house', gender: 'f', emoji: '🏠', difficulty: 1 },
                    { es: 'escuela', de: 'Schule', en: 'school', gender: 'f', emoji: '🏫', difficulty: 1 },
                    { es: 'restaurante', de: 'Restaurant', en: 'restaurant', gender: 'm', emoji: '🍽️', difficulty: 1 },
                    { es: 'hospital', de: 'Krankenhaus', en: 'hospital', gender: 'm', emoji: '🏥', difficulty: 1 },
                    { es: 'parque', de: 'Park', en: 'park', gender: 'm', emoji: '🌳', difficulty: 1 },
                    { es: 'playa', de: 'Strand', en: 'beach', gender: 'f', emoji: '🏖️', difficulty: 1 },
                    { es: 'ciudad', de: 'Stadt', en: 'city', gender: 'f', emoji: '🏙️', difficulty: 1 },
                    { es: 'biblioteca', de: 'Bibliothek', en: 'library', gender: 'f', emoji: '📚', difficulty: 2 }
                ],
                people: [
                    { es: 'estudiante', de: 'Student', en: 'student', gender: 'm/f', emoji: '🎓', difficulty: 1 },
                    { es: 'profesor', de: 'Lehrer', en: 'teacher', gender: 'm', emoji: '👨‍🏫', difficulty: 1 },
                    { es: 'profesora', de: 'Lehrerin', en: 'teacher', gender: 'f', emoji: '👩‍🏫', difficulty: 1 },
                    { es: 'médico', de: 'Arzt', en: 'doctor', gender: 'm', emoji: '👨‍⚕️', difficulty: 1 },
                    { es: 'amigo', de: 'Freund', en: 'friend', gender: 'm', emoji: '👦', difficulty: 1 },
                    { es: 'amiga', de: 'Freundin', en: 'friend', gender: 'f', emoji: '👧', difficulty: 1 },
                    { es: 'hermano', de: 'Bruder', en: 'brother', gender: 'm', emoji: '👦', difficulty: 1 },
                    { es: 'hermana', de: 'Schwester', en: 'sister', gender: 'f', emoji: '👧', difficulty: 1 }
                ],
                animals: [
                    { es: 'perro', de: 'Hund', en: 'dog', gender: 'm', emoji: '🐕', difficulty: 1 },
                    { es: 'gato', de: 'Katze', en: 'cat', gender: 'm', emoji: '🐈', difficulty: 1 },
                    { es: 'pájaro', de: 'Vogel', en: 'bird', gender: 'm', emoji: '🐦', difficulty: 1 },
                    { es: 'pez', de: 'Fisch', en: 'fish', gender: 'm', emoji: '🐟', difficulty: 1 },
                    { es: 'caballo', de: 'Pferd', en: 'horse', gender: 'm', emoji: '🐴', difficulty: 2 },
                    { es: 'elefante', de: 'Elefant', en: 'elephant', gender: 'm', emoji: '🐘', difficulty: 2 }
                ]
            },

            // Adjectives
            adjectives: {
                emotions: [
                    { es: 'feliz', de: 'glücklich', en: 'happy', emoji: '😊', difficulty: 1 },
                    { es: 'triste', de: 'traurig', en: 'sad', emoji: '😢', difficulty: 1 },
                    { es: 'cansado', de: 'müde', en: 'tired', gender: 'm', emoji: '😴', difficulty: 1 },
                    { es: 'cansada', de: 'müde', en: 'tired', gender: 'f', emoji: '😴', difficulty: 1 },
                    { es: 'enojado', de: 'wütend', en: 'angry', gender: 'm', emoji: '😠', difficulty: 2 },
                    { es: 'contento', de: 'zufrieden', en: 'content', gender: 'm', emoji: '😌', difficulty: 2 }
                ],
                descriptions: [
                    { es: 'grande', de: 'groß', en: 'big', emoji: '📏', difficulty: 1 },
                    { es: 'pequeño', de: 'klein', en: 'small', gender: 'm', emoji: '🔬', difficulty: 1 },
                    { es: 'bueno', de: 'gut', en: 'good', gender: 'm', emoji: '👍', difficulty: 1 },
                    { es: 'malo', de: 'schlecht', en: 'bad', gender: 'm', emoji: '👎', difficulty: 1 },
                    { es: 'nuevo', de: 'neu', en: 'new', gender: 'm', emoji: '✨', difficulty: 1 },
                    { es: 'viejo', de: 'alt', en: 'old', gender: 'm', emoji: '⏳', difficulty: 1 },
                    { es: 'joven', de: 'jung', en: 'young', emoji: '👶', difficulty: 1 },
                    { es: 'hermoso', de: 'schön', en: 'beautiful', gender: 'm', emoji: '🌟', difficulty: 2 }
                ],
                colors: [
                    { es: 'rojo', de: 'rot', en: 'red', gender: 'm', emoji: '🔴', difficulty: 1 },
                    { es: 'azul', de: 'blau', en: 'blue', emoji: '🔵', difficulty: 1 },
                    { es: 'verde', de: 'grün', en: 'green', emoji: '🟢', difficulty: 1 },
                    { es: 'amarillo', de: 'gelb', en: 'yellow', gender: 'm', emoji: '🟡', difficulty: 1 },
                    { es: 'negro', de: 'schwarz', en: 'black', gender: 'm', emoji: '⚫', difficulty: 1 },
                    { es: 'blanco', de: 'weiß', en: 'white', gender: 'm', emoji: '⚪', difficulty: 1 }
                ]
            },

            // Countries and cities
            geography: {
                countries: [
                    { es: 'España', de: 'Spanien', en: 'Spain', emoji: '🇪🇸', difficulty: 1 },
                    { es: 'Alemania', de: 'Deutschland', en: 'Germany', emoji: '🇩🇪', difficulty: 1 },
                    { es: 'Francia', de: 'Frankreich', en: 'France', emoji: '🇫🇷', difficulty: 1 },
                    { es: 'México', de: 'Mexiko', en: 'Mexico', emoji: '🇲🇽', difficulty: 1 },
                    { es: 'Argentina', de: 'Argentinien', en: 'Argentina', emoji: '🇦🇷', difficulty: 2 },
                    { es: 'Italia', de: 'Italien', en: 'Italy', emoji: '🇮🇹', difficulty: 1 }
                ],
                cities: [
                    { es: 'Madrid', de: 'Madrid', en: 'Madrid', country: 'España', difficulty: 1 },
                    { es: 'Barcelona', de: 'Barcelona', en: 'Barcelona', country: 'España', difficulty: 1 },
                    { es: 'Berlín', de: 'Berlin', en: 'Berlin', country: 'Alemania', difficulty: 1 },
                    { es: 'París', de: 'Paris', en: 'Paris', country: 'Francia', difficulty: 1 },
                    { es: 'Roma', de: 'Rom', en: 'Rome', country: 'Italia', difficulty: 1 }
                ]
            },

            // Numbers
            numbers: [
                { es: 'uno', de: 'eins', en: 'one', value: 1, difficulty: 1 },
                { es: 'dos', de: 'zwei', en: 'two', value: 2, difficulty: 1 },
                { es: 'tres', de: 'drei', en: 'three', value: 3, difficulty: 1 },
                { es: 'cuatro', de: 'vier', en: 'four', value: 4, difficulty: 1 },
                { es: 'cinco', de: 'fünf', en: 'five', value: 5, difficulty: 1 },
                { es: 'diez', de: 'zehn', en: 'ten', value: 10, difficulty: 1 },
                { es: 'veinte', de: 'zwanzig', en: 'twenty', value: 20, difficulty: 1 },
                { es: 'cien', de: 'hundert', en: 'hundred', value: 100, difficulty: 2 }
            ]
        };
    }

    /**
     * Get vocabulary by category and difficulty
     */
    getByCategory(category, subcategory = null, maxDifficulty = 3) {
        if (subcategory) {
            const items = this.data[category]?.[subcategory] || [];
            return items.filter(item => item.difficulty <= maxDifficulty);
        }
        return this.data[category] || [];
    }

    /**
     * Get random items from a category
     */
    getRandomFrom(category, subcategory, count = 1, maxDifficulty = 3) {
        const items = this.getByCategory(category, subcategory, maxDifficulty);
        return this.shuffleArray(items).slice(0, count);
    }

    /**
     * Get items with emoji
     */
    getWithEmoji(maxDifficulty = 3) {
        const result = [];

        // Collect all items with emoji
        for (const category in this.data.nouns) {
            const items = this.data.nouns[category];
            items.forEach(item => {
                if (item.emoji && item.difficulty <= maxDifficulty) {
                    result.push({ ...item, category: 'nouns.' + category });
                }
            });
        }

        for (const category in this.data.adjectives) {
            const items = this.data.adjectives[category];
            items.forEach(item => {
                if (item.emoji && item.difficulty <= maxDifficulty) {
                    result.push({ ...item, category: 'adjectives.' + category });
                }
            });
        }

        return result;
    }

    /**
     * Search for a specific word
     */
    search(query, language = 'es') {
        const results = [];
        const lowerQuery = query.toLowerCase();

        // Search in nouns
        for (const category in this.data.nouns) {
            this.data.nouns[category].forEach(item => {
                if (item[language]?.toLowerCase().includes(lowerQuery)) {
                    results.push({ ...item, type: 'noun', category });
                }
            });
        }

        // Search in adjectives
        for (const category in this.data.adjectives) {
            this.data.adjectives[category].forEach(item => {
                if (item[language]?.toLowerCase().includes(lowerQuery)) {
                    results.push({ ...item, type: 'adjective', category });
                }
            });
        }

        return results;
    }

    /**
     * Get verb conjugation
     */
    getVerb(infinitive, person = 'yo') {
        const verb = this.data.verbs[infinitive];
        if (!verb) return null;

        return {
            ...verb,
            conjugated: verb.present[person]
        };
    }

    /**
     * Shuffle array helper
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Get all categories
     */
    getCategories() {
        return {
            nouns: Object.keys(this.data.nouns),
            adjectives: Object.keys(this.data.adjectives),
            verbs: Object.keys(this.data.verbs),
            geography: Object.keys(this.data.geography)
        };
    }
}

// Export for browser and Node.js
if (typeof window !== 'undefined') {
    window.VocabularyDatabase = VocabularyDatabase;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VocabularyDatabase };
}
