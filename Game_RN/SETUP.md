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

### Troubleshooting: `eas build` bricht ab mit „Slug for project identified by ... does not match the slug field"

**Symptom:** `eas build` (egal ob Cloud oder `--local`) bricht sofort ab mit einer Fehlermeldung wie `Project config: Slug for project identified by "extra.eas.projectId" (Trinkspiel_RN) does not match the "slug" field (Game_RN)`.

**Ursache:** Der `slug` in `app.json` wurde im Laufe der Projektgeschichte mehrfach umbenannt (siehe `git log -p -- app.json`), das bei Expo unter `extra.eas.projectId` hinterlegte Projekt aber nie mit. Anders als der "Display name" (im Expo-Dashboard unter Projekt-Settings editierbar) ist der `slug` nach Projekterstellung faktisch unveränderlich — es gibt dafür kein Feld im Dashboard.

**Fix:** `slug` in `app.json` auf den beim verlinkten Projekt tatsächlich hinterlegten Wert zurücksetzen (aktuell `Trinkspiel_RN`) statt den bei Expo hinterlegten Slug ändern zu wollen. Das hat keine sichtbaren Auswirkungen — App-Name und Store-Paket kommen aus den separaten Feldern `name` und `android.package`. Nur falls tatsächlich ein komplett neues EAS-Projekt gewünscht ist (z.B. bewusster Cloud-Migrationsschritt), stattdessen `eas init` neu ausführen — dabei aber beachten, dass das bestehende Android-Signing-Keystore beim alten Projekt hängen bleibt und für Play-Store-Updates manuell mit übernommen werden müsste.

**Wichtige Lehre daraus:** `android.package` in `app.json` hatte beim selben Umbenennungs-Rutsch dasselbe Problem (fälschlich auf `com.felsbend.Game_RN` statt dem tatsächlich bei Google Play veröffentlichten `com.felsbend.Trinkspiel_RN` geändert). Android-Package-Namen bereits veröffentlichter Apps sind unveränderlich — ein Mismatch hier verhindert jeden weiteren Play-Store-Upload und lässt nebenbei jeden Code, der den Package-Namen hardcodet (z.B. `src/utils/rating.js` für die Play-Store-URL), auf eine falsche/nicht existierende URL zeigen. **Vor jeder Umbenennung von `slug`/`android.package`/`ios.bundleIdentifier` immer zuerst mit dem tatsächlichen Stand in der Play Console bzw. App Store Connect abgleichen**, nicht nur lokal ändern.

Falls trotzdem mal ein Build mit einem falschen/neu generierten Android-Keystore hochgeladen und von Google Play mit "Dein App Bundle ist mit dem falschen Schlüssel signiert" abgelehnt wird: Play App Signing (Standard für alle neueren Apps) erlaubt einen **Upload-Key-Reset**, ohne dass die App oder ihre Installationen dadurch beeinträchtigt werden — der eigentliche App-Signing-Key bleibt bei Google. Zu finden in der Play Console über das Suchfeld oben ("App-Signatur" eingeben) — die Navigation dorthin ändert sich bei Google öfter, daher lohnt sich die Suche mehr als ein fester Menüpfad.

## Lokale EAS-Builds einrichten (WSL/Linux/macOS, einmalig, optional)

Nur nötig, falls lokal gebaut werden soll (`eas build --local`, siehe README.md), statt in der Expo-Cloud — z.B. um Warteschlangen/Limits im kostenlosen EAS-Tier zu umgehen. `eas-cli` unterstützt lokale Builds **nicht unter nativem Windows**; unter Windows also in WSL (Ubuntu) ausführen, siehe [README.md#ubuntu--linux](README.md#ubuntu--linux) für die Grundeinrichtung von Node/Android SDK dort.

Zusätzlich zum dort beschriebenen Emulator-Setup braucht ein lokaler Build noch ein natives Java/Android-Build-Toolchain (Gradle, Build-Tools, NDK):

1. **Java 17:**
   ```bash
   sudo apt install -y openjdk-17-jdk
   echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
   source ~/.bashrc
   java -version
   ```
2. **Android Command-Line-Tools** (falls noch keine volle Android-Studio-Installation mit SDK vorhanden ist, z.B. auf einem Server/in WSL ohne GUI):
   ```bash
   mkdir -p ~/Android/Sdk/cmdline-tools && cd ~/Android/Sdk/cmdline-tools
   wget -O tools.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
   unzip tools.zip && mkdir -p latest && mv cmdline-tools/* latest/
   echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
   echo 'export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH' >> ~/.bashrc
   source ~/.bashrc
   yes | sdkmanager --licenses
   ```
   Fehlende Plattform-/Build-Tools-/NDK-Pakete meldet `eas build --local` beim ersten Lauf konkret mit Namen — dann gezielt per `sdkmanager "<paketname>"` nachinstallieren.
3. **EAS CLI ohne sudo** (falls `npm install -g` Berechtigungsprobleme macht):
   ```bash
   mkdir -p ~/.npm-global
   npm config set prefix '~/.npm-global'
   echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc
   source ~/.bashrc
   npm install -g eas-cli
   eas login
   ```

### Troubleshooting (nur WSL2): NDK-Download bricht mit `AEADBadTagException`/`Tag mismatch!` ab

**Symptom:** Der erste `eas build --local` (bzw. `sdkmanager` beim NDK-Download, ~1 GB) bricht in WSL2 mit `javax.crypto.AEADBadTagException: Tag mismatch!` oder `Failed to install the following SDK components: ndk;...` ab.

**Ursache:** Ein bekannter WSL2-Bug — der virtuelle Hyper-V-Netzwerkadapter berechnet TCP-Checksummen bei großen Downloads manchmal falsch, wodurch Pakete bei der TLS-Entschlüsselung als beschädigt erkannt werden. Betrifft nur WSL2, nicht natives Linux/Ubuntu.

**Fix (einmalig, in einer PowerShell **als Administrator** unter Windows, nicht in WSL):**
```powershell
Get-NetAdapter | Where-Object { $_.InterfaceDescription -match "Hyper-V" }
# Namen aus der Ausgabe uebernehmen, z.B. "vEthernet (WSL (Hyper-V firewall))"
Set-NetAdapterChecksumOffload -Name "vEthernet (WSL (Hyper-V firewall))" -TcpIPv4 Disabled -UdpIPv4 Disabled -IpIPv4 Disabled -TcpIPv6 Disabled -UdpIPv6 Disabled
wsl --shutdown
```
Danach WSL neu starten und den Download erneut versuchen.

**Schnellerer Workaround** (nur falls auf demselben Windows-Rechner schon eine Android-SDK-Installation mit derselben NDK-Version existiert, z.B. von Android Studio): NDK-Ordner direkt aus Windows nach WSL kopieren statt neu herunterzuladen:
```bash
cp -r "/mnt/c/Users/<DEIN_USER>/AppData/Local/Android/Sdk/ndk/<version>" ~/Android/Sdk/ndk/
```
Das behebt aber nur diese eine Maschine — der Netzwerk-Fix oben behebt die Ursache dauerhaft für jeden Download.

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
