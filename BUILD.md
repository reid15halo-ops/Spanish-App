# Build Pipeline Documentation

## 🚀 Quick Start

### Development
```bash
npm install      # Install dependencies
npm run dev      # Start dev server on http://localhost:3000
```

### Production Build
```bash
npm run build    # Build for production (output: dist/)
npm run preview  # Preview production build
```

## 📦 Build Configuration

### Vite Configuration (`vite.config.js`)

**Minification:**
- Uses Terser for JavaScript minification
- Removes `console.log` and `debugger` statements in production
- Removes comments from output

**Code Splitting:**
The build automatically splits code into optimized chunks:

| Chunk | Files | Description |
|-------|-------|-------------|
| `app-core` | app-core.js | Main application logic |
| `exercise-data` | exercise-data.js | Exercise content (568KB → lazy loaded) |
| `utils` | utils.js | Consolidated utilities |
| `adaptive` | adaptive-learning.js, adaptive-practice-system.js | Adaptive learning system |
| `monitoring` | monitoring.js, error-handling.js | Error & performance monitoring |
| `data` | data-manager.js | Data storage management |
| `features` | improved-feedback.js, tolerant-validator.js, level-test-system.js | Enhanced features |
| `config` | production-config.js, performance-optimizations.js, environment.js | Configuration |

**Source Maps:**
- Enabled for debugging production builds
- Separate `.map` files generated

**Asset Optimization:**
- Images/fonts < 4KB are inlined as base64
- Larger assets copied with content-hash filenames
- CSS code splitting enabled

## 📊 Bundle Analysis

After building, view bundle statistics:
```bash
open dist/stats.html  # Visual bundle analyzer
```

Shows:
- Chunk sizes (gzipped and brotli compressed)
- Module dependencies
- Optimization opportunities

## 🏗️ Build Output Structure

```
dist/
├── index.html                    # HTML entry point
├── manifest.json                 # PWA manifest
├── sw.js                         # Service Worker
├── assets/
│   ├── js/
│   │   ├── app-core-[hash].js   # Core app bundle
│   │   ├── exercise-data-[hash].js  # Exercise data
│   │   ├── utils-[hash].js      # Utilities
│   │   ├── adaptive-[hash].js   # Adaptive learning
│   │   ├── monitoring-[hash].js # Monitoring
│   │   ├── data-[hash].js       # Data management
│   │   ├── features-[hash].js   # Features
│   │   └── config-[hash].js     # Configuration
│   ├── css/
│   │   └── styles-[hash].css    # Stylesheets
│   └── [images, fonts, etc.]    # Other assets
└── stats.html                    # Bundle analyzer report

[hash] = Content-based hash for cache busting
```

## ⚡ Performance Optimizations

### 1. Code Splitting
- Vendor code separated from app code
- Route-based splitting (future enhancement)
- Dynamic imports for lazy loading

### 2. Minification
- JavaScript: Terser with 2-pass optimization
- CSS: Built-in cssnano
- HTML: Minified inline scripts/styles

### 3. Caching
- Content-hash filenames for long-term caching
- Service Worker caches all production assets
- Immutable assets (never change)

### 4. Compression
- Brotli compression recommended (server-side)
- Gzip fallback support
- Typical reduction: 70-80%

## 🎯 Expected Bundle Sizes

### Development (unminified)
- Total JS: ~900KB
- exercise-data.js: 568KB (largest)
- Other files: ~332KB

### Production (minified + gzipped)
- Total JS: ~180-220KB (75-80% reduction)
- exercise-data.js: ~100KB (82% reduction)
- Other files: ~80-120KB (70-75% reduction)

### With Lazy Loading
- Initial Load: ~80-100KB
- On-demand: Loaded as needed

## 🔧 Configuration Options

### Environment Variables
Create `.env` file for custom settings:
```bash
# Base URL for production
VITE_BASE_URL=/

# Enable/disable source maps
VITE_SOURCEMAP=true

# API endpoints (if needed)
VITE_API_URL=https://api.example.com
```

### Custom Build
Modify `vite.config.js` for specific needs:
- Add plugins for specific frameworks
- Adjust chunk splitting strategy
- Configure proxy for API calls
- Add environment-specific builds

## 📝 Development Workflow

### Local Development
1. `npm run dev` - Start dev server with HMR
2. Edit files - Changes reflect immediately
3. Debug with browser DevTools
4. Source maps enabled automatically

### Production Testing
1. `npm run build` - Build for production
2. `npm run preview` - Test production build locally
3. Check `dist/stats.html` for bundle analysis
4. Run Lighthouse audit for performance

### Deployment
1. Build: `npm run build`
2. Deploy `dist/` folder to hosting
3. Configure server for SPA routing
4. Enable compression (Brotli/Gzip)
5. Set cache headers for assets

## 🚀 Deployment Targets

### Static Hosting
- **Netlify**: Drag & drop `dist/` or connect to Git
- **Vercel**: Import project, auto-detects Vite
- **GitHub Pages**: Build and push to `gh-pages` branch
- **Cloudflare Pages**: Connect repo, set build command

### Server Hosting
- **Apache**: Copy `dist/`, configure `.htaccess`
- **Nginx**: Copy `dist/`, configure location blocks
- **Node.js**: Serve with Express/Fastify

### Example: Nginx Configuration
```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/spanish-app/dist;
    index index.html;

    # Compression
    gzip on;
    gzip_types text/css application/javascript application/json;
    brotli on;
    brotli_types text/css application/javascript application/json;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 📈 Performance Monitoring

### Lighthouse Audit
```bash
npm run build
npm run preview
# Run Lighthouse in Chrome DevTools
```

**Target Scores:**
- Performance: 90+
- Accessibility: 100
- Best Practices: 95+
- SEO: 90+
- PWA: 100

### Bundle Size Monitoring
- Check `dist/stats.html` after each build
- Monitor for unexpected size increases
- Set CI/CD checks for bundle size limits

## 🐛 Troubleshooting

### Build Fails
1. Clear cache: `rm -rf node_modules/.vite`
2. Reinstall: `npm install`
3. Check Node version: `node -v` (requires 18+)

### Large Bundle Size
1. Check `dist/stats.html` for heavy modules
2. Review code splitting configuration
3. Enable lazy loading for large components

### Source Maps Not Working
1. Ensure `sourcemap: true` in `vite.config.js`
2. Deploy `.map` files with JavaScript bundles
3. Check browser DevTools settings

## 🔄 Migration from Development

If running without build pipeline:
1. Install dependencies: `npm install`
2. Test in dev mode: `npm run dev`
3. Build for production: `npm run build`
4. Update deployment to use `dist/` folder
5. Update Service Worker paths if needed

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [Rollup Documentation](https://rollupjs.org/)
- [Terser Options](https://terser.org/docs/api-reference)
- [Bundle Analyzer](https://github.com/btd/rollup-plugin-visualizer)

---

**Created**: 2025-11-05
**Version**: 1.2.0
**Status**: Production Ready
