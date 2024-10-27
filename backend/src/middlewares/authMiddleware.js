const jwt = require('jsonwebtoken'); 
const cookieParser = require('cookie-parser'); 

exports.authMiddleware = (requiredRoles = []) => {
  return (req, res, next) => {
    console.log('Cookies:', req.cookies);

    const token = req.cookies.token; 
    console.log('Token from cookie:', token);

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log('Decoded token:', decoded);

      req.user = decoded;

      if (requiredRoles.length && !requiredRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Invalid token', error: error.message });
    }
  };
};
