const express = require('express');
const { auth, permit } = require('../middleware/auth');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const router = express.Router();

router.get('/counts', auth, permit('SuperAdmin'), async (req, res) => {
  const courses = await Course.find();
  const teachers = await User.find({ role: 'Teacher' });
  const students = await User.find({ role: 'Student' });
  res.json({ courses, teachers, students });
});

// list endpoints
router.get('/courses', auth, permit('SuperAdmin'), async (req, res) => {
  res.json(await Course.find().populate('teacher', 'profile'));
});
router.get('/teachers', auth, permit('SuperAdmin'), async (req, res) => {
  res.json(await User.find({ role: 'Teacher' }));
});
router.get('/students', auth, permit('SuperAdmin'), async (req, res) => {
  res.json(await User.find({ role: 'Student' }));
});

module.exports = router;
