# Serversetup
Die folgenden Schritte wurden einmalig ausgeführt und sind nur für Serverumzug relevant:

### Grundlegende Infos
Der Server wurde über Netcup von Richard gehostet und läuft mit Debian 12. Alle Zugangsdaten hat Richard.

### Datenbank
Install MariaDB: https://kifarunix.com/install-mariadb-10-on-debian-12/#install-maria-db-10-on-debian-12
Wichtig: Schritt der Passworterstellung für root@localhost darf erst nach phpmyadmin-Installation durchgeführt werden weil die Installation sonst an dem Passwort scheitert! 
Stattdessen: 
- sudo mysql -u root
- SET PASSWORD FOR root@localhost=PASSWORD('');

### Firewall für Datenbank anpassen
- UFW installieren, falls nicht vorhanden: https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-debian
- sudo ufw allow 3306 #damit mysql server auf 3306 zuhören kann und von Code erreicht werden kann
- mysql auf port 3306 zuhören lassen: https://phoenixnap.com/kb/mysql-remote-connection aber mit sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf weil wir mariaDB haben und mit der bind-adress 0.0.0.0 damit auch von außerhalb zugehört wird. Also:
    - sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf
        - bind-address            = 0.0.0.0 
        - #127.0.0.1
    - sudo systemctl restart mysql
    - ???????


### Datenbankuser, der auch von außerhalb des Servers Zugriff haben soll
 - sudo mysql -u root
 - CREATE USER 'backenduser'@'%' IDENTIFIED BY 'passworthiereinfügen';
 - GRANT ALL PRIVILEGES ON *.* TO 'backenduser'@'%' WITH GRANT OPTION;
 - flush privileges;
 - quit;


VERALTET: wenn Host nicht allowed für mariaDB server ist: https://stackoverflow.com/questions/1559955/host-xxx-xx-xxx-xxx-is-not-allowed-to-connect-to-this-mysql-server

### Datenbankuser für Entwickler*innen
User für Entwickler erstellen:
mariadb -u root -p
CREATE USER 'flo'@'localhost' IDENTIFIED BY 'passworthiereinfügen';
GRANT ALL PRIVILEGES ON TrinkspielDB.* TO 'flo'@'localhost' WITH GRANT OPTION;

### phpmyadmin (+Apache)
phpmyadmin (+Apache) installieren: https://kifarunix.com/install-phpmyadmin-on-debian-12/#prerequisites-install-php-my-admin-on-debian-12
problem: https://askubuntu.com/questions/387062/how-to-solve-the-phpmyadmin-not-found-issue-after-upgrading-php-and-apache
sudo systemctl restart apache2
mariadb -u root -p
GRANT ALL PRIVILEGES ON *.* TO 'phpmyadmin'@'localhost'; FLUSH PRIVILEGES;
(create db: https://mariadb.com/kb/en/create-database/) 
Falls Passwort mal geändert werden muss: SET PASSWORD FOR 'phpmyadmin'@localhost = PASSWORD("");

Jetzt das mariadb-root-Passwort und das von mysql ändern:
 - ALTER USER root@localhost identified by 'myStr0nP@ssW0rd';
 - ALTER USER mysql@localhost identified by 'myStr0nP@ssW0rd2';
 - flush privileges;
 - quit;


### SSL-Zertifikat
SSL auf Server installieren: https://certbot.eff.org/instructions?ws=apache&os=debianbuster
Uns gehört aktuell die Domain blankiball.de. Diese hat einen A-Record, der auf die IP des Servers weiterleitet und sie hat außerdem ein SSL-Zertifikat. Der Server hat auch eins. 
Zertifikate werden unter /etc/letsencrypt/live/ abgelegt
Falls schon andere SSL-Zertifikate vorhanden sind:
sudo certbot -d meinedomain.de --apache
Dann c um letzten Schritt zu canceln
und sudo nano /etc/apache2/sites-available/000-default-le-ssl.conf
ungefähr so https://www.digicert.com/kb/ssl-support/apache-multiple-ssl-certificates-using-sni.htm
und sudo systemctl restart apache2