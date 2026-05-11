<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <ReadingProgress :content-element-id="'article-content'" />
    <Header />

    <main class="py-12 flex-1">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <!-- Back Button -->
          <router-link
            to="/"
            class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </router-link>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
          </div>

          <!-- Article Content -->
          <article v-else-if="article" class="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <!-- Article Header -->
            <header class="mb-8 pb-8 border-b">
              <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {{ article.title }}
              </h1>

              <div class="flex flex-wrap items-center gap-4 text-gray-600">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{{ formatDate(article.publishedAt) }}</span>
                </div>

                <div v-if="article.category" class="flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>{{ article.category.name }}</span>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    @click="copyLink"
                    class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    {{ copied ? '已复制' : '分享' }}
                  </button>
                </div>
              </div>

              <!-- Tags -->
              <div v-if="article.tags?.length" class="flex flex-wrap gap-2 mt-4">
                <span
                  v-for="tag in article.tags"
                  :key="tag.id"
                  class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  #{{ tag.name }}
                </span>
              </div>
            </header>

            <!-- Article Body -->
            <div
              id="article-content"
              class="prose prose-lg max-w-none markdown-content"
              v-html="renderedContent"
            />

            <!-- Article Navigation -->
            <nav class="mt-12 pt-8 border-t flex justify-between">
              <router-link
                v-if="previousArticle"
                :to="`/articles/${previousArticle.id}`"
                class="flex-1 text-left hover:text-blue-600"
              >
                <div class="text-sm text-gray-500">上一篇</div>
                <div class="font-medium">{{ previousArticle.title }}</div>
              </router-link>

              <div v-else class="flex-1" />

              <router-link
                v-if="nextArticle"
                :to="`/articles/${nextArticle.id}`"
                class="flex-1 text-right hover:text-blue-600"
              >
                <div class="text-sm text-gray-500">下一篇</div>
                <div class="font-medium">{{ nextArticle.title }}</div>
              </router-link>
            </nav>
          </article>

          <!-- Error State -->
          <div v-else class="bg-white rounded-lg shadow-lg p-12 text-center">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">文章未找到</h2>
            <p class="text-gray-600 mb-6">抱歉，该文章不存在或已被删除。</p>
            <router-link to="/" class="text-blue-600 hover:text-blue-700">
              返回首页
            </router-link>
          </div>
        </div>

        <!-- TOC Sidebar -->
        <div v-if="article && !loading" class="hidden lg:block fixed right-8 top-32 w-64">
          <TOC :content-element-id="'article-content'" />
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import ReadingProgress from '@/components/ReadingProgress.vue'
import TOC from '@/components/TOC.vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

interface Tag {
  id: string
  name: string
}

interface Category {
  id: string
  name: string
}

interface Article {
  id: string
  title: string
  content: string
  publishedAt: string
  category?: Category
  tags?: Tag[]
}

const route = useRoute()
const article = ref<Article | null>(null)
const loading = ref(true)
const copied = ref(false)
const previousArticle = ref<Article | null>(null)
const nextArticle = ref<Article | null>(null)

// Configure markdown-it with syntax highlighting
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
})

const renderedContent = computed(() => {
  if (!article.value) return ''
  return md.render(article.value.content)
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy link:', error)
  }
}

const loadArticle = async () => {
  loading.value = true
  try {
    const articleId = route.params.id as string

    const response = await fetch(`/api/v1/articles/${articleId}`)
    if (response.ok) {
      const data = await response.json()
      article.value = data.data

      // Load adjacent articles
      await loadAdjacentArticles()
    }
  } catch (error) {
    console.error('Failed to load article:', error)
  } finally {
    loading.value = false
  }
}

const loadAdjacentArticles = async () => {
  try {
    const response = await fetch('/api/v1/articles?status=PUBLISHED&limit=100')
    if (response.ok) {
      const data = await response.json()
      const articles = data.data || []

      const currentIndex = articles.findIndex((a: Article) => a.id === article.value?.id)

      if (currentIndex > 0) {
        previousArticle.value = articles[currentIndex - 1]
      }

      if (currentIndex < articles.length - 1) {
        nextArticle.value = articles[currentIndex + 1]
      }
    }
  } catch (error) {
    console.error('Failed to load adjacent articles:', error)
  }
}

onMounted(() => {
  loadArticle()
})
</script>

<style>
.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.markdown-content h1 {
  font-size: 2.25rem;
}

.markdown-content h2 {
  font-size: 1.875rem;
}

.markdown-content h3 {
  font-size: 1.5rem;
}

.markdown-content h4 {
  font-size: 1.25rem;
}

.markdown-content p {
  margin-bottom: 1.25rem;
  line-height: 1.75;
}

.markdown-content code {
  background-color: #f3f4f6;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.markdown-content pre {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #1f2937;
  border-radius: 0.5rem;
  overflow-x: auto;
}

.markdown-content pre code {
  background-color: transparent;
  padding: 0;
  color: #f3f4f6;
}

.markdown-content blockquote {
  border-left: 4px solid #3b82f6;
  padding-left: 1rem;
  margin-bottom: 1.25rem;
  color: #4b5563;
  font-style: italic;
}

.markdown-content ul,
.markdown-content ol {
  margin-bottom: 1.25rem;
  padding-left: 2rem;
}

.markdown-content li {
  margin-bottom: 0.5rem;
}

.markdown-content img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
}

.markdown-content a {
  color: #3b82f6;
  text-decoration: underline;
}

.markdown-content a:hover {
  color: #2563eb;
}

.markdown-content table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}

.markdown-content th,
.markdown-content td {
  border: 1px solid #e5e7eb;
  padding: 0.75rem;
  text-align: left;
}

.markdown-content th {
  background-color: #f9fafb;
  font-weight: 600;
}
</style>
