<template>
  <article
    class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer"
    @click="handleClick"
  >
    <!-- Article Image (optional) -->
    <div v-if="article.coverImage" class="aspect-video overflow-hidden">
      <img
        :src="article.coverImage"
        :alt="article.title"
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
      />
    </div>

    <div class="p-6">
      <!-- Article Title -->
      <h2 class="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
        {{ article.title }}
      </h2>

      <!-- Article Excerpt -->
      <p class="text-gray-600 mb-4 line-clamp-3">
        {{ excerpt }}
      </p>

      <!-- Article Meta -->
      <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500">
        <!-- Date -->
        <div class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{{ formatDate(articleDate) }}</span>
        </div>

        <!-- Category -->
        <div v-if="categoryName" class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span>{{ categoryName }}</span>
        </div>

        <!-- Tags -->
        <div v-if="article.tags?.length" class="flex items-center gap-2">
          <span
            v-for="tag in article.tags.slice(0, 3)"
            :key="tag.id"
            class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
          >
            #{{ tag.name }}
          </span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Tag {
  id: string | number
  name: string
}

interface Category {
  id: string | number
  name: string
}

interface Article {
  id: string | number
  title: string
  content?: string
  excerpt?: string
  coverImage?: string
  publishedAt?: string
  createdAt?: string
  category?: Category
  categoryName?: string
  tags?: Tag[]
}

interface Props {
  article: Article
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [article: Article]
}>()

const categoryName = computed(() => props.article.category?.name ?? props.article.categoryName ?? '')
const articleDate = computed(() => props.article.publishedAt ?? props.article.createdAt)

const excerpt = computed(() => {
  const source = props.article.content ?? props.article.excerpt ?? ''
  const text = source
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`/g, '')
    .replace(/\n/g, ' ')
  return text.length > 150 ? text.slice(0, 150) + '...' : text
})

const formatDate = (dateString?: string) => {
  if (!dateString) {
    return '未发布'
  }

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return '未发布'
  }

  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const handleClick = () => {
  emit('click', props.article)
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
