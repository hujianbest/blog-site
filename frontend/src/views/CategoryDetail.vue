<template>
  <div class="min-h-screen bg-gray-50">
    <LayoutHeader />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">加载中...</p>
      </div>

      <div v-else-if="category">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">
          {{ category.name }}
        </h1>

        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <ArticlePreview
            v-for="article in articles"
            :key="article.id"
            :article="article"
          />
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

interface Category {
  id: string
  name: string
}

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
const category = ref<Category | null>(null)
const articles = ref<Article[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const categoryId = route.params.id as string
    const response = await fetch(`http://localhost:3000/api/v1/categories/${categoryId}`)
    if (response.ok) {
      const data = await response.json()
      category.value = data.category
      articles.value = data.articles || []
    }
  } catch (error) {
    console.error('Failed to load category:', error)
  } finally {
    loading.value = false
  }
})
</script>
