<template>
  <div class="min-h-screen flex flex-col bg-[var(--color-bg-page)]">
    <Header />

    <main id="main-content" class="py-16 flex-1">
      <div class="ui-page">
        <h1 class="text-4xl font-bold text-[var(--color-fg-default)] mb-3 text-center">分类归档</h1>
        <p class="text-[var(--color-fg-muted)] mb-8 text-center">按主题浏览文章，找到更长期的阅读线索。</p>

        <!-- Loading State -->
        <div v-if="loading" data-ui-state="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[var(--color-border-default)] border-t-[var(--color-primary-text)]"></div>
        </div>

        <div v-else-if="errorMessage" data-ui-state="error" class="ui-surface text-center py-10 px-6">
          <p class="text-[var(--color-danger)] font-medium">{{ errorMessage }}</p>
          <button class="ui-link mt-4 inline-flex font-semibold" type="button" @click="loadCategories">
            重新加载
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="categories.length === 0" data-ui-state="empty" class="ui-surface text-center py-10 px-6">
          <p class="text-[var(--color-fg-muted)]">暂无分类。</p>
        </div>

        <!-- Category Tree -->
        <div v-else data-ui="category-tree" class="max-w-4xl mx-auto bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-8">
          <ul class="space-y-4">
            <li
              v-for="category in categoryTree"
              :key="category.id"
              class="category-item"
            >
              <div class="flex items-center justify-between py-2 px-4 bg-[var(--color-bg-accent-subtle)] rounded-[var(--radius-md)] hover:border-[var(--color-border-strong)] transition-colors">
                <router-link
                  :to="`/categories/${category.id}`"
                  class="flex-1 text-lg font-medium text-[var(--color-fg-default)] hover:text-[var(--color-primary-text)]"
                >
                  {{ category.name }}
                </router-link>
                <span class="text-sm text-[var(--color-fg-muted)]">
                  {{ category.articleCount }} 篇文章
                </span>
              </div>

              <!-- Subcategories -->
              <ul v-if="category.children?.length" class="ml-8 mt-2 space-y-2">
                <li
                  v-for="child in category.children"
                  :key="child.id"
                >
                  <div class="flex items-center justify-between py-2 px-4 bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] transition-colors">
                    <router-link
                      :to="`/categories/${child.id}`"
                      class="flex-1 text-[var(--color-fg-muted)] hover:text-[var(--color-primary-text)]"
                    >
                      {{ child.name }}
                    </router-link>
                    <span class="text-sm text-[var(--color-fg-muted)]">
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
import { getCategoriesAsync } from '@/data/content'

interface Category {
  id: string
  name: string
  articleCount: number
  parentId: string | null
  children?: Category[]
}

const categories = ref<Category[]>([])
const loading = ref(true)
const errorMessage = ref('')

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
  errorMessage.value = ''
  try {
    categories.value = (await getCategoriesAsync()).map(category => ({
      id: String(category.id),
      name: category.name,
      articleCount: category.articleCount || 0,
      parentId: category.parentId == null ? null : String(category.parentId),
    }))
  } catch (error) {
    console.error('Failed to load categories:', error)
    errorMessage.value = '分类暂时无法加载，请稍后重试。'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCategories()
})
</script>
