const jwt = require('jsonwebtoken');
module.exports = (roles = []) => (req, res, next) => {
  if (typeof roles === 'string') roles = [roles];
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || (roles.length && !roles.includes(decoded.role))) return res.status(401).json({ message: 'Unauthorized' });
    req.user = decoded;
    next();
  });
};
