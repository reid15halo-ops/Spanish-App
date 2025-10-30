/**
 * Dependency Cleanup Analyzer
 *
 * Analyzes which JavaScript modules are actually used by index.html
 * and identifies candidates for archival
 */

const fs = require('fs');
const path = require('path');

class DependencyAnalyzer {
    constructor(rootDir) {
        this.rootDir = rootDir;
        this.usedFiles = new Set();
        this.unusedFiles = new Set();
        this.dataFiles = new Set();
    }

    /**
     * Analyze all dependencies starting from index.html
     */
    async analyze() {
        console.log('🔍 Analyzing dependencies...\n');

        // 1. Find all script tags in index.html
        const indexHTML = fs.readFileSync(path.join(this.rootDir, 'index.html'), 'utf-8');
        const scriptMatches = indexHTML.matchAll(/<script\s+src="([^"]+)"/g);

        for (const match of scriptMatches) {
            const scriptPath = match[1];
            this.usedFiles.add(scriptPath);
            console.log(`✅ USED: ${scriptPath}`);
        }

        // 2. Find all JavaScript files
        const allJSFiles = this.findAllFiles('js', '.js');
        console.log(`\n📊 Total JS files found: ${allJSFiles.length}`);
        console.log(`✅ Used in index.html: ${this.usedFiles.size}`);

        // 3. Identify unused files
        for (const file of allJSFiles) {
            const relativePath = file.replace(this.rootDir + '/', '');
            if (!this.usedFiles.has(relativePath)) {
                this.unusedFiles.add(relativePath);
            }
        }

        console.log(`❌ Unused files: ${this.unusedFiles.size}\n`);

        // 4. Find all JSON data files
        const allDataFiles = this.findAllFiles('data', '.json');
        for (const file of allDataFiles) {
            this.dataFiles.add(file.replace(this.rootDir + '/', ''));
        }

        console.log(`📦 JSON data files: ${this.dataFiles.size}\n`);

        // 5. Generate report
        this.generateReport();

        return {
            used: Array.from(this.usedFiles),
            unused: Array.from(this.unusedFiles),
            data: Array.from(this.dataFiles)
        };
    }

    /**
     * Find all files in directory with extension
     */
    findAllFiles(dir, ext) {
        const dirPath = path.join(this.rootDir, dir);
        if (!fs.existsSync(dirPath)) {
            return [];
        }

        const files = [];
        const items = fs.readdirSync(dirPath, { withFileTypes: true });

        for (const item of items) {
            const fullPath = path.join(dirPath, item.name);

            if (item.isDirectory()) {
                files.push(...this.findAllFiles(path.join(dir, item.name), ext));
            } else if (item.name.endsWith(ext)) {
                files.push(fullPath);
            }
        }

        return files;
    }

    /**
     * Generate detailed report
     */
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalJSFiles: this.findAllFiles('js', '.js').length,
                usedFiles: this.usedFiles.size,
                unusedFiles: this.unusedFiles.size,
                dataFiles: this.dataFiles.size
            },
            used: Array.from(this.usedFiles).sort(),
            unused: Array.from(this.unusedFiles).sort(),
            data: Array.from(this.dataFiles).sort(),
            categories: this.categorizeUnusedFiles()
        };

        // Write to file
        const reportPath = path.join(this.rootDir, 'dependency-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        console.log(`📄 Report saved to: dependency-report.json\n`);

        // Print summary
        console.log('=== CLEANUP SUMMARY ===\n');
        console.log(`Total JS files:    ${report.summary.totalJSFiles}`);
        console.log(`✅ Used files:     ${report.summary.usedFiles}`);
        console.log(`❌ Unused files:   ${report.summary.unusedFiles}`);
        console.log(`📦 Data files:     ${report.summary.dataFiles}\n`);

        // Print categories
        console.log('=== UNUSED FILES BY CATEGORY ===\n');
        for (const [category, files] of Object.entries(report.categories)) {
            console.log(`${category}: ${files.length} files`);
            files.forEach(f => console.log(`  - ${f}`));
            console.log();
        }

        return report;
    }

    /**
     * Categorize unused files for organized archival
     */
    categorizeUnusedFiles() {
        const categories = {
            'Development Tools': [],
            'Testing & Debug': [],
            'Experimental': [],
            'Specialized Systems': [],
            'Old Versions': [],
            'Uncategorized': []
        };

        for (const file of this.unusedFiles) {
            if (file.includes('test') || file.includes('debug') || file.includes('debugger')) {
                categories['Testing & Debug'].push(file);
            } else if (file.includes('mock') || file.includes('diagnostic')) {
                categories['Development Tools'].push(file);
            } else if (file.includes('v1') || file.includes('old') || file.includes('-v2')) {
                categories['Old Versions'].push(file);
            } else if (file.includes('periphrastic') || file.includes('conjugator') ||
                       file.includes('zeiten') || file.includes('verb-pack')) {
                categories['Specialized Systems'].push(file);
            } else if (file.includes('experimental') || file.includes('prototype')) {
                categories['Experimental'].push(file);
            } else {
                categories['Uncategorized'].push(file);
            }
        }

        return categories;
    }

    /**
     * Create archive structure
     */
    async createArchiveStructure() {
        console.log('\n📁 Creating archive structure...\n');

        const archiveDir = path.join(this.rootDir, 'archive');

        // Create main archive directory
        if (!fs.existsSync(archiveDir)) {
            fs.mkdirSync(archiveDir, { recursive: true });
        }

        // Create category directories
        const categories = ['development', 'testing', 'experimental', 'specialized', 'old-versions'];
        for (const category of categories) {
            const categoryDir = path.join(archiveDir, category);
            if (!fs.existsSync(categoryDir)) {
                fs.mkdirSync(categoryDir, { recursive: true });
            }
        }

        console.log('✅ Archive structure created:\n');
        console.log('archive/');
        console.log('├── development/');
        console.log('├── testing/');
        console.log('├── experimental/');
        console.log('├── specialized/');
        console.log('└── old-versions/\n');
    }
}

// Run if called directly
if (require.main === module) {
    const analyzer = new DependencyAnalyzer(process.cwd());

    analyzer.analyze()
        .then(() => analyzer.createArchiveStructure())
        .then(() => {
            console.log('✅ Analysis complete!');
            console.log('\nNext steps:');
            console.log('1. Review dependency-report.json');
            console.log('2. Run archival script to move unused files');
            console.log('3. Create consolidated modules');
            console.log('4. Inline JSON data');
        })
        .catch(error => {
            console.error('❌ Error:', error);
            process.exit(1);
        });
}

module.exports = DependencyAnalyzer;
