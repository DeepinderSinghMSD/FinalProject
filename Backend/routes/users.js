const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Get user data
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.sendStatus(404);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single user by ID (Admin only)
router.get('/:id', authenticateToken, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.sendStatus(404);
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Create a new user (Admin only)
  router.post('/', async (req, res) => {
    const { username, password } = req.body;
    try {
      const newUser = new User({ username, password });
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Update a user by ID (Admin only)
  router.put('/:id', authenticateToken, async (req, res) => {
    const { username, password } = req.body;
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { username, password },
        { new: true, runValidators: true }
      );
      if (!updatedUser) return res.sendStatus(404);
      res.json(updatedUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Delete a user by ID (Admin only)
  router.delete('/:id', authenticateToken, async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) return res.sendStatus(404);
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

module.exports = router;
