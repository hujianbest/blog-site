<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header />

    <main class="py-16 flex-1">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold text-gray-900 mb-8 text-center">分类归档</h1>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="categories.length === 0" class="text-center py-12">
          <p class="text-gray-600">暂无分类</p>
        </div>

        <!-- Category Tree -->
        <div v-else class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <ul class="space-y-4">
            <li
              v-for="category in categoryTree"
              :key="category.id"
              class="category-item"
            >
              <div class="flex items-center justify-between py-2 px-4 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                <router-link
                  :to="`/categories/${category.id}`"
                  class="flex-1 text-lg font-medium text-gray-900 hover:text-blue-600"
                >
                  {{ category.name }}
                </router-link>
                <span class="text-sm text-gray-500">
                  {{ category.articleCount }} 篇文章
                </span>
              </div>

              <!-- Subcategories -->
              <ul v-if="category.children?.length" class="ml-8 mt-2 space-y-2">
                <li
                  v-for="child in category.children"
                  :key="child.id"
                >
                  <div class="flex items-center justify-between py-2 px-4 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                    <router-link
                      :to="`/categories/${child.id}`"
                      class="flex-1 text-gray-700 hover:text-blue-600"
                    >
                      {{ child.name }}
                    </router-link>
                    <span class="text-sm text-gray-500">
                      {{ child.articleCount }} 篇文章
                    </span>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'

interface Category {
  id: string
  name: string
  articleCount: number
  parentId: string | null
  children?: Category[]
}

const categories = ref<Category[]>([])
const loading = ref(true)

const categoryTree = computed(() => {
  const buildTree = (parentId: string | null = null): Category[] => {
    return categories.value
      .filter(cat => cat.parentId === parentId)
      .map(cat => ({
        ...cat,
        children: buildTree(cat.id)
      }))
  }

  return buildTree()
})

const loadCategories = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/v1/categories')
    if (response.ok) {
      const data = await response.json()
      categories.value = data.data || []
    }
  } catch (error) {
    console.error('Failed to load categories:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCategories()
})
</script>
