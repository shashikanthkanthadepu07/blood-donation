const jwt = require('jsonwebtoken');
const { mockUsers } = require('../data/mockData');
const User = require('../models/User');
const { isDbConnected } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'lifeflow_default_jwt_secret_2026';

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (isDbConnected()) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'User no longer exists.' });
      }
      req.user = user;
    } else {
      // In-Memory mock fallback
      const user = mockUsers.find((u) => u._id === decoded.id || u.email === decoded.email);
      if (!user) {
        // Return dummy user from decoded token
        req.user = {
          _id: decoded.id,
          name: decoded.name || 'Demo User',
          email: decoded.email,
          role: decoded.role || 'donor',
          bloodGroup: decoded.bloodGroup || 'O+'
        };
      } else {
        const { password, ...userWithoutPass } = user;
        req.user = userWithoutPass;
      }
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token', error: error.message });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    }
  } catch (e) {
    // Silently continue without req.user
  }
  next();
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to roles [${roles.join(', ')}]`
      });
    }
    next();
  };
};

module.exports = {
  requireAuth,
  optionalAuth,
  requireRole,
  JWT_SECRET
};
