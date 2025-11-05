# ?? LAUNCHER-VEREINFACHUNG

## ?? Problem: Zu viele Launcher!

### **Aktuell (VERWIRREND)**:
```
? start.bat           - Guided Version
? launch.bat          - Alt
? launch-simple.bat   - Einfach
? launch.ps1          - PowerShell
? create-shortcut.bat - Shortcut-Creator
```

### **Neue Struktur (EINFACH)**:
```
? start.bat           - HAUPT-LAUNCHER (mit Menü)
? start-modern.bat    - Modernes UI (NEU)
```

---

## ?? NEUE LAUNCHER-STRUKTUR

### **1. start.bat - Universal Launcher mit Menü**
- Zeigt Menü mit allen verfügbaren Versionen
- User wählt Version
- Startet gewählte Version

### **2. start-modern.bat - Modern UI Launcher**
- Startet direkt `index-modern.html`
- Für das neue moderne Interface

---

## ??? ZU ARCHIVIEREN

```
? archive/launchers/
  - launch.bat
  - launch-simple.bat
  - launch.ps1
  - create-shortcut.bat
```

---

## ? UMSETZUNG

### **Schritt 1: Neuer Universal Launcher**
```bat
start.bat
  ? Menü-System
  ? Alle Versionen
  ? Browser-Detection
```

### **Schritt 2: Modern UI Launcher**
```bat
start-modern.bat
  ? Startet index-modern.html
  ? Schnellstart für neues UI
```

### **Schritt 3: Alte Launcher archivieren**
```powershell
.\tools\archive-old-files.ps1
```

---

## ?? VERFÜGBARE VERSIONEN

### **Nach Cleanup**:
```
1. index-modern.html    ? NEU! Modernes UI
2. index-guided.html    ? Geführte Version
3. index-simple.html    ? Einfache Version
4. index.html           ? Vollversion (komplex)
```

---

**STATUS**: ?? Plan erstellt
**NEXT**: Launcher-Dateien erstellen
