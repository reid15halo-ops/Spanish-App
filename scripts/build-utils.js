/**
 * Build Utils Module
 *
 * Combines all utility modules into a single utils.js file
 */

const fs = require('fs');
const path = require('path');

class UtilsBuilder {
    constructor(rootDir) {
        this.rootDir = rootDir;
        this.utilsDir = path.join(rootDir, 'js', 'utils');
        this.outputFile = path.join(rootDir, 'js', 'utils.js');
    }

    /**
     * Build consolidated utils.js
     */
    build() {
        console.log('📦 Building consolidated utils.js...\n');

        const modules = [
            'logger.js',
            'loading.js',
            'error-boundary.js',
            'data-backup.js',
            'gdpr-compliance.js',
            'touch-gestures.js',
            'accessibility.js',
            'spanish-keyboard.js',
            'haptic-feedback.js'
        ];

        let output = `/**
 * Consolidated Utilities Module
 *
 * Combines all utility modules into a single file:
 * - Logger (production-aware logging)
 * - LoadingManager (loading spinners)
 * - ErrorBoundary (error handling)
 * - DataBackupSystem (data export/import)
 * - GDPRCompliance (privacy compliance)
 * - TouchGestureManager (mobile gestures)
 * - AccessibilityManager (WCAG AAA compliance)
 * - SpanishKeyboardHelper (Spanish character input)
 * - HapticFeedbackManager (mobile haptic feedback)
 *
 * Generated: ${new Date().toISOString()}
 */

`;

        for (const module of modules) {
            const filePath = path.join(this.utilsDir, module);

            if (!fs.existsSync(filePath)) {
                console.warn(`⚠️  ${module} not found, skipping...`);
                continue;
            }

            console.log(`📄 Adding ${module}...`);

            let content = fs.readFileSync(filePath, 'utf-8');

            // Remove individual file headers (first comment block)
            content = content.replace(/^\/\*\*[\s\S]*?\*\/\s*\n/, '');

            // Remove module.exports if present
            content = content.replace(/\nif \(typeof module.*?\n\}\s*$/s, '');
            content = content.replace(/\nmodule\.exports.*?;?\s*$/s, '');

            // Add section header
            output += `
// ====================================================================
// ${module.replace('.js', '').toUpperCase().replace(/-/g, ' ')}
// ====================================================================

${content}

`;
        }

        // Write output
        fs.writeFileSync(this.outputFile, output, 'utf-8');

        const stats = fs.statSync(this.outputFile);
        console.log(`\n✅ Generated: ${this.outputFile}`);
        console.log(`📊 File size: ${(stats.size / 1024).toFixed(1)} KB`);
        console.log(`📝 Modules combined: ${modules.length}`);

        return this.outputFile;
    }
}

// Run if called directly
if (require.main === module) {
    const builder = new UtilsBuilder(process.cwd());

    try {
        builder.build();
        console.log('\n✅ Utils consolidation complete!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

module.exports = UtilsBuilder;
