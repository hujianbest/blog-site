<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header />

    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          欢迎来到我的博客
        </h1>
        <p class="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
          记录技术探索，分享学习心得，沉淀思考点滴
        </p>
        <router-link
          to="/articles"
          class="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
        >
          浏览文章
        </router-link>
      </div>
    </section>

    <!-- Latest Articles Section -->
    <section class="py-16 flex-1">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">最新文章</h2>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
          <p class="mt-4 text-gray-600">加载中...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="articles.length === 0" class="text-center py-12">
          <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="mt-4 text-gray-600">暂无文章</p>
        </div>

        <!-- Articles Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ArticlePreview
            v-for="article in articles"
            :key="article.id"
            :article="article"
            @click="handleArticleClick"
          />
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import ArticlePreview from '@/components/ArticlePreview.vue'
import { setMetaTags } from '@/utils/seo'

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

const router = useRouter()
const articles = ref<Article[]>([])
const loading = ref(true)

const loadArticles = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/v1/articles?status=PUBLISHED&limit=9')
    if (response.ok) {
      const data = await response.json()
      articles.value = data.data || []
    }
  } catch (error) {
    console.error('Failed to load articles:', error)
  } finally {
    loading.value = false
  }
}

const handleArticleClick = (article: Article) => {
  router.push(`/articles/${article.id}`)
}

onMounted(() => {
  // SEO Meta Tags
  setMetaTags({
    title: '首页 - My Blog',
    description: '记录技术探索，分享学习心得，沉淀思考点滴。欢迎来到我的个人博客，探索最新的技术文章和教程。',
    ogType: 'website',
    twitterCard: 'summary_large_image'
  })

  loadArticles()
})
</script>
