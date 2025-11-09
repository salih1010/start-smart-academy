<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white p-8 rounded shadow">
      <h1 class="text-2xl font-bold mb-4 text-center">Start-Smart — Login</h1>
      <form @submit.prevent="doLogin" class="space-y-4">
        <div>
          <label class="block text-sm">Username</label>
          <input v-model="username" class="w-full border p-2 rounded" />
        </div>
        <div>
          <label class="block text-sm">Password</label>
          <input v-model="password" type="password" class="w-full border p-2 rounded" />
        </div>
        <div>
          <button :disabled="loading" class="w-full bg-blue-600 text-white py-2 rounded">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </div>
      </form>
      <p v-if="error" class="text-red-600 mt-2 text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()
async function doLogin() {
  error.value = ''
  loading.value = true
  try {
    const res = await axios.post('http://16.16.219.45:4000/api/auth/login', {
      username: username.value,
      password: password.value
    })

    const data = res.data
    console.log('Login response:', data)

    // Save token and profile
localStorage.setItem('ss_token', data.token || '')
localStorage.setItem('ss_role', data.role || '')
localStorage.setItem('ss_name', data.name || '')
localStorage.setItem('ss_email', data.email || '')
//localStorage.setItem('ss_profile', data.profile ? JSON.stringify(data.profile) : '{}')

    // Determine role safely
    const role = (data.role || '').toLowerCase()

    if (role === 'student') router.push('/student')
    else if (role === 'teacher') router.push('/teacher')
    else if (role.includes('admin')) router.push('/admin')
    else router.push('/')
  } catch (err) {
    console.error('Login failed:', err)
    error.value = err?.response?.data?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}

</script>

