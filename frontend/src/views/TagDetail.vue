<template>
  <div class="min-h-screen bg-gray-50">
    <LayoutHeader />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">加载中...</p>
      </div>

      <div v-else>
        <h1 class="text-3xl font-bold text-gray-900 mb-8">
          标签: #{{ tagName }}
        </h1>

        <div v-if="articles.length > 0" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <ArticlePreview
            v-for="article in articles"
            :key="article.id"
            :article="article"
          />
        </div>

        <div v-else class="text-center py-12">
          <p class="text-gray-600">该标签下暂无文章</p>
        </div>
      </div>
    </main>

    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import LayoutHeader from '../components/layout/Header.vue'
import LayoutFooter from '../components/layout/Footer.vue'
import ArticlePreview from '../components/ArticlePreview.vue'

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
}

const route = useRoute()
const tagName = ref(route.params.name as string)
const articles = ref<Article[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const tag = route.params.name as string
    const response = await fetch(`http://localhost:3000/api/v1/articles?tag=${tag}`)
    if (response.ok) {
      const data = await response.json()
      articles.value = data.articles || []
    }
  } catch (error) {
    console.error('Failed to load articles by tag:', error)
  } finally {
    loading.value = false
  }
})
</script>
