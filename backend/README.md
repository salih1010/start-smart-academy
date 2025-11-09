# Start-Smart Backend (Node.js + MongoDB)

## Overview
Simple REST API for users (SuperAdmin/Teacher/Student), courses and enrollments.

## Setup (local)
1. Install Node 18+ and MongoDB.
2. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
3. `npm install`
4. `npm run seed` to create example SuperAdmin (username=superadmin, password=SuperAdmin123!)
5. `npm run dev` to start in dev mode (requires nodemon) or `npm start`.

## Important routes
- POST /api/auth/login  { username, password } -> { token }
- POST /api/auth/register-student -> register new student
- GET /api/teachers/me -> teacher profile + active courses (auth: Teacher)
- GET /api/teachers/course/:id -> course details + students (auth: Teacher)
- GET /api/students/me/courses -> student's enrollments (auth: Student)
- GET /api/admin/courses, /teachers, /students -> SuperAdmin only

Use Authorization: Bearer <token> for protected endpoints.
