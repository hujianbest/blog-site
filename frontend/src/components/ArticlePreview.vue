<template>
  <article class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
    <!-- Article Image (optional) -->
    <div v-if="article.coverImage" class="aspect-video overflow-hidden">
      <img
        :src="article.coverImage"
        :alt="article.title"
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>

    <div class="p-6">
      <!-- Article Title -->
      <router-link
        :to="`/articles/${article.id}`"
        class="block group"
      >
        <h3 class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
          {{ article.title }}
        </h3>
      </router-link>

      <!-- Article Excerpt -->
      <p class="text-gray-600 mb-4 line-clamp-3">
        {{ article.excerpt }}
      </p>

      <!-- Article Meta -->
      <div class="flex items-center justify-between text-sm">
        <div class="flex items-center space-x-4">
          <span class="text-gray-500">
            {{ formatDate(article.createdAt) }}
          </span>
          <span class="text-gray-500">
            {{ article.author.name }}
          </span>
        </div>
        <router-link
          :to="`/articles/${article.id}`"
          class="text-primary-600 hover:text-primary-700 font-medium"
        >
          阅读 →
        </router-link>
      </div>

      <!-- Tags -->
      <div v-if="article.tags && article.tags.length > 0" class="mt-4 flex flex-wrap gap-2">
        <router-link
          v-for="tag in article.tags.slice(0, 3)"
          :key="tag.id"
          :to="`/tags/${tag.name}`"
          class="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors"
        >
          {{ tag.name }}
        </router-link>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
interface Article {
  id: string
  title: string
  excerpt: string
  createdAt: string
  author: {
    name: string
  }
  tags: Array<{
    id: string
    name: string
  }>
  coverImage?: string
}

interface Props {
  article: Article
}

defineProps<Props>()

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    return '今天'
  } else if (diffInDays === 1) {
    return '昨天'
  } else if (diffInDays < 7) {
    return `${diffInDays} 天前`
  } else if (diffInDays < 30) {
    return `${Math.floor(diffInDays / 7)} 周前`
  } else if (diffInDays < 365) {
    return `${Math.floor(diffInDays / 30)} 月前`
  } else {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
