const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'test-secret';

function generateToken(user) {
  const payload = { id: user._id.toString(), email: user.email };
  return jwt.sign(payload, SECRET, { expiresIn: '1h' });
}

function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token provided' });

  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Token format invalid' });

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { generateToken, verifyToken };
