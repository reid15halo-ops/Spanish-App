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
                    { es: 'fresa', de: 'Erdbeere', en: 'strawberry', gender: 'f', emoji: '🍓', difficulty: 1 },
                    { es: 'uva', de: 'Traube', en: 'grape', gender: 'f', emoji: '🍇', difficulty: 1 },
                    { es: 'pera', de: 'Birne', en: 'pear', gender: 'f', emoji: '🍐', difficulty: 2 },
                    { es: 'sandía', de: 'Wassermelone', en: 'watermelon', gender: 'f', emoji: '🍉', difficulty: 2 },
                    { es: 'pan', de: 'Brot', en: 'bread', gender: 'm', emoji: '🍞', difficulty: 1 },
                    { es: 'queso', de: 'Käse', en: 'cheese', gender: 'm', emoji: '🧀', difficulty: 1 },
                    { es: 'leche', de: 'Milch', en: 'milk', gender: 'f', emoji: '🥛', difficulty: 1 },
                    { es: 'huevo', de: 'Ei', en: 'egg', gender: 'm', emoji: '🥚', difficulty: 1 },
                    { es: 'carne', de: 'Fleisch', en: 'meat', gender: 'f', emoji: '🥩', difficulty: 1 },
                    { es: 'pollo', de: 'Huhn', en: 'chicken', gender: 'm', emoji: '🍗', difficulty: 1 },
                    { es: 'pescado', de: 'Fisch', en: 'fish', gender: 'm', emoji: '🐟', difficulty: 1 },
                    { es: 'arroz', de: 'Reis', en: 'rice', gender: 'm', emoji: '🍚', difficulty: 1 },
                    { es: 'pasta', de: 'Nudeln', en: 'pasta', gender: 'f', emoji: '🍝', difficulty: 1 },
                    { es: 'ensalada', de: 'Salat', en: 'salad', gender: 'f', emoji: '🥗', difficulty: 1 },
                    { es: 'sopa', de: 'Suppe', en: 'soup', gender: 'f', emoji: '🍲', difficulty: 1 },
                    { es: 'agua', de: 'Wasser', en: 'water', gender: 'f', emoji: '💧', difficulty: 1 },
                    { es: 'café', de: 'Kaffee', en: 'coffee', gender: 'm', emoji: '☕', difficulty: 1 },
                    { es: 'té', de: 'Tee', en: 'tea', gender: 'm', emoji: '🍵', difficulty: 1 },
                    { es: 'zumo', de: 'Saft', en: 'juice', gender: 'm', emoji: '🧃', difficulty: 1 },
                    { es: 'vino', de: 'Wein', en: 'wine', gender: 'm', emoji: '🍷', difficulty: 2 },
                    { es: 'cerveza', de: 'Bier', en: 'beer', gender: 'f', emoji: '🍺', difficulty: 1 },
                    { es: 'pizza', de: 'Pizza', en: 'pizza', gender: 'f', emoji: '🍕', difficulty: 1 },
                    { es: 'hamburguesa', de: 'Hamburger', en: 'hamburger', gender: 'f', emoji: '🍔', difficulty: 2 },
                    { es: 'helado', de: 'Eis', en: 'ice cream', gender: 'm', emoji: '🍦', difficulty: 1 },
                    { es: 'chocolate', de: 'Schokolade', en: 'chocolate', gender: 'm', emoji: '🍫', difficulty: 1 },
                    { es: 'galleta', de: 'Keks', en: 'cookie', gender: 'f', emoji: '🍪', difficulty: 1 },
                    { es: 'pastel', de: 'Kuchen', en: 'cake', gender: 'm', emoji: '🍰', difficulty: 1 },
                    { es: 'tomate', de: 'Tomate', en: 'tomato', gender: 'm', emoji: '🍅', difficulty: 1 },
                    { es: 'patata', de: 'Kartoffel', en: 'potato', gender: 'f', emoji: '🥔', difficulty: 1 },
                    { es: 'zanahoria', de: 'Karotte', en: 'carrot', gender: 'f', emoji: '🥕', difficulty: 2 }
                ],
                places: [
                    { es: 'casa', de: 'Haus', en: 'house', gender: 'f', emoji: '🏠', difficulty: 1 },
                    { es: 'escuela', de: 'Schule', en: 'school', gender: 'f', emoji: '🏫', difficulty: 1 },
                    { es: 'restaurante', de: 'Restaurant', en: 'restaurant', gender: 'm', emoji: '🍽️', difficulty: 1 },
                    { es: 'hospital', de: 'Krankenhaus', en: 'hospital', gender: 'm', emoji: '🏥', difficulty: 1 },
                    { es: 'parque', de: 'Park', en: 'park', gender: 'm', emoji: '🌳', difficulty: 1 },
                    { es: 'playa', de: 'Strand', en: 'beach', gender: 'f', emoji: '🏖️', difficulty: 1 },
                    { es: 'ciudad', de: 'Stadt', en: 'city', gender: 'f', emoji: '🏙️', difficulty: 1 },
                    { es: 'biblioteca', de: 'Bibliothek', en: 'library', gender: 'f', emoji: '📚', difficulty: 2 },
                    { es: 'oficina', de: 'Büro', en: 'office', gender: 'f', emoji: '🏢', difficulty: 1 },
                    { es: 'supermercado', de: 'Supermarkt', en: 'supermarket', gender: 'm', emoji: '🛒', difficulty: 2 },
                    { es: 'aeropuerto', de: 'Flughafen', en: 'airport', gender: 'm', emoji: '✈️', difficulty: 2 },
                    { es: 'estación', de: 'Bahnhof', en: 'station', gender: 'f', emoji: '🚉', difficulty: 2 },
                    { es: 'cine', de: 'Kino', en: 'cinema', gender: 'm', emoji: '🎬', difficulty: 1 },
                    { es: 'teatro', de: 'Theater', en: 'theater', gender: 'm', emoji: '🎭', difficulty: 2 },
                    { es: 'museo', de: 'Museum', en: 'museum', gender: 'm', emoji: '🏛️', difficulty: 2 },
                    { es: 'hotel', de: 'Hotel', en: 'hotel', gender: 'm', emoji: '🏨', difficulty: 1 },
                    { es: 'banco', de: 'Bank', en: 'bank', gender: 'm', emoji: '🏦', difficulty: 2 },
                    { es: 'iglesia', de: 'Kirche', en: 'church', gender: 'f', emoji: '⛪', difficulty: 2 },
                    { es: 'mercado', de: 'Markt', en: 'market', gender: 'm', emoji: '🛍️', difficulty: 1 },
                    { es: 'farmacia', de: 'Apotheke', en: 'pharmacy', gender: 'f', emoji: '💊', difficulty: 2 },
                    { es: 'café', de: 'Café', en: 'café', gender: 'm', emoji: '☕', difficulty: 1 },
                    { es: 'bar', de: 'Bar', en: 'bar', gender: 'm', emoji: '🍺', difficulty: 1 },
                    { es: 'gimnasio', de: 'Fitnessstudio', en: 'gym', gender: 'm', emoji: '🏋️', difficulty: 2 },
                    { es: 'piscina', de: 'Schwimmbad', en: 'pool', gender: 'f', emoji: '🏊', difficulty: 2 },
                    { es: 'montaña', de: 'Berg', en: 'mountain', gender: 'f', emoji: '⛰️', difficulty: 2 }
                ],
                people: [
                    { es: 'estudiante', de: 'Student', en: 'student', gender: 'm/f', emoji: '🎓', difficulty: 1 },
                    { es: 'profesor', de: 'Lehrer', en: 'teacher', gender: 'm', emoji: '👨‍🏫', difficulty: 1 },
                    { es: 'profesora', de: 'Lehrerin', en: 'teacher', gender: 'f', emoji: '👩‍🏫', difficulty: 1 },
                    { es: 'médico', de: 'Arzt', en: 'doctor', gender: 'm', emoji: '👨‍⚕️', difficulty: 1 },
                    { es: 'médica', de: 'Ärztin', en: 'doctor', gender: 'f', emoji: '👩‍⚕️', difficulty: 1 },
                    { es: 'enfermero', de: 'Krankenpfleger', en: 'nurse', gender: 'm', emoji: '👨‍⚕️', difficulty: 2 },
                    { es: 'enfermera', de: 'Krankenschwester', en: 'nurse', gender: 'f', emoji: '👩‍⚕️', difficulty: 2 },
                    { es: 'ingeniero', de: 'Ingenieur', en: 'engineer', gender: 'm', emoji: '👨‍🔧', difficulty: 2 },
                    { es: 'ingeniera', de: 'Ingenieurin', en: 'engineer', gender: 'f', emoji: '👩‍🔧', difficulty: 2 },
                    { es: 'abogado', de: 'Anwalt', en: 'lawyer', gender: 'm', emoji: '👨‍⚖️', difficulty: 2 },
                    { es: 'abogada', de: 'Anwältin', en: 'lawyer', gender: 'f', emoji: '👩‍⚖️', difficulty: 2 },
                    { es: 'cocinero', de: 'Koch', en: 'cook', gender: 'm', emoji: '👨‍🍳', difficulty: 2 },
                    { es: 'cocinera', de: 'Köchin', en: 'cook', gender: 'f', emoji: '👩‍🍳', difficulty: 2 },
                    { es: 'policía', de: 'Polizist', en: 'police officer', gender: 'm/f', emoji: '👮', difficulty: 1 },
                    { es: 'bombero', de: 'Feuerwehrmann', en: 'firefighter', gender: 'm', emoji: '👨‍🚒', difficulty: 2 },
                    { es: 'bombera', de: 'Feuerwehrfrau', en: 'firefighter', gender: 'f', emoji: '👩‍🚒', difficulty: 2 },
                    { es: 'arquitecto', de: 'Architekt', en: 'architect', gender: 'm', emoji: '👨‍💼', difficulty: 3 },
                    { es: 'arquitecta', de: 'Architektin', en: 'architect', gender: 'f', emoji: '👩‍💼', difficulty: 3 },
                    { es: 'programador', de: 'Programmierer', en: 'programmer', gender: 'm', emoji: '👨‍💻', difficulty: 2 },
                    { es: 'programadora', de: 'Programmiererin', en: 'programmer', gender: 'f', emoji: '👩‍💻', difficulty: 2 },
                    { es: 'artista', de: 'Künstler', en: 'artist', gender: 'm/f', emoji: '🎨', difficulty: 2 },
                    { es: 'músico', de: 'Musiker', en: 'musician', gender: 'm', emoji: '🎵', difficulty: 2 },
                    { es: 'músíca', de: 'Musikerin', en: 'musician', gender: 'f', emoji: '🎵', difficulty: 2 },
                    { es: 'amigo', de: 'Freund', en: 'friend', gender: 'm', emoji: '👦', difficulty: 1 },
                    { es: 'amiga', de: 'Freundin', en: 'friend', gender: 'f', emoji: '👧', difficulty: 1 },
                    { es: 'hermano', de: 'Bruder', en: 'brother', gender: 'm', emoji: '👦', difficulty: 1 },
                    { es: 'hermana', de: 'Schwester', en: 'sister', gender: 'f', emoji: '👧', difficulty: 1 },
                    { es: 'padre', de: 'Vater', en: 'father', gender: 'm', emoji: '👨', difficulty: 1 },
                    { es: 'madre', de: 'Mutter', en: 'mother', gender: 'f', emoji: '👩', difficulty: 1 },
                    { es: 'hijo', de: 'Sohn', en: 'son', gender: 'm', emoji: '👦', difficulty: 1 },
                    { es: 'hija', de: 'Tochter', en: 'daughter', gender: 'f', emoji: '👧', difficulty: 1 }
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
                    { es: 'enfermo', de: 'krank', en: 'sick', gender: 'm', emoji: '🤒', difficulty: 1 },
                    { es: 'enferma', de: 'krank', en: 'sick', gender: 'f', emoji: '🤒', difficulty: 1 },
                    { es: 'enojado', de: 'wütend', en: 'angry', gender: 'm', emoji: '😠', difficulty: 2 },
                    { es: 'enojada', de: 'wütend', en: 'angry', gender: 'f', emoji: '😠', difficulty: 2 },
                    { es: 'contento', de: 'zufrieden', en: 'content', gender: 'm', emoji: '😌', difficulty: 2 },
                    { es: 'contenta', de: 'zufrieden', en: 'content', gender: 'f', emoji: '😌', difficulty: 2 },
                    { es: 'nervioso', de: 'nervös', en: 'nervous', gender: 'm', emoji: '😰', difficulty: 2 },
                    { es: 'nerviosa', de: 'nervös', en: 'nervous', gender: 'f', emoji: '😰', difficulty: 2 },
                    { es: 'preocupado', de: 'besorgt', en: 'worried', gender: 'm', emoji: '😟', difficulty: 2 },
                    { es: 'preocupada', de: 'besorgt', en: 'worried', gender: 'f', emoji: '😟', difficulty: 2 },
                    { es: 'aburrido', de: 'gelangweilt', en: 'bored', gender: 'm', emoji: '😑', difficulty: 2 },
                    { es: 'aburrida', de: 'gelangweilt', en: 'bored', gender: 'f', emoji: '😑', difficulty: 2 },
                    { es: 'emocionado', de: 'aufgeregt', en: 'excited', gender: 'm', emoji: '🤩', difficulty: 2 },
                    { es: 'emocionada', de: 'aufgeregt', en: 'excited', gender: 'f', emoji: '🤩', difficulty: 2 },
                    { es: 'enfadado', de: 'verärgert', en: 'annoyed', gender: 'm', emoji: '😤', difficulty: 2 },
                    { es: 'enfadada', de: 'verärgert', en: 'annoyed', gender: 'f', emoji: '😤', difficulty: 2 },
                    { es: 'tranquilo', de: 'ruhig', en: 'calm', gender: 'm', emoji: '😌', difficulty: 2 },
                    { es: 'tranquila', de: 'ruhig', en: 'calm', gender: 'f', emoji: '😌', difficulty: 2 },
                    { es: 'sorprendido', de: 'überrascht', en: 'surprised', gender: 'm', emoji: '😲', difficulty: 2 },
                    { es: 'sorprendida', de: 'überrascht', en: 'surprised', gender: 'f', emoji: '😲', difficulty: 2 }
                ],
                descriptions: [
                    { es: 'grande', de: 'groß', en: 'big', emoji: '📏', difficulty: 1 },
                    { es: 'pequeño', de: 'klein', en: 'small', gender: 'm', emoji: '🔬', difficulty: 1 },
                    { es: 'pequeña', de: 'klein', en: 'small', gender: 'f', emoji: '🔬', difficulty: 1 },
                    { es: 'bueno', de: 'gut', en: 'good', gender: 'm', emoji: '👍', difficulty: 1 },
                    { es: 'buena', de: 'gut', en: 'good', gender: 'f', emoji: '👍', difficulty: 1 },
                    { es: 'malo', de: 'schlecht', en: 'bad', gender: 'm', emoji: '👎', difficulty: 1 },
                    { es: 'mala', de: 'schlecht', en: 'bad', gender: 'f', emoji: '👎', difficulty: 1 },
                    { es: 'nuevo', de: 'neu', en: 'new', gender: 'm', emoji: '✨', difficulty: 1 },
                    { es: 'nueva', de: 'neu', en: 'new', gender: 'f', emoji: '✨', difficulty: 1 },
                    { es: 'viejo', de: 'alt', en: 'old', gender: 'm', emoji: '⏳', difficulty: 1 },
                    { es: 'vieja', de: 'alt', en: 'old', gender: 'f', emoji: '⏳', difficulty: 1 },
                    { es: 'joven', de: 'jung', en: 'young', emoji: '👶', difficulty: 1 },
                    { es: 'hermoso', de: 'schön', en: 'beautiful', gender: 'm', emoji: '🌟', difficulty: 2 },
                    { es: 'hermosa', de: 'schön', en: 'beautiful', gender: 'f', emoji: '🌟', difficulty: 2 },
                    { es: 'feo', de: 'hässlich', en: 'ugly', gender: 'm', emoji: '😖', difficulty: 1 },
                    { es: 'fea', de: 'hässlich', en: 'ugly', gender: 'f', emoji: '😖', difficulty: 1 },
                    { es: 'alto', de: 'groß/hoch', en: 'tall', gender: 'm', emoji: '📏', difficulty: 1 },
                    { es: 'alta', de: 'groß/hoch', en: 'tall', gender: 'f', emoji: '📏', difficulty: 1 },
                    { es: 'bajo', de: 'klein/niedrig', en: 'short', gender: 'm', emoji: '📐', difficulty: 1 },
                    { es: 'baja', de: 'klein/niedrig', en: 'short', gender: 'f', emoji: '📐', difficulty: 1 },
                    { es: 'gordo', de: 'dick', en: 'fat', gender: 'm', emoji: '🐻', difficulty: 2 },
                    { es: 'gorda', de: 'dick', en: 'fat', gender: 'f', emoji: '🐻', difficulty: 2 },
                    { es: 'delgado', de: 'dünn', en: 'thin', gender: 'm', emoji: '🦒', difficulty: 2 },
                    { es: 'delgada', de: 'dünn', en: 'thin', gender: 'f', emoji: '🦒', difficulty: 2 },
                    { es: 'fuerte', de: 'stark', en: 'strong', emoji: '💪', difficulty: 2 },
                    { es: 'débil', de: 'schwach', en: 'weak', emoji: '😔', difficulty: 2 },
                    { es: 'rápido', de: 'schnell', en: 'fast', gender: 'm', emoji: '⚡', difficulty: 1 },
                    { es: 'rápida', de: 'schnell', en: 'fast', gender: 'f', emoji: '⚡', difficulty: 1 },
                    { es: 'lento', de: 'langsam', en: 'slow', gender: 'm', emoji: '🐌', difficulty: 1 },
                    { es: 'lenta', de: 'langsam', en: 'slow', gender: 'f', emoji: '🐌', difficulty: 1 },
                    { es: 'rico', de: 'reich/lecker', en: 'rich/delicious', gender: 'm', emoji: '💰', difficulty: 2 },
                    { es: 'rica', de: 'reich/lecker', en: 'rich/delicious', gender: 'f', emoji: '💰', difficulty: 2 },
                    { es: 'pobre', de: 'arm', en: 'poor', emoji: '😔', difficulty: 2 },
                    { es: 'inteligente', de: 'intelligent', en: 'intelligent', emoji: '🧠', difficulty: 2 },
                    { es: 'tonto', de: 'dumm', en: 'dumb', gender: 'm', emoji: '🤪', difficulty: 2 },
                    { es: 'tonta', de: 'dumm', en: 'dumb', gender: 'f', emoji: '🤪', difficulty: 2 },
                    { es: 'listo', de: 'bereit/klug', en: 'ready/smart', gender: 'm', emoji: '✅', difficulty: 2 },
                    { es: 'lista', de: 'bereit/klug', en: 'ready/smart', gender: 'f', emoji: '✅', difficulty: 2 },
                    { es: 'difícil', de: 'schwierig', en: 'difficult', emoji: '😰', difficulty: 2 },
                    { es: 'fácil', de: 'einfach', en: 'easy', emoji: '😊', difficulty: 1 },
                    { es: 'importante', de: 'wichtig', en: 'important', emoji: '⭐', difficulty: 2 },
                    { es: 'interesante', de: 'interessant', en: 'interesting', emoji: '🤔', difficulty: 2 },
                    { es: 'divertido', de: 'lustig', en: 'fun', gender: 'm', emoji: '🎉', difficulty: 2 },
                    { es: 'divertida', de: 'lustig', en: 'fun', gender: 'f', emoji: '🎉', difficulty: 2 },
                    { es: 'serio', de: 'ernst', en: 'serious', gender: 'm', emoji: '😐', difficulty: 2 },
                    { es: 'seria', de: 'ernst', en: 'serious', gender: 'f', emoji: '😐', difficulty: 2 }
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
                    { es: 'Italia', de: 'Italien', en: 'Italy', emoji: '🇮🇹', difficulty: 1 },
                    { es: 'Portugal', de: 'Portugal', en: 'Portugal', emoji: '🇵🇹', difficulty: 1 },
                    { es: 'Brasil', de: 'Brasilien', en: 'Brazil', emoji: '🇧🇷', difficulty: 1 },
                    { es: 'Chile', de: 'Chile', en: 'Chile', emoji: '🇨🇱', difficulty: 2 },
                    { es: 'Colombia', de: 'Kolumbien', en: 'Colombia', emoji: '🇨🇴', difficulty: 2 },
                    { es: 'Perú', de: 'Peru', en: 'Peru', emoji: '🇵🇪', difficulty: 2 },
                    { es: 'Venezuela', de: 'Venezuela', en: 'Venezuela', emoji: '🇻🇪', difficulty: 2 },
                    { es: 'Cuba', de: 'Kuba', en: 'Cuba', emoji: '🇨🇺', difficulty: 2 },
                    { es: 'Costa Rica', de: 'Costa Rica', en: 'Costa Rica', emoji: '🇨🇷', difficulty: 2 },
                    { es: 'Ecuador', de: 'Ecuador', en: 'Ecuador', emoji: '🇪🇨', difficulty: 2 },
                    { es: 'Estados Unidos', de: 'USA', en: 'United States', emoji: '🇺🇸', difficulty: 1 },
                    { es: 'Inglaterra', de: 'England', en: 'England', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', difficulty: 1 },
                    { es: 'China', de: 'China', en: 'China', emoji: '🇨🇳', difficulty: 1 },
                    { es: 'Japón', de: 'Japan', en: 'Japan', emoji: '🇯🇵', difficulty: 2 }
                ],
                cities: [
                    { es: 'Madrid', de: 'Madrid', en: 'Madrid', country: 'España', difficulty: 1 },
                    { es: 'Barcelona', de: 'Barcelona', en: 'Barcelona', country: 'España', difficulty: 1 },
                    { es: 'Sevilla', de: 'Sevilla', en: 'Seville', country: 'España', difficulty: 2 },
                    { es: 'Valencia', de: 'Valencia', en: 'Valencia', country: 'España', difficulty: 2 },
                    { es: 'Berlín', de: 'Berlin', en: 'Berlin', country: 'Alemania', difficulty: 1 },
                    { es: 'Múnich', de: 'München', en: 'Munich', country: 'Alemania', difficulty: 2 },
                    { es: 'París', de: 'Paris', en: 'Paris', country: 'Francia', difficulty: 1 },
                    { es: 'Lyon', de: 'Lyon', en: 'Lyon', country: 'Francia', difficulty: 2 },
                    { es: 'Roma', de: 'Rom', en: 'Rome', country: 'Italia', difficulty: 1 },
                    { es: 'Milán', de: 'Mailand', en: 'Milan', country: 'Italia', difficulty: 2 },
                    { es: 'Venecia', de: 'Venedig', en: 'Venice', country: 'Italia', difficulty: 2 },
                    { es: 'Lisboa', de: 'Lissabon', en: 'Lisbon', country: 'Portugal', difficulty: 1 },
                    { es: 'Buenos Aires', de: 'Buenos Aires', en: 'Buenos Aires', country: 'Argentina', difficulty: 1 },
                    { es: 'Ciudad de México', de: 'Mexiko-Stadt', en: 'Mexico City', country: 'México', difficulty: 1 },
                    { es: 'Bogotá', de: 'Bogotá', en: 'Bogotá', country: 'Colombia', difficulty: 2 },
                    { es: 'Lima', de: 'Lima', en: 'Lima', country: 'Perú', difficulty: 2 },
                    { es: 'Santiago', de: 'Santiago', en: 'Santiago', country: 'Chile', difficulty: 2 },
                    { es: 'La Habana', de: 'Havanna', en: 'Havana', country: 'Cuba', difficulty: 2 }
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
