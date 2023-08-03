const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise'); // Stelle sicher, dass du mysql2 installiert hast


const app = express();
const PORT = process.env.PORT || 3000;

// Verbindung zur Datenbank herstellen
const db = mysql.createPool({
    host: '45.9.63.16',
    user: 'phpmyadmin',
    password: '1HD2h28Hd',
    database: 'TrinkspielDB',
  });

// Middleware
app.use(bodyParser.json());

app.post('/api/sendText', (req, res) => {
    const receivedText = req.body.text;
    console.log('Empfangener Text:', receivedText);
    // Sende eine Antwort als Text
    res.send('Nachricht empfangen: ' + receivedText);
});
app.post('/api/sqlRequest', async (req, res) => {
    const receivedText = req.body.sqlRequest;
    console.log(receivedText);
    try {
        const [rows, fields] = await db.query(receivedText); // Annahme: Tabelle "users" existiert in deiner Datenbank
        res.status(200).json(rows);
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen der Daten. Nicht mit DB verbunden?' });
    }
});

app.get('/api/getUserData', async (req, res) => {
    try {
        const [rows, fields] = await db.query('SELECT * FROM `game_simple_questions`'); // Annahme: Tabelle "users" existiert in deiner Datenbank
        res.status(200).json(rows);
        console.log("SUCCESS");
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

// Starte den Server
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
