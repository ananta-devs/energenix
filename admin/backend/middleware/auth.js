const jwt = require('jsonwebtoken');

const auth = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded.admin;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

const isSuperAdmin = function (req, res, next) {
    if (!req.admin.isSuper) {
        return res.status(403).json({ msg: 'Access denied. Super admin only.' });
    }
    next();
};

module.exports = {
    auth,
    isSuperAdmin,
};