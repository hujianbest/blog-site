<template>
  <div class="min-h-screen flex flex-col bg-[var(--color-bg-page)]">
    <Header />

    <main id="main-content" class="flex-1">
      <!-- Hero Section -->
      <section
        data-ui="home-hero"
        class="bg-[var(--color-bg-accent-subtle)] border-b border-[var(--color-border-default)] py-20"
      >
        <div class="ui-page">
          <p class="text-sm font-medium text-[var(--color-primary-text)] mb-4">
            Editorial notes on software, tools, and long-term thinking
          </p>
          <h1 class="text-[2.125rem] md:text-5xl leading-tight font-bold text-[var(--color-fg-default)] mb-6 max-w-3xl">
            写作、工程与长期思考
          </h1>
          <p class="text-lg md:text-xl text-[var(--color-fg-muted)] mb-8 max-w-2xl leading-relaxed">
            记录工程实践、产品判断和个人知识系统的长期变化，保留上下文、限制条件和证据。
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <router-link
              to="/articles"
              class="ui-button-primary inline-flex items-center justify-center px-6 py-3 font-semibold"
            >
              开始阅读
            </router-link>
            <router-link
              to="/about"
              class="ui-link inline-flex items-center justify-center px-6 py-3 font-semibold"
            >
              关于作者
            </router-link>
          </div>
        </div>
      </section>

      <!-- Latest Articles Section -->
      <section class="py-16">
        <div class="ui-page">
          <h2 class="text-3xl font-bold text-[var(--color-fg-default)] mb-8">最新文章</h2>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div
            data-ui-state="loading"
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[var(--color-border-default)] border-t-[var(--color-primary-text)]"
          ></div>
          <p class="mt-4 text-[var(--color-fg-muted)]">加载中...</p>
        </div>

        <!-- Error State -->
        <div
          v-else-if="errorMessage"
          data-ui-state="error"
          class="ui-surface text-center py-10 px-6"
        >
          <p class="text-[var(--color-danger)] font-medium">{{ errorMessage }}</p>
          <button class="ui-link mt-4 inline-flex font-semibold" type="button" @click="loadArticles">
            重新加载
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="articles.length === 0" data-ui-state="empty" class="ui-surface text-center py-10 px-6">
          <svg class="mx-auto h-16 w-16 text-[var(--color-fg-subtle)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="mt-4 text-[var(--color-fg-muted)]">暂无文章。你可以稍后回来，或先了解这个站点的写作方向。</p>
          <router-link to="/about" class="ui-link mt-4 inline-flex font-semibold">
            关于作者
          </router-link>
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
    </main>

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
import { getPublishedArticlesAsync } from '@/data/content'

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
const errorMessage = ref('')

const loadArticles = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    articles.value = await getPublishedArticlesAsync(9)
  } catch (error) {
    console.error('Failed to load articles:', error)
    errorMessage.value = '文章暂时无法加载，请稍后重试。'
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
    title: "首页 - hujian's bolg",
    description: '记录技术探索，分享学习心得，沉淀思考点滴。欢迎来到我的个人博客，探索最新的技术文章和教程。',
    ogType: 'website',
    twitterCard: 'summary_large_image'
  })

  loadArticles()
})
</script>
