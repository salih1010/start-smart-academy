const express = require('express');
const { auth, permit } = require('../middleware/auth');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const router = express.Router();

// Student's dashboard: all registered courses with payment and dates
router.get('/me/courses', auth, permit('Student'), async (req, res) => {
  const enrolls = await Enrollment.find({ student: req.user._id }).populate('course');
  const result = enrolls.map(e => ({
    course: e.course,
    paymentStatus: e.paymentStatus,
    registeredAt: e.registeredAt
  }));
  res.json(result);
});

module.exports = router;
