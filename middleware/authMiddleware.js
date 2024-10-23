const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(401).send('Access Denied');

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send('Invalid token');
  }
};

module.exports = authenticate;
