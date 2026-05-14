<template>
  <div class="min-h-screen bg-[var(--color-bg-page)]">
    <LayoutHeader />

    <main id="main-content" class="ui-page py-12">
      <div v-if="loading" data-ui-state="loading" class="text-center py-12">
        <p class="text-[var(--color-fg-muted)]">加载中...</p>
      </div>

      <div v-else-if="errorMessage" data-ui-state="error" class="ui-surface text-center py-10 px-6">
        <p class="text-[var(--color-danger)] font-medium">{{ errorMessage }}</p>
        <button class="ui-link mt-4 inline-flex font-semibold" type="button" @click="loadArticles">
          重新加载
        </button>
      </div>

      <div v-else>
        <h1 class="text-3xl font-bold text-[var(--color-fg-default)] mb-3">
          标签: #{{ tagName }}
        </h1>
        <p class="text-[var(--color-fg-muted)] mb-8">围绕这个关键词继续阅读。</p>

        <div v-if="articles.length > 0" class="grid gap-6">
          <ArticlePreview
            v-for="article in articles"
            :key="article.id"
            :article="article"
            @click="handleArticleClick"
          />
        </div>

        <div v-else data-ui-state="empty" class="ui-surface text-center py-10 px-6">
          <p class="text-[var(--color-fg-muted)]">该标签下暂无文章。</p>
          <router-link to="/categories" class="ui-link mt-4 inline-flex font-semibold">
            浏览分类
          </router-link>
        </div>
      </div>
    </main>

    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LayoutHeader from '../components/layout/Header.vue'
import LayoutFooter from '../components/layout/Footer.vue'
import ArticlePreview from '../components/ArticlePreview.vue'
import { getArticlesByTagNameAsync } from '@/data/content'

interface Article {
  id: string | number
  title: string
  content?: string
  excerpt?: string
  coverImage?: string
  publishedAt?: string
  createdAt?: string
  categoryName?: string
  tags?: Array<{
    id: string | number
    name: string
  }>
}

const route = useRoute()
const router = useRouter()
const tagName = ref(route.params.name as string)
const articles = ref<Article[]>([])
const loading = ref(true)
const errorMessage = ref('')
const activeLoadTag = ref<string | null>(null)
let loadToken = 0

const loadArticles = async () => {
  const tag = route.params.name as string
  if (loading.value && activeLoadTag.value === tag) {
    return
  }

  const token = ++loadToken
  loading.value = true
  activeLoadTag.value = tag
  errorMessage.value = ''
  try {
    const nextArticles = await getArticlesByTagNameAsync(tag)
    if (token !== loadToken) return
    articles.value = nextArticles
  } catch (error) {
    if (token !== loadToken) return
    console.error('Failed to load articles by tag:', error)
    errorMessage.value = '标签文章暂时无法加载，请稍后重试。'
  } finally {
    if (token === loadToken) {
      loading.value = false
      activeLoadTag.value = null
    }
  }
}

const handleArticleClick = (article: Article) => {
  router.push(`/articles/${article.id}`)
}

watch(() => route.params.name, (name) => {
  tagName.value = name as string
  articles.value = []
  loadArticles()
}, { immediate: true })
</script>
