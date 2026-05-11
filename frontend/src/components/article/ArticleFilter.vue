<template>
  <div class="flex flex-col sm:flex-row gap-4 mb-6" data-testid="article-filter">
    <div class="flex-1">
      <input
        ref="searchInput"
        v-model="searchQuery"
        data-testid="search-input"
        type="text"
        placeholder="搜索文章..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        @input="handleSearchInput"
      />
    </div>

    <div class="flex gap-3">
      <select
        v-model="selectedStatus"
        data-testid="status-filter"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        @change="handleStatusChange"
      >
        <option value="ALL">全部状态</option>
        <option value="PUBLISHED">已发布</option>
        <option value="DRAFT">草稿</option>
      </select>

      <button
        data-testid="create-button"
        class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        @click="handleCreate"
      >
        新建文章
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  search: [query: string]
  filter: [status: string]
  create: []
}>()

const searchQuery = ref('')
const selectedStatus = ref('ALL')
const debounceTimer = ref<number | null>(null)

const handleSearchInput = () => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }

  debounceTimer.value = window.setTimeout(() => {
    emit('search', searchQuery.value)
  }, 500)
}

const handleStatusChange = () => {
  emit('filter', selectedStatus.value)
}

const handleCreate = () => {
  emit('create')
}
</script>
