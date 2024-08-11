const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware for verifying token
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

// for getting user data
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.sendStatus(404);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// for getting a single user by ID 
router.get('/:id', authenticateToken, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.sendStatus(404);
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // for creating a new user 
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
  
  // for updating a user by ID 
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
  
  // for deleting a user by ID 
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
