#!/usr/bin/env node

/**
 * Test script for Spanish App Debugger
 * Run with: node test-debugger.js
 */

// Simulate browser environment
global.document = {
    getElementById: () => null,
    addEventListener: () => null,
    querySelectorAll: () => []
};

global.localStorage = {
    getItem: () => null,
    setItem: () => null,
    removeItem: () => null
};

global.window = global;

// Load modules
const Phase1Controller = require('./js/mock-phase1-controller.js');
const UIController = require('./js/ui-controller.js');
const AppController = require('./js/app-controller.js');
const SpanishAppDebugger = require('./js/spanish-app-debugger.js');

// Run debugger
console.log('🚀 Starting Spanish App Debugger Test\n');

try {
    // Initialize mock UI elements
    const mockUI = {
        elements: {},
        state: {},
        initElements: () => {},
        attachEventListeners: () => {},
        showLoading: () => {},
        hideLoading: () => {},
        showError: () => {},
        updateStatus: () => {},
        updateProgress: () => {},
        renderExercise: () => {},
        reset: () => {},
        showCompletion: () => {}
    };

    // Initialize controllers
    const mockController = new Phase1Controller();
    const appController = new AppController(mockUI);

    // Create debugger instance
    const debuggerTool = new SpanishAppDebugger(appController, mockController);

    // Generate report
    const report = debuggerTool.generateReport();

    // Output report
    console.log(report);

    // Export JSON
    const json = debuggerTool.getIssuesJSON();
    console.log('\n📦 JSON Export:');
    console.log(JSON.stringify(json, null, 2));

    // Exit code based on issues
    const exitCode = json.summary.errors > 0 ? 1 : 0;
    process.exit(exitCode);

} catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
}
