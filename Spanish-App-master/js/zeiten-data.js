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
                es: 'Yo hablo espa�ol todos los d�as.',
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
                es: 'Mar�a come frutas cada ma�ana.',
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
        nameES: 'Pret�rito Indefinido',
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
            'ayer', 'anoche', 'el a�o pasado', 'la semana pasada',
            'hace dos d�as', 'en 1990', 'el lunes pasado',
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
                es: 'Ayer habl� con mi madre por tel�fono.',
                de: 'Gestern sprach ich mit meiner Mutter am Telefon.',
                verb: 'habl�',
                infinitivo: 'hablar',
                persona: 'yo',
                analysis: {
                    tiempo: 'Pret�rito Indefinido',
                    persona: 'yo (1. Person Singular)',
                    modo: 'Indikativ',
                    aspecto: 'Vollendet',
                    stamm: 'habl',
                    endung: '�'
                }
            },
            {
                es: 'Ella comi� paella en Valencia.',
                de: 'Sie ass Paella in Valencia.',
                verb: 'comi�',
                infinitivo: 'comer',
                persona: 'ella',
                analysis: {
                    tiempo: 'Pret�rito Indefinido',
                    persona: 'ella (3. Person Singular)',
                    modo: 'Indikativ',
                    aspecto: 'Vollendet',
                    stamm: 'com',
                    endung: 'i�'
                }
            },
            {
                es: 'Vivimos en Barcelona durante cinco a�os.',
                de: 'Wir lebten fuenf Jahre lang in Barcelona.',
                verb: 'vivimos',
                infinitivo: 'vivir',
                persona: 'nosotros',
                analysis: {
                    tiempo: 'Pret�rito Indefinido',
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
        nameES: 'Pret�rito Imperfecto',
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
            'frecuentemente', 'todos los d�as', 'cada d�a',
            'normalmente', 'generalmente', 'de ni�o', 'antes'
        ],
        
        formation: {
            ar: 'Stamm + aba, abas, aba, �bamos, abais, aban',
            er: 'Stamm + �a, �as, �a, �amos, �ais, �an',
            ir: 'Stamm + �a, �as, �a, �amos, �ais, �an'
        },
        
        timelinePosition: 'past',
        
        examples: [
            {
                es: 'Cuando era ni�o, jugaba en el parque.',
                de: 'Als ich ein Kind war, spielte ich im Park.',
                verb: 'jugaba',
                infinitivo: 'jugar',
                persona: 'yo',
                analysis: {
                    tiempo: 'Pret�rito Imperfecto',
                    persona: 'yo (1. Person Singular)',
                    modo: 'Indikativ',
                    aspecto: 'Unvollendet, wiederholend',
                    stamm: 'jug',
                    endung: 'aba'
                }
            },
            {
                es: 'Mi abuela siempre hac�a paella los domingos.',
                de: 'Meine Grossmutter machte sonntags immer Paella.',
                verb: 'hac�a',
                infinitivo: 'hacer',
                persona: 'ella',
                analysis: {
                    tiempo: 'Pret�rito Imperfecto',
                    persona: 'ella (3. Person Singular)',
                    modo: 'Indikativ',
                    aspecto: 'Unvollendet, gewohnheitsmaessig',
                    stamm: 'hac',
                    endung: '�a'
                }
            },
            {
                es: 'Mientras estudi�bamos, son� el tel�fono.',
                de: 'Waehrend wir lernten, klingelte das Telefon.',
                verb: 'estudi�bamos',
                infinitivo: 'estudiar',
                persona: 'nosotros',
                analysis: {
                    tiempo: 'Pret�rito Imperfecto',
                    persona: 'nosotros (1. Person Plural)',
                    modo: 'Indikativ',
                    aspekt: 'Unvollendet, Hintergrund-Handlung',
                    stamm: 'estudi',
                    endung: '�bamos'
                }
            }
        ]
    },

    perfecto: {
        nameES: 'Pret�rito Perfecto Compuesto',
        nameDE: 'Zusammengesetzte Vergangenheit',
        
        rule: {
            es: 'Acciones pasadas con relaci�n al presente',
            de: 'Vergangene Handlungen mit Bezug zur Gegenwart'
        },
        
        explanation: [
            'Handlungen, die gerade abgeschlossen wurden',
            'Erfahrungen im Leben (ohne genauen Zeitpunkt)',
            'Handlungen in einem noch andauernden Zeitraum',
            'Bildung: haber (Presente) + Partizip'
        ],
        
        signalWords: [
            'hoy', 'esta ma�ana', 'esta semana', 'este mes',
            'este a�o', 'ya', 'todav�a no', 'alguna vez',
            'nunca', 'recientemente', '�ltimamente'
        ],
        
        formation: {
            all: 'haber (presente) + participio: he, has, ha, hemos, hab�is, han + -ado/-ido'
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
                    tiempo: 'Pret�rito Perfecto',
                    persona: 'yo (1. Person Singular)',
                    modo: 'Indikativ',
                    aspecto: 'Vollendet mit Gegenwartsbezug',
                    auxiliar: 'he',
                    participio: 'hablado'
                }
            },
            {
                es: '�Has comido paella alguna vez?',
                de: 'Hast du jemals Paella gegessen?',
                verb: 'has comido',
                infinitivo: 'comer',
                persona: 't�',
                analysis: {
                    tiempo: 'Pret�rito Perfecto',
                    persona: 't� (2. Person Singular)',
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
                    tiempo: 'Pret�rito Perfecto',
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
        nameES: 'Pret�rito Pluscuamperfecto',
        nameDE: 'Vorvergangenheit',
        
        rule: {
            es: 'Acciones pasadas anteriores a otra acci�n pasada',
            de: 'Vergangene Handlung vor einer anderen vergangenen Handlung'
        },
        
        explanation: [
            'Vorvergangenheit: was VOR etwas anderem passierte',
            'Bildung: haber (Imperfecto) + Partizip',
            'Zeitliche Abfolge in der Vergangenheit verdeutlichen',
            'Oft mit "ya" (schon) verwendet'
        ],
        
        signalWords: [
            'ya', 'antes', 'cuando', 'despu�s de que',
            'todav�a no', 'nunca antes', 'a�n no'
        ],
        
        formation: {
            all: 'haber (imperfecto) + participio: hab�a, hab�as, hab�a, hab�amos, hab�ais, hab�an + -ado/-ido'
        },
        
        timelinePosition: 'past',
        
        examples: [
            {
                es: 'Cuando llegu�, ella ya hab�a salido.',
                de: 'Als ich ankam, war sie schon gegangen.',
                verb: 'hab�a salido',
                infinitivo: 'salir',
                persona: 'ella',
                analysis: {
                    tiempo: 'Pret�rito Pluscuamperfecto',
                    persona: 'ella (3. Person Singular)',
                    modo: 'Indikativ',
                    aspecto: 'Vorvergangenheit',
                    auxiliar: 'hab�a',
                    participio: 'salido'
                }
            },
            {
                es: 'Nunca antes hab�a comido sushi.',
                de: 'Ich hatte noch nie zuvor Sushi gegessen.',
                verb: 'hab�a comido',
                infinitivo: 'comer',
                persona: 'yo',
                analysis: {
                    tiempo: 'Pret�rito Pluscuamperfecto',
                    persona: 'yo (1. Person Singular)',
                    modo: 'Indikativ',
                    aspecto: 'Erfahrung vor einem bestimmten Zeitpunkt',
                    auxiliar: 'hab�a',
                    participio: 'comido'
                }
            },
            {
                es: 'Ellos ya hab�an terminado cuando empezamos.',
                de: 'Sie hatten schon beendet, als wir anfingen.',
                verb: 'hab�an terminado',
                infinitivo: 'terminar',
                persona: 'ellos',
                analysis: {
                    tiempo: 'Pret�rito Pluscuamperfecto',
                    persona: 'ellos (3. Person Plural)',
                    modo: 'Indikativ',
                    aspecto: 'Vorzeitigkeit',
                    auxiliar: 'hab�an',
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
            'ma�ana', 'pasado ma�ana', 'la pr�xima semana',
            'el pr�ximo mes', 'el a�o que viene', 'en el futuro',
            'pronto', 'dentro de', 'despu�s'
        ],
        
        formation: {
            all: 'Infinitiv + �, �s, �, emos, �is, �n'
        },
        
        timelinePosition: 'future',
        
        examples: [
            {
                es: 'Ma�ana hablar� con el director.',
                de: 'Morgen werde ich mit dem Direktor sprechen.',
                verb: 'hablar�',
                infinitivo: 'hablar',
                persona: 'yo',
                analysis: {
                    tiempo: 'Futuro Simple',
                    persona: 'yo (1. Person Singular)',
                    modo: 'Indikativ',
                    aspecto: 'Zukuenftige Handlung',
                    stamm: 'hablar',
                    endung: '�'
                }
            },
            {
                es: '�Comer�s conmigo esta noche?',
                de: 'Wirst du heute Abend mit mir essen?',
                verb: 'comer�s',
                infinitivo: 'comer',
                persona: 't�',
                analysis: {
                    tiempo: 'Futuro Simple',
                    persona: 't� (2. Person Singular)',
                    modo: 'Indikativ',
                    aspecto: 'Zukuenftige Handlung',
                    stamm: 'comer',
                    endung: '�s'
                }
            },
            {
                es: 'Ellos vivir�n en Espa�a el pr�ximo a�o.',
                de: 'Sie werden naechstes Jahr in Spanien leben.',
                verb: 'vivir�n',
                infinitivo: 'vivir',
                persona: 'ellos',
                analysis: {
                    tiempo: 'Futuro Simple',
                    persona: 'ellos (3. Person Plural)',
                    modo: 'Indikativ',
                    aspecto: 'Zukuenftige Handlung',
                    stamm: 'vivir',
                    endung: '�n'
                }
            }
        ]
    },

    condicional: {
        nameES: 'Condicional Simple',
        nameDE: 'Konditional / Wuerdensatz',
        
        rule: {
            es: 'Acciones hipot�ticas, cortes�a, consejos',
            de: 'Hypothetische Handlungen, Hoeflichkeit, Ratschlaege'
        },
        
        explanation: [
            'Hoefliche Bitten und Wuensche',
            'Hypothetische Situationen (wuerde...)',
            'Ratschlaege geben',
            'Bildung: Infinitiv + �a-Endungen'
        ],
        
        signalWords: [
            'si tuviera', 'me gustar�a', 'deber�a',
            'podr�a', 'en tu lugar', 'yo que t�'
        ],
        
        formation: {
            all: 'Infinitiv + �a, �as, �a, �amos, �ais, �an'
        },
        
        timelinePosition: 'future',
        
        examples: [
            {
                es: 'Me gustar�a hablar con usted.',
                de: 'Ich wuerde gerne mit Ihnen sprechen.',
                verb: 'gustar�a',
                infinitivo: 'gustar',
                persona: 'a m�',
                analysis: {
                    tiempo: 'Condicional Simple',
                    persona: '3. Person Singular (a m�)',
                    modo: 'Condicional',
                    aspecto: 'Hoefliche Bitte',
                    stamm: 'gustar',
                    endung: '�a'
                }
            },
            {
                es: '�Podr�as ayudarme con esto?',
                de: 'Koenntest du mir damit helfen?',
                verb: 'podr�as',
                infinitivo: 'poder',
                persona: 't�',
                analysis: {
                    tiempo: 'Condicional Simple',
                    persona: 't� (2. Person Singular)',
                    modo: 'Condicional',
                    aspekt: 'Hoefliche Frage',
                    stamm: 'podr',
                    endung: '�as'
                }
            },
            {
                es: 'Deber�as estudiar m�s para el examen.',
                de: 'Du solltest mehr fuer die Pruefung lernen.',
                verb: 'deber�as',
                infinitivo: 'deber',
                persona: 't�',
                analysis: {
                    tiempo: 'Condicional Simple',
                    persona: 't� (2. Person Singular)',
                    modo: 'Condicional',
                    aspekt: 'Ratschlag',
                    stamm: 'deber',
                    endung: '�as'
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
                es: 'Estoy hablando por tel�fono ahora mismo.',
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
                es: '�Qu� est�s comiendo?',
                de: 'Was isst du gerade?',
                verb: 'est�s comiendo',
                infinitivo: 'comer',
                persona: 't�',
                analysis: {
                    tiempo: 'Presente Progresivo',
                    persona: 't� (2. Person Singular)',
                    modo: 'Indikativ',
                    aspekt: 'Handlung im Verlauf',
                    auxiliar: 'est�s',
                    gerundio: 'comiendo'
                }
            },
            {
                es: 'Los ni�os est�n jugando en el parque.',
                de: 'Die Kinder spielen gerade im Park.',
                verb: 'est�n jugando',
                infinitivo: 'jugar',
                persona: 'ellos',
                analysis: {
                    tiempo: 'Presente Progresivo',
                    persona: 'ellos (3. Person Plural)',
                    modo: 'Indikativ',
                    aspekt: 'Handlung im Verlauf',
                    auxiliar: 'est�n',
                    gerundio: 'jugando'
                }
            }
        ]
    },

    perifrasis: {
        nameES: 'Per�frasis Verbal (ir a + infinitivo)',
        nameDE: 'Verbale Umschreibung (nahe Zukunft)',
        
        rule: {
            es: 'Futuro pr�ximo, intenciones, planes inmediatos (ir a + infinitivo)',
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
            'm�s tarde', 'esta tarde', 'luego'
        ],
        
        formation: {
            all: 'ir (presente) + a + infinitivo: voy a, vas a, va a, vamos a, vais a, van a'
        },
        
        timelinePosition: 'future',
        
        examples: [
            {
                es: 'Voy a hablar con mi jefe ma�ana.',
                de: 'Ich werde morgen mit meinem Chef sprechen.',
                verb: 'voy a hablar',
                infinitivo: 'hablar',
                persona: 'yo',
                analysis: {
                    tiempo: 'Per�frasis (ir a + inf)',
                    persona: 'yo (1. Person Singular)',
                    modo: 'Indikativ',
                    aspekt: 'Nahe Zukunft / Absicht',
                    auxiliar: 'voy a',
                    infinitivo: 'hablar'
                }
            },
            {
                es: '�Vas a comer con nosotros?',
                de: 'Wirst du mit uns essen?',
                verb: 'vas a comer',
                infinitivo: 'comer',
                persona: 't�',
                analysis: {
                    tiempo: 'Per�frasis (ir a + inf)',
                    persona: 't� (2. Person Singular)',
                    modo: 'Indikativ',
                    aspekt: 'Nahe Zukunft / Plan',
                    auxiliar: 'vas a',
                    infinitivo: 'comer'
                }
            },
            {
                es: 'Ellos van a viajar a M�xico el mes que viene.',
                de: 'Sie werden naechsten Monat nach Mexiko reisen.',
                verb: 'van a viajar',
                infinitivo: 'viajar',
                persona: 'ellos',
                analysis: {
                    tiempo: 'Per�frasis (ir a + inf)',
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
