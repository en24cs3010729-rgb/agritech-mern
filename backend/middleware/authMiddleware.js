const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'agritech_super_secret_jwt_key_2026');
      
      // If DB is connected, fetch full user; otherwise use decoded payload
      try {
        req.user = await User.findById(decoded.id).select('-password');
      } catch (err) {
        req.user = null;
      }

      if (!req.user) {
        req.user = {
          _id: decoded.id,
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role || 'farmer'
        };
      }
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Admin privileges required' });
  }
};

module.exports = { protect, adminOnly };
