<template>
  <div class="min-h-screen bg-gray-50">
    <LayoutHeader />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">分类归档</h1>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">加载中...</p>
      </div>

      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <router-link
          v-for="category in categories"
          :key="category.id"
          :to="`/categories/${category.id}`"
          class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 class="text-xl font-semibold text-gray-900 mb-2">
            {{ category.name }}
          </h2>
          <p class="text-gray-600">
            {{ category.articleCount }} 篇文章
          </p>
        </router-link>
      </div>
    </main>

    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LayoutHeader from '../components/layout/Header.vue'
import LayoutFooter from '../components/layout/Footer.vue'

interface Category {
  id: string
  name: string
  articleCount: number
}

const categories = ref<Category[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/categories')
    if (response.ok) {
      const data = await response.json()
      categories.value = data.categories || []
    }
  } catch (error) {
    console.error('Failed to load categories:', error)
    // Use mock data
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

onMounted(() => {
  document.title = '分类归档 - 我的博客'
})
</script>
