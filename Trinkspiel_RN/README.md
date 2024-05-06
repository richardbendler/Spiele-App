# Trinkspielapp
In dieser README wird alles erklärt, was man für das grundsätzliche Entwickeln an der App braucht. 
Ausnahmen: 
- Für alle Schritte, die den Serverumzug oder tiefergehende Umkonfiguration der App betreffen, sind Informationen in der SETUP.md festgehalten.
- Für alle Schritte, die das Backend betreffen, sind Informationen in der README im Ordner Backend festgehalten.


## Datenbank

### Datenbank bearbeiten
http://45.9.63.16/phpmyadmin/
Benutzername: _hat Richard_
Passwort: _hat Richard_
Name unserer DB: TrinkspielDB


## Der Code

### Node.js und npm installieren: 
https://nodejs.org/en/download/ oder https://phoenixnap.com/kb/install-node-js-npm-on-windows (necessary tools mitinstallieren)

### In Powershell
cd RN_Trinkspiel
npm install
_(ggf: npm audit fix --force)_

## Lokal - Start:
- npm start # you can open iOS, Android, or web from here, or run them directly with the commands below.

- ~~npm run android~~
- ~~npm run ios # requires an iOS device or macOS for access to an iOS simulator~~
- ~~npm run web~~

## Expo Go auf dem Handy zum testen
_(Falls Fehler kommt: Wrong Expo version: "expo update 47.0.0)_

## To test on pc:
Android Studio: https://developer.android.com/studio

_(Für Mac: XCode | Achtung! Testen für IoS klappt nur auf Iphones oder Apple Laptops selbst!)_

## Build
### EAS installieren und einrichten
https://docs.expo.dev/build/setup/
_(Zum Test "expo" ausführen -> Falls Fehler kommt: "Datei kann nicht geladen werden, da Ausführung von Scripts auf diesem System deaktiviert ist" -> Powershell als Admin ausführen -> "Set-ExecutionPolicy RemoteSigned" -> Ja)_

### Build erstellen
Vorher: "versionCode" in app.json inkrementieren!
eas build --platform android  

(npm update)

https://docs.expo.dev/build/setup/

Diese Anleitung erstellt aber eine .aab-Datei

Um apk zu bekommen https://play.google.com/console nutzen und Projekt hochladen. Danach APK downloaden

