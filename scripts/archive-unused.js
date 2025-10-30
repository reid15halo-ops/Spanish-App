/**
 * Archive Unused Files Script
 *
 * Moves unused JavaScript files to archive/ directory
 * Uses categorization from dependency-report.json
 */

const fs = require('fs');
const path = require('path');

class FileArchiver {
    constructor(rootDir) {
        this.rootDir = rootDir;
        this.archiveDir = path.join(rootDir, 'archive');
        this.reportPath = path.join(rootDir, 'dependency-report.json');
    }

    /**
     * Run archival process
     */
    async run(dryRun = false) {
        console.log('📦 Starting file archival process...\n');

        // Load dependency report
        if (!fs.existsSync(this.reportPath)) {
            throw new Error('dependency-report.json not found. Run dependency-cleanup.js first.');
        }

        const report = JSON.parse(fs.readFileSync(this.reportPath, 'utf-8'));
        console.log(`📊 Total unused files: ${report.summary.unusedFiles}`);

        // Create archive structure
        this.createArchiveStructure();

        // Archive files by category
        const categoryMap = {
            'Development Tools': 'development',
            'Testing & Debug': 'testing',
            'Experimental': 'experimental',
            'Specialized Systems': 'specialized',
            'Old Versions': 'old-versions',
            'Uncategorized': 'uncategorized'
        };

        let totalMoved = 0;

        for (const [category, files] of Object.entries(report.categories)) {
            if (files.length === 0) continue;

            const archiveSubdir = categoryMap[category] || 'uncategorized';
            console.log(`\n📁 ${category} → archive/${archiveSubdir}/`);

            for (const file of files) {
                const sourcePath = path.join(this.rootDir, file);
                const destPath = path.join(this.archiveDir, archiveSubdir, path.basename(file));

                if (dryRun) {
                    console.log(`   [DRY RUN] ${file} → ${destPath}`);
                } else {
                    if (fs.existsSync(sourcePath)) {
                        fs.renameSync(sourcePath, destPath);
                        console.log(`   ✅ Moved: ${path.basename(file)}`);
                        totalMoved++;
                    } else {
                        console.log(`   ⚠️  Not found: ${file}`);
                    }
                }
            }
        }

        console.log(`\n✅ Archival complete!`);
        console.log(`📦 Files moved: ${totalMoved}`);
        console.log(`📁 Archive location: ${this.archiveDir}`);

        // Create archive README
        if (!dryRun) {
            this.createArchiveREADME(report);
        }

        return {
            totalMoved,
            archiveDir: this.archiveDir
        };
    }

    /**
     * Create archive directory structure
     */
    createArchiveStructure() {
        const subdirs = [
            'development',
            'testing',
            'experimental',
            'specialized',
            'old-versions',
            'uncategorized'
        ];

        if (!fs.existsSync(this.archiveDir)) {
            fs.mkdirSync(this.archiveDir, { recursive: true });
        }

        subdirs.forEach(subdir => {
            const dirPath = path.join(this.archiveDir, subdir);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
        });

        console.log('✅ Archive structure created\n');
    }

    /**
     * Create README for archive
     */
    createArchiveREADME(report) {
        const readme = `# Archived Files

This directory contains JavaScript files that were archived during the code consolidation process.

**Archive Date:** ${new Date().toISOString()}
**Total Files Archived:** ${report.summary.unusedFiles}

## Directory Structure

- **development/** - Mock implementations and development utilities
- **testing/** - Testing and debugging tools
- **experimental/** - Experimental features and prototypes
- **specialized/** - Specialized systems (conjugators, verb packs, etc.)
- **old-versions/** - Previous versions of files
- **uncategorized/** - Other unused files

## What Happened?

The Spanish Learning App was consolidated from 71 JavaScript files to 5 core modules:

1. **js/environment.js** - Environment configuration
2. **js/exercise-data.js** - All exercise data (inlined JSON)
3. **js/app-core.js** - Main app + exercise loader + renderer
4. **js/utils.js** - All utilities + accessibility features
5. **js/monitoring.js** - Error and performance monitoring

## Why Were These Files Archived?

These files were not loaded by index.html and are not part of the active codebase.
They may contain:
- Experimental features that were never fully integrated
- Old versions of files that have been updated
- Development and testing tools
- Specialized systems that are not currently used

## Can I Delete These Files?

**Not recommended immediately.** These files contain valuable code that may be:
- Referenced in documentation
- Useful for future features
- Important for understanding the app's development history

Keep this archive for at least 3-6 months before considering permanent deletion.

## Restoring Files

To restore a file from the archive:
1. Copy the file from archive/category/ back to js/
2. Add a script tag to index.html to load it
3. Test thoroughly

## Consolidated Files

The consolidation eliminates:
- ❌ CORS issues with file:// URLs (JSON data now inlined)
- ❌ Module dependency complexity
- ❌ Long load times from multiple script tags

The app now:
- ✅ Loads faster
- ✅ Works offline without server
- ✅ Easy to share as ZIP
- ✅ Double-click index.html to run

---

Generated by: scripts/archive-unused.js
Report: dependency-report.json
`;

        fs.writeFileSync(path.join(this.archiveDir, 'README.md'), readme, 'utf-8');
        console.log('📄 Created archive/README.md');
    }
}

// Run if called directly
if (require.main === module) {
    const archiver = new FileArchiver(process.cwd());

    // Check for --dry-run flag
    const dryRun = process.argv.includes('--dry-run');

    if (dryRun) {
        console.log('🔍 DRY RUN MODE - No files will be moved\n');
    }

    archiver.run(dryRun)
        .then((result) => {
            console.log('\n🎉 Done!');
            if (dryRun) {
                console.log('\n💡 To actually move files, run without --dry-run flag');
            }
        })
        .catch(error => {
            console.error('❌ Error:', error);
            process.exit(1);
        });
}

module.exports = FileArchiver;
