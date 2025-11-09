import { createRouter, createWebHistory } from 'vue-router'

// Import pages
import Login from '../views/Login.vue'
import StudentDashboard from '../views/StudentDashboard.vue'
import TeacherDashboard from '../views/TeacherDashboard.vue'
import SuperAdminDashboard from '../views/SuperAdminDashboard.vue'
import CoursesDashboard from '../views/CoursesDashboard.vue'



// Define routes
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/admin/students',
    component: StudentDashboard,
  //  meta: { requiresAuth: true, roles: ['Student'] }
  },
  {
    path: '/admin/teachers',
    component: TeacherDashboard,
  //  meta: { requiresAuth: true, roles: ['Teacher'] }
  },
 {
    path: '/admin/courses',
    component: CoursesDashboard,
  },
  {
    path: '/admin',
    component: SuperAdminDashboard,
    meta: { requiresAuth: true, roles: ['SuperAdmin'] }
  }
]

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Helper functions for auth
function getToken() {
  return localStorage.getItem('ss_token')
}

function getName() {
  return localStorage.getItem('ss_name')
}

function getEmail() {
  return localStorage.getItem('ss_email')
}

function getRole() {
  return localStorage.getItem('ss_role')
}


// Navigation guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta?.requiresAuth
  if (!requiresAuth) return next()

  const token = getToken()
  const email = getEmail()
  const name = getName()
  const role = getRole()

  if (!token || !name) {
    // Not logged in → redirect to login
    return next('/login')
  }


  // Role-based access check
  const allowedRoles = to.meta.roles || []
	if (allowedRoles.length && !allowedRoles.includes(role)) {
    // Redirect user to their dashboard
    if (role === 'Student') return next('/student')
    if (role === 'Teacher') return next('/teacher')
    if (role === 'SuperAdmin') return next('/admin')
    return next('/login')
  }

  next()
})

export default router

