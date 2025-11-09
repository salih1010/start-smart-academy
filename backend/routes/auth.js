const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, role: user.role, name: user.profile.name, email: user.profile.email });
});

router.post('/register-student', async (req, res) => {
  const { username, password, name, email } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username & password required' });
  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ message: 'username taken' });
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ username, passwordHash: hash, role: 'Student', profile: { name, email } });
  await user.save();
  res.json({ message: 'student registered' });
});

module.exports = router;
