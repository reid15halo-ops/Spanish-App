#!/usr/bin/env node

/**
 * Production Build Script
 *
 * Creates optimized production build
 * Run with: node build.js
 */

const fs = require('fs');
const path = require('path');

const BUILD_DIR = 'dist';
const VERSION = '1.0.0';

console.log('🚀 Building Spanish Learning App...\n');

// Create dist directory
if (!fs.existsSync(BUILD_DIR)) {
    fs.mkdirSync(BUILD_DIR);
}

// Copy files
const filesToCopy = [
    'index.html',
    'manifest.json',
    'sw.js',
    'privacy-policy.html',
    'offline.html'
];

const dirsToCopy = [
    'js',
    'data',
    'icons',
    'screenshots'
];

console.log('📁 Copying files...');
filesToCopy.forEach(file => {
    if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join(BUILD_DIR, file));
        console.log(`✓ ${file}`);
    }
});

console.log('\n📁 Copying directories...');
dirsToCopy.forEach(dir => {
    if (fs.existsSync(dir)) {
        copyDir(dir, path.join(BUILD_DIR, dir));
        console.log(`✓ ${dir}/`);
    }
});

// Update version in files
console.log('\n🔧 Updating version...');
updateVersion(path.join(BUILD_DIR, 'manifest.json'));
updateVersion(path.join(BUILD_DIR, 'sw.js'));

// Create _headers file for Netlify
console.log('\n🔒 Creating security headers...');
createHeadersFile();

// Create netlify.toml
console.log('⚙️  Creating netlify.toml...');
createNetlifyConfig();

console.log('\n✅ Build complete!\n');
console.log(`📦 Output: ${BUILD_DIR}/`);
console.log(`📊 Version: ${VERSION}\n`);

// Helper functions
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function updateVersion(file) {
    if (!fs.existsSync(file)) return;

    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/v\d+\.\d+\.\d+/g, `v${VERSION}`);
    content = content.replace(/"version":\s*"[^"]+"/g, `"version": "${VERSION}"`);
    fs.writeFileSync(file, content);
}

function createHeadersFile() {
    const headers = `/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; manifest-src 'self'
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  X-XSS-Protection: 1; mode=block
  Strict-Transport-Security: max-age=31536000; includeSubDomains

/sw.js
  Service-Worker-Allowed: /
  Cache-Control: public, max-age=0, must-revalidate

/manifest.json
  Content-Type: application/manifest+json
  Cache-Control: public, max-age=3600

/*.js
  Cache-Control: public, max-age=31536000, immutable

/data/*
  Cache-Control: public, max-age=86400
`;

    fs.writeFileSync(path.join(BUILD_DIR, '_headers'), headers);
}

function createNetlifyConfig() {
    const config = `[build]
  publish = "."
  command = "echo 'No build command needed'"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "no-referrer"

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
    Service-Worker-Allowed = "/"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
  force = true
`;

    fs.writeFileSync(path.join(BUILD_DIR, 'netlify.toml'), config);
}
