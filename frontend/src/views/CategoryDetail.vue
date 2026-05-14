<template>
  <div class="min-h-screen bg-[var(--color-bg-page)]">
    <LayoutHeader />

    <main id="main-content" class="ui-page py-12">
      <div v-if="loading" data-ui-state="loading" class="text-center py-12">
        <p class="text-[var(--color-fg-muted)]">加载中...</p>
      </div>

      <div v-else-if="errorMessage" data-ui-state="error" class="ui-surface text-center py-10 px-6">
        <p class="text-[var(--color-danger)] font-medium">{{ errorMessage }}</p>
        <button class="ui-link mt-4 inline-flex font-semibold" type="button" @click="loadCategory">
          重新加载
        </button>
      </div>

      <div v-else-if="category">
        <h1 class="text-3xl font-bold text-[var(--color-fg-default)] mb-3">
          {{ category.name }}
        </h1>
        <p class="text-[var(--color-fg-muted)] mb-8">这个分类下的文章。</p>

        <div v-if="articles.length > 0" class="grid gap-6">
          <ArticlePreview
            v-for="article in articles"
            :key="article.id"
            :article="article"
            @click="handleArticleClick"
          />
        </div>
        <div v-else data-ui-state="empty" class="ui-surface text-center py-10 px-6">
          <p class="text-[var(--color-fg-muted)]">该分类下暂无文章。</p>
          <router-link to="/categories" class="ui-link mt-4 inline-flex font-semibold">
            返回分类归档
          </router-link>
        </div>
      </div>
    </main>

    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LayoutHeader from '../components/layout/Header.vue'
import LayoutFooter from '../components/layout/Footer.vue'
import ArticlePreview from '../components/ArticlePreview.vue'
import { getArticlesByCategoryIdAsync, getCategoryByIdAsync } from '@/data/content'

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
  categoryName?: string
  tags?: Array<{
    id: string | number
    name: string
  }>
}

const route = useRoute()
const router = useRouter()
const category = ref<Category | null>(null)
const articles = ref<Article[]>([])
const loading = ref(true)
const errorMessage = ref('')
let loadToken = 0

const loadCategory = async () => {
  const token = ++loadToken
  loading.value = true
  errorMessage.value = ''
  try {
    const categoryId = route.params.id as string
    const [nextCategory, nextArticles] = await Promise.all([
      getCategoryByIdAsync(categoryId),
      getArticlesByCategoryIdAsync(categoryId),
    ])
    if (token !== loadToken) return
    category.value = nextCategory
    articles.value = nextArticles
  } catch (error) {
    if (token !== loadToken) return
    console.error('Failed to load category:', error)
    errorMessage.value = '分类内容暂时无法加载，请稍后重试。'
  } finally {
    if (token === loadToken) {
      loading.value = false
    }
  }
}

const handleArticleClick = (article: Article) => {
  router.push(`/articles/${article.id}`)
}

onMounted(() => {
  loadCategory()
})

watch(() => route.params.id, () => {
  category.value = null
  articles.value = []
  loadCategory()
})
</script>
