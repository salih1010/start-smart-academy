require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/teachers');
const courseRoutes = require('./routes/courses');
const adminRoutes = require('./routes/admin');
const studentRoutes = require('./routes/students');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/students', studentRoutes);

const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=> {
  console.log('MongoDB connected');
  app.listen(PORT, ()=> console.log('Server listening on', PORT));
})
.catch(err => {
  console.error('Mongo connection error', err);
});
