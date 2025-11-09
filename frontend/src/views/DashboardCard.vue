<template>
  <div
    class="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl p-6 transition-transform hover:-translate-y-1 border border-gray-100"
    @click="$emit('click')"
  >
    <div class="text-5xl mb-4">{{ icon }}</div>
    <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ title }}</h2>
    <p class="text-gray-500 text-sm">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
  icon: String
})
</script>

