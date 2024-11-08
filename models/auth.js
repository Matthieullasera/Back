const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_SECRET_KEY'); // Utilisez la même clé secrète
    const userId = decodedToken.userId;
    req.auth = { userId };
    next();
  } catch {
    res.status(401).json({ error: 'Requête non authentifiée !' });
  }
};
