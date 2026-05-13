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
          @click="handleArticleClick"
        />
      </div>
    </main>

    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LayoutHeader from '../components/layout/Header.vue'
import LayoutFooter from '../components/layout/Footer.vue'
import ArticlePreview from '../components/ArticlePreview.vue'

interface Article {
  id: string | number
  title: string
  content?: string
  excerpt?: string
  coverImage?: string
  publishedAt?: string
  createdAt?: string
  category?: {
    id: string | number
    name: string
  }
  categoryName?: string
  tags?: Array<{
    id: string | number
    name: string
  }>
}

const router = useRouter()
const articles = ref<Article[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await fetch('/api/v1/articles?status=PUBLISHED')
    if (!response.ok) {
      throw new Error(`Failed to load articles: ${response.status}`)
    }

    const data = await response.json()
    articles.value = data.data || data.articles || []
  } catch (error) {
    console.warn('Using fallback articles after load failure:', error)
    // Use mock data
    articles.value = [
      {
        id: '1',
        title: '示例文章 1',
        content: '这是一篇示例文章的正文内容，用于在后端不可用时保持列表可浏览。',
        excerpt: '这是一篇示例文章的摘要内容...',
        publishedAt: new Date().toISOString(),
        tags: [{ id: '1', name: '技术' }]
      },
      {
        id: '2',
        title: '示例文章 2',
        content: '这是另一篇示例文章的正文内容，用于覆盖 ArticlePreview 对 content 字段的需求。',
        excerpt: '这是另一篇示例文章的摘要内容...',
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        tags: [{ id: '2', name: '生活' }]
      }
    ]
  } finally {
    loading.value = false
  }
})

const handleArticleClick = (article: Article) => {
  router.push(`/articles/${article.id}`)
}

onMounted(() => {
  document.title = '文章列表 - 我的博客'
})
</script>
