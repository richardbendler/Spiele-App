# Game_RN – Client

React Native / Expo App ("The One"). Diese README deckt den laufenden Entwickler-Alltag ab: Projekt installieren, lokal testen, linten, Builds erstellen.

Nicht hier, sondern anderswo dokumentiert:
- Einmaliges Einrichten einer neuen Entwicklungsumgebung (z.B. Android-Emulator auf einem neuen Rechner), Projekt-/Konto-Migration und bekannte Umgebungs-Troubleshooting-Fälle: [SETUP.md](SETUP.md)
- Alles rund um das Backend (Rust/Rocket + legacy Node.js): [../Backend](../Backend)

> **Hinweis:** Die Backend-Anbindung des Clients ist aktuell bewusst deaktiviert (siehe `src/general.js`, `getGameData`/`postFeedback`). Alle Spiele laufen mit lokal gebündelten Daten aus `src/data`. Die `.env`-Variablen unten werden erst wieder relevant, sobald das Backend reaktiviert wird.

## Voraussetzungen
- [Node.js](https://nodejs.org/en/download/) + npm
- Ein Smartphone mit der **Expo Go**-App (schnellster Weg zum Testen, kein Emulator nötig) — oder:
  - **Android:** Android Studio mit eingerichtetem Emulator (einmaliges Einrichten: siehe [SETUP.md](SETUP.md))
  - **iOS:** nur auf macOS möglich, mit Xcode und iOS-Simulator

## Setup
```powershell
cd Game_RN
npm install
```
`npm install` installiert alle Abhängigkeiten aus `package.json` und führt anschließend automatisch `patch-package` aus (siehe `postinstall`-Script). Bei sehr alten `node_modules`-Ständen kann `npm audit fix --force` nötig sein, danach `npm install` erneut ausführen.

### Optional: lokale `.env`
Nur relevant, sobald das Backend wieder angebunden wird:
1. `.env.example` nach `.env` kopieren.
2. `EXPO_PUBLIC_API_TOKEN` setzen (Bearer-Token, ohne `Bearer`-Prefix).
3. Optional `EXPO_PUBLIC_API_BASE_URL` anpassen, falls der Server nicht unter der Standard-URL läuft.

Hinweis: In Expo werden nur Variablen mit dem Prefix `EXPO_PUBLIC_` ins Client-Bundle übernommen — und landen damit auch für alle sichtbar in der gebauten App. Keine echten Geheimnisse dort hineinschreiben, die schützenswert sind.

## Lokal testen
```powershell
npm start
```
Startet den Metro-Bundler und zeigt einen QR-Code in der Konsole/im Browser-Tab. Von dort aus:
- **Handy (empfohlen, am schnellsten):** Expo Go App öffnen und den QR-Code scannen. Handy und PC müssen im selben WLAN sein.
- **Android-Emulator:** ⚠️ **nicht** die von Metro selbst angezeigte Taste `a` drücken — das nutzt Expos eigene Geräte-Erkennung, die abstürzt, sobald `adb` auch nur einen einzigen nicht erreichbaren Geister-Eintrag listet (siehe Troubleshooting in [SETUP.md](SETUP.md)). Stattdessen den laufenden `npm start` mit `Strg+C` beenden und stattdessen `npm run android` ausführen — das startet bei Bedarf automatisch einen Emulator, öffnet die App gezielt darauf und umgeht das Problem komplett.
- **iOS-Simulator (nur macOS):** Taste `i` drücken, oder `npm run ios`.
- **Web:** Taste `w` drücken, oder `npm run web` (nützlich für schnelle UI-Checks, aber kein vollständiger Ersatz für den Test auf echten Geräten, da einige RN-Module sich im Web anders verhalten).

Falls das Handy nicht im selben Netzwerk ist oder die WLAN-Verbindung blockiert wird (z.B. restriktives Firmen-/Uni-Netz):
```powershell
npm run local
```
Startet Expo im Tunnel-Modus (`expo start --tunnel`) — etwas langsamer, funktioniert aber unabhängig vom lokalen Netzwerk.

**Versions-Mismatch in Expo Go:** Zeigt Expo Go beim Verbinden einen Fehler wegen unpassender SDK-Version, in den App-Store/Play-Store gehen und Expo Go auf die neueste Version aktualisieren (das Projekt nutzt aktuell Expo SDK 54, siehe `package.json`).

## Linting
```powershell
npm run lint
```
Führt ESLint (`eslint-config-expo`) über den Client-Code aus. Vor größeren Commits ausführen; sollte 0 Fehler zeigen (Warnungen sind bekannter, dokumentierter Backlog).

## Build (EAS)
Für einen echten Installations-Build (statt nur lokalem Testen über Expo Go) wird [EAS](https://docs.expo.dev/build/setup/) verwendet.

### Einmalig einrichten
```powershell
npm install -g eas-cli
eas login
```
Falls PowerShell die Ausführung von Skripten verweigert ("Datei kann nicht geladen werden, da die Ausführung von Skripten auf diesem System deaktiviert ist"): PowerShell **als Administrator** öffnen und einmalig `Set-ExecutionPolicy RemoteSigned` ausführen (mit "Ja" bestätigen).

### Build erstellen
1. `versionCode` in `app.json` (unter `expo.android.versionCode`) hochzählen — Play Store akzeptiert sonst keinen erneuten Upload.
2. Build starten:
   ```powershell
   eas build --platform android
   ```
   Build-Profile (`development`, `preview`, `production`) sind in `eas.json` definiert; ohne `--profile`-Flag wird `production` verwendet.
3. Das Ergebnis ist eine `.aab`-Datei (Android App Bundle), keine direkt installierbare `.apk`.

**Um eine installierbare APK zu bekommen:** die `.aab` in der [Play Console](https://play.google.com/console) hochladen (z.B. als internen Test) und von dort die APK herunterladen. Für iOS entsprechend `eas build --platform ios` (erfordert ein Apple-Developer-Konto).

## Datenpflege-Skripte
Unter `scripts/` liegen Node-Skripte zur Pflege der Picolo-Prompt-Datasets (`node scripts/<name>.js` ausführen):
- `exportPicoloDatasets.js` – exportiert die rohen Prompt-Daten als JSON-Datasets.
- `regeneratePoolFiles.js` – baut aus den JSON-Datasets wieder die `*Pool`-JS-Dateien.
- `tagDrinkingPrompts.js` – markiert Prompts automatisch anhand von Schlüsselwörtern als trinkbezogen.

Diese werden nur bei Änderungen an den Prompt-Rohdaten benötigt, nicht für den normalen App-Betrieb.

## Datenbank (Referenz, für spätere Backend-Anbindung)
Zugangsdaten (URL, Benutzername, Passwort) bei Richard erfragen bzw. im Passwortmanager nachsehen – nicht im Repo dokumentieren, da es öffentlich ist.
Name der DB: `TrinkspielDB`
