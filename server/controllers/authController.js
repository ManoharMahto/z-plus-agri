import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { store } from '../services/store.js';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'zplus_secret', {
    expiresIn: '30d'
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role, farmDetails, savedAddress } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, and password are required'
      });
    }

    const existingUser = await store.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A farmer account with this email already exists'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await store.createUser({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: role || 'farmer',
      farmDetails: farmDetails || {},
      savedAddress: savedAddress || {}
    });

    const token = generateToken(user._id || user.id, user.role);

    res.status(201).json({
      success: true,
      message: 'Farmer account registered successfully!',
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const user = await store.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.'
      });
    }

    // Verify password (or allow demo match if plain demo account)
    let isMatch = false;
    if (user.password && user.password.startsWith('$2')) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = user.password === password;
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password'
      });
    }

    const token = generateToken(user._id || user.id, user.role);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        farmDetails: user.farmDetails,
        savedAddress: user.savedAddress
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
