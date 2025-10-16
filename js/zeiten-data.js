/**
 * Spanish Tenses Data - Complete definitions with rules, examples, and signal words
 * ASCII-compliant German explanations
 */

const ZEITEN_DATA = {
    presente: {
        nameES: 'Presente de Indicativo',
        nameDE: 'Gegenwart',
        
        rule: {
            es: 'Acciones habituales, estados actuales, verdades generales',
            de: 'Gewohnheiten, aktuelle Zustaende, allgemeine Wahrheiten'
        },
        
        explanation: [
            'Verwendet fuer Handlungen, die gerade stattfinden',
            'Gewohnheiten und regelmaessige Aktivitaeten',
            'Allgemeine Wahrheiten und Fakten',
            'Zustaende und Gefuehle in der Gegenwart'
        ],
        
        signalWords: [
            'ahora', 'ahora mismo', 'hoy', 'actualmente',
            'siempre', 'nunca', 'a menudo', 'frecuentemente',
            'todos los dias', 'cada dia', 'generalmente'
        ],
        
        formation: {
            ar: 'Stamm + o, as, a, amos, ais, an',
            er: 'Stamm + o, es, e, emos, eis, en',
            ir: 'Stamm + o, es, e, imos, is, en'
        },
        
        timelinePosition: 'present',
        
        examples: [
            {
                es: 'Yo hablo español todos los días.',
                de: 'Ich spreche jeden Tag Spanisch.',
                verb: 'hablo',
                infinitivo: 'hablar',
                persona: 'yo',
                analysis: {
                    tiempo: 'Presente',
                    persona: 'yo (1. Person Singular)',
                    modo: 'Indikativ',
                    aspecto: 'Unvollendet',
                    stamm: 'habl',
                    endung: 'o'
                }
            },
            {
                es: 'María come frutas cada mañana.',
                de: 'Maria isst jeden Morgen Fruechte.',
                verb: 'come',
                infinitivo: 'comer',
                persona: 'ella',
                analysis: {
                    tiempo: 'Presente',
                    persona: 'ella (3. Person Singular)',
                    modo: 'Indikativ',
                    aspecto: 'Unvollendet',
                    stamm: 'com',
                    endung: 'e'
                }
            },
            {
                es: 'Nosotros vivimos en Madrid.',
                de: 'Wir leben in Madrid.',
                verb: 'vivimos',
                infinitivo: 'vivir',
                persona: 'nosotros',
                analysis: {
                    tiempo: 'Presente',
                    persona: 'nosotros (1. Person Plural)',
                    modo: 'Indikativ',
                    aspecto: 'Unvollendet',
                    stamm: 'viv',
                    endung: 'imos'
                }
            }
        ]
    },

    preterito: {
        nameES: 'Pretérito Indefinido',
        nameDE: 'Einfache Vergangenheit',
        
        rule: {
            es: 'Acciones completadas en el pasado con tiempo definido',
            de: 'Abgeschlossene Handlungen mit festem Zeitpunkt'
        },
        
        explanation: [
            'Verwendet fuer abgeschlossene Handlungen in der Vergangenheit',
            'Einmalige Ereignisse mit klarem Anfang und Ende',
            'Handlungen zu einem bestimmten Zeitpunkt',
            'Narrative Erzaehlungen (was passierte)'
        ],
        
        signalWords: [
            'ayer', 'anoche', 'el año pasado', 'la semana pasada',
            'hace dos días', 'en 1990', 'el lunes pasado',
            'entonces', 'de repente', 'por fin'
        ],
        
        formation: {
            ar: 'Stamm + e, aste, o, amos, asteis, aron',
            er: 'Stamm + i, iste, io, imos, isteis, ieron',
            ir: 'Stamm + i, iste, io, imos, isteis, ieron'
        },
        
        timelinePosition: 'past',
        
        examples: [
            {
                es: 'Ayer hablé con mi madre por teléfono.',
                de: 'Gestern sprach ich mit meiner Mutter am Telefon.',
                verb: 'hablé',
                infinitivo: 'hablar',
                persona: 'yo',
                analysis: {
                    tiempo: 'Pretérito Indefinido',
                    persona: 'yo (1. Person Singular)',
                    modo: 'Indikativ',
                    aspecto: 'Vollendet',
                    stamm: 'habl',
                    endung: 'é'
                }
            },
            {
                es: 'Ella comió paella en Valencia.',
                de: 'Sie ass Paella in Valencia.',
                verb: 'comió',
                infinitivo: 'comer',
                persona: 'ella',
                analysis: {
                    tiempo: 'Pretérito Indefinido',
                    persona: 'ella (3. Person Singular)',
                    modo: 'Indikativ',
                    aspecto: 'Vollendet',
                    stamm: 'com',
                    endung: 'ió'
                }
            },
            {
                es: 'Vivimos en Barcelona durante cinco años.',
                de: 'Wir lebten fuenf Jahre lang in Barcelona.',
                verb: 'vivimos',
                infinitivo: 'vivir',
                persona: 'nosotros',
                analysis: {
                    tiempo: 'Pretérito Indefinido',
                    persona: 'nosotros (1. Person Plural)',
                    modo: 'Indikativ',
                    aspecto: 'Vollendet',
                    stamm: 'viv',
                    endung: 'imos'
                }
            }
        ]
    },

    imperfecto: {
        nameES: 'Pretérito Imperfecto',
        nameDE: 'Unvollendete Vergangenheit',
        
        rule: {
            es: 'Acciones habituales en el pasado, descripciones, acciones en progreso',
            de: 'Gewohnheiten in der Vergangenheit, Beschreibungen, laufende Handlungen'
        },
        
        explanation: [
            'Gewohnheiten und wiederholte Handlungen in der Vergangenheit',
            'Beschreibungen von Personen, Orten, Wetter',
            'Parallel laufende Handlungen',
            'Hintergrund-Informationen in Erzaehlungen'
        ],
        
        signalWords: [
            'mientras', 'siempre', 'nunca', 'a menudo',
            'frecuentemente', 'todos los días', 'cada día',
            'normalmente', 'generalmente', 'de niño', 'antes'
        ],
        
        formation: {
            ar: 'Stamm + aba, abas, aba, ábamos, abais, aban',
            er: 'Stamm + ía, ías, ía, íamos, íais, ían',
            ir: 'Stamm + ía, ías, ía, íamos, íais, ían'
        },
        
        timelinePosition: 'past',
        
        examples: [
            {
                es: 'Cuando era niño, jugaba en el parque.',
                de: 'Als ich ein Kind war, spielte ich im Park.',
                verb: 'jugaba',
                infinitivo: 'jugar',
                persona: 'yo',
                analysis: {
                    tiempo: 'Pretérito Imperfecto',
                    persona: 'yo (1. Person Singular)',
                    modo: 'Indikativ',
                    aspecto: 'Unvollendet, wiederholend',
                    stamm: 'jug',
                    endung: 'aba'
                }
            },
            {
                es: 'Mi abuela siempre hacía paella los domingos.',
                de: 'Meine Grossmutter machte sonntags immer Paella.',
                verb: 'hacía',
                infinitivo: 'hacer',
                persona: 'ella',
                analysis: {
                    tiempo: 'Pretérito Imperfecto',
                    persona: 'ella (3. Person Singular)',
                    modo: 'Indikativ',
                    aspecto: 'Unvollendet, gewohnheitsmaessig',
                    stamm: 'hac',
                    endung: 'ía'
                }
            },
            {
                es: 'Mientras estudiábamos, sonó el teléfono.',
                de: 'Waehrend wir lernten, klingelte das Telefon.',
                verb: 'estudiábamos',
                infinitivo: 'estudiar',
                persona: 'nosotros',
                analysis: {
                    tiempo: 'Pretérito Imperfecto',
                    persona: 'nosotros (1. Person Plural)',
                    modo: 'Indikativ',
                    aspekt: 'Unvollendet, Hintergrund-Handlung',
                    stamm: 'estudi',
                    endung: 'ábamos'
                }
            }
        ]
    },

    perfecto: {
        nameES: 'Pretérito Perfecto Compuesto',
        nameDE: 'Zusammengesetzte Vergangenheit',
        
        rule: {
            es: 'Acciones pasadas con relación al presente',
            de: 'Vergangene Handlungen mit Bezug zur Gegenwart'
        },
        
        explanation: [
            'Handlungen, die gerade abgeschlossen wurden',
            'Erfahrungen im Leben (ohne genauen Zeitpunkt)',
            'Handlungen in einem noch andauernden Zeitraum',
            'Bildung: haber (Presente) + Partizip'
        ],
        
        signalWords: [
            'hoy', 'esta mañana', 'esta semana', 'este mes',
            'este año', 'ya', 'todavía no', 'alguna vez',
            'nunca', 'recientemente', 'últimamente'
        ],
        
        formation: {
            all: 'haber (presente) + participio: he, has, ha, hemos, habéis, han + -ado/-ido'
        },
        
        timelinePosition: 'present',
        
        examples: [
            {
                es: 'Hoy he hablado con mi profesor.',
                de: 'Heute habe ich mit meinem Lehrer gesprochen.',
                verb: 'he hablado',
                infinitivo: 'hablar',
                persona: 'yo',
                analysis: {
                    tiempo: 'Pretérito Perfecto',
                    persona: 'yo (1. Person Singular)',
                    modo: 'Indikativ',
                    aspecto: 'Vollendet mit Gegenwartsbezug',
                    auxiliar: 'he',
                    participio: 'hablado'
                }
            },
            {
                es: '¿Has comido paella alguna vez?',
                de: 'Hast du jemals Paella gegessen?',
                verb: 'has comido',
                infinitivo: 'comer',
                persona: 'tú',
                analysis: {
                    tiempo: 'Pretérito Perfecto',
                    persona: 'tú (2. Person Singular)',
                    modo: 'Indikativ',
                    aspecto: 'Erfahrung im Leben',
                    auxiliar: 'has',
                    participio: 'comido'
                }
            },
            {
                es: 'Esta semana hemos estudiado mucho.',
                de: 'Diese Woche haben wir viel gelernt.',
                verb: 'hemos estudiado',
                infinitivo: 'estudiar',
                persona: 'nosotros',
                analysis: {
                    tiempo: 'Pretérito Perfecto',
                    persona: 'nosotros (1. Person Plural)',
                    modo: 'Indikativ',
                    aspecto: 'In andauerndem Zeitraum',
                    auxiliar: 'hemos',
                    participio: 'estudiado'
                }
            }
        ]
    },

    pluscuamperfecto: {
        nameES: 'Pretérito Pluscuamperfecto',
        nameDE: 'Vorvergangenheit',
        
        rule: {
            es: 'Acciones pasadas anteriores a otra acción pasada',
            de: 'Vergangene Handlung vor einer anderen vergangenen Handlung'
        },
        
        explanation: [
            'Vorvergangenheit: was VOR etwas anderem passierte',
            'Bildung: haber (Imperfecto) + Partizip',
            'Zeitliche Abfolge in der Vergangenheit verdeutlichen',
            'Oft mit "ya" (schon) verwendet'
        ],
        
        signalWords: [
            'ya', 'antes', 'cuando', 'después de que',
            'todavía no', 'nunca antes', 'aún no'
        ],
        
        formation: {
            all: 'haber (imperfecto) + participio: había, habías, había, habíamos, habíais, habían + -ado/-ido'
        },
        
        timelinePosition: 'past',
        
        examples: [
            {
                es: 'Cuando llegué, ella ya había salido.',
                de: 'Als ich ankam, war sie schon gegangen.',
                verb: 'había salido',
                infinitivo: 'salir',
                persona: 'ella',
                analysis: {
                    tiempo: 'Pretérito Pluscuamperfecto',
                    persona: 'ella (3. Person Singular)',
                    modo: 'Indikativ',
                    aspecto: 'Vorvergangenheit',
                    auxiliar: 'había',
                    participio: 'salido'
                }
            },
            {
                es: 'Nunca antes había comido sushi.',
                de: 'Ich hatte noch nie zuvor Sushi gegessen.',
                verb: 'había comido',
                infinitivo: 'comer',
                persona: 'yo',
                analysis: {
                    tiempo: 'Pretérito Pluscuamperfecto',
                    persona: 'yo (1. Person Singular)',
                    modo: 'Indikativ',
                    aspecto: 'Erfahrung vor einem bestimmten Zeitpunkt',
                    auxiliar: 'había',
                    participio: 'comido'
                }
            },
            {
                es: 'Ellos ya habían terminado cuando empezamos.',
                de: 'Sie hatten schon beendet, als wir anfingen.',
                verb: 'habían terminado',
                infinitivo: 'terminar',
                persona: 'ellos',
                analysis: {
                    tiempo: 'Pretérito Pluscuamperfecto',
                    persona: 'ellos (3. Person Plural)',
                    modo: 'Indikativ',
                    aspecto: 'Vorzeitigkeit',
                    auxiliar: 'habían',
                    participio: 'terminado'
                }
            }
        ]
    },

    futuro: {
        nameES: 'Futuro Simple',
        nameDE: 'Zukunft',
        
        rule: {
            es: 'Acciones futuras, predicciones, suposiciones',
            de: 'Zukuenftige Handlungen, Vorhersagen, Vermutungen'
        },
        
        explanation: [
            'Handlungen, die in der Zukunft stattfinden werden',
            'Vorhersagen und Prognosen',
            'Vermutungen ueber die Gegenwart',
            'Bildung: Infinitiv + Endungen'
        ],
        
        signalWords: [
            'mañana', 'pasado mañana', 'la próxima semana',
            'el próximo mes', 'el año que viene', 'en el futuro',
            'pronto', 'dentro de', 'después'
        ],
        
        formation: {
            all: 'Infinitiv + é, ás, á, emos, éis, án'
        },
        
        timelinePosition: 'future',
        
        examples: [
            {
                es: 'Mañana hablaré con el director.',
                de: 'Morgen werde ich mit dem Direktor sprechen.',
                verb: 'hablaré',
                infinitivo: 'hablar',
                persona: 'yo',
                analysis: {
                    tiempo: 'Futuro Simple',
                    persona: 'yo (1. Person Singular)',
                    modo: 'Indikativ',
                    aspecto: 'Zukuenftige Handlung',
                    stamm: 'hablar',
                    endung: 'é'
                }
            },
            {
                es: '¿Comerás conmigo esta noche?',
                de: 'Wirst du heute Abend mit mir essen?',
                verb: 'comerás',
                infinitivo: 'comer',
                persona: 'tú',
                analysis: {
                    tiempo: 'Futuro Simple',
                    persona: 'tú (2. Person Singular)',
                    modo: 'Indikativ',
                    aspecto: 'Zukuenftige Handlung',
                    stamm: 'comer',
                    endung: 'ás'
                }
            },
            {
                es: 'Ellos vivirán en España el próximo año.',
                de: 'Sie werden naechstes Jahr in Spanien leben.',
                verb: 'vivirán',
                infinitivo: 'vivir',
                persona: 'ellos',
                analysis: {
                    tiempo: 'Futuro Simple',
                    persona: 'ellos (3. Person Plural)',
                    modo: 'Indikativ',
                    aspecto: 'Zukuenftige Handlung',
                    stamm: 'vivir',
                    endung: 'án'
                }
            }
        ]
    },

    condicional: {
        nameES: 'Condicional Simple',
        nameDE: 'Konditional / Wuerdensatz',
        
        rule: {
            es: 'Acciones hipotéticas, cortesía, consejos',
            de: 'Hypothetische Handlungen, Hoeflichkeit, Ratschlaege'
        },
        
        explanation: [
            'Hoefliche Bitten und Wuensche',
            'Hypothetische Situationen (wuerde...)',
            'Ratschlaege geben',
            'Bildung: Infinitiv + ía-Endungen'
        ],
        
        signalWords: [
            'si tuviera', 'me gustaría', 'debería',
            'podría', 'en tu lugar', 'yo que tú'
        ],
        
        formation: {
            all: 'Infinitiv + ía, ías, ía, íamos, íais, ían'
        },
        
        timelinePosition: 'future',
        
        examples: [
            {
                es: 'Me gustaría hablar con usted.',
                de: 'Ich wuerde gerne mit Ihnen sprechen.',
                verb: 'gustaría',
                infinitivo: 'gustar',
                persona: 'a mí',
                analysis: {
                    tiempo: 'Condicional Simple',
                    persona: '3. Person Singular (a mí)',
                    modo: 'Condicional',
                    aspecto: 'Hoefliche Bitte',
                    stamm: 'gustar',
                    endung: 'ía'
                }
            },
            {
                es: '¿Podrías ayudarme con esto?',
                de: 'Koenntest du mir damit helfen?',
                verb: 'podrías',
                infinitivo: 'poder',
                persona: 'tú',
                analysis: {
                    tiempo: 'Condicional Simple',
                    persona: 'tú (2. Person Singular)',
                    modo: 'Condicional',
                    aspekt: 'Hoefliche Frage',
                    stamm: 'podr',
                    endung: 'ías'
                }
            },
            {
                es: 'Deberías estudiar más para el examen.',
                de: 'Du solltest mehr fuer die Pruefung lernen.',
                verb: 'deberías',
                infinitivo: 'deber',
                persona: 'tú',
                analysis: {
                    tiempo: 'Condicional Simple',
                    persona: 'tú (2. Person Singular)',
                    modo: 'Condicional',
                    aspekt: 'Ratschlag',
                    stamm: 'deber',
                    endung: 'ías'
                }
            }
        ]
    },

    progresivo: {
        nameES: 'Presente Progresivo',
        nameDE: 'Verlaufsform',
        
        rule: {
            es: 'Acciones en progreso en este momento (estar + gerundio)',
            de: 'Handlungen, die gerade stattfinden (estar + Gerundium)'
        },
        
        explanation: [
            'Handlungen, die GERADE in diesem Moment passieren',
            'Bildung: estar (konjugiert) + Gerundium',
            'Gerundium: -ando (ar-Verben), -iendo (er/ir-Verben)',
            'Betont den Verlauf der Handlung'
        ],
        
        signalWords: [
            'ahora', 'ahora mismo', 'en este momento',
            'actualmente', 'justo ahora', 'ahorita'
        ],
        
        formation: {
            ar: 'estar + Stamm + ando',
            er: 'estar + Stamm + iendo',
            ir: 'estar + Stamm + iendo'
        },
        
        timelinePosition: 'present',
        
        examples: [
            {
                es: 'Estoy hablando por teléfono ahora mismo.',
                de: 'Ich spreche gerade am Telefon.',
                verb: 'estoy hablando',
                infinitivo: 'hablar',
                persona: 'yo',
                analysis: {
                    tiempo: 'Presente Progresivo',
                    persona: 'yo (1. Person Singular)',
                    modo: 'Indikativ',
                    aspekt: 'Verlaufsform',
                    auxiliar: 'estoy',
                    gerundio: 'hablando'
                }
            },
            {
                es: '¿Qué estás comiendo?',
                de: 'Was isst du gerade?',
                verb: 'estás comiendo',
                infinitivo: 'comer',
                persona: 'tú',
                analysis: {
                    tiempo: 'Presente Progresivo',
                    persona: 'tú (2. Person Singular)',
                    modo: 'Indikativ',
                    aspekt: 'Handlung im Verlauf',
                    auxiliar: 'estás',
                    gerundio: 'comiendo'
                }
            },
            {
                es: 'Los niños están jugando en el parque.',
                de: 'Die Kinder spielen gerade im Park.',
                verb: 'están jugando',
                infinitivo: 'jugar',
                persona: 'ellos',
                analysis: {
                    tiempo: 'Presente Progresivo',
                    persona: 'ellos (3. Person Plural)',
                    modo: 'Indikativ',
                    aspekt: 'Handlung im Verlauf',
                    auxiliar: 'están',
                    gerundio: 'jugando'
                }
            }
        ]
    },

    perifrasis: {
        nameES: 'Perífrasis Verbal (ir a + infinitivo)',
        nameDE: 'Verbale Umschreibung (nahe Zukunft)',
        
        rule: {
            es: 'Futuro próximo, intenciones, planes inmediatos (ir a + infinitivo)',
            de: 'Nahe Zukunft, Absichten, unmittelbare Plaene (ir a + Infinitiv)'
        },
        
        explanation: [
            'Nahe Zukunft: was bald passieren wird',
            'Absichten und Plaene',
            'Bildung: ir (konjugiert) + a + Infinitiv',
            'Informeller als Futuro Simple'
        ],
        
        signalWords: [
            'dentro de poco', 'pronto', 'en un rato',
            'más tarde', 'esta tarde', 'luego'
        ],
        
        formation: {
            all: 'ir (presente) + a + infinitivo: voy a, vas a, va a, vamos a, vais a, van a'
        },
        
        timelinePosition: 'future',
        
        examples: [
            {
                es: 'Voy a hablar con mi jefe mañana.',
                de: 'Ich werde morgen mit meinem Chef sprechen.',
                verb: 'voy a hablar',
                infinitivo: 'hablar',
                persona: 'yo',
                analysis: {
                    tiempo: 'Perífrasis (ir a + inf)',
                    persona: 'yo (1. Person Singular)',
                    modo: 'Indikativ',
                    aspekt: 'Nahe Zukunft / Absicht',
                    auxiliar: 'voy a',
                    infinitivo: 'hablar'
                }
            },
            {
                es: '¿Vas a comer con nosotros?',
                de: 'Wirst du mit uns essen?',
                verb: 'vas a comer',
                infinitivo: 'comer',
                persona: 'tú',
                analysis: {
                    tiempo: 'Perífrasis (ir a + inf)',
                    persona: 'tú (2. Person Singular)',
                    modo: 'Indikativ',
                    aspekt: 'Nahe Zukunft / Plan',
                    auxiliar: 'vas a',
                    infinitivo: 'comer'
                }
            },
            {
                es: 'Ellos van a viajar a México el mes que viene.',
                de: 'Sie werden naechsten Monat nach Mexiko reisen.',
                verb: 'van a viajar',
                infinitivo: 'viajar',
                persona: 'ellos',
                analysis: {
                    tiempo: 'Perífrasis (ir a + inf)',
                    persona: 'ellos (3. Person Plural)',
                    modo: 'Indikativ',
                    aspekt: 'Geplante Zukunft',
                    auxiliar: 'van a',
                    infinitivo: 'viajar'
                }
            }
        ]
    }
};

// Export for use
if (typeof window !== 'undefined') {
    window.ZEITEN_DATA = ZEITEN_DATA;
}
