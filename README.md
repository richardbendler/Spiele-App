# Trinkspielapp

## Lokal - Vorbereitungen:
### Node.js und npm installieren: 
https://phoenixnap.com/kb/install-node-js-npm-on-windows

### Powershell im RN_Trinkspiel-Ordner ausführen:

Falls noch nie programmiert wurde:
nodejs installieren: https://nodejs.org/en/download/
(necessary tools mitinstallieren)

danach:
cd RN_Trinkspiel
npm install

_(npm audit fix --force)_

__________________________________________________

## Lokal - Start:
- cd RN_Trinkspiel
- npm start # you can open iOS, Android, or web from here, or run them directly with the commands below.

- ~~npm run android~~
- ~~npm run ios # requires an iOS device or macOS for access to an iOS simulator~~
- ~~npm run web~~

__________________________________________________

## Expo Go auf dem Handy zum testen
_(Falls Fehler kommt: Wrong Expo version: "expo update 47.0.0)_
__________________________________________________

## To test on pc:
Android Studio: https://developer.android.com/studio

_(Für Mac: XCode | Achtung! Testen für IoS klappt nur auf Iphones oder Apple Laptops selbst!)_

__________________________________________________

## Build

Vorher: "versionCode" in app.json inkrementieren!
eas build --platform android  

(npm update)

https://docs.expo.dev/build/setup/

Diese Anleitung erstellt aber eine .aab-Datei

Um apk zu bekommen https://play.google.com/console  nutzen und Projekt hochladen. Danach APK downloaden

__________________________________________________

### EAS installieren und einrichten (nur für Build relevant)
https://docs.expo.dev/build/setup/

### NPM-Geschichten (-> IST SCHON INSTALLIERT und muss nicht neu installiert werden)
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


//Sound:
//npx expo install expo-av
// -> Sorgt aktuell noch für Probleme: Google Play Console sagt beim Import: In deinem APK oder Android App Bundle werden Berechtigungen verwendet, für die eine Datenschutzerklärung erforderlich ist: android.permission.RECORD_AUDIO. Weitere Informationen

//////////////////////////////////////////
//Noch nicht:

npm install react-native-sound

npx expo install @react-native-async-storage/async-storage
? npm install react-native-screens


_(Zum Test "expo" ausführen -> Falls Fehler kommt: "Datei kann nicht geladen werden, da Ausführung von Scripts auf diesem System deaktiviert ist" -> Powershell als Admin ausführen -> "Set-ExecutionPolicy RemoteSigned" -> Ja)_

__________________________________________________

## Datenbank

### Datenbank bearbeiten
http://45.9.63.16/phpmyadmin/
Benutzername: phpmyadmin
Passwort: _hat Richard_
Name unserer DB: TrinkspielDB

### Datenbank verwalten
ssh trinkspielapp@45.9.63.16
Passwort: _hat Richard_

### Installationsschritte (wurden einmalig ausgeführt - nur für Serverumzug relevant)
install MariaDB: https://kifarunix.com/install-mariadb-10-on-debian-12/#install-maria-db-10-on-debian-12
Wichtig: Schritt der Passworterstellung für root@localhost darf erst nach phpmyadmin-Installation durchgeführt werden weil die Installation sonst an dem Passwort scheitert!

UFW, falls nicht vorhanden: https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-debian
sudo ufw allow 3306 #damit mysql server auf 3306 zuhören kann und von Code erreicht werden kann
mysql auf port 3306 zuhören lassen: https://phoenixnap.com/kb/mysql-remote-connection aber mit sudo nano /etc/mysql/mar
iadb.conf.d/50-server.cnf weil wir mariaDB haben

CREATE USER 'backenduser'@'%' IDENTIFIED BY 'passworthiereinfügen';
GRANT ALL PRIVILEGES ON *.* TO 'backenduser'@'%' WITH GRANT OPTION;
VERALTET: wenn Host nicht allowed für mariaDB server ist: https://stackoverflow.com/questions/1559955/host-xxx-xx-xxx-xxx-is-not-allowed-to-connect-to-this-mysql-server

User für Entwickler erstellen:
CREATE USER 'flo'@'localhost' IDENTIFIED BY 'passworthiereinfügen';
GRANT ALL PRIVILEGES ON TrinkspielDB.* TO 'flo'@'localhost' WITH GRANT OPTION;

phpmyadmin: https://kifarunix.com/install-phpmyadmin-on-debian-12/#prerequisites-install-php-my-admin-on-debian-12
problem: https://askubuntu.com/questions/387062/how-to-solve-the-phpmyadmin-not-found-issue-after-upgrading-php-and-apache
sudo systemctl restart apache2
GRANT ALL PRIVILEGES ON *.* TO 'phpmyadmin'@'localhost'; FLUSH PRIVILEGES;
(create db: https://mariadb.com/kb/en/create-database/) 

SSL auf Server installieren: https://certbot.eff.org/instructions?ws=apache&os=debianbuster
Uns gehört aktuell die Domain my-tournament.org. Diese hat einen A-Record, der auf die IP des Servers weiterleitet und sie hat außerdem ein SSL-Zertifikat. Der Server hat auch eins. 


### Produktionsumgebung
_Das hier sollte vor der Production noch passieren: By default, a MariaDB installation has an anonymous user, allowing anyone to log into MariaDB without having to have a user account created for them.  This is intended only for testing, and to make the installation go a bit smoother.  You should remove them before moving into a production environment. Remove anonymous users? [Y/n] n ... skipping._

_________________________________________________________

## Backend

Achtung: Backend läuft gerade durchgängig - dieser Part kann zum Testen ignoriert werden

### Start - Entwicklungsumgebung
cd Trinkspielapp_Backend
sudo node server.js
(sudo wegen https)

### Start - Produktionsumgebung
To run in background: Step 3 of https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-debian-9
cd Trinkspielapp_Backend
sudo pm2 start server.js
sudo pm2 list
sudo pm2 stop server
(sudo wegen https)

### Installationsschritte (wurden einmalig ausgeführt - nur für Serverumzug relevant)
Auf Netcup-Server pushen
Node und npm installieren: https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-debian-10
sudo apt install npm
npm install express body-parser mysql2
npm install jsonwebtoken
sudo ufw allow 3000 #damit app den server anpingen kann -> http
sudo ufw allow 3000 #damit app den server anpingen kann -> https


_________________________________________________________



__________________________________________________

### Using Expo Go

› Press s │ switch to development build

› Press a │ open Android

› Press w │ open web

› Press j │ open debugger

› Press r │ reload app

› Press m │ toggle menu

› Press o │ open project code in your editor

› Press ? │ show all commands