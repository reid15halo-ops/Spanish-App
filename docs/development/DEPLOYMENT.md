# Deployment Guide - Spanish Learning App

Complete guide for deploying the Spanish Learning App to various hosting platforms.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Building for Production](#building-for-production)
3. [Deployment Platforms](#deployment-platforms)
   - [GitHub Pages](#github-pages)
   - [Netlify](#netlify)
   - [Vercel](#vercel)
   - [Custom Server](#custom-server)
4. [Post-Deployment](#post-deployment)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- ✅ All files committed to git
- ✅ Node.js installed (for build script)
- ✅ Icons created in `/icons` directory
- ✅ Data files populated in `/data` directory

---

## Building for Production

### Option 1: Using the Build Script

```bash
node build.js
```

This will:
- Create a `dist/` directory
- Copy all necessary files
- Update version numbers
- Create security headers
- Generate netlify.toml

### Option 2: Manual Build

If you prefer not to use the build script:

```bash
# Create dist directory
mkdir dist

# Copy files
cp index.html dist/
cp manifest.json dist/
cp sw.js dist/
cp privacy-policy.html dist/
cp offline.html dist/
cp _headers dist/
cp -r js dist/
cp -r data dist/
cp -r icons dist/
cp -r screenshots dist/
```

---

## Deployment Platforms

### GitHub Pages

#### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select **main** branch
4. Choose **/ (root)** as the folder
5. Click **Save**

#### Step 2: Configure for GitHub Pages

If your repository is not at the root domain (e.g., `username.github.io/repo-name`), update paths:

**In `index.html`:**
```html
<!-- Change absolute paths to relative -->
<link rel="manifest" href="./manifest.json">
<script src="./js/app.js"></script>
```

**In `manifest.json`:**
```json
{
  "start_url": "./",
  "scope": "./"
}
```

**In `sw.js`:**
```javascript
// Update cache URLs to include base path
const urlsToCache = [
    './',
    './index.html',
    './js/app.js',
    // ...
];
```

#### Step 3: Deploy

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

Your app will be live at: `https://username.github.io/repo-name`

#### Troubleshooting GitHub Pages

- **404 errors**: Make sure all paths are relative, not absolute
- **Service Worker issues**: Ensure `scope` in manifest.json matches your base path
- **HTTPS required**: GitHub Pages uses HTTPS by default (good for PWA!)

---

### Netlify

Netlify is the recommended platform for this app.

#### Method 1: Deploy via Git (Recommended)

1. **Sign up at [netlify.com](https://netlify.com)**

2. **Click "Add new site" → "Import an existing project"**

3. **Connect your Git repository**
   - Choose GitHub, GitLab, or Bitbucket
   - Authorize Netlify
   - Select your repository

4. **Configure build settings**
   ```
   Build command: (leave empty - no build needed)
   Publish directory: /
   ```

5. **Click "Deploy site"**

That's it! Netlify will automatically:
- Deploy your site
- Apply security headers from `_headers`
- Enable HTTPS
- Create a unique URL (e.g., `random-name.netlify.app`)

#### Method 2: Drag & Drop Deploy

1. Build your app: `node build.js`
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag the `dist/` folder onto the page
4. Done!

#### Custom Domain on Netlify

1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Enter your domain (e.g., `spanishapp.com`)
4. Follow DNS configuration instructions

#### Environment Variables on Netlify

1. Go to **Site settings** → **Environment variables**
2. Add variables:
   ```
   NODE_ENV=production
   APP_VERSION=1.0.0
   ```

#### Netlify Configuration

The `netlify.toml` file (created by build script) configures:

```toml
[build]
  publish = "."
  command = "echo 'No build command needed'"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
    Service-Worker-Allowed = "/"
```

---

### Vercel

#### Method 1: Deploy via Git

1. **Sign up at [vercel.com](https://vercel.com)**

2. **Click "Add New" → "Project"**

3. **Import your repository**

4. **Configure project**
   ```
   Framework Preset: Other
   Build Command: (leave empty)
   Output Directory: (leave empty or ".")
   ```

5. **Click "Deploy"**

#### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### vercel.json Configuration

Create `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "no-referrer"
        }
      ]
    },
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        },
        {
          "key": "Service-Worker-Allowed",
          "value": "/"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

### Custom Server

#### Apache (.htaccess)

Create `.htaccess`:

```apache
# Enable HTTPS redirect
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security headers
<IfModule mod_headers.c>
    Header set X-Frame-Options "DENY"
    Header set X-Content-Type-Options "nosniff"
    Header set Referrer-Policy "no-referrer"
    Header set X-XSS-Protection "1; mode=block"
    Header set Permissions-Policy "geolocation=(), microphone=(), camera=()"

    # Service Worker
    <FilesMatch "sw\.js$">
        Header set Service-Worker-Allowed "/"
        Header set Cache-Control "public, max-age=0, must-revalidate"
    </FilesMatch>

    # Cache control
    <FilesMatch "\.(js|css)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>

    <FilesMatch "\.(html)$">
        Header set Cache-Control "no-cache, no-store, must-revalidate"
    </FilesMatch>
</IfModule>

# MIME types
<IfModule mod_mime.c>
    AddType application/manifest+json .webmanifest .json
    AddType application/javascript .js
    AddType text/css .css
</IfModule>
```

#### Nginx

Add to `nginx.conf`:

```nginx
server {
    listen 443 ssl http2;
    server_name spanishapp.com;

    # SSL configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Root directory
    root /var/www/spanish-app;
    index index.html;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Service Worker
    location = /sw.js {
        add_header Service-Worker-Allowed "/" always;
        add_header Cache-Control "public, max-age=0, must-revalidate" always;
        try_files $uri =404;
    }

    # Static files caching
    location ~* \.(js|css)$ {
        add_header Cache-Control "public, max-age=31536000, immutable" always;
        try_files $uri =404;
    }

    # HTML files - no cache
    location ~* \.html$ {
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;
        try_files $uri =404;
    }

    # Data files
    location /data/ {
        add_header Cache-Control "public, max-age=86400" always;
        try_files $uri =404;
    }

    # Default location
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name spanishapp.com;
    return 301 https://$server_name$request_uri;
}
```

#### Node.js + Express

```javascript
const express = require('express');
const path = require('path');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"],
            fontSrc: ["'self'", "data:"],
        }
    },
    frameguard: { action: 'deny' },
    referrerPolicy: { policy: 'no-referrer' }
}));

// Service Worker special headers
app.get('/sw.js', (req, res) => {
    res.set('Service-Worker-Allowed', '/');
    res.set('Cache-Control', 'public, max-age=0, must-revalidate');
    res.sendFile(path.join(__dirname, 'sw.js'));
});

// Static files with caching
app.use('/js', express.static('js', {
    maxAge: '365d',
    immutable: true
}));

app.use('/data', express.static('data', {
    maxAge: '1d'
}));

app.use('/icons', express.static('icons', {
    maxAge: '365d',
    immutable: true
}));

// HTML files - no cache
app.use(express.static('.', {
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
    }
}));

// SPA fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Spanish Learning App running on port ${PORT}`);
});
```

---

## Post-Deployment

### 1. Test PWA Installation

1. Open your deployed site in Chrome/Edge
2. Look for the install button in the address bar
3. Click "Install"
4. Verify the app opens in standalone mode

### 2. Test Offline Functionality

1. Open DevTools → Network tab
2. Check "Offline" mode
3. Refresh the page
4. Verify the app still works

### 3. Verify Security Headers

Use [securityheaders.com](https://securityheaders.com) to check your headers.

### 4. Test Performance

Use [Lighthouse](https://web.dev/measure/):
```bash
# Chrome DevTools → Lighthouse
# Or use CLI:
npm install -g lighthouse
lighthouse https://your-app.com --view
```

Target scores:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+
- PWA: ✓ All checks pass

### 5. Monitor Errors

Check browser console on production:
```javascript
// Access error log
console.log(window.ErrorMonitor.getStats());

// Export errors
window.ErrorMonitor.exportErrors();
```

### 6. GDPR Compliance Check

Verify:
- ✅ Consent banner appears on first visit
- ✅ "Export Data" works in settings
- ✅ "Delete Data" works in settings
- ✅ Privacy policy is accessible
- ✅ All data stays local (check Network tab)

---

## Troubleshooting

### Service Worker Not Updating

```javascript
// Force service worker update
navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(reg => reg.unregister());
});
location.reload();
```

### PWA Not Installable

Check requirements:
- ✅ HTTPS (required)
- ✅ manifest.json with required fields
- ✅ Service Worker registered
- ✅ Icons (192x192 and 512x512 minimum)
- ✅ Valid start_url

### CORS Errors

If loading resources from CDN:

```javascript
// In manifest.json
{
  "start_url": "./",
  "scope": "./"
}
```

### Cache Issues

Clear caches:

```javascript
// In DevTools console
caches.keys().then(keys => {
    keys.forEach(key => caches.delete(key));
});
```

### Relative vs Absolute Paths

**GitHub Pages (subfolder):**
```html
<!-- Use relative paths -->
<link href="./manifest.json">
<script src="./js/app.js"></script>
```

**Custom domain (root):**
```html
<!-- Use absolute paths -->
<link href="/manifest.json">
<script src="/js/app.js"></script>
```

---

## Performance Optimization Tips

### 1. Minimize JavaScript

```bash
# Install terser
npm install -g terser

# Minify all JS files
find js -name "*.js" -exec terser {} -o {}.min.js \;
```

### 2. Optimize Images

```bash
# Install imagemin
npm install -g imagemin-cli imagemin-pngquant

# Optimize PNGs
imagemin icons/*.png --out-dir=icons --plugin=pngquant
```

### 3. Enable Compression

Most hosting platforms enable gzip/brotli automatically, but for custom servers:

**Nginx:**
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

**Apache:**
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/css application/json application/javascript
</IfModule>
```

---

## Monitoring and Analytics

### Privacy-First Analytics

Since this app doesn't use external analytics, you can add privacy-focused solutions:

**Option 1: Self-hosted Plausible**
```html
<script defer data-domain="yourdomain.com" src="https://your-plausible-instance.com/js/script.js"></script>
```

**Option 2: Simple Analytics**
```html
<script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
```

**Option 3: Use built-in Performance Monitor**
```javascript
// Export performance data
window.PerformanceMonitor.exportReport();
```

---

## Security Checklist

Before going live:

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Content Security Policy (CSP) tested
- [ ] No sensitive data in code
- [ ] Service Worker scope restricted
- [ ] CORS properly configured
- [ ] Input sanitization implemented
- [ ] GDPR compliance verified
- [ ] Privacy policy accessible
- [ ] Error logging doesn't expose sensitive info

---

## Support

For issues or questions:
- Check [GitHub Issues](https://github.com/your-repo/issues)
- Review [troubleshooting section](#troubleshooting)
- Test locally first: `python -m http.server 8000`

---

## Quick Reference

| Platform | Deployment Time | Difficulty | Best For |
|----------|----------------|------------|----------|
| **Netlify** | 2 minutes | Easy | Production (Recommended) |
| **Vercel** | 2 minutes | Easy | Production |
| **GitHub Pages** | 5 minutes | Medium | Open source projects |
| **Custom Server** | 30+ minutes | Hard | Enterprise/Full control |

---

Happy deploying! 🚀
