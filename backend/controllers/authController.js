const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const store = require('../utils/memoryStore');
const { getDbStatus } = require('../config/db');

const generateToken = (id, name, email, role) => {
  return jwt.sign(
    { id, name, email, role },
    process.env.JWT_SECRET || 'agritech_super_secret_jwt_key_2026',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user (Farmer or Admin)
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = 'farmer', phone, location, preferredLanguage = 'en' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (getDbStatus()) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const user = await User.create({
        name,
        email,
        password,
        role,
        phone: phone || '',
        location: location || {},
        preferredLanguage
      });

      return res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          location: user.location,
          preferredLanguage: user.preferredLanguage,
          token: generateToken(user._id, user.name, user.email, user.role)
        }
      });
    }

    // In-memory fallback
    const existing = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const newUser = {
      _id: `user_${Date.now()}`,
      id: `user_${Date.now()}`,
      name,
      email,
      passwordHash: bcrypt.hashSync(password, 10),
      role,
      phone: phone || '',
      location: location || { state: 'Punjab', district: 'Ludhiana', village: 'Raikot' },
      preferredLanguage,
      createdAt: new Date()
    };

    store.users.push(newUser);

    res.status(201).json({
      success: true,
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        location: newUser.location,
        preferredLanguage: newUser.preferredLanguage,
        token: generateToken(newUser._id, newUser.name, newUser.email, newUser.role)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter email and password' });
    }

    if (getDbStatus()) {
      const user = await User.findOne({ email });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          success: true,
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            location: user.location,
            preferredLanguage: user.preferredLanguage,
            token: generateToken(user._id, user.name, user.email, user.role)
          }
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // In-memory fallback
    const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && bcrypt.compareSync(password, user.passwordHash)) {
      return res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          location: user.location,
          preferredLanguage: user.preferredLanguage || 'en',
          token: generateToken(user._id, user.name, user.email, user.role)
        }
      });
    }

    res.status(401).json({ success: false, message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
const getUserProfile = async (req, res) => {
  try {
    if (getDbStatus()) {
      const user = await User.findById(req.user._id).select('-password');
      return res.json({ success: true, data: user });
    }
    const user = store.users.find(u => u._id === req.user._id || u.id === req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const { passwordHash, ...safeUser } = user;
    res.json({ success: true, data: safeUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
