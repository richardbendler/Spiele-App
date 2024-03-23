const { generateToken } = require('./auth'); // Pfad zur auth.js-Datei anpassen

// Annahme: Du hast einen Benutzerobjekt, das du als Payload verwenden möchtest
const user = {
  id: 1,
  username: 'app',
};

// Generiere ein Token mit dem Benutzerobjekt als Payload
const token = generateToken(user);

console.log('Generiertes Token:', token);
