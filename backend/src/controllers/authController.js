import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Seller } from '../models/Seller.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_fallback', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log('REGISTER REQUEST RECEIVED:', { name, email, role });

    // Basic validation
    if (!name || !email || !password || !role) {
      console.log('AUTH FAILURE: Missing fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('AUTH FAILURE: Invalid email format');
      return res.status(400).json({ message: 'Invalid email' });
    }

    if (password.length < 6) {
      console.log('AUTH FAILURE: Password too short');
      return res.status(400).json({ message: 'Password too short' });
    }

    // Check BOTH collections for email uniqueness
    const userExists = await User.findOne({ email });
    const sellerExists = await Seller.findOne({ email });

    if (userExists || sellerExists) {
      console.log('AUTH FAILURE: Email already exists');
      return res.status(400).json({ message: 'Email already exists' });
    }

    const isSeller = role === 'seller';
    const Model = isSeller ? Seller : User;

    const user = await Model.create({
      name,
      email,
      passwordHash: password, // will be hashed by pre-save hook
      role: isSeller ? 'seller' : 'customer',
      ...(isSeller ? { businessName: name } : {})
    });

    if (user) {
      console.log('AUTH SUCCESS: Registered', email);
      const userData = user.toObject();
      delete userData.passwordHash;
      res.status(201).json({
        ...userData,
        token: generateToken(user._id),
      });
    } else {
      console.error('AUTH FAILURE: Invalid user data returned after creation');
      res.status(400).json({ message: 'Validation failed' });
    }
  } catch (error) {
    console.error('REGISTER ERROR STACK TRACE:');
    console.error(error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: `Validation failed: ${error.message}` });
    } else {
      res.status(500).json({ message: error.message || 'Database write failed' });
    }
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log('LOGIN REQUEST RECEIVED:', { email, role });

    // Validate role exists
    if (!role) {
      console.log('AUTH FAILURE: Role missing in login request');
      return res.status(400).json({ message: 'Role is required' });
    }

    // Check both collections
    let user = await User.findOne({ email });
    let isSeller = false;

    if (!user) {
      user = await Seller.findOne({ email });
      isSeller = true;
    }

    if (!user) {
      console.log('AUTH FAILURE: Account not found');
      return res.status(404).json({ message: 'Account not found. Please sign up first.' });
    }

    // Validate account type / role
    const expectedRole = isSeller ? 'seller' : 'customer';
    const requestedRole = role === 'user' ? 'customer' : role; // Map frontend 'user' to backend 'customer'

    if (expectedRole !== requestedRole) {
      console.log('AUTH FAILURE: Wrong account type');
      return res.status(401).json({ message: 'Wrong account type.' });
    }

    if (await user.matchPassword(password)) {
      console.log('AUTH SUCCESS: Logged in', email);
      const userData = user.toObject();
      delete userData.passwordHash;
      res.json({
        ...userData,
        token: generateToken(user._id),
      });
    } else {
      console.log('AUTH FAILURE: Incorrect password');
      res.status(401).json({ message: 'Incorrect password' });
    }
  } catch (error) {
    console.error('LOGIN ERROR STACK TRACE:');
    console.error(error);
    res.status(500).json({ message: error.message || 'Database connection error' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash') || await Seller.findById(req.user._id).select('-passwordHash');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
};

export const logoutUser = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};
