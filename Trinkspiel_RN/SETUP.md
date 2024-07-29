# Trinkspielapp - SETUP
Diese Datei enthält alle wichtigen Schritte für Projektsetup. Das ist nur bei Neukonfiguration relevant.

## Projektsetup
Die folgenden Schritte wurden einmalig bei Projektsetup ausgeführt und müssen nur bei Migration in ein neues Projekt erneut ausgeführt werden. Das kann z.B. nötig werden, wenn unsere gratis Expo-Lizenz an ein Limit kommt und wir zu einem neuen Expo-Account migrieren.

### NPM Packages
Die folgenden Packages müssen bei Projektsetup einmalig installiert werden und werden vom Installer, der package.json hinzugefügt, sodass beim Wechsel einfach nur "npm install" ausgeführt werden muss, um alle Packages au der package.json zu installieren.

//Bereits installiert:

npm install -g expo-cli

npm install react-native
npm install react-native-gesture-handler 
npm install react-native-safe-area-context

npm install @react-navigation/native
npm install @react-navigation/stack

npm install @react-native-community/netinfo

npm install @react-native-async-storage/async-storage

//Fonts:
npx expo install @expo-google-fonts/quicksand expo-font
npx expo install @expo-google-fonts/raleway expo-font
npx expo install @expo-google-fonts/caveat expo-font

//Slider
npx expo install @react-native-community/slider

//Sound:
//npx expo install expo-av
// -> Sorgt aktuell noch für Probleme: Google Play Console sagt beim Import: In deinem APK oder Android App Bundle werden Berechtigungen verwendet, für die eine Datenschutzerklärung erforderlich ist: android.permission.RECORD_AUDIO. Weitere Informationen

//////////////////////////////////////////
//Noch nicht:

npm install react-native-sound

npx expo install @react-native-async-storage/async-storage
? npm install react-native-screens

