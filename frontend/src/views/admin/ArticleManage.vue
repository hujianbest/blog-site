<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">文章管理</h1>

    <ArticleFilter
      data-testid="article-filter"
      @search="handleSearch"
      @filter="handleFilter"
      @create="handleCreate"
    />

    <div v-if="loading" class="flex justify-center py-12">
      <div class="n-spin" data-testid="loading-spinner">加载中...</div>
    </div>

    <div v-else-if="articles.length === 0" class="text-center py-12">
      <div class="n-empty" data-testid="empty-state">暂无文章</div>
    </div>

    <div v-else>
      <div
        data-testid="article-list"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <ArticleCard
          v-for="article in paginatedArticles"
          :key="article.id"
          :article="article"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>

      <div class="mt-8 flex justify-center">
        <div class="n-pagination" data-testid="pagination">
          <button
            v-for="page in totalPages"
            :key="page"
            :class="[
              'px-4 py-2 mx-1 rounded',
              currentPage === page
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
            @click="handlePageChange(page)"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <div
      v-if="showDeleteDialog"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      data-testid="delete-dialog"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-semibold mb-4">确认删除</h3>
        <p class="text-gray-600 mb-6">
          确定要删除文章 "{{ articleToDelete?.title }}" 吗？此操作无法撤销。
        </p>
        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            @click="cancelDelete"
          >
            取消
          </button>
          <button
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            @click="confirmDelete"
          >
            确认删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ArticleCard from '@/components/article/ArticleCard.vue'
import ArticleFilter from '@/components/article/ArticleFilter.vue'

interface Article {
  id: string
  title: string
  content: string
  status: 'DRAFT' | 'PUBLISHED'
  createdAt: string
}

const router = useRouter()

const articles = ref<Article[]>([])
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('ALL')
const currentPage = ref(1)
const pageSize = ref(9)
const totalArticles = ref(0)
const showDeleteDialog = ref(false)
const articleToDelete = ref<Article | null>(null)

const filteredArticles = computed(() => {
  let filtered = articles.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query)
    )
  }

  // Apply status filter
  if (statusFilter.value !== 'ALL') {
    filtered = filtered.filter((article) => article.status === statusFilter.value)
  }

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredArticles.value.length / pageSize.value)
})

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredArticles.value.slice(start, end)
})

const loadArticles = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/v1/articles')
    if (response.ok) {
      const data = await response.json()
      articles.value = data.data || []
      totalArticles.value = data.total || articles.value.length
    }
  } catch (error) {
    console.error('Failed to load articles:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = (query: string) => {
  searchQuery.value = query
  currentPage.value = 1
}

const handleFilter = (status: string) => {
  statusFilter.value = status
  currentPage.value = 1
}

const handleCreate = () => {
  router.push('/admin/articles/new')
}

const handleEdit = (article: Article) => {
  router.push(`/admin/articles/${article.id}`)
}

const handleDelete = (article: Article) => {
  showDeleteDialog.value = true
  articleToDelete.value = article
}

const cancelDelete = () => {
  showDeleteDialog.value = false
  articleToDelete.value = null
}

const confirmDelete = async () => {
  if (!articleToDelete.value) return

  try {
    const response = await fetch(`/api/v1/articles/${articleToDelete.value.id}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      // Remove article from list
      articles.value = articles.value.filter(
        (a) => a.id !== articleToDelete.value!.id
      )
      showDeleteDialog.value = false
      articleToDelete.value = null
    } else {
      alert('删除失败，请重试')
    }
  } catch (error) {
    console.error('Failed to delete article:', error)
    alert('删除失败，请重试')
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  loadArticles()
})
</script>
