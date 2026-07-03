const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      const err = new Error('Not authorized. No token provided.');
      err.statusCode = 401;
      return next(err);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (exclude password)
    const user = await User.findById(decoded.id);
    if (!user) {
      const err = new Error('User belonging to this token no longer exists');
      err.statusCode = 401;
      return next(err);
    }

    req.user = { id: user._id, name: user.name, email: user.email };
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      error.message = 'Invalid token';
      error.statusCode = 401;
    } else if (error.name === 'TokenExpiredError') {
      error.message = 'Token has expired';
      error.statusCode = 401;
    }
    next(error);
  }
};

module.exports = { protect };
