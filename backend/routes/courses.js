const express = require('express');
const { auth, permit } = require('../middleware/auth');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const router = express.Router();

// Public list (SuperAdmin/Teacher/Student can use after auth)
router.get('/', auth, async (req, res) => {
  const courses = await Course.find().populate('teacher', 'profile');
  res.json(courses);
});

// Create course (Teacher or SuperAdmin)
router.post('/', auth, permit('Teacher','SuperAdmin'), async (req, res) => {
  const { title, description, startDate, endDate } = req.body;
  const course = new Course({
    title, description, startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
    teacher: req.user.role === 'Teacher' ? req.user._id : req.body.teacherId
  });
  await course.save();
  res.json(course);
});

// Enroll student to course (Student or SuperAdmin)
router.post('/:id/enroll', auth, permit('Student','SuperAdmin'), async (req, res) => {
  const courseId = req.params.id;
  const studentId = req.user.role === 'Student' ? req.user._id : req.body.studentId;
  const existing = await Enrollment.findOne({ student: studentId, course: courseId });
  if (existing) return res.status(400).json({ message: 'Already enrolled' });
  const enroll = new Enrollment({ student: studentId, course: courseId });
  await enroll.save();
  res.json({ message: 'enrolled', enroll });
});

module.exports = router;
