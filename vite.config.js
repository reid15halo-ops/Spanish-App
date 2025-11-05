import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  // Base public path
  base: './',

  // Build configuration
  build: {
    // Output directory
    outDir: 'dist',

    // Generate source maps for debugging
    sourcemap: true,

    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        passes: 2
      },
      format: {
        comments: false // Remove comments
      }
    },

    // Chunk size warning limit (500kb)
    chunkSizeWarningLimit: 500,

    // Rollup options for code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for third-party code (currently none, but prepared)
          // 'vendor': ['module-name'],

          // Core app logic
          'app-core': [
            './js/app-core.js'
          ],

          // Exercise data (large file)
          'exercise-data': [
            './js/exercise-data.js'
          ],

          // Utilities (consolidated)
          'utils': [
            './js/utils.js'
          ],

          // Adaptive learning system
          'adaptive': [
            './js/adaptive-learning.js',
            './js/adaptive-practice-system.js'
          ],

          // Monitoring and error handling
          'monitoring': [
            './js/monitoring.js',
            './js/error-handling.js'
          ],

          // Data management
          'data': [
            './js/data-manager.js'
          ],

          // Enhanced features
          'features': [
            './js/improved-feedback.js',
            './js/tolerant-validator.js',
            './js/level-test-system.js'
          ],

          // Configuration
          'config': [
            './js/production-config.js',
            './js/performance-optimizations.js',
            './js/config/environment.js'
          ]
        },

        // Naming pattern for chunks
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },

    // Asset inline threshold (4kb)
    assetsInlineLimit: 4096,

    // CSS code splitting
    cssCodeSplit: true
  },

  // Development server configuration
  server: {
    port: 3000,
    open: true,
    cors: true
  },

  // Preview server configuration
  preview: {
    port: 4173,
    open: true
  },

  // Plugins
  plugins: [
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ]
});
