# Game_RN - SETUP

Diese Datei ist für **einmalige** Einrichtungsschritte gedacht: Projekt auf einer neuen Maschine komplett neu aufsetzen, Umzug auf einen neuen Expo-Account/Server, oder Umgebungsprobleme, die nur beim erstmaligen Einrichten auftreten. Für den normalen Entwickler-Alltag (Setup, lokal testen, linten, bauen) siehe [README.md](README.md) — dort reicht in der Regel einfach `npm install`.

## Android-Emulator einrichten (einmalig pro Rechner)

1. [Android Studio](https://developer.android.com/studio) installieren.
2. Im SDK Manager mindestens eine Android-Plattform sowie "Android Emulator" und "Android SDK Platform-Tools" installieren.
3. Im Device Manager ein AVD anlegen (aktuell getestet mit einem Pixel-Profil).
4. Sicherstellen, dass `ANDROID_HOME` (bzw. `ANDROID_SDK_ROOT`) auf das SDK-Verzeichnis zeigt — Android Studio setzt das meist automatisch. Damit `adb` auch direkt im Terminal aufrufbar ist, `platform-tools` einmalig zum User-PATH hinzufügen:
   ```powershell
   [Environment]::SetEnvironmentVariable("Path", [Environment]::GetEnvironmentVariable("Path","User") + ";$env:ANDROID_HOME\platform-tools", "User")
   ```
   Danach ein **neues** Terminal-Fenster öffnen, damit die Änderung greift.

### Troubleshooting: `adb devices` zeigt einen dauerhaften Geister-Eintrag / Expo stürzt beim Android-Start ab

**Symptom:** `adb devices` listet neben dem echten, laufenden Emulator einen zweiten Eintrag mit Status `offline` (z.B. `emulator-5562  offline`), der nie verschwindet — auch nach `adb kill-server`/Neustart von Android Studio nicht. `npm run android` bzw. das Drücken von `a` im laufenden `npm start` schlägt fehl mit `could not connect to TCP port <Portnummer>`, teils mit vollem Absturz der Expo CLI.

**Ursache:** Android/`adb` durchsucht beim Start automatisch die Ports 5554–5585 nach Emulator-Konsolen. Läuft auf dem Rechner unabhängige Software, die zufällig einen Port in diesem Bereich belegt (in diesem Fall: `NTKDaemonService` von Native Instruments auf Port 5563), registriert `adb` das fälschlich als Emulator-Kandidaten. Expo fragt bei `--android`/`a` intern selbst nochmal *alle* bei `adb` gelisteten Geräte ab und bricht komplett ab, sobald eines davon nicht sauber antwortet — unabhängig davon, ob der echte Emulator einwandfrei läuft.

**Diagnose:**
```powershell
adb devices                                          # zeigt den/die Geister-Eintraege
Get-NetTCPConnection -LocalPort <Portnummer+1>       # zeigt den Prozess, der den (ungeraden) Port belegt
Get-CimInstance Win32_Service -Filter "Name LIKE '%<Teil des Prozessnamens>%'"   # findet den zugehoerigen Dienst
```

**Fix (nur einmalig nötig, um Expo Go auf einem neuen/frischen Emulator zu installieren):**
1. Störenden Dienst kurz stoppen, PowerShell **als Administrator**:
   ```powershell
   Stop-Service -Name "<Dienstname>" -Force
   ```
2. Im laufenden `npm run android`/Metro-Fenster `a` drücken — Expo installiert Expo Go jetzt automatisch, ohne am Geister-Eintrag zu scheitern.
3. Dienst danach wieder starten:
   ```powershell
   Start-Service -Name "<Dienstname>"
   ```

**Für den täglichen Gebrauch danach nicht mehr nötig:** `npm run android` (siehe README.md) nutzt `scripts/runAndroid.js`, das dieses Geräte-Enumerations-Problem umgeht (eigenes `adb reverse` + App-Start nur auf dem echten Gerät, ohne Expos absturzanfällige interne Geräte-Abfrage) und funktioniert dauerhaft, solange Expo Go einmal installiert ist.

## Ursprüngliche NPM-Paketliste (historisch)

Die folgenden Schritte wurden einmalig bei Projektsetup ausgeführt und müssten nur bei einer Migration in ein komplett neues Projekt erneut ausgeführt werden — z.B. falls die gratis Expo-Lizenz an ein Limit kommt und zu einem neuen Expo-Account migriert wird. Im normalen Alltag reicht `npm install`, da alle Packages bereits in `package.json` eingetragen sind; die folgende Liste ist ein historisches Protokoll der ursprünglichen Einrichtung.

```
npm install -g expo-cli

npm install react-native
npm install react-native-gesture-handler
npm install react-native-safe-area-context

npm install @react-navigation/native
npm install @react-navigation/stack

npm install @react-native-community/netinfo

npm install @react-native-async-storage/async-storage

# Fonts:
npx expo install @expo-google-fonts/quicksand expo-font
npx expo install @expo-google-fonts/raleway expo-font
npx expo install @expo-google-fonts/caveat expo-font

# Slider
npx expo install @react-native-community/slider
```

**Nicht (mehr) eingebunden:** `expo-av` (Sound) — sorgte beim Play-Store-Upload für eine Warnung wegen der `RECORD_AUDIO`-Berechtigung und einer nötigen Datenschutzerklärung dafür; `react-native-sound` wurde probeweise erwogen, aber nie eingebunden.
