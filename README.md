# Trinkspielapp

Vorbereitungen:
Node.js und npm installieren: https://phoenixnap.com/kb/install-node-js-npm-on-windows
danach:
npm install
(npm audit fix --force)

Expo installieren:
npm install -g expo-cli
(Zum Test "expo" ausführen)
(Falls Fehler kommt: "Datei kann nicht geladen werden, da Ausführung von Scripts auf diesem System deaktiviert ist" -> Powershell als Admin ausführen -> "Set-ExecutionPolicy RemoteSigned" -> Ja)

Start:
- cd RN_Trinkspiel
- npm start # you can open iOS, Android, or web from here, or run them directly with the commands below.
- npm run android
- npm run ios # requires an iOS device or macOS for access to an iOS simulator
- npm run web

Expo Go auf dem Handy zum testen
(Falls Fehler kommt: Wrong Expo version: "expo update 47.0.0)
__________________________________________________

To test on pc:
Android Studio (https://developer.android.com/studio)
(Für Mac: XCode
Achtung! Testen für IoS klappt nur auf Iphones oder Apple Laptops selbst!)
› Using Expo Go
› Press s │ switch to development build

› Press a │ open Android
› Press w │ open web

› Press j │ open debugger
› Press r │ reload app
› Press m │ toggle menu
› Press o │ open project code in your editor

› Press ? │ show all commands