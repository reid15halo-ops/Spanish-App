/**
 * CSV Import/Export System
 * Handles verbs and grammar examples with ASCII sanitization
 * ASCII-compliant, No-Gamification
 */

class CSVImporter {
    constructor() {
        this.asciiSanitizer = window.asciiNormalizer || null;
    }

    /**
     * Parse CSV content
     */
    parseCSV(csvContent) {
        const lines = csvContent.split('\n').filter(line => line.trim());
        if (lines.length === 0) {
            throw new Error('CSV file is empty');
        }

        const headers = this.parseCSVLine(lines[0]);
        const rows = [];

        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            if (values.length === 0 || values.every(v => !v)) {
                continue; // Skip empty lines
            }

            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            rows.push(row);
        }

        return { headers, rows };
    }

    /**
     * Parse single CSV line (handles quoted values)
     */
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // Escaped quote
                    current += '"';
                    i++; // Skip next quote
                } else {
                    // Toggle quotes
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                // Field separator
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current.trim());
        return result;
    }

    /**
     * Convert rows to CSV
     */
    toCSV(headers, rows) {
        const lines = [this.toCSVLine(headers)];

        rows.forEach(row => {
            const values = headers.map(header => row[header] || '');
            lines.push(this.toCSVLine(values));
        });

        return lines.join('\n');
    }

    /**
     * Convert array to CSV line (properly escape values)
     */
    toCSVLine(values) {
        return values.map(value => {
            const str = String(value);
            
            // If contains comma, quote, or newline, wrap in quotes
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                // Escape quotes by doubling them
                return `"${str.replace(/"/g, '""')}"`;
            }
            
            return str;
        }).join(',');
    }

    /**
     * Sanitize text to ASCII
     */
    sanitizeToASCII(text) {
        if (!text) return '';
        
        if (this.asciiSanitizer) {
            return this.asciiSanitizer.normalize(text);
        }

        // Fallback basic sanitization
        return text
            .replace(/ä/g, 'ae')
            .replace(/ö/g, 'oe')
            .replace(/ü/g, 'ue')
            .replace(/Ä/g, 'Ae')
            .replace(/Ö/g, 'Oe')
            .replace(/Ü/g, 'Ue')
            .replace(/ß/g, 'ss');
    }

    /**
     * Import verbs from CSV
     */
    importVerbs(csvContent) {
        console.log('?? Importing verbs from CSV...');

        const { headers, rows } = this.parseCSV(csvContent);

        // Validate headers
        const requiredHeaders = ['infinitivo', 'clase', 'participio', 'gerundio'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        
        if (missingHeaders.length > 0) {
            throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
        }

        const verbs = [];
        const errors = [];

        rows.forEach((row, index) => {
            try {
                const verb = this.parseVerbRow(row, index + 2); // +2 for header and 0-index
                verbs.push(verb);
            } catch (error) {
                errors.push({
                    row: index + 2,
                    error: error.message
                });
            }
        });

        console.log(`? Imported ${verbs.length} verbs`);
        if (errors.length > 0) {
            console.warn(`?? ${errors.length} errors:`, errors);
        }

        return { verbs, errors };
    }

    /**
     * Parse single verb row
     */
    parseVerbRow(row, rowNumber) {
        const infinitivo = row.infinitivo?.trim();
        if (!infinitivo) {
            throw new Error('Missing infinitivo');
        }

        const verb = {
            infinitivo: infinitivo,
            clase: row.clase?.trim() || '-ar',
            participio: row.participio?.trim() || this.buildParticipioDefault(infinitivo),
            gerundio: row.gerundio?.trim() || this.buildGerundioDefault(infinitivo),
            traduccion: this.sanitizeToASCII(row.traduccion?.trim() || ''),
            tipo: row.tipo?.trim() || 'accion',
            frecuencia: parseInt(row.frecuencia) || 2
        };

        // Parse irregularidades (JSON string)
        if (row.irregularidades && row.irregularidades.trim()) {
            try {
                verb.irregularidades = JSON.parse(row.irregularidades);
            } catch (error) {
                console.warn(`Row ${rowNumber}: Invalid irregularidades JSON, skipping`);
                verb.irregularidades = {};
            }
        } else {
            verb.irregularidades = {};
        }

        return verb;
    }

    /**
     * Build default participio
     */
    buildParticipioDefault(infinitivo) {
        if (infinitivo.endsWith('ar')) {
            return infinitivo.slice(0, -2) + 'ado';
        } else if (infinitivo.endsWith('er') || infinitivo.endsWith('ir')) {
            return infinitivo.slice(0, -2) + 'ido';
        }
        return infinitivo + 'ado';
    }

    /**
     * Build default gerundio
     */
    buildGerundioDefault(infinitivo) {
        if (infinitivo.endsWith('ar')) {
            return infinitivo.slice(0, -2) + 'ando';
        } else if (infinitivo.endsWith('er') || infinitivo.endsWith('ir')) {
            return infinitivo.slice(0, -2) + 'iendo';
        }
        return infinitivo + 'ando';
    }

    /**
     * Export verbs to CSV
     */
    exportVerbs(verbs) {
        console.log('?? Exporting verbs to CSV...');

        const headers = [
            'infinitivo',
            'clase',
            'participio',
            'gerundio',
            'traduccion',
            'tipo',
            'frecuencia',
            'irregularidades'
        ];

        const rows = verbs.map(verb => ({
            infinitivo: verb.infinitivo,
            clase: verb.clase,
            participio: verb.participio,
            gerundio: verb.gerundio,
            traduccion: verb.traduccion || '',
            tipo: verb.tipo || 'accion',
            frecuencia: verb.frecuencia || 2,
            irregularidades: verb.irregularidades && Object.keys(verb.irregularidades).length > 0
                ? JSON.stringify(verb.irregularidades)
                : ''
        }));

        const csv = this.toCSV(headers, rows);
        console.log(`? Exported ${rows.length} verbs`);

        return csv;
    }

    /**
     * Import grammar examples from CSV
     */
    importGrammarExamples(csvContent) {
        console.log('?? Importing grammar examples from CSV...');

        const { headers, rows } = this.parseCSV(csvContent);

        // Validate headers
        const requiredHeaders = ['es', 'de_ascii'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        
        if (missingHeaders.length > 0) {
            throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
        }

        const examples = [];
        const errors = [];

        rows.forEach((row, index) => {
            try {
                const example = this.parseGrammarRow(row, index + 2);
                examples.push(example);
            } catch (error) {
                errors.push({
                    row: index + 2,
                    error: error.message
                });
            }
        });

        console.log(`? Imported ${examples.length} grammar examples`);
        if (errors.length > 0) {
            console.warn(`?? ${errors.length} errors:`, errors);
        }

        return { examples, errors };
    }

    /**
     * Parse single grammar example row
     */
    parseGrammarRow(row, rowNumber) {
        const es = row.es?.trim();
        const de_ascii = row.de_ascii?.trim();

        if (!es) {
            throw new Error('Missing Spanish text (es)');
        }
        if (!de_ascii) {
            throw new Error('Missing German text (de_ascii)');
        }

        // Enforce ASCII-only for German
        const sanitizedDE = this.sanitizeToASCII(de_ascii);

        const example = {
            id: row.id || `grammar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            es: es,
            de: sanitizedDE,
            type: row.type || 'sentence',
            tiempo: row.tiempo?.trim() || '',
            nota: this.sanitizeToASCII(row.nota?.trim() || ''),
            tags: row.tags ? row.tags.split(';').map(t => t.trim()).filter(t => t) : []
        };

        return example;
    }

    /**
     * Export grammar examples to CSV
     */
    exportGrammarExamples(examples) {
        console.log('?? Exporting grammar examples to CSV...');

        const headers = [
            'id',
            'es',
            'de_ascii',
            'type',
            'tiempo',
            'nota',
            'tags'
        ];

        const rows = examples.map(ex => ({
            id: ex.id,
            es: ex.es,
            de_ascii: this.sanitizeToASCII(ex.de || ex.de_ascii),
            type: ex.type || 'sentence',
            tiempo: ex.tiempo || '',
            nota: this.sanitizeToASCII(ex.nota || ''),
            tags: ex.tags ? ex.tags.join(';') : ''
        }));

        const csv = this.toCSV(headers, rows);
        console.log(`? Exported ${rows.length} grammar examples`);

        return csv;
    }

    /**
     * Merge verbs into existing verbs.json
     */
    mergeVerbs(existingVerbs, newVerbs) {
        console.log('?? Merging verbs...');

        const verbMap = new Map();

        // Add existing verbs
        existingVerbs.forEach(verb => {
            verbMap.set(verb.infinitivo, verb);
        });

        // Merge/update with new verbs
        newVerbs.forEach(verb => {
            if (verbMap.has(verb.infinitivo)) {
                // Update existing
                console.log(`  Updating: ${verb.infinitivo}`);
                verbMap.set(verb.infinitivo, { ...verbMap.get(verb.infinitivo), ...verb });
            } else {
                // Add new
                console.log(`  Adding: ${verb.infinitivo}`);
                verbMap.set(verb.infinitivo, verb);
            }
        });

        const merged = Array.from(verbMap.values());
        console.log(`? Merged to ${merged.length} verbs`);

        return merged;
    }

    /**
     * Merge grammar examples into existing items.json
     */
    mergeGrammarExamples(existingItems, newExamples) {
        console.log('?? Merging grammar examples...');

        const itemMap = new Map();

        // Add existing items
        existingItems.forEach(item => {
            itemMap.set(item.id, item);
        });

        // Merge/update with new examples
        newExamples.forEach(example => {
            if (itemMap.has(example.id)) {
                // Update existing
                console.log(`  Updating: ${example.id}`);
                itemMap.set(example.id, { ...itemMap.get(example.id), ...example });
            } else {
                // Add new
                console.log(`  Adding: ${example.id}`);
                itemMap.set(example.id, example);
            }
        });

        const merged = Array.from(itemMap.values());
        console.log(`? Merged to ${merged.length} items`);

        return merged;
    }

    /**
     * Validate roundtrip (CSV ? JSON ? CSV)
     */
    validateRoundtrip(originalCSV, exportedCSV) {
        console.log('?? Validating roundtrip...');

        const original = this.parseCSV(originalCSV);
        const exported = this.parseCSV(exportedCSV);

        const errors = [];

        // Check row count
        if (original.rows.length !== exported.rows.length) {
            errors.push({
                type: 'row-count',
                message: `Row count mismatch: ${original.rows.length} vs ${exported.rows.length}`
            });
        }

        // Check data integrity
        original.rows.forEach((origRow, index) => {
            const expRow = exported.rows[index];
            if (!expRow) return;

            original.headers.forEach(header => {
                const origVal = origRow[header];
                const expVal = expRow[header];

                if (origVal !== expVal) {
                    errors.push({
                        type: 'data-mismatch',
                        row: index + 2,
                        field: header,
                        original: origVal,
                        exported: expVal
                    });
                }
            });
        });

        if (errors.length === 0) {
            console.log('? Roundtrip validation passed');
            return { valid: true, errors: [] };
        } else {
            console.warn(`?? Roundtrip validation failed: ${errors.length} errors`);
            return { valid: false, errors };
        }
    }
}

// Export for use
if (typeof window !== 'undefined') {
    window.CSVImporter = CSVImporter;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CSVImporter;
}
