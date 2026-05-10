<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <LayoutHeader />

    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary-50 to-secondary-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            欢迎来到我的博客
          </h1>
          <p class="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            记录技术、生活和思考，分享知识与经验
          </p>
          <div class="flex justify-center gap-4">
            <router-link
              to="/articles"
              class="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              浏览文章
            </router-link>
            <router-link
              to="/about"
              class="px-8 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-50 transition-colors font-medium border border-primary-600"
            >
              了解更多
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Articles Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900">最新文章</h2>
          <router-link
            to="/articles"
            class="text-primary-600 hover:text-primary-700 font-medium"
          >
            查看全部 →
          </router-link>
        </div>

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
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">分类浏览</h2>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <router-link
            v-for="category in categories"
            :key="category.id"
            :to="`/categories/${category.id}`"
            class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ category.name }}
            </h3>
            <p class="text-sm text-gray-600">
              {{ category.articleCount }} 篇文章
            </p>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LayoutHeader from '../components/layout/Header.vue'
import LayoutFooter from '../components/layout/Footer.vue'
import ArticlePreview from '../components/ArticlePreview.vue'
import { setMetaTags, generateWebsiteStructuredData, injectStructuredData } from '../utils/seo'

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

interface Category {
  id: string
  name: string
  articleCount: number
}

const articles = ref<Article[]>([])
const categories = ref<Category[]>([])
const loading = ref(true)

onMounted(async () => {
  // Set SEO meta tags
  setMetaTags({
    title: '首页 - 我的博客',
    description: '欢迎来到我的博客，记录技术、生活和思考，分享知识与经验。',
    ogType: 'website',
    canonical: window.location.origin
  })

  // Generate and inject website structured data
  const structuredData = generateWebsiteStructuredData()
  injectStructuredData(structuredData)

  try {
    // Fetch articles
    const articlesResponse = await fetch('http://localhost:3000/api/v1/articles?status=published&limit=6')
    if (articlesResponse.ok) {
      const data = await articlesResponse.json()
      articles.value = data.articles || []
    }

    // Fetch categories
    const categoriesResponse = await fetch('http://localhost:3000/api/v1/categories')
    if (categoriesResponse.ok) {
      const data = await categoriesResponse.json()
      categories.value = data.categories || []
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
    // Use mock data when backend is not available
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
      },
      {
        id: '3',
        title: '示例文章 3',
        excerpt: '这是第三篇示例文章的摘要内容...',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        author: { name: '作者' },
        tags: [{ id: '1', name: '技术' }]
      }
    ]
    categories.value = [
      { id: '1', name: '技术', articleCount: 10 },
      { id: '2', name: '生活', articleCount: 5 },
      { id: '3', name: '思考', articleCount: 3 },
      { id: '4', name: '随笔', articleCount: 8 }
    ]
  } finally {
    loading.value = false
  }
})
</script>
