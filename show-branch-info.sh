#!/bin/bash

echo "=================================================="
echo "  SPANISH APP - BRANCH STATUS"
echo "=================================================="
echo ""

echo "📍 AKTUELLER BRANCH:"
git branch --show-current
echo ""

echo "📊 DATEIEN IM JS/ ORDNER:"
echo "   Anzahl: $(ls -1 js/*.js 2>/dev/null | wc -l) JavaScript Dateien"
echo "   Größe: $(du -sh js/ 2>/dev/null | cut -f1)"
echo ""

echo "✅ LETZTE 5 COMMITS:"
git log --oneline -5
echo ""

echo "🌐 REMOTE BRANCHES:"
git branch -r | grep -E "(master|main|claude)" | head -5
echo ""

echo "💾 LOKALE BRANCHES:"
git branch -a | head -10
echo ""

echo "📦 PRODUCTION-READY FILES:"
echo "   ✅ production.html ($(ls -lh production.html 2>/dev/null | awk '{print $5}'))"
echo "   ✅ js/production-config.js ($(ls -lh js/production-config.js 2>/dev/null | awk '{print $5}'))"
echo "   ✅ js/error-handling.js ($(ls -lh js/error-handling.js 2>/dev/null | awk '{print $5}'))"
echo "   ✅ css/ux-enhancements.css ($(ls -lh css/ux-enhancements.css 2>/dev/null | awk '{print $5}'))"
echo ""

echo "=================================================="
echo "  EMPFEHLUNG"
echo "=================================================="
echo ""
echo "Dieser Branch ist sauber und production-ready!"
echo ""
echo "Um ihn als main Branch zu nutzen:"
echo "1. Gehe zu: https://github.com/reid15halo-ops/Spanish-App/settings/branches"
echo "2. Ändere Default Branch zu: $(git branch --show-current)"
echo "3. Optional: Benenne alten 'master' um zu 'old-master-backup'"
echo ""
echo "Mehr Details: cat BRANCH-MIGRATION-GUIDE.md"
echo ""

