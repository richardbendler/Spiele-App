# Trinkspielapp

## Lokal - Vorbereitungen:
### Node.js und npm installieren: 
https://phoenixnap.com/kb/install-node-js-npm-on-windows

### Powershell im RN_Trinkspiel-Ordner ausführen:

danach:
npm install

_(npm audit fix --force)_

### Expo installieren:
npm install -g expo-cli

### Sonstiges
//Bereits installiert:

npm install react-native
npm install react-native-gesture-handler 
npm install react-native-safe-area-context

npm install @react-navigation/native
npm install @react-navigation/stack

npm install @react-native-async-storage/async-storage


//////////////////////////////////////////
//Noch nicht:

npm install react-native-sound

npx expo install @react-native-async-storage/async-storage
? npm install react-native-screens


_(Zum Test "expo" ausführen -> Falls Fehler kommt: "Datei kann nicht geladen werden, da Ausführung von Scripts auf diesem System deaktiviert ist" -> Powershell als Admin ausführen -> "Set-ExecutionPolicy RemoteSigned" -> Ja)_

### Datenbank installieren
~~npm install react-native-sqlite-storage~~

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
create db: https://mariadb.com/kb/en/create-database/
phpmyadmin: https://kifarunix.com/install-phpmyadmin-on-debian-12/#prerequisites-install-php-my-admin-on-debian-12
problem: https://askubuntu.com/questions/387062/how-to-solve-the-phpmyadmin-not-found-issue-after-upgrading-php-and-apache
sudo systemctl restart apache2

### Produktionsumgebung
_Das hier sollte vor der Production noch passieren: By default, a MariaDB installation has an anonymous user, allowing anyone to log into MariaDB without having to have a user account created for them.  This is intended only for testing, and to make the installation go a bit smoother.  You should remove them before moving into a production environment. Remove anonymous users? [Y/n] n ... skipping._

_________________________________________________________

## Backend

Achtung: Backend läuft gerade durchgängig - dieser Part kann zum Testen ignoriert werden

### Start - Entwicklungsumgebung
cd Trinkspielapp_Backend
node server.js

### Start - Produktionsumgebung
To run in background: Step 3 of https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-debian-9
cd Trinkspielapp_Backend
pm2 start server.js

### Installationsschritte (wurden einmalig ausgeführt - nur für Serverumzug relevant)
Auf Netcup-Server pushen
Node und npm installieren: https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-debian-10
sudo apt install npm
npm install express body-parser mysql2
npm install jsonwebtoken
sudo ufw allow 3000 #damit app den server anpingen kann
sudo ufw allow 3306 #damit mysql server auf 3306 zuhören kann
mysql auf port 3306 zuhören lassen: https://phoenixnap.com/kb/mysql-remote-connection aber mit sudo nano /etc/mysql/mar
iadb.conf.d/50-server.cnf weil wir mariaDB haben
wenn Host nicht allowd für mariaDB server ist: https://stackoverflow.com/questions/1559955/host-xxx-xx-xxx-xxx-is-not-allowed-to-connect-to-this-mysql-server

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