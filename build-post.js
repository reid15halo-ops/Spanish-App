/**
 * Post-build script to organize compiled TypeScript files
 * Copies compiled JS files from dist/ to js/ directory
 */

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const jsDir = path.join(__dirname, 'js');

console.log('Post-build: Organizing compiled files...');

// Ensure js directory exists
if (!fs.existsSync(jsDir)) {
    fs.mkdirSync(jsDir, { recursive: true });
}

// Copy all files from dist to js
function copyRecursive(src, dest) {
    if (!fs.existsSync(src)) {
        console.log(`Source directory ${src} does not exist`);
        return;
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            if (!fs.existsSync(destPath)) {
                fs.mkdirSync(destPath, { recursive: true });
            }
            copyRecursive(srcPath, destPath);
        } else if (entry.isFile() && entry.name.endsWith('.js')) {
            // Only copy .js files (skip .d.ts and .map files for now)
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied: ${entry.name}`);
        }
    }
}

try {
    copyRecursive(distDir, jsDir);
    console.log('Post-build: Complete!');
} catch (error) {
    console.error('Post-build error:', error);
    process.exit(1);
}
