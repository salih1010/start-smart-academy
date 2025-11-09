<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <h1 class="text-3xl font-bold mb-8 text-gray-800">Super Admin Dashboard</h1>

    <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
      <DashboardCard
        title="Courses"
        description="View and manage all available courses"
        icon="📘"
        @click="goTo('/admin/courses')"
      />
      <DashboardCard
        title="Teachers"
        description="View and manage all teachers"
        icon="👩‍🏫"
        @click="goTo('/admin/teachers')"
      />
      <DashboardCard
        title="Students"
        description="View and manage all enrolled students"
        icon="🎓"
        @click="goTo('/admin/students')"
      />
    </div>
  </div>
</template>

<script setup>
import DashboardCard from '../components/DashboardCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
function goTo(path) {
  router.push(path)
}
</script>

