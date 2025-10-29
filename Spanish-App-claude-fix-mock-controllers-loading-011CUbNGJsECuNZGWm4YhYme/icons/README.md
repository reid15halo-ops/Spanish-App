# App Icons für Spanish Learning App

Diese Icons werden für die PWA (Progressive Web App) benötigt.

## Benötigte Icon-Größen

### Pflicht (für PWA):
- `icon-16.png` - 16x16px (Favicon)
- `icon-32.png` - 32x32px (Favicon)
- `icon-72.png` - 72x72px (Android)
- `icon-96.png` - 96x96px (Android, Badge)
- `icon-128.png` - 128x128px (Android)
- `icon-144.png` - 144x144px (Windows Tile)
- `icon-152.png` - 152x152px (iOS)
- `icon-192.png` - 192x192px (Android, PWA Standard)
- `icon-384.png` - 384x384px (Android)
- `icon-512.png` - 512x512px (PWA Standard, Maskable)

### Optional (für Shortcuts):
- `shortcut-exercise.png` - 96x96px (Übung starten)
- `shortcut-stats.png` - 96x96px (Statistik)
- `shortcut-vocab.png` - 96x96px (Vokabeltrainer)

## Design-Richtlinien

### Haupticon
**Empfohlenes Design:**
- Hintergrundfarbe: `#20B2AA` (App Accent Color)
- Symbol: Stilisiertes "ES" für Español oder eine Sprechblase
- Stil: Minimalistisch, modern, flach
- Format: PNG mit transparentem Hintergrund (außer bei Maskable Icons)

**Maskable Icons** (icon-192.png, icon-512.png):
- Sicherer Bereich in der Mitte (80% des Icons)
- Hintergrund sollte durchgehend sein (keine Transparenz)
- Wird auf Android für adaptive Icons verwendet

### Farbschema
- Primär: `#20B2AA` (Türkis/Teal)
- Sekundär: `#FFFFFF` (Weiß)
- Text: `#1A1A1A` (Dunkelgrau)

## Schnelle Icon-Generierung

### Option 1: Online-Tool (Empfohlen)
1. Besuche https://www.pwabuilder.com/imageGenerator
2. Lade ein 512x512px Mastericon hoch
3. Wähle "Generate PWA Icons"
4. Lade alle generierten Icons in diesen Ordner herunter

### Option 2: Favicon.io
1. Besuche https://favicon.io/favicon-generator/
2. Erstelle ein Text-Icon mit "ES"
3. Hintergrund: `#20B2AA`
4. Textfarbe: `#FFFFFF`
5. Font: Roboto Bold
6. Lade die generierten Icons herunter

### Option 3: ImageMagick (Kommandozeile)
```bash
# Master-Icon erstellen (512x512)
convert -size 512x512 xc:"#20B2AA" \
  -font Roboto-Bold -pointsize 300 \
  -fill white -gravity center \
  -annotate +0+0 "ES" \
  icon-512.png

# Alle Größen generieren
for size in 16 32 72 96 128 144 152 192 384; do
  convert icon-512.png -resize ${size}x${size} icon-${size}.png
done
```

### Option 4: Photoshop/GIMP/Figma
1. Erstelle ein 512x512px Dokument
2. Hintergrund: `#20B2AA`
3. Füge dein Logo/Design hinzu
4. Exportiere alle benötigten Größen

## Platzhalter verwenden (Temporär)

Falls du sofort testen möchtest ohne Icons zu erstellen:

**Einfarbige Platzhalter generieren:**
```bash
# Windows (PowerShell mit ImageMagick)
$sizes = @(16,32,72,96,128,144,152,192,384,512)
foreach ($size in $sizes) {
    magick -size "${size}x${size}" xc:"#20B2AA" "icon-$size.png"
}
```

**Oder SVG zu PNG:**
```bash
# Falls du ein SVG-Logo hast
inkscape -w 512 -h 512 logo.svg -o icon-512.png
```

## Browser-Caching

Nach Icon-Änderungen:
1. Leere den Browser-Cache
2. Deinstalliere die PWA
3. Installiere neu
4. Oder inkrementiere die `CACHE_VERSION` in `sw.js`

## Validierung

Nach der Erstellung, prüfe:
- ✅ Alle Dateien sind PNG-Format
- ✅ Dateinamen stimmen exakt überein
- ✅ Transparenz nur bei nicht-maskable Icons
- ✅ Mindestens 192px und 512px vorhanden (PWA-Standard)

## Testen

1. **Chrome DevTools:**
   - F12 → Application → Manifest
   - Prüfe alle Icons in der Liste

2. **PWA Manifest Validator:**
   - https://manifest-validator.appspot.com/

3. **Lighthouse Audit:**
   - Chrome DevTools → Lighthouse → "Progressive Web App"

## Ressourcen

- [PWA Icons Guide](https://web.dev/add-manifest/#icons)
- [Maskable Icons Spec](https://web.dev/maskable-icon/)
- [Icon Generator](https://www.pwabuilder.com/imageGenerator)
- [Favicon.io](https://favicon.io/)

---

**Status:** ⚠️ Icons fehlen noch - bitte generieren!
**Priorität:** Hoch
**Aufwand:** 15-30 Minuten
