/**
 * Emoji Vocabulary Database
 * Maps Spanish words to emojis and German translations
 * Used for progressive hint system
 */

class EmojiVocabulary {
    constructor() {
        this.vocabulary = {
            // Food / Comida
            'manzana': { emoji: '🍎', german: 'Apfel', category: 'food' },
            'naranja': { emoji: '🍊', german: 'Orange', category: 'food' },
            'plátano': { emoji: '🍌', german: 'Banane', category: 'food' },
            'pan': { emoji: '🍞', german: 'Brot', category: 'food' },
            'agua': { emoji: '💧', german: 'Wasser', category: 'food' },
            'café': { emoji: '☕', german: 'Kaffee', category: 'food' },
            'pizza': { emoji: '🍕', german: 'Pizza', category: 'food' },
            'hamburguesa': { emoji: '🍔', german: 'Hamburger', category: 'food' },
            'helado': { emoji: '🍦', german: 'Eis', category: 'food' },
            'chocolate': { emoji: '🍫', german: 'Schokolade', category: 'food' },
            'leche': { emoji: '🥛', german: 'Milch', category: 'food' },
            'té': { emoji: '🍵', german: 'Tee', category: 'food' },
            'queso': { emoji: '🧀', german: 'Käse', category: 'food' },
            'huevo': { emoji: '🥚', german: 'Ei', category: 'food' },
            'arroz': { emoji: '🍚', german: 'Reis', category: 'food' },
            'pasta': { emoji: '🍝', german: 'Nudeln', category: 'food' },
            'sopa': { emoji: '🍲', german: 'Suppe', category: 'food' },
            'ensalada': { emoji: '🥗', german: 'Salat', category: 'food' },
            'pollo': { emoji: '🍗', german: 'Huhn', category: 'food' },
            'carne': { emoji: '🥩', german: 'Fleisch', category: 'food' },
            'pescado': { emoji: '🐟', german: 'Fisch', category: 'food' },
            'tomate': { emoji: '🍅', german: 'Tomate', category: 'food' },
            'patata': { emoji: '🥔', german: 'Kartoffel', category: 'food' },
            'zanahoria': { emoji: '🥕', german: 'Karotte', category: 'food' },
            'lechuga': { emoji: '🥬', german: 'Kopfsalat', category: 'food' },
            'cebolla': { emoji: '🧅', german: 'Zwiebel', category: 'food' },
            'ajo': { emoji: '🧄', german: 'Knoblauch', category: 'food' },
            'fresa': { emoji: '🍓', german: 'Erdbeere', category: 'food' },
            'uva': { emoji: '🍇', german: 'Traube', category: 'food' },
            'sandía': { emoji: '🍉', german: 'Wassermelone', category: 'food' },
            'limón': { emoji: '🍋', german: 'Zitrone', category: 'food' },
            'pera': { emoji: '🍐', german: 'Birne', category: 'food' },
            'durazno': { emoji: '🍑', german: 'Pfirsich', category: 'food' },
            'cerezas': { emoji: '🍒', german: 'Kirschen', category: 'food' },
            'piña': { emoji: '🍍', german: 'Ananas', category: 'food' },
            'mango': { emoji: '🥭', german: 'Mango', category: 'food' },
            'aguacate': { emoji: '🥑', german: 'Avocado', category: 'food' },
            'pepino': { emoji: '🥒', german: 'Gurke', category: 'food' },

            // Places / Lugares
            'casa': { emoji: '🏠', german: 'Haus', category: 'places' },
            'escuela': { emoji: '🏫', german: 'Schule', category: 'places' },
            'restaurante': { emoji: '🍽️', german: 'Restaurant', category: 'places' },
            'hospital': { emoji: '🏥', german: 'Krankenhaus', category: 'places' },
            'parque': { emoji: '🌳', german: 'Park', category: 'places' },
            'playa': { emoji: '🏖️', german: 'Strand', category: 'places' },
            'ciudad': { emoji: '🏙️', german: 'Stadt', category: 'places' },
            'biblioteca': { emoji: '📚', german: 'Bibliothek', category: 'places' },
            'oficina': { emoji: '🏢', german: 'Büro', category: 'places' },
            'banco': { emoji: '🏦', german: 'Bank', category: 'places' },
            'supermercado': { emoji: '🛒', german: 'Supermarkt', category: 'places' },
            'tienda': { emoji: '🏪', german: 'Laden', category: 'places' },
            'aeropuerto': { emoji: '✈️', german: 'Flughafen', category: 'places' },
            'estación': { emoji: '🚉', german: 'Bahnhof', category: 'places' },
            'hotel': { emoji: '🏨', german: 'Hotel', category: 'places' },
            'museo': { emoji: '🏛️', german: 'Museum', category: 'places' },
            'teatro': { emoji: '🎭', german: 'Theater', category: 'places' },
            'cine': { emoji: '🎬', german: 'Kino', category: 'places' },
            'iglesia': { emoji: '⛪', german: 'Kirche', category: 'places' },
            'montaña': { emoji: '⛰️', german: 'Berg', category: 'places' },
            'campo': { emoji: '🌾', german: 'Feld', category: 'places' },
            'jardín': { emoji: '🪴', german: 'Garten', category: 'places' },
            'universidad': { emoji: '🎓', german: 'Universität', category: 'places' },
            'farmacia': { emoji: '💊', german: 'Apotheke', category: 'places' },
            'gimnasio': { emoji: '💪', german: 'Fitnessstudio', category: 'places' },
            'piscina': { emoji: '🏊', german: 'Schwimmbad', category: 'places' },
            'estadio': { emoji: '🏟️', german: 'Stadion', category: 'places' },
            'calle': { emoji: '🛣️', german: 'Straße', category: 'places' },

            // People / Personas
            'estudiante': { emoji: '🎓', german: 'Student', category: 'people' },
            'profesor': { emoji: '👨‍🏫', german: 'Lehrer', category: 'people' },
            'médico': { emoji: '👨‍⚕️', german: 'Arzt', category: 'people' },
            'amigo': { emoji: '👦', german: 'Freund', category: 'people' },
            'hermano': { emoji: '👦', german: 'Bruder', category: 'people' },
            'hermana': { emoji: '👧', german: 'Schwester', category: 'people' },
            'madre': { emoji: '👩', german: 'Mutter', category: 'people' },
            'padre': { emoji: '👨', german: 'Vater', category: 'people' },
            'hijo': { emoji: '👶', german: 'Sohn', category: 'people' },
            'hija': { emoji: '👧', german: 'Tochter', category: 'people' },
            'abuelo': { emoji: '👴', german: 'Großvater', category: 'people' },
            'abuela': { emoji: '👵', german: 'Großmutter', category: 'people' },
            'tío': { emoji: '👨', german: 'Onkel', category: 'people' },
            'tía': { emoji: '👩', german: 'Tante', category: 'people' },
            'primo': { emoji: '👦', german: 'Cousin', category: 'people' },
            'niño': { emoji: '👶', german: 'Kind (Junge)', category: 'people' },
            'niña': { emoji: '👧', german: 'Kind (Mädchen)', category: 'people' },
            'hombre': { emoji: '👨', german: 'Mann', category: 'people' },
            'mujer': { emoji: '👩', german: 'Frau', category: 'people' },
            'bebé': { emoji: '👶', german: 'Baby', category: 'people' },
            'familia': { emoji: '👨‍👩‍👧‍👦', german: 'Familie', category: 'people' },
            'enfermera': { emoji: '👩‍⚕️', german: 'Krankenschwester', category: 'people' },
            'ingeniero': { emoji: '👷', german: 'Ingenieur', category: 'people' },
            'artista': { emoji: '🎨', german: 'Künstler', category: 'people' },
            'músico': { emoji: '🎵', german: 'Musiker', category: 'people' },

            // Animals / Animales
            'perro': { emoji: '🐕', german: 'Hund', category: 'animals' },
            'gato': { emoji: '🐈', german: 'Katze', category: 'animals' },
            'pájaro': { emoji: '🐦', german: 'Vogel', category: 'animals' },
            'pez': { emoji: '🐟', german: 'Fisch', category: 'animals' },
            'caballo': { emoji: '🐴', german: 'Pferd', category: 'animals' },
            'elefante': { emoji: '🐘', german: 'Elefant', category: 'animals' },
            'león': { emoji: '🦁', german: 'Löwe', category: 'animals' },
            'tigre': { emoji: '🐯', german: 'Tiger', category: 'animals' },
            'oso': { emoji: '🐻', german: 'Bär', category: 'animals' },
            'mono': { emoji: '🐒', german: 'Affe', category: 'animals' },
            'jirafa': { emoji: '🦒', german: 'Giraffe', category: 'animals' },
            'cebra': { emoji: '🦓', german: 'Zebra', category: 'animals' },
            'vaca': { emoji: '🐄', german: 'Kuh', category: 'animals' },
            'cerdo': { emoji: '🐷', german: 'Schwein', category: 'animals' },
            'oveja': { emoji: '🐑', german: 'Schaf', category: 'animals' },
            'conejo': { emoji: '🐰', german: 'Kaninchen', category: 'animals' },
            'ratón': { emoji: '🐭', german: 'Maus', category: 'animals' },
            'serpiente': { emoji: '🐍', german: 'Schlange', category: 'animals' },
            'tortuga': { emoji: '🐢', german: 'Schildkröte', category: 'animals' },
            'rana': { emoji: '🐸', german: 'Frosch', category: 'animals' },
            'mariposa': { emoji: '🦋', german: 'Schmetterling', category: 'animals' },
            'abeja': { emoji: '🐝', german: 'Biene', category: 'animals' },
            'hormiga': { emoji: '🐜', german: 'Ameise', category: 'animals' },
            'araña': { emoji: '🕷️', german: 'Spinne', category: 'animals' },
            'lobo': { emoji: '🐺', german: 'Wolf', category: 'animals' },
            'zorro': { emoji: '🦊', german: 'Fuchs', category: 'animals' },

            // Emotions / Emociones
            'feliz': { emoji: '😊', german: 'glücklich', category: 'emotions' },
            'triste': { emoji: '😢', german: 'traurig', category: 'emotions' },
            'cansado': { emoji: '😴', german: 'müde', category: 'emotions' },
            'enojado': { emoji: '😠', german: 'wütend', category: 'emotions' },
            'contento': { emoji: '😌', german: 'zufrieden', category: 'emotions' },
            'emocionado': { emoji: '🤩', german: 'aufgeregt', category: 'emotions' },
            'nervioso': { emoji: '😰', german: 'nervös', category: 'emotions' },
            'tranquilo': { emoji: '😌', german: 'ruhig', category: 'emotions' },
            'sorprendido': { emoji: '😲', german: 'überrascht', category: 'emotions' },
            'aburrido': { emoji: '😑', german: 'gelangweilt', category: 'emotions' },
            'asustado': { emoji: '😨', german: 'verängstigt', category: 'emotions' },
            'preocupado': { emoji: '😟', german: 'besorgt', category: 'emotions' },

            // Colors / Colores
            'rojo': { emoji: '🔴', german: 'rot', category: 'colors' },
            'azul': { emoji: '🔵', german: 'blau', category: 'colors' },
            'verde': { emoji: '🟢', german: 'grün', category: 'colors' },
            'amarillo': { emoji: '🟡', german: 'gelb', category: 'colors' },
            'negro': { emoji: '⚫', german: 'schwarz', category: 'colors' },
            'blanco': { emoji: '⚪', german: 'weiß', category: 'colors' },
            'naranja': { emoji: '🟠', german: 'orange', category: 'colors' },
            'morado': { emoji: '🟣', german: 'lila', category: 'colors' },
            'rosa': { emoji: '🌸', german: 'rosa', category: 'colors' },

            // Weather / Clima
            'sol': { emoji: '☀️', german: 'Sonne', category: 'weather' },
            'lluvia': { emoji: '🌧️', german: 'Regen', category: 'weather' },
            'nieve': { emoji: '❄️', german: 'Schnee', category: 'weather' },
            'nube': { emoji: '☁️', german: 'Wolke', category: 'weather' },
            'viento': { emoji: '💨', german: 'Wind', category: 'weather' },
            'tormenta': { emoji: '⛈️', german: 'Sturm', category: 'weather' },

            // Transportation / Transporte
            'coche': { emoji: '🚗', german: 'Auto', category: 'transport' },
            'autobús': { emoji: '🚌', german: 'Bus', category: 'transport' },
            'tren': { emoji: '🚆', german: 'Zug', category: 'transport' },
            'avión': { emoji: '✈️', german: 'Flugzeug', category: 'transport' },
            'barco': { emoji: '🚢', german: 'Schiff', category: 'transport' },
            'bicicleta': { emoji: '🚲', german: 'Fahrrad', category: 'transport' },
            'moto': { emoji: '🏍️', german: 'Motorrad', category: 'transport' },
            'taxi': { emoji: '🚕', german: 'Taxi', category: 'transport' },

            // Body Parts / Cuerpo
            'cabeza': { emoji: '👤', german: 'Kopf', category: 'body' },
            'ojo': { emoji: '👁️', german: 'Auge', category: 'body' },
            'nariz': { emoji: '👃', german: 'Nase', category: 'body' },
            'boca': { emoji: '👄', german: 'Mund', category: 'body' },
            'oreja': { emoji: '👂', german: 'Ohr', category: 'body' },
            'mano': { emoji: '✋', german: 'Hand', category: 'body' },
            'pie': { emoji: '🦶', german: 'Fuß', category: 'body' },
            'corazón': { emoji: '❤️', german: 'Herz', category: 'body' },

            // Actions/Verbs / Verbos
            'hablar': { emoji: '💬', german: 'sprechen', category: 'verbs' },
            'comer': { emoji: '🍽️', german: 'essen', category: 'verbs' },
            'beber': { emoji: '🥤', german: 'trinken', category: 'verbs' },
            'caminar': { emoji: '🚶', german: 'gehen', category: 'verbs' },
            'correr': { emoji: '🏃', german: 'laufen', category: 'verbs' },
            'dormir': { emoji: '😴', german: 'schlafen', category: 'verbs' },
            'trabajar': { emoji: '💼', german: 'arbeiten', category: 'verbs' },
            'estudiar': { emoji: '📚', german: 'lernen', category: 'verbs' },
            'leer': { emoji: '📖', german: 'lesen', category: 'verbs' },
            'escribir': { emoji: '✍️', german: 'schreiben', category: 'verbs' },
            'escuchar': { emoji: '👂', german: 'hören', category: 'verbs' },
            'ver': { emoji: '👀', german: 'sehen', category: 'verbs' },
            'pensar': { emoji: '🤔', german: 'denken', category: 'verbs' },
            'amar': { emoji: '💕', german: 'lieben', category: 'verbs' },
            'cocinar': { emoji: '🍳', german: 'kochen', category: 'verbs' },
            'limpiar': { emoji: '🧹', german: 'putzen', category: 'verbs' },
            'comprar': { emoji: '🛒', german: 'kaufen', category: 'verbs' },
            'bailar': { emoji: '💃', german: 'tanzen', category: 'verbs' },
            'cantar': { emoji: '🎤', german: 'singen', category: 'verbs' },
            'jugar': { emoji: '🎮', german: 'spielen', category: 'verbs' }
        };
    }

    /**
     * Get vocabulary entry by Spanish word
     */
    get(spanishWord) {
        const normalized = spanishWord.toLowerCase().trim();
        return this.vocabulary[normalized] || null;
    }

    /**
     * Check if word has emoji
     */
    hasEmoji(spanishWord) {
        return this.get(spanishWord) !== null;
    }

    /**
     * Get German translation
     */
    getGerman(spanishWord) {
        const entry = this.get(spanishWord);
        return entry ? entry.german : null;
    }

    /**
     * Get emoji
     */
    getEmoji(spanishWord) {
        const entry = this.get(spanishWord);
        return entry ? entry.emoji : null;
    }

    /**
     * Get full entry (emoji + german)
     */
    getEmojiWithGerman(spanishWord) {
        const entry = this.get(spanishWord);
        if (!entry) return null;
        return `${entry.emoji} ${entry.german}`;
    }

    /**
     * Search for words in question/sentence
     * Returns array of found vocabulary entries
     */
    findInText(text) {
        const found = [];
        const words = text.toLowerCase().split(/\s+/);

        words.forEach(word => {
            // Remove punctuation
            const cleaned = word.replace(/[.,!?;:()]/g, '');
            const entry = this.get(cleaned);
            if (entry) {
                found.push({
                    word: cleaned,
                    ...entry
                });
            }
        });

        return found;
    }

    /**
     * Get by category
     */
    getByCategory(category) {
        return Object.entries(this.vocabulary)
            .filter(([word, data]) => data.category === category)
            .map(([word, data]) => ({ word, ...data }));
    }
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.EmojiVocabulary = EmojiVocabulary;
}
