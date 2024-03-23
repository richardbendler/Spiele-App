const jwt = require('jsonwebtoken');

const secretKey = 'REDACTED_JWT_SECRET'; // Sollte stark und geheim gehalten werden

const generateToken = (user) => {
  return jwt.sign({ user }, secretKey, { /*expiresIn: '1h'*/ }); // Token läuft nach 1 Stunde ab
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null; // Token ist ungültig oder abgelaufen
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
