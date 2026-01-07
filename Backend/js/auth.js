const jwt = require('jsonwebtoken');

const getSecretKey = () => {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error('Missing JWT_SECRET environment variable.');
  }
  return secretKey;
};

const generateToken = (user) => {
  return jwt.sign({ user }, getSecretKey(), { /*expiresIn: '1h'*/ }); // Token läuft nach 1 Stunde ab
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, getSecretKey());
  } catch (error) {
    return null; // Token ist ungültig oder abgelaufen
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
