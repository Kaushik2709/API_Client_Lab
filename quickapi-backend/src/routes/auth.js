import express from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import multer from 'multer';

const upload = multer();

// Signup
router.post('/signup', upload.none(), async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      message: 'User registered successfully',
      User: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', upload.none(), async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({ 
      message: 'Logged in successfully',
      User: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Profile
router.put("/update", upload.none(), async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { firstName, lastName, email, password } = req.body;
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
    }

    await user.save();
    
    // Return updated user without password
    const updatedUser = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    };

    res.status(200).json({ 
      message: "User updated successfully",
      User: updatedUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Current User (Me)
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.status(200).json({ User: user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'User logged out successfully' });
});

// Delete account
router.delete('/delete', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 1. Delete user collections (which should also delete requests if we have a post hook, but let's be explicit)
    // Importing models locally to avoid circular dependencies if any, though here it's simple
    const Collection = (await import('../models/Collection.js')).default;
    const Request = (await import('../models/Request.js')).default;
    const Environment = (await import('../models/Environment.js')).default;

    await Promise.all([
      Collection.deleteMany({ userId: decoded.id }),
      Request.deleteMany({ userId: decoded.id }),
      Environment.deleteMany({ userId: decoded.id }),
      User.findByIdAndDelete(decoded.id)
    ]);

    res.clearCookie('token');
    res.status(200).json({ message: 'Account and all data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;
