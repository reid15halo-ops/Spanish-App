/**
 * Module Structure for Spanish Learning App
 *
 * Complete restructure: Modules → Lessons → Exercises
 * Each module has 7 lessons, each lesson ~100 exercises
 */

window.MODULE_STRUCTURE = {
    modules: [
        {
            id: "module1",
            title: "Modul 1: Absolute Basics",
            level: "A1",
            description: "Grundlagen der spanischen Sprache - von Null bis zu einfachen Gesprächen",
            estimatedHours: 35,
            lessons: [
                {
                    id: "m1_l1",
                    number: 1,
                    title: "Sich vorstellen",
                    title_es: "Presentarse",
                    grammar: "Das Verb SER (sein) - yo soy, tú eres",
                    vocabulary: ["hola", "yo", "tú", "soy", "eres", "me llamo", "¿cómo te llamas?", "mucho gusto", "estudiante", "profesor", "de", "Alemania", "España"],
                    goals: [
                        "Deinen Namen sagen",
                        "Nach dem Namen fragen",
                        "Deine Herkunft angeben",
                        "Deinen Beruf nennen"
                    ],
                    exerciseCount: 100,
                    estimatedTime: "5-6 Stunden"
                },
                {
                    id: "m1_l2",
                    number: 2,
                    title: "Ser (alle Formen) & Beschreibungen",
                    title_es: "Ser completo y descripciones",
                    grammar: "SER - alle 6 Formen (yo, tú, él/ella, nosotros, vosotros, ellos)",
                    vocabulary: ["él", "ella", "nosotros", "vosotros", "ellos", "alto", "bajo", "simpático", "inteligente", "amable", "amigo", "familia"],
                    goals: [
                        "Alle Formen von 'ser' benutzen",
                        "Personen beschreiben",
                        "Über andere sprechen"
                    ],
                    exerciseCount: 100,
                    estimatedTime: "5-6 Stunden"
                },
                {
                    id: "m1_l3",
                    number: 3,
                    title: "Estar - Orte und Befinden",
                    title_es: "Estar - lugares y estados",
                    grammar: "ESTAR (sein) - temporäre Zustände und Orte",
                    vocabulary: ["estoy", "estás", "está", "en", "casa", "trabajo", "cansado", "feliz", "triste", "bien", "mal", "aquí", "allí"],
                    goals: [
                        "Sagen wo du bist",
                        "Dein Befinden ausdrücken",
                        "SER vs ESTAR unterscheiden"
                    ],
                    exerciseCount: 100,
                    estimatedTime: "5-6 Stunden"
                },
                {
                    id: "m1_l4",
                    number: 4,
                    title: "Zahlen und Alter",
                    title_es: "Números y edad",
                    grammar: "Zahlen 1-100, TENER (haben) für Alter",
                    vocabulary: ["uno", "dos", "tres", "diez", "veinte", "treinta", "cien", "tengo", "tienes", "años", "cuántos"],
                    goals: [
                        "Zahlen von 1-100",
                        "Dein Alter sagen",
                        "Nach dem Alter fragen",
                        "Preise verstehen"
                    ],
                    exerciseCount: 100,
                    estimatedTime: "5-6 Stunden"
                },
                {
                    id: "m1_l5",
                    number: 5,
                    title: "Familie und Besitz",
                    title_es: "Familia y posesión",
                    grammar: "TENER (haben), Possessivpronomen (mi, tu, su)",
                    vocabulary: ["padre", "madre", "hermano", "hermana", "hijo", "hija", "mi", "tu", "su", "familia", "tengo"],
                    goals: [
                        "Familie vorstellen",
                        "Besitz ausdrücken",
                        "Beziehungen beschreiben"
                    ],
                    exerciseCount: 100,
                    estimatedTime: "5-6 Stunden"
                },
                {
                    id: "m1_l6",
                    number: 6,
                    title: "Alltagsverben (Präsens)",
                    title_es: "Verbos cotidianos",
                    grammar: "Regelmäßige Verben -ar, -er, -ir im Präsens",
                    vocabulary: ["hablar", "comer", "vivir", "trabajar", "estudiar", "beber", "escribir", "leer", "todos los días"],
                    goals: [
                        "Tagesablauf beschreiben",
                        "Über Gewohnheiten sprechen",
                        "Regelmäßige Verben konjugieren"
                    ],
                    exerciseCount: 100,
                    estimatedTime: "5-6 Stunden"
                },
                {
                    id: "m1_l7",
                    number: 7,
                    title: "Einkaufen und Essen",
                    title_es: "Compras y comida",
                    grammar: "QUERER (wollen), Demonstrativpronomen (este, ese)",
                    vocabulary: ["quiero", "quisiera", "pan", "agua", "café", "restaurante", "tienda", "este", "ese", "cuánto cuesta", "por favor", "gracias"],
                    goals: [
                        "Im Restaurant bestellen",
                        "Einkaufen gehen",
                        "Preise erfragen",
                        "Höflich Wünsche äußern"
                    ],
                    exerciseCount: 100,
                    estimatedTime: "5-6 Stunden"
                }
            ]
        }
    ]
};
