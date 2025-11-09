/**
 * Run: node scripts/seedSuperAdmin.js
 * Make sure MONGO_URI and JWT_SECRET are set in environment or .env
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

async function run(){
  await mongoose.connect(process.env.MONGO_URI);
  const exists = await User.findOne({ role: 'SuperAdmin' });
  if (exists) {
    console.log('SuperAdmin exists:', exists.username);
    process.exit(0);
  }
  const hash = await bcrypt.hash('SuperAdmin123!', 10);
  const admin = new User({ username: 'superadmin', passwordHash: hash, role: 'SuperAdmin', profile: { name: 'Super Admin', email: 'admin@start-smart.local' } });
  await admin.save();
  console.log('Created SuperAdmin with username=superadmin and password=SuperAdmin123!');
  process.exit(0);
}
run().catch(err => { console.error(err); process.exit(1); });
