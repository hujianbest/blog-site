<template>
  <div class="min-h-screen bg-gray-50">
    <LayoutHeader />

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">加载中...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <router-link to="/" class="text-primary-600 hover:text-primary-700">
          返回首页
        </router-link>
      </div>

      <!-- Article Content -->
      <article v-else-if="article" class="bg-white rounded-lg shadow-sm p-6 md:p-8">
        <!-- Article Header -->
        <header class="mb-8">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {{ article.title }}
          </h1>

          <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>{{ article.author.name }}</span>
            </div>

            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>{{ formatDate(article.createdAt) }}</span>
            </div>

            <div v-if="article.category" class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"
                />
              </svg>
              <router-link
                :to="`/categories/${article.category.id}`"
                class="text-primary-600 hover:text-primary-700"
              >
                {{ article.category.name }}
              </router-link>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="article.tags && article.tags.length > 0" class="mt-4 flex flex-wrap gap-2">
            <router-link
              v-for="tag in article.tags"
              :key="tag.id"
              :to="`/tags/${tag.name}`"
              class="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
            >
              # {{ tag.name }}
            </router-link>
          </div>
        </header>

        <!-- Article Cover Image -->
        <div v-if="article.coverImage" class="mb-8 rounded-lg overflow-hidden">
          <img
            :src="article.coverImage"
            :alt="article.title"
            class="w-full object-cover"
          />
        </div>

        <!-- Article Content -->
        <div class="prose prose-lg max-w-none">
          <div v-html="renderedContent" class="markdown-content" />
        </div>

        <!-- Share Section -->
        <div class="mt-12 pt-8 border-t border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">分享文章</h3>
          <div class="flex flex-wrap gap-4">
            <button
              @click="copyLink"
              class="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path
                  d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"
                />
              </svg>
              <span>{{ copyButtonText }}</span>
            </button>
          </div>
        </div>

        <!-- Navigation -->
        <div class="mt-12 pt-8 border-t border-gray-200 flex justify-between">
          <router-link
            v-if="previousArticle"
            :to="`/articles/${previousArticle.id}`"
            class="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clip-rule="evenodd"
              />
            </svg>
            <span>上一篇</span>
          </router-link>

          <div v-else></div>

          <router-link
            v-if="nextArticle"
            :to="`/articles/${nextArticle.id}`"
            class="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
          >
            <span>下一篇</span>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </router-link>
        </div>
      </article>

      <!-- Comments Section -->
      <section v-if="article" class="mt-8 bg-white rounded-lg shadow-sm p-6 md:p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">评论</h2>
        <CommentList :article-id="article.id" />
      </section>
    </main>

    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import LayoutHeader from '../components/layout/Header.vue'
import LayoutFooter from '../components/layout/Footer.vue'
import CommentList from '../components/comments/CommentList.vue'
import { convertMarkdownToHtml } from '../utils/markdown'
import { setMetaTags, generateArticleStructuredData, injectStructuredData, generatePageTitle, generateDescription, generateOgImageUrl } from '../utils/seo'

interface Article {
  id: string
  title: string
  content: string
  excerpt: string
  coverImage?: string
  createdAt: string
  updatedAt?: string
  author: {
    name: string
  }
  category?: {
    id: string
    name: string
  }
  tags: Array<{
    id: string
    name: string
  }>
}

const route = useRoute()
const article = ref<Article | null>(null)
const previousArticle = ref<Article | null>(null)
const nextArticle = ref<Article | null>(null)
const loading = ref(true)
const error = ref('')
const copyButtonText = ref('复制链接')

const renderedContent = computed(() => {
  if (!article.value) return ''
  return convertMarkdownToHtml(article.value.content)
})

async function loadArticle() {
  try {
    const articleId = route.params.id as string
    const response = await fetch(`http://localhost:3000/api/v1/articles/${articleId}`)

    if (!response.ok) {
      throw new Error('文章加载失败')
    }

    const data = await response.json()
    article.value = data.article

    if (article.value) {
      // Set SEO meta tags
      const description = article.value.excerpt || generateDescription(article.value.content)
      const keywords = article.value.tags.map(tag => tag.name)

      setMetaTags({
        title: generatePageTitle(article.value.title),
        description,
        ogTitle: article.value.title,
        ogDescription: description,
        ogImage: generateOgImageUrl(article.value.coverImage),
        ogType: 'article',
        canonical: window.location.href,
        keywords
      })

      // Generate and inject structured data
      const structuredData = generateArticleStructuredData({
        title: article.value.title,
        description,
        publishDate: article.value.createdAt,
        modifyDate: article.value.updatedAt,
        author: article.value.author.name,
        image: article.value.coverImage,
        url: window.location.href
      })
      injectStructuredData(structuredData)
    }

    // Load adjacent articles
    await loadAdjacentArticles()
  } catch (err) {
    console.error('Failed to load article:', err)
    error.value = '文章加载失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

async function loadAdjacentArticles() {
  if (!article.value) return

  try {
    const response = await fetch('http://localhost:3000/api/v1/articles?status=published&limit=10')
    if (response.ok) {
      const data = await response.json()
      const articles = data.articles || []
      const currentIndex = articles.findIndex((a: Article) => a.id === article.value?.id)

      if (currentIndex > 0) {
        previousArticle.value = articles[currentIndex - 1]
      }
      if (currentIndex >= 0 && currentIndex < articles.length - 1) {
        nextArticle.value = articles[currentIndex + 1]
      }
    }
  } catch (err) {
    console.error('Failed to load adjacent articles:', err)
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function copyLink() {
  const url = window.location.href
  navigator.clipboard.writeText(url).then(() => {
    copyButtonText.value = '已复制!'
    setTimeout(() => {
      copyButtonText.value = '复制链接'
    }, 2000)
  })
}

onMounted(() => {
  loadArticle()
})
</script>

<style scoped>
.markdown-content {
  color: #111827;
  line-height: 1.625;
}

.markdown-content :deep(h1) {
  font-size: 1.875rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #111827;
}

.markdown-content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #111827;
}

.markdown-content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 700;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: #111827;
}

.markdown-content :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.75;
}

.markdown-content :deep(code) {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-family: monospace;
}

.markdown-content :deep(pre) {
  background-color: #111827;
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.markdown-content :deep(pre code) {
  background-color: transparent;
  color: white;
  padding: 0;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin-bottom: 1rem;
  margin-left: 2rem;
}

.markdown-content :deep(li) {
  margin-bottom: 0.5rem;
}

.markdown-content :deep(a) {
  color: #ea580c;
  text-decoration: underline;
}

.markdown-content :deep(a:hover) {
  color: #c2410c;
}

.markdown-content :deep(img) {
  border-radius: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  max-width: 100%;
  height: auto;
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid #ea580c;
  padding-left: 1rem;
  font-style: italic;
  color: #374151;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.markdown-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  text-align: left;
}

.markdown-content :deep(th) {
  background-color: #f3f4f6;
  font-weight: 600;
}
</style>
