# ?? Windows Launcher f�r Spanish Learning App

## �bersicht

Die App enth�lt mehrere Launcher f�r Windows, um den Start zu vereinfachen.

---

## ?? Verf�gbare Launcher

### 1. **launch.bat** (Einfach) ? EMPFOHLEN

**Zweck**: Interaktiver Browser-Launcher f�r Anf�nger

**Features**:
- ? Automatische Browser-Erkennung
- ? Interaktives Men�
- ? Unterst�tzt Chrome, Edge, Firefox
- ? Lokaler Server-Modus (Python)
- ? Einfache Bedienung

**Verwendung**:
```cmd
Doppelklick auf launch.bat
? Browser ausw�hlen
? App startet automatisch
```

---

### 2. **launch.ps1** (Erweitert)

**Zweck**: PowerShell-Launcher mit erweiterten Optionen

**Features**:
- ? Kommandozeilen-Parameter
- ? Debug-Modus
- ? Flexibler Server-Port
- ? Farbige Ausgabe
- ? Erweiterte Fehlerbehandlung

**Verwendung**:

#### Interaktiv:
```powershell
.\launch.ps1
```

#### Mit Parametern:
```powershell
# Chrome starten
.\launch.ps1 -Browser chrome

# Edge starten
.\launch.ps1 -Browser edge

# Server starten (Port 8000)
.\launch.ps1 -Server

# Server mit anderem Port
.\launch.ps1 -Server -Port 3000

# Debug-Modus
.\launch.ps1 -Browser chrome -Debug

# Hilfe anzeigen
.\launch.ps1 -Help
```

---

### 3. **create-shortcut.bat** (Setup)

**Zweck**: Erstellt Desktop-Verkn�pfung

**Features**:
- ? Legt Verkn�pfung auf Desktop an
- ? Ein-Klick-Installation
- ? Automatische Pfad-Erkennung

**Verwendung**:
```cmd
Doppelklick auf create-shortcut.bat
? Verkn�pfung wird auf Desktop erstellt
? App ab jetzt vom Desktop startbar
```

---

## ?? Schritt-f�r-Schritt Anleitung

### Erstmaliger Start

1. **ZIP entpacken**
   ```
   spanish-app-v0.0.zip ? Beliebiger Ordner
   ```

2. **Desktop-Verkn�pfung erstellen** (optional)
   ```
   Doppelklick: create-shortcut.bat
   ```

3. **App starten**
   ```
   Doppelklick: launch.bat
   ODER
   Desktop-Verkn�pfung
   ```

4. **Browser w�hlen**
   ```
   1) Chrome (empfohlen)
   2) Edge
   3) Firefox
   4) Standard-Browser
   5) Lokaler Server
   ```

5. **Fertig!** ??
   ```
   App l�uft im Browser
   Offline-f�hig nach erstem Start
   ```

---

## ?? Erweiterte Optionen

### Lokaler Server (f�r Service Worker)

**Warum Server?**
- Service Worker funktioniert nur �ber HTTP(S)
- Bessere Performance
- Echte PWA-Experience

**Voraussetzung**: Python 3 installiert

**Start**:
```cmd
launch.bat ? Option 5
ODER
launch.ps1 -Server
```

**URL**: `http://localhost:8000`

---

### Debug-Modus

**Aktivierung**:
```powershell
launch.ps1 -Browser chrome -Debug
```

**Features**:
- Erweiterte Console-Logs
- Debug-Toolbar sichtbar
- Test-Parameter aktiviert

---

### Custom Port

**Standard**: Port 8000

**�ndern**:
```powershell
launch.ps1 -Server -Port 3000
```

---

## ?? Problembehandlung

### "Execution Policy" Fehler (PowerShell)

**Problem**:
```
launch.ps1 kann nicht ausgef�hrt werden
```

**L�sung**:
```powershell
# Option 1: Tempor�r erlauben
PowerShell -ExecutionPolicy Bypass -File launch.ps1

# Option 2: Dauerhaft erlauben (Admin)
Set-ExecutionPolicy RemoteSigned
```

---

### Browser wird nicht erkannt

**Problem**:
```
[!] No supported browser found
```

**L�sung**:
- Option 4 w�hlen (Standard-Browser)
- ODER Browser manuell installieren:
  - Chrome: https://www.google.com/chrome/
  - Edge: In Windows 10/11 vorinstalliert
  - Firefox: https://www.mozilla.org/firefox/

---

### Python nicht gefunden

**Problem**:
```
Python not found
```

**L�sung**:
1. Python installieren: https://www.python.org/
2. Bei Installation "Add to PATH" aktivieren
3. Terminal neu starten
4. Test: `python --version`

---

### Service Worker funktioniert nicht

**Problem**:
- Offline-Modus nicht verf�gbar
- Cache-Fehler

**L�sung**:
- Lokalen Server verwenden (Option 5)
- ODER App auf Webserver hosten
- File://-URLs unterst�tzen keine Service Worker

---

## ?? Alternative Start-Methoden

### 1. Direkt im Browser

**Vorteil**: Kein Launcher n�tig

**Vorgehen**:
```
1. Browser �ffnen
2. Ctrl+O (Datei �ffnen)
3. index.html ausw�hlen
4. App startet
```

**Nachteil**: Kein Service Worker (kein Offline-Modus)

---

### 2. Python HTTP Server (manuell)

**Vorgehen**:
```cmd
cd C:\Pfad\zur\App
python -m http.server 8000
? Browser �ffnen: http://localhost:8000
```

---

### 3. Live Server (VS Code)

**Voraussetzung**: Visual Studio Code

**Vorgehen**:
```
1. Ordner in VS Code �ffnen
2. Extension "Live Server" installieren
3. Rechtsklick auf index.html
4. "Open with Live Server"
```

---

## ?? Anpassungen

### Launcher-Icon �ndern

**Datei**: `create-shortcut.bat`

**Zeile �ndern**:
```vbs
echo oLink.IconLocation = "%APP_DIR%\icons\mein-icon.ico" >> %VBS_FILE%
```

---

### Standard-Browser festlegen

**Datei**: `launch.bat`

**Zeile 95 �ndern**:
```batch
REM Statt Men� direkt Chrome starten
set CHOICE=1
```

---

### Server-Port �ndern

**Datei**: `launch.ps1`

**Zeile 7 �ndern**:
```powershell
[int]$Port = 3000  # Statt 8000
```

---

## ?? Produktions-Deployment

### F�r End-User

**Paket vorbereiten**:
```
1. ZIP erstellen mit:
   - launch.bat
   - create-shortcut.bat
   - index.html
   - Alle App-Dateien

2. README.txt hinzuf�gen:
   "Doppelklick auf launch.bat zum Starten"

3. Optional: Installer erstellen (NSIS, Inno Setup)
```

---

### Web-Server (produktiv)

**Nicht launcher verwenden**, sondern:
```
1. App auf Webserver hochladen
2. HTTPS konfigurieren
3. URL teilen: https://meine-app.de
4. Automatisch offline-f�hig (PWA)
```

---

## ?? Performance-Tipps

### Schnellster Start

**Methode**:
```powershell
# Direkt Chrome mit App-Modus
launch.ps1 -Browser chrome
```

**Vorteil**: Keine Men�-Interaktion

---

### Beste PWA-Experience

**Methode**:
```
1. launch.bat ? Option 5 (Server)
2. Im Browser: Men� ? "App installieren"
3. Ab jetzt vom Desktop starten (PWA)
```

**Vorteil**: Echte App-Experience

---

## ? Zusammenfassung

### F�r Anf�nger: ?
```
launch.bat
? Browser w�hlen
? Fertig!
```

### F�r Power-User: ??
```powershell
launch.ps1 -Browser chrome -Debug
```

### F�r Entwickler: ??
```powershell
launch.ps1 -Server -Port 8000
```

### F�r End-User: ??
```
1. create-shortcut.bat ausf�hren
2. Desktop-Icon nutzen
3. Keine weiteren Schritte
```

---

## ?? Quick Start

**Windows Explorer**:
```
Doppelklick: launch.bat
```

**PowerShell**:
```powershell
.\launch.ps1
```

**Command Prompt**:
```cmd
launch.bat
```

**Desktop**:
```
(Nach create-shortcut.bat)
Doppelklick auf Desktop-Icon
```

---

**Status**: ? Launcher ready!  
**Version**: 0.0  
**Platform**: Windows 10/11  
**Tested**: Chrome, Edge, Firefox

Viel Spa� beim Spanisch lernen! ??????
