const express = require('express');
const https = require('https');
const fs = require('fs');

const bodyParser = require('body-parser');
const mysql = require('mysql2/promise'); // Stelle sicher, dass du mysql2 installiert hast
const { generateToken, verifyToken } = require('./auth'); // Pfad zur auth.js-Datei anpassen

const requireEnv = (name) => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing ${name} environment variable.`);
    }
    return value;
};

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 8443;//8443;//process.env.PORT || 443;//3000;
//443 -> https
//3000 -> http


// Verbindung zur Datenbank herstellen
const db = mysql.createPool({
    host: requireEnv('DB_HOST'),
    user: requireEnv('DB_USER'),
    password: requireEnv('DB_PASSWORD'),
    database: requireEnv('DB_NAME'),
  });

// Middleware
app.use(bodyParser.json());

app.post('/api/sendText', (req, res) => {
    const receivedText = req.body.text;
    //console.log('Empfangener Text:', receivedText);
    // Sende eine Antwort als Text
    res.send('Nachricht empfangen: ' + receivedText);
});
app.post('/api/sqlRequest', async (req, res) => {
    //check Token
    const token = req.headers.authorization;
    console.log('Empfangener Token:', token); 
    if (!token) {
        console.log("Kein Token vorhanden");
        return res.status(401).json({ error: 'Kein Token vorhanden.' });
    }
    const decodedToken = verifyToken(token.split(' ')[1]);
    if (!decodedToken) {
        console.log("Ungültiger oder abgelaufener Token");
        return res.status(401).json({ error: 'Ungültiger oder abgelaufener Token.' });
    }
    console.log("Gültiger Token");
    /////////////////////////////
    const receivedText = req.body.sqlRequest;
    console.log(receivedText);
    try {
        const [rows, fields] = await db.query(receivedText); // Annahme: Tabelle "users" existiert in deiner Datenbank
        res.status(200).json(rows);
        console.log(rows);
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen der Daten. Nicht mit DB verbunden?' });
    }
});

app.get('/api/getUserData', async (req, res) => {
    try {
        const [rows, fields] = await db.query('SELECT * FROM `game_simple_questions`'); // Annahme: Tabelle "users" existiert in deiner Datenbank
        res.status(200).json(rows);
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen der Daten. Nicht mit DB verbunden?' });
    }
    
    // Hier könntest du die Daten aus deiner Datenbank abrufen
    /*const userData = [
      { id: 1, name: 'Benutzer 1' },
      { id: 2, name: 'Benutzer 2' },
      // ...
    ];*/  
    //res.status(200).json(userData);
  });



  


const httpsOptions = {
    key: fs.readFileSync(requireEnv('TLS_KEY_PATH')), // Pfad zur privaten Schlüsseldatei
    cert: fs.readFileSync(requireEnv('TLS_CERT_PATH')), // Pfad zur Zertifikatsdatei
};

const server = https.createServer(httpsOptions, app);

// Starte den Server
server.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});

/*
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});*/
