const express = require('express');
const { auth, permit } = require('../middleware/auth');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const router = express.Router();

// Teacher profile + their active courses
router.get('/me', auth, permit('Teacher'), async (req, res) => {
  const teacher = req.user;
  const courses = await Course.find({ teacher: teacher._id, active: true });
  res.json({ profile: teacher.profile, courses });
});

// Course details (teacher must own it)
router.get('/course/:id', auth, permit('Teacher'), async (req, res) => {
  const course = await Course.findById(req.params.id).populate('teacher', 'profile');
  if (!course) return res.status(404).json({ message: 'Course not found' });
  if (String(course.teacher._id) !== String(req.user._id)) return res.status(403).json({ message: 'Not allowed' });
  const students = await Enrollment.find({ course: course._id }).populate('student', 'profile username');
  res.json({ course, students });
});

module.exports = router;
