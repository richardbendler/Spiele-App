# Game_RN – Client

React Native / Expo App ("The One"). Diese README deckt den laufenden Entwickler-Alltag ab: Projekt installieren, lokal testen, linten, Builds erstellen, in die Stores hochladen.

Nicht hier, sondern anderswo dokumentiert:
- Einmaliges Einrichten einer neuen Entwicklungsumgebung (EAS CLI, Android-Emulator, lokale EAS-Builds unter WSL/Linux, Google Play Service Account), Projekt-/Konto-Migration und bekannte Umgebungs-Troubleshooting-Fälle: [SETUP.md](SETUP.md)
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

Unter Ubuntu/Linux sind alle Kommandos oben identisch, einfach in einem normalen Bash-Terminal statt PowerShell ausführen. Einmalige Einrichtung der Linux-Entwicklungsumgebung (Node, Android Studio, KVM, `ANDROID_HOME`) siehe [SETUP.md](SETUP.md#linuxubuntu-native-entwicklungsumgebung-einrichten-einmalig).

## Linting
```powershell
npm run lint
```
Führt ESLint (`eslint-config-expo`) über den Client-Code aus. Vor größeren Commits ausführen; sollte 0 Fehler zeigen (Warnungen sind bekannter, dokumentierter Backlog).

## Build und Release
Für einen echten Installations-Build (statt nur lokalem Testen über Expo Go) wird [EAS](https://docs.expo.dev/build/setup/) verwendet. Einmalige Einrichtung von EAS CLI/Login siehe [SETUP.md](SETUP.md#eas-cli-installieren--einloggen-einmalig).

**Wichtig:** Alle `eas`-Befehle in diesem Abschnitt müssen aus dem `Game_RN`-Verzeichnis heraus laufen (dort liegen `eas.json`/`app.json`), nicht aus dem Repo-Root `Spiele-App/`:
```bash
cd Game_RN
```
Sonst bricht `eas build`/`eas submit` sofort mit `Run this command inside a project directory.` ab.

### Android: Cloud-Build
```powershell
eas build --platform android --profile production
```
Build-Profile (`development`, `preview`, `production`) sind in `eas.json` definiert; ohne `--profile`-Flag wird `production` verwendet. Das Ergebnis ist eine `.aab`-Datei (Android App Bundle), keine direkt installierbare `.apk`.

Der `versionCode` wird dank `autoIncrement`/`appVersionSource: remote` in `eas.json` bei jedem Build automatisch hochgezählt (von EAS serverseitig verwaltet) — kein manuelles Hochzählen in `app.json` mehr nötig. Einmalige Umstellung/Synchronisierung dieser Zählung siehe [SETUP.md](SETUP.md#android-versionierung-auf-eas-umstellen-einmalig).

**Um eine installierbare APK zu bekommen:** die `.aab` in der [Play Console](https://play.google.com/console) hochladen (z.B. als internen Test) und von dort die APK herunterladen.

### Android: Lokaler Build (WSL / Linux)
Statt in der Expo-Cloud zu bauen, kann `eas build` auch komplett lokal laufen (`--local`-Flag) — nützlich bei Warteschlangen oder Limits im kostenlosen EAS-Tier. Das ist trotz Managed-Workflow (kein eingechecktes `android/`-Verzeichnis) möglich, da EAS dafür intern automatisch ein temporäres `expo prebuild` durchführt.

**Wichtig:** Lokale Builds werden von `eas-cli` unter **nativem Windows nicht unterstützt** — es braucht Linux oder macOS, z.B. via WSL oder direkt in einer nativen Ubuntu-Umgebung. Einmaliges Einrichten des dafür nötigen nativen Android-Toolchains (Java, Android SDK Command-Line-Tools) unter [SETUP.md](SETUP.md#lokale-eas-builds-einrichten-wsllinuxmacos-einmalig-optional).

```bash
eas build --platform android --profile production --local
```
Das Ergebnis liegt danach als `.aab`-/`.apk`-Datei direkt im aktuellen Verzeichnis, ganz ohne Upload in die Expo-Cloud.

### iOS: Cloud-Build
Erfordert ein Apple-Developer-Konto:
```powershell
eas build --platform ios --profile production
```
Beim ersten Build legt Expo Zertifikate/Provisioning-Profile automatisch an, sofern der Account
mit deinem Apple Developer Account verknüpft ist (`eas credentials` zum manuellen Verwalten).
Stelle vorher sicher, dass die App in App Store Connect angelegt ist (Bundle-ID siehe
`ios.bundleIdentifier` in `app.json`).

Läuft auch von Ubuntu/WSL aus, da der Build in der Cloud passiert — es wird nur das
Apple-Developer-Konto benötigt, kein lokales macOS. Lokales iOS-Bauen bleibt weiterhin nur auf
macOS möglich (Xcode/Simulator gibt es nicht für andere Plattformen).

## In die Stores hochladen (eas submit)

### Android (Google Play)
**Wichtig:** `eas submit` lädt standardmäßig **nicht** direkt live in Production hoch. Es gibt
zwei Submit-Profile in `eas.json`, die genau das steuern - je nachdem, welches du mit
`--profile` angibst, landet der Build in einem anderen Play-Console-Track:

```bash
# Internal-Test-Track: nur für eingeladene Tester sichtbar, geht sofort automatisch "live"
# (aber eben nur für Tester, nicht öffentlich im Play Store):
eas submit --platform android --profile production --latest

# Production-Track: für alle im Play Store sichtbar/installierbar - wird aber als ENTWURF
# hochgeladen (releaseStatus: draft) und muss in der Play Console erst manuell geprüft und
# veröffentlicht werden (Release-Übersicht → Entwurf → "Zur Prüfung freigeben"/"Veröffentlichen"):
eas submit --platform android --profile production-release --latest
```

`--latest` nimmt in beiden Fällen automatisch den zuletzt erzeugten Build (Cloud oder lokal) -
kein manuelles Suchen/Angeben des `.aab`-Pfads nötig. Läuft dank `serviceAccountKeyPath` in
`eas.json` nicht-interaktiv (siehe [SETUP.md](SETUP.md#google-play-service-account-für-eas-submit-einmalig)
für die Einrichtung).

Hinweis: Falls eine App noch nie manuell über die Play-Console-Weboberfläche hochgeladen wurde
(kein einziger Entwurf/Release existiert), verlangt Googles Publishing-API, dass der allererste
Upload manuell passiert – danach funktioniert `eas submit` für alle weiteren Versionen.

### iOS (App Store Connect / TestFlight)
Bei iOS gibt es die Internal/Production-Unterscheidung wie bei Android **nicht** - es gibt nur
ein Submit-Profil, weil `eas submit --platform ios` sowieso nie automatisch öffentlich live
geht. Es lädt den Build lediglich zu App Store Connect hoch (dort landet er zunächst in
TestFlight); die tatsächliche Veröffentlichung im App Store passiert immer manuell über die
Schritte unten ("Submit for Review" + Apples Review-Prozess).
```bash
eas submit --platform ios --profile production --latest
```
Fragt beim ersten Mal interaktiv nach den Apple-Zugangsdaten und speichert sie für künftige
Submits.

### Apple: TestFlight / App Store Distribution
1. Lade das `.ipa` aus dem Expo Dashboard herunter oder verwende `eas submit --platform ios
   --profile production`, um den Upload direkt in App Store Connect zu erledigen.
2. In App Store Connect: App wählen → „Build“-Reiter unter „App-Informationen“ → neuen Build
   hinzufügen. Metadaten (Screenshots, Beschreibung, Kategorien, Datenschutz, Altersfreigabe)
   ausfüllen, falls noch nicht geschehen.
3. Build für eine interne/beta TestFlight-Runde freigeben oder zur Prüfung einreichen.
   Tester:innen danach via E-Mail oder öffentlichem Link einladen (Einstellungen > TestFlight >
   Gruppe/Tester).
4. Für die finale Veröffentlichung: alle App-Infos, Screenshots und Preisangaben in App Store
   Connect prüfen und die Version zur Prüfung einreichen („Preparing for Submission“ > „Submit
   for Review“).

## Datenpflege-Skripte
Unter `scripts/` liegen Node-Skripte zur Pflege der Picolo-Prompt-Datasets (`node scripts/<name>.js` ausführen):
- `exportPicoloDatasets.js` – exportiert die rohen Prompt-Daten als JSON-Datasets.
- `regeneratePoolFiles.js` – baut aus den JSON-Datasets wieder die `*Pool`-JS-Dateien.
- `tagDrinkingPrompts.js` – markiert Prompts automatisch anhand von Schlüsselwörtern als trinkbezogen.

Diese werden nur bei Änderungen an den Prompt-Rohdaten benötigt, nicht für den normalen App-Betrieb.

## Datenbank (Referenz, für spätere Backend-Anbindung)
Zugangsdaten (URL, Benutzername, Passwort) bei Richard erfragen bzw. im Passwortmanager nachsehen – nicht im Repo dokumentieren, da es öffentlich ist.
Name der DB: `TrinkspielDB`
