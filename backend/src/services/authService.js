import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { AuthenticationError, ValidationError } from '../errors/index.js';

export const authService = {
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  async verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
  },

  generateToken(user) {
    return jwt.sign(
      { id: user._id, role: user.role },
      env.jwtSecret,
      { expiresIn: '30d' }
    );
  },

  verifyToken(token) {
    try {
      return jwt.verify(token, env.jwtSecret);
    } catch (error) {
      throw new AuthenticationError('Invalid or expired token');
    }
  },

  async register({ name, email, password, role = 'User', location }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ValidationError('Email already registered');
    }

    const passwordHash = await this.hashPassword(password);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      location,
      greenCredits: 0
    });

    const token = this.generateToken(user);
    return { user, token };
  },

  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    const isMatch = await this.verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      throw new AuthenticationError('Invalid credentials');
    }

    const token = this.generateToken(user);
    return { user, token };
  }
};
