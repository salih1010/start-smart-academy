<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
      <h1 class="text-2xl font-bold text-gray-800">Courses</h1>

      <div class="flex items-center gap-3">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search courses..."
          class="px-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          @click="fetchCourses"
          class="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
        >
          🔄 Refresh
        </button>
        <button
          @click="openAddModal"
          class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition"
        >
          ➕ Add Course
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-gray-500 text-center py-10">
      Loading courses...
    </div>

    <!-- Error state -->
    <div
      v-if="error"
      class="text-red-500 bg-red-50 border border-red-200 p-4 rounded-lg mb-4"
    >
      {{ error }}
    </div>

    <!-- Courses Table -->
    <DataTable
      v-if="!loading && !error"
      :headers="headers"
      :rows="filteredCourses"
    />

    <!-- Add Course Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <h2 class="text-lg font-semibold mb-4 text-gray-800">Add New Course</h2>

        <div class="space-y-3">
          <input
            v-model="newCourse.title"
            type="text"
            placeholder="Course Title"
            class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
          />
          <input
            v-model="newCourse.category"
            type="text"
            placeholder="Category"
            class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
          />
          <input
            v-model="newCourse.teacher"
            type="text"
            placeholder="Teacher Name"
            class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button
            @click="closeAddModal"
            class="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Cancel
          </button>
          <button
            @click="addCourse"
            class="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import DataTable from '../components/DataTable.vue'

// --- State ---
const headers = ['ID', 'Title', 'Category', 'Teacher']
const courses = ref([])
const loading = ref(true)
const error = ref('')
const searchTerm = ref('')
const showAddModal = ref(false)
const newCourse = ref({ title: '', category: '', teacher: '' })

// --- Computed filtered list ---
const filteredCourses = computed(() => {
  if (!searchTerm.value) return courses.value
  const term = searchTerm.value.toLowerCase()
  return courses.value.filter(
    (c) =>
      c.title.toLowerCase().includes(term) ||
      c.category.toLowerCase().includes(term) ||
      c.teacher.toLowerCase().includes(term)
  )
})

// --- API Fetch ---
async function fetchCourses() {
  loading.value = true
  error.value = ''
  try {
    const token = localStorage.getItem('ss_token')
    if (!token) throw new Error('Missing token, please log in again.')

    const res = await axios.get('http://16.16.219.45:4000/api/courses', {
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = Array.isArray(res.data)
      ? res.data
      : res.data.courses || res.data.data || []

    courses.value = data.map((c) => ({
      id: c._id || c.id,
      title: c.title || c.name,
      category: c.category || c.type || 'N/A',
      teacher: c.teacher?.name || c.teacherName || 'N/A',
    }))
  } catch (err) {
    console.error('Error fetching courses:', err)
    error.value =
      err.response?.data?.message || err.message || 'Failed to load courses'
  } finally {
    loading.value = false
  }
}

// --- Add Course Modal logic ---
function openAddModal() {
  showAddModal.value = true
}
function closeAddModal() {
  showAddModal.value = false
  newCourse.value = { title: '', category: '', teacher: '' }
}

// --- Add Course API call ---
async function addCourse() {
  try {
    const token = localStorage.getItem('ss_token')
    if (!token) throw new Error('Missing token, please log in again.')

    const payload = {
      title: newCourse.value.title,
      category: newCourse.value.category,
      teacherName: newCourse.value.teacher,
    }

    await axios.post('http://16.16.219.45:4000/api/courses', payload, {
      headers: { Authorization: `Bearer ${token}` },
    })

    closeAddModal()
    await fetchCourses() // refresh table
  } catch (err) {
    console.error('Error adding course:', err)
    alert(err.response?.data?.message || 'Failed to add course')
  }
}

onMounted(fetchCourses)
</script>

