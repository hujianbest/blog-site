<template>
  <div
    class="article-card bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-6 cursor-pointer"
    data-testid="article-card"
  >
    <div class="flex justify-between items-start mb-3">
      <h3 class="text-xl font-semibold text-gray-900 flex-1">{{ article.title }}</h3>
      <span
        :class="[
          'px-2 py-1 text-xs font-medium rounded',
          article.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        ]"
      >
        {{ article.status === 'PUBLISHED' ? '已发布' : '草稿' }}
      </span>
    </div>

    <p class="text-gray-600 mb-4 line-clamp-2">
      {{ excerpt }}
    </p>

    <div class="flex justify-between items-center">
      <span class="text-sm text-gray-500">
        {{ formatDate(article.createdAt) }}
      </span>

      <div class="flex gap-2">
        <button
          data-testid="edit-button"
          @click.stop="handleEdit"
          class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          编辑
        </button>
        <button
          data-testid="delete-button"
          @click.stop="handleDelete"
          class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          删除
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Article {
  id: string
  title: string
  content: string
  status: 'DRAFT' | 'PUBLISHED'
  createdAt: string
}

interface Props {
  article: Article
}

const props = defineProps<Props>()

const emit = defineEmits<{
  edit: [article: Article]
  delete: [article: Article]
}>()

const excerpt = computed(() => {
  // Strip markdown and get first 150 characters
  const text = props.article.content
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`/g, '')
    .replace(/\n/g, ' ')
  return text.length > 150 ? text.slice(0, 150) + '...' : text
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const handleEdit = () => {
  emit('edit', props.article)
}

const handleDelete = () => {
  emit('delete', props.article)
}
</script>

<style scoped>
.article-card {
  border: 1px solid #e5e7eb;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
