#!/usr/bin/env python3
"""
Add practice exercises to all vocabulary items in lesson1-expanded.js
"""

import json
import re

# Practice data for each vocabulary word
PRACTICES = {
    "soy": [
        {"direction": "es-de", "question": "Soy estudiante.", "answer": "Ich bin Student.", "hint": "Soy = ich bin"},
        {"direction": "de-es", "question": "Ich bin Lehrer.", "answer": "Soy profesor.", "hint": "Soy = ich bin"},
        {"direction": "es-de", "question": "Soy de México.", "answer": "Ich bin aus Mexiko.", "hint": "Soy = ich bin"},
        {"direction": "de-es", "question": "Ich bin aus Deutschland.", "answer": "Soy de Alemania.", "hint": "Soy de..."},
        {"direction": "es-de", "question": "Soy Pedro.", "answer": "Ich bin Pedro.", "hint": "Soy = ich bin"},
        {"direction": "de-es", "question": "Ich bin María.", "answer": "Soy María.", "hint": "Soy..."}
    ],
    "eres": [
        {"direction": "es-de", "question": "Eres profesor.", "answer": "Du bist Lehrer.", "hint": "Eres = du bist"},
        {"direction": "de-es", "question": "Du bist Student.", "answer": "Eres estudiante.", "hint": "Eres = du bist"},
        {"direction": "es-de", "question": "Eres de Alemania.", "answer": "Du bist aus Deutschland.", "hint": "Eres = du bist"},
        {"direction": "de-es", "question": "Du bist nett.", "answer": "Eres simpático.", "hint": "Eres..."},
        {"direction": "es-de", "question": "¿Eres María?", "answer": "Bist du María?", "hint": "Eres = bist du"},
        {"direction": "de-es", "question": "Du bist intelligent.", "answer": "Eres inteligente.", "hint": "Eres..."}
    ],
    "me llamo": [
        {"direction": "es-de", "question": "Me llamo Pedro.", "answer": "Ich heiße Pedro.", "hint": "Me llamo = ich heiße"},
        {"direction": "de-es", "question": "Ich heiße María.", "answer": "Me llamo María.", "hint": "Me llamo..."},
        {"direction": "es-de", "question": "Me llamo Juan.", "answer": "Ich heiße Juan.", "hint": "Me llamo = ich heiße"},
        {"direction": "de-es", "question": "Ich heiße Anna.", "answer": "Me llamo Anna.", "hint": "Me llamo..."},
        {"direction": "es-de", "question": "¿Cómo te llamas? Me llamo Carlos.", "answer": "Wie heißt du? Ich heiße Carlos.", "hint": "Me llamo = ich heiße"},
        {"direction": "de-es", "question": "Hallo, ich heiße Laura.", "answer": "Hola, me llamo Laura.", "hint": "Me llamo..."}
    ],
    "¿cómo te llamas?": [
        {"direction": "es-de", "question": "¿Cómo te llamas?", "answer": "Wie heißt du?", "hint": "Frage nach dem Namen"},
        {"direction": "de-es", "question": "Wie heißt du?", "answer": "¿Cómo te llamas?", "hint": "¿Cómo...?"},
        {"direction": "es-de", "question": "Hola, ¿cómo te llamas?", "answer": "Hallo, wie heißt du?", "hint": "Frage nach dem Namen"},
        {"direction": "de-es", "question": "Hallo, wie heißt du?", "answer": "Hola, ¿cómo te llamas?", "hint": "Beginne mit ¿"},
        {"direction": "es-de", "question": "¿Cómo te llamas? Yo soy Pedro.", "answer": "Wie heißt du? Ich bin Pedro.", "hint": "Wie heißt du?"},
        {"direction": "de-es", "question": "Entschuldigung, wie heißt du?", "answer": "Perdón, ¿cómo te llamas?", "hint": "¿Cómo te llamas?"}
    ],
    "de": [
        {"direction": "es-de", "question": "Soy de España.", "answer": "Ich bin aus Spanien.", "hint": "de = aus/von"},
        {"direction": "de-es", "question": "Ich bin aus Deutschland.", "answer": "Soy de Alemania.", "hint": "de = aus"},
        {"direction": "es-de", "question": "Soy de México.", "answer": "Ich bin aus Mexiko.", "hint": "de = aus"},
        {"direction": "de-es", "question": "Du bist aus Spanien.", "answer": "Eres de España.", "hint": "de = aus"},
        {"direction": "es-de", "question": "¿De dónde eres?", "answer": "Woher bist du?", "hint": "de dónde = woher"},
        {"direction": "de-es", "question": "Woher bist du?", "answer": "¿De dónde eres?", "hint": "de dónde..."}
    ],
    "estudiante": [
        {"direction": "es-de", "question": "Soy estudiante.", "answer": "Ich bin Student.", "hint": "estudiante = Student"},
        {"direction": "de-es", "question": "Ich bin Student.", "answer": "Soy estudiante.", "hint": "estudiante..."},
        {"direction": "es-de", "question": "Eres estudiante.", "answer": "Du bist Student.", "hint": "estudiante = Student"},
        {"direction": "de-es", "question": "Du bist Studentin.", "answer": "Eres estudiante.", "hint": "estudiante..."},
        {"direction": "es-de", "question": "Pedro es estudiante.", "answer": "Pedro ist Student.", "hint": "estudiante = Student"},
        {"direction": "de-es", "question": "Bist du Student?", "answer": "¿Eres estudiante?", "hint": "estudiante..."}
    ],
    "profesor": [
        {"direction": "es-de", "question": "Soy profesor.", "answer": "Ich bin Lehrer.", "hint": "profesor = Lehrer"},
        {"direction": "de-es", "question": "Ich bin Lehrer.", "answer": "Soy profesor.", "hint": "profesor..."},
        {"direction": "es-de", "question": "Eres profesor.", "answer": "Du bist Lehrer.", "hint": "profesor = Lehrer"},
        {"direction": "de-es", "question": "María ist Lehrerin.", "answer": "María es profesora.", "hint": "profesora..."},
        {"direction": "es-de", "question": "Mi profesor es simpático.", "answer": "Mein Lehrer ist nett.", "hint": "profesor = Lehrer"},
        {"direction": "de-es", "question": "Der Lehrer heißt Pedro.", "answer": "El profesor se llama Pedro.", "hint": "El profesor..."}
    ],
    "Alemania": [
        {"direction": "es-de", "question": "Soy de Alemania.", "answer": "Ich bin aus Deutschland.", "hint": "Alemania = Deutschland"},
        {"direction": "de-es", "question": "Ich bin aus Deutschland.", "answer": "Soy de Alemania.", "hint": "Alemania..."},
        {"direction": "es-de", "question": "Eres de Alemania.", "answer": "Du bist aus Deutschland.", "hint": "Alemania = Deutschland"},
        {"direction": "de-es", "question": "Woher kommst du? Aus Deutschland.", "answer": "¿De dónde eres? De Alemania.", "hint": "De Alemania"},
        {"direction": "es-de", "question": "Pedro es de Alemania.", "answer": "Pedro ist aus Deutschland.", "hint": "Alemania = Deutschland"},
        {"direction": "de-es", "question": "Deutschland ist schön.", "answer": "Alemania es bonita.", "hint": "Alemania..."}
    ],
    "España": [
        {"direction": "es-de", "question": "Soy de España.", "answer": "Ich bin aus Spanien.", "hint": "España = Spanien"},
        {"direction": "de-es", "question": "Ich bin aus Spanien.", "answer": "Soy de España.", "hint": "España..."},
        {"direction": "es-de", "question": "Eres de España.", "answer": "Du bist aus Spanien.", "hint": "España = Spanien"},
        {"direction": "de-es", "question": "María ist aus Spanien.", "answer": "María es de España.", "hint": "Es de España"},
        {"direction": "es-de", "question": "¿Eres de España?", "answer": "Bist du aus Spanien?", "hint": "España = Spanien"},
        {"direction": "de-es", "question": "Spanien ist schön.", "answer": "España es bonita.", "hint": "España..."}
    ],
    "mucho gusto": [
        {"direction": "es-de", "question": "Mucho gusto.", "answer": "Freut mich.", "hint": "Höfliche Begrüßung"},
        {"direction": "de-es", "question": "Freut mich.", "answer": "Mucho gusto.", "hint": "Mucho gusto"},
        {"direction": "es-de", "question": "Hola, mucho gusto.", "answer": "Hallo, freut mich.", "hint": "mucho gusto = freut mich"},
        {"direction": "de-es", "question": "Hallo, freut mich dich kennenzulernen.", "answer": "Hola, mucho gusto.", "hint": "Mucho gusto"},
        {"direction": "es-de", "question": "Mucho gusto en conocerte.", "answer": "Freut mich, dich kennenzulernen.", "hint": "mucho gusto = freut mich"},
        {"direction": "de-es", "question": "Schön, dich zu treffen.", "answer": "Mucho gusto.", "hint": "Mucho gusto"}
    ],
    "¿de dónde eres?": [
        {"direction": "es-de", "question": "¿De dónde eres?", "answer": "Woher bist du?", "hint": "de dónde = woher"},
        {"direction": "de-es", "question": "Woher bist du?", "answer": "¿De dónde eres?", "hint": "¿De dónde...?"},
        {"direction": "es-de", "question": "Hola, ¿de dónde eres?", "answer": "Hallo, woher bist du?", "hint": "de dónde = woher"},
        {"direction": "de-es", "question": "Woher kommst du?", "answer": "¿De dónde eres?", "hint": "¿De dónde eres?"},
        {"direction": "es-de", "question": "¿De dónde eres? Soy de España.", "answer": "Woher bist du? Ich bin aus Spanien.", "hint": "de dónde = woher"},
        {"direction": "de-es", "question": "Woher bist du? Aus Deutschland.", "answer": "¿De dónde eres? De Alemania.", "hint": "De Alemania"}
    ],
    "también": [
        {"direction": "es-de", "question": "Yo también.", "answer": "Ich auch.", "hint": "también = auch"},
        {"direction": "de-es", "question": "Ich auch.", "answer": "Yo también.", "hint": "también"},
        {"direction": "es-de", "question": "Soy estudiante también.", "answer": "Ich bin auch Student.", "hint": "también = auch"},
        {"direction": "de-es", "question": "Ich bin auch Lehrer.", "answer": "Soy profesor también.", "hint": "también am Ende"},
        {"direction": "es-de", "question": "María también es de España.", "answer": "María ist auch aus Spanien.", "hint": "también = auch"},
        {"direction": "de-es", "question": "Pedro ist auch aus Deutschland.", "answer": "Pedro también es de Alemania.", "hint": "también..."}
    ],
    "y": [
        {"direction": "es-de", "question": "Pedro y María.", "answer": "Pedro und María.", "hint": "y = und"},
        {"direction": "de-es", "question": "Du und ich.", "answer": "Tú y yo.", "hint": "y = und"},
        {"direction": "es-de", "question": "Hola, ¿y tú?", "answer": "Hallo, und du?", "hint": "y = und"},
        {"direction": "de-es", "question": "Und wie heißt du?", "answer": "¿Y cómo te llamas?", "hint": "y = und"},
        {"direction": "es-de", "question": "Soy Pedro, ¿y tú?", "answer": "Ich bin Pedro, und du?", "hint": "y = und"},
        {"direction": "de-es", "question": "Student und Lehrer.", "answer": "Estudiante y profesor.", "hint": "y..."}
    ],
    "gracias": [
        {"direction": "es-de", "question": "Gracias.", "answer": "Danke.", "hint": "gracias = danke"},
        {"direction": "de-es", "question": "Danke.", "answer": "Gracias.", "hint": "Gracias"},
        {"direction": "es-de", "question": "Muchas gracias.", "answer": "Vielen Dank.", "hint": "muchas gracias = vielen Dank"},
        {"direction": "de-es", "question": "Vielen Dank.", "answer": "Muchas gracias.", "hint": "Muchas gracias"},
        {"direction": "es-de", "question": "Gracias, mucho gusto.", "answer": "Danke, freut mich.", "hint": "gracias = danke"},
        {"direction": "de-es", "question": "Danke schön.", "answer": "Muchas gracias.", "hint": "Muchas gracias"}
    ],
    "por favor": [
        {"direction": "es-de", "question": "Por favor.", "answer": "Bitte.", "hint": "por favor = bitte"},
        {"direction": "de-es", "question": "Bitte.", "answer": "Por favor.", "hint": "Por favor"},
        {"direction": "es-de", "question": "Hola, por favor.", "answer": "Hallo, bitte.", "hint": "por favor = bitte"},
        {"direction": "de-es", "question": "Bitte schön.", "answer": "Por favor.", "hint": "Por favor"},
        {"direction": "es-de", "question": "Gracias. De nada, por favor.", "answer": "Danke. Bitte schön.", "hint": "por favor = bitte"},
        {"direction": "de-es", "question": "Ein Kaffee, bitte.", "answer": "Un café, por favor.", "hint": "por favor"}
    ],
    "adiós": [
        {"direction": "es-de", "question": "Adiós.", "answer": "Auf Wiedersehen.", "hint": "adiós = tschüss"},
        {"direction": "de-es", "question": "Auf Wiedersehen.", "answer": "Adiós.", "hint": "Adiós"},
        {"direction": "es-de", "question": "Adiós, hasta luego.", "answer": "Auf Wiedersehen, bis später.", "hint": "adiós = auf Wiedersehen"},
        {"direction": "de-es", "question": "Tschüss.", "answer": "Adiós.", "hint": "Adiós"},
        {"direction": "es-de", "question": "Gracias, adiós.", "answer": "Danke, auf Wiedersehen.", "hint": "adiós = auf Wiedersehen"},
        {"direction": "de-es", "question": "Bis bald!", "answer": "¡Hasta pronto! Adiós.", "hint": "Adiós am Ende"}
    ],
    "¿qué tal?": [
        {"direction": "es-de", "question": "¿Qué tal?", "answer": "Wie geht's?", "hint": "qué tal = wie geht's"},
        {"direction": "de-es", "question": "Wie geht's?", "answer": "¿Qué tal?", "hint": "¿Qué tal?"},
        {"direction": "es-de", "question": "Hola, ¿qué tal?", "answer": "Hallo, wie geht's?", "hint": "qué tal = wie geht's"},
        {"direction": "de-es", "question": "Wie geht es dir?", "answer": "¿Qué tal?", "hint": "¿Qué tal?"},
        {"direction": "es-de", "question": "¿Qué tal? Bien, gracias.", "answer": "Wie geht's? Gut, danke.", "hint": "qué tal = wie geht's"},
        {"direction": "de-es", "question": "Hallo, wie geht es dir?", "answer": "Hola, ¿qué tal?", "hint": "¿Qué tal?"}
    ],
    "bien": [
        {"direction": "es-de", "question": "Bien, gracias.", "answer": "Gut, danke.", "hint": "bien = gut"},
        {"direction": "de-es", "question": "Gut, danke.", "answer": "Bien, gracias.", "hint": "Bien"},
        {"direction": "es-de", "question": "Estoy bien.", "answer": "Mir geht es gut.", "hint": "bien = gut"},
        {"direction": "de-es", "question": "Mir geht es gut.", "answer": "Estoy bien.", "hint": "Estoy bien"},
        {"direction": "es-de", "question": "¿Qué tal? Bien.", "answer": "Wie geht's? Gut.", "hint": "bien = gut"},
        {"direction": "de-es", "question": "Sehr gut, danke.", "answer": "Muy bien, gracias.", "hint": "Muy bien"}
    ]
}

# Read the file
with open('/home/user/Spanish-App/js/lesson1-expanded.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add practices to each vocabulary item that doesn't have them yet
for word, practices in PRACTICES.items():
    # Find the vocabulary item
    pattern = rf'"word": "{re.escape(word)}",\s*"translation":'
    match = re.search(pattern, content)

    if match:
        # Find the end of this vocabulary item (next closing brace with comma, or last one)
        start_pos = match.start()

        # Find the mnemonic line for this item
        mnemonic_pattern = rf'"mnemonic": "[^"]*"'
        mnemonic_match = re.search(mnemonic_pattern, content[start_pos:start_pos+2000])

        if mnemonic_match:
            # Check if practices already exist after mnemonic
            check_start = start_pos + mnemonic_match.end()
            check_snippet = content[check_start:check_start+100]

            if '"practices":' not in check_snippet:
                # Add practices after mnemonic
                practices_json = ',\n            "practices": ' + json.dumps(practices, indent=16, ensure_ascii=False)

                insert_pos = start_pos + mnemonic_match.end()
                content = content[:insert_pos] + practices_json + content[insert_pos:]
                print(f"Added practices for: {word}")
            else:
                print(f"Practices already exist for: {word}")

# Write back
with open('/home/user/Spanish-App/js/lesson1-expanded.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("\nDone! All practices added.")
