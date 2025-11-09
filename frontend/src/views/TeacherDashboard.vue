<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
      <h1 class="text-2xl font-bold text-gray-800">Teachers</h1>

      <div class="flex items-center gap-3">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search teachers..."
          class="px-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          @click="fetchTeachers"
          class="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
        >
          🔄 Refresh
        </button>
        <button
          @click="openAddModal"
          class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition"
        >
          ➕ Add Teacher
        </button>
      </div>
    </div>

    <!-- Loading / Error / Table -->
    <div v-if="loading" class="text-gray-500 text-center py-10">Loading teachers...</div>
    <div
      v-if="error"
      class="text-red-500 bg-red-50 border border-red-200 p-4 rounded-lg mb-4"
    >
      {{ error }}
    </div>
    <DataTable v-if="!loading && !error" :headers="headers" :rows="filteredTeachers" />

    <!-- Add Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 class="text-lg font-semibold mb-4 text-gray-800">Add New Teacher</h2>
        <div class="space-y-3">
          <input
            v-model="newTeacher.name"
            type="text"
            placeholder="Full Name"
            class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
          />
          <input
            v-model="newTeacher.email"
            type="email"
            placeholder="Email"
            class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
          />
          <input
            v-model="newTeacher.department"
            type="text"
            placeholder="Department"
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
            @click="addTeacher"
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

const headers = ['ID', 'Name', 'Email', 'Department']
const teachers = ref([])
const loading = ref(true)
const error = ref('')
const searchTerm = ref('')
const showAddModal = ref(false)
const newTeacher = ref({ name: '', email: '', department: '' })

const filteredTeachers = computed(() => {
  if (!searchTerm.value) return teachers.value
  const term = searchTerm.value.toLowerCase()
  return teachers.value.filter(
    (t) =>
      t.name.toLowerCase().includes(term) ||
      t.email.toLowerCase().includes(term) ||
      t.department.toLowerCase().includes(term)
  )
})

async function fetchTeachers() {
  loading.value = true
  error.value = ''
  try {
    const token = localStorage.getItem('ss_token')
    const res = await axios.get('http://16.16.219.45:4000/api/teachers', {
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = Array.isArray(res.data)
      ? res.data
      : res.data.teachers || res.data.data || []

    teachers.value = data.map((t) => ({
      id: t._id || t.id,
      name: t.name,
      email: t.email,
      department: t.department || 'N/A',
    }))
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load teachers'
  } finally {
    loading.value = false
  }
}

function openAddModal() {
  showAddModal.value = true
}
function closeAddModal() {
  showAddModal.value = false
  newTeacher.value = { name: '', email: '', department: '' }
}

async function addTeacher() {
  try {
    const token = localStorage.getItem('ss_token')
    await axios.post('http://16.16.219.45:4000/api/teachers', newTeacher.value, {
      headers: { Authorization: `Bearer ${token}` },
    })
    closeAddModal()
    await fetchTeachers()
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to add teacher')
  }
}

onMounted(fetchTeachers)
</script>

