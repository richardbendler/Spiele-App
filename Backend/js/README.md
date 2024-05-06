## VERALTET: Serversetup für nodejs
DIESES BACKEND WIRD NICHT MEHR GENUTZT!

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