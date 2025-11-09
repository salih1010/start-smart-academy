<template>
  <div class="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-100">
        <tr>
          <th
            v-for="header in headers"
            :key="header"
            class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-100">
        <tr v-for="row in rows" :key="row.id" class="hover:bg-gray-50">
          <td v-for="(value, key) in row" :key="key" class="px-6 py-3 text-gray-700 text-sm">
            {{ value }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  headers: Array,
  rows: Array
})
</script>

