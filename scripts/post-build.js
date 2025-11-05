#!/usr/bin/env node

/**
 * Post-build script for Spanish Learning App
 *
 * Handles copying static files and updating service worker for production builds.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

console.log('🔧 Running post-build tasks...\n');

// 1. Copy Service Worker
console.log('📋 Copying Service Worker...');
try {
    const swSource = path.join(projectRoot, 'sw.js');
    const swDest = path.join(distDir, 'sw.js');
    fs.copyFileSync(swSource, swDest);
    console.log('✅ Service Worker copied to dist/sw.js');
} catch (error) {
    console.error('❌ Failed to copy Service Worker:', error.message);
    process.exit(1);
}

// 2. Copy manifest.json (if not already copied by Vite)
console.log('\n📋 Checking manifest.json...');
try {
    const manifestDest = path.join(distDir, 'manifest.json');
    if (!fs.existsSync(manifestDest)) {
        const manifestSource = path.join(projectRoot, 'manifest.json');
        fs.copyFileSync(manifestSource, manifestDest);
        console.log('✅ manifest.json copied');
    } else {
        console.log('✅ manifest.json already exists');
    }
} catch (error) {
    console.warn('⚠️  manifest.json not found (optional)');
}

// 3. Copy icons directory
console.log('\n📋 Copying icons...');
try {
    const iconsSource = path.join(projectRoot, 'icons');
    const iconsDest = path.join(distDir, 'icons');

    if (fs.existsSync(iconsSource)) {
        if (!fs.existsSync(iconsDest)) {
            fs.mkdirSync(iconsDest, { recursive: true });
        }

        const icons = fs.readdirSync(iconsSource);
        icons.forEach(icon => {
            fs.copyFileSync(
                path.join(iconsSource, icon),
                path.join(iconsDest, icon)
            );
        });
        console.log(`✅ Copied ${icons.length} icons`);
    } else {
        console.log('⚠️  No icons directory found (optional)');
    }
} catch (error) {
    console.warn('⚠️  Failed to copy icons:', error.message);
}

// 4. Copy data directory (if it exists and isn't already in assets)
console.log('\n📋 Checking data directory...');
try {
    const dataSource = path.join(projectRoot, 'data');
    const dataDest = path.join(distDir, 'data');

    if (fs.existsSync(dataSource)) {
        // Only copy if data directory has JSON files for lazy loading
        const files = fs.readdirSync(dataSource, { recursive: true });
        const jsonFiles = files.filter(f => f.endsWith('.json'));

        if (jsonFiles.length > 0) {
            console.log(`Found ${jsonFiles.length} JSON files, copying data directory...`);

            if (!fs.existsSync(dataDest)) {
                fs.mkdirSync(dataDest, { recursive: true });
            }

            // Copy all JSON files maintaining directory structure
            jsonFiles.forEach(file => {
                const sourceFile = path.join(dataSource, file);
                const destFile = path.join(dataDest, file);
                const destDir = path.dirname(destFile);

                if (!fs.existsSync(destDir)) {
                    fs.mkdirSync(destDir, { recursive: true });
                }

                fs.copyFileSync(sourceFile, destFile);
            });

            console.log('✅ Data directory copied');
        } else {
            console.log('✅ No JSON files to copy (data is bundled)');
        }
    } else {
        console.log('✅ No data directory (data is bundled)');
    }
} catch (error) {
    console.warn('⚠️  Failed to copy data:', error.message);
}

// 5. Update Service Worker cache version and paths
console.log('\n📋 Updating Service Worker for production...');
try {
    const swPath = path.join(distDir, 'sw.js');
    let swContent = fs.readFileSync(swPath, 'utf-8');

    // Update cache version to force cache refresh
    const newVersion = 'v1.2.0-' + Date.now();
    swContent = swContent.replace(
        /const CACHE_VERSION = ['"]v[\d.]+['"]/,
        `const CACHE_VERSION = '${newVersion}'`
    );

    // Note: Vite generates hashed filenames, so we might need a different caching strategy
    // For now, keep the current SW logic which caches on fetch

    fs.writeFileSync(swPath, swContent);
    console.log(`✅ Service Worker updated (${newVersion})`);
} catch (error) {
    console.warn('⚠️  Failed to update Service Worker:', error.message);
}

// 6. Generate build info
console.log('\n📋 Generating build info...');
try {
    const buildInfo = {
        version: '1.2.0',
        buildDate: new Date().toISOString(),
        buildType: 'production',
        vite: true,
        minified: true,
        sourceMap: true
    };

    fs.writeFileSync(
        path.join(distDir, 'build-info.json'),
        JSON.stringify(buildInfo, null, 2)
    );
    console.log('✅ Build info generated');
} catch (error) {
    console.warn('⚠️  Failed to generate build info:', error.message);
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('✅ Post-build tasks completed!');
console.log('='.repeat(50));

// Get file sizes
try {
    const stats = fs.statSync(distDir);
    console.log('\n📊 Build Statistics:');
    console.log(`   Output directory: dist/`);

    // Count files
    const countFiles = (dir) => {
        let count = 0;
        const items = fs.readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
            if (item.isFile()) count++;
            else if (item.isDirectory()) {
                count += countFiles(path.join(dir, item.name));
            }
        }
        return count;
    };

    const totalFiles = countFiles(distDir);
    console.log(`   Total files: ${totalFiles}`);

    // Get JS bundle sizes
    const jsDir = path.join(distDir, 'assets', 'js');
    if (fs.existsSync(jsDir)) {
        const jsFiles = fs.readdirSync(jsDir)
            .filter(f => f.endsWith('.js') && !f.endsWith('.map'));

        let totalSize = 0;
        jsFiles.forEach(file => {
            const stats = fs.statSync(path.join(jsDir, file));
            totalSize += stats.size;
        });

        console.log(`   JS bundles: ${jsFiles.length} files (${(totalSize / 1024).toFixed(2)} KB)`);
    }

    console.log('\n🚀 Ready for deployment!');
    console.log('   Preview: npm run preview');
    console.log('   Deploy:  Upload dist/ to your hosting');

} catch (error) {
    console.log('\n✅ Build complete!');
}
