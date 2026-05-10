<template>
  <div class="min-h-screen bg-gray-50">
    <LayoutHeader />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">文章列表</h1>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">加载中...</p>
      </div>

      <div v-else-if="articles.length === 0" class="text-center py-12">
        <p class="text-gray-600">暂无文章</p>
      </div>

      <div v-else class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <ArticlePreview
          v-for="article in articles"
          :key="article.id"
          :article="article"
        />
      </div>
    </main>

    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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

const articles = ref<Article[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/articles?status=published')
    if (response.ok) {
      const data = await response.json()
      articles.value = data.articles || []
    }
  } catch (error) {
    console.error('Failed to load articles:', error)
    // Use mock data
    articles.value = [
      {
        id: '1',
        title: '示例文章 1',
        excerpt: '这是一篇示例文章的摘要内容...',
        createdAt: new Date().toISOString(),
        author: { name: '作者' },
        tags: [{ id: '1', name: '技术' }]
      },
      {
        id: '2',
        title: '示例文章 2',
        excerpt: '这是另一篇示例文章的摘要内容...',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        author: { name: '作者' },
        tags: [{ id: '2', name: '生活' }]
      }
    ]
  } finally {
    loading.value = false
  }
})

onMounted(() => {
  document.title = '文章列表 - 我的博客'
})
</script>
