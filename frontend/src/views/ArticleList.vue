<template>
  <div class="min-h-screen bg-[var(--color-bg-page)]">
    <LayoutHeader />

    <main id="main-content" class="ui-page py-12">
      <h1 class="text-3xl font-bold text-[var(--color-fg-default)] mb-3">文章列表</h1>
      <p class="text-[var(--color-fg-muted)] mb-8">按时间浏览近期文章，继续沿着主题和标签探索。</p>

      <div v-if="loading" data-ui-state="loading" class="text-center py-12">
        <p class="text-[var(--color-fg-muted)]">加载中...</p>
      </div>

      <div v-else-if="errorMessage" data-ui-state="error" class="ui-surface text-center py-10 px-6">
        <p class="text-[var(--color-danger)] font-medium">{{ errorMessage }}</p>
        <button class="ui-link mt-4 inline-flex font-semibold" type="button" @click="loadArticles">
          重新加载
        </button>
      </div>

      <div v-else-if="articles.length === 0" data-ui-state="empty" class="ui-surface text-center py-10 px-6">
        <p class="text-[var(--color-fg-muted)]">暂无文章。你可以稍后回来，或先查看分类归档。</p>
        <router-link to="/categories" class="ui-link mt-4 inline-flex font-semibold">
          浏览分类
        </router-link>
      </div>

      <div v-else class="grid gap-6">
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
import { getPublishedArticlesAsync } from '@/data/content'

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
const errorMessage = ref('')

const loadArticles = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    articles.value = await getPublishedArticlesAsync()
  } catch (error) {
    console.error('Failed to load articles:', error)
    errorMessage.value = '文章列表暂时无法加载，请稍后重试。'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadArticles()
})

const handleArticleClick = (article: Article) => {
  router.push(`/articles/${article.id}`)
}

onMounted(() => {
  document.title = '文章列表 - 我的博客'
})
</script>
