import { AuthenticationError, AuthorizationError } from '../errors/index.js';
import { authService } from '../services/authService.js';
import { User } from '../models/User.js';

export const requireAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      throw new AuthenticationError('Not authorized, no token');
    }
    
    const decoded = authService.verifyToken(token);
    
    // Attach user to request
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      throw new AuthenticationError('User no longer exists');
    }
    
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AuthorizationError(`User role '${req.user?.role}' is not authorized`));
    }
    next();
  };
};
