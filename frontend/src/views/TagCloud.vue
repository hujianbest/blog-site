<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header />

    <main class="py-16 flex-1">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold text-gray-900 mb-8 text-center">标签云</h1>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="tags.length === 0" class="text-center py-12">
          <p class="text-gray-600">暂无标签</p>
        </div>

        <!-- Tag Cloud -->
        <div v-else class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div class="flex flex-wrap gap-4 justify-center">
            <TagBadge
              v-for="tag in sortedTags"
              :key="tag.id"
              :tag="tag"
              :size="getTagSize(tag.articleCount)"
            />
          </div>
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
import TagBadge from '@/components/TagBadge.vue'

interface Tag {
  id: string
  name: string
  articleCount: number
}

const tags = ref<Tag[]>([])
const loading = ref(true)

const sortedTags = computed(() => {
  return [...tags.value].sort((a, b) => b.articleCount - a.articleCount)
})

const getTagSize = (count: number): 'small' | 'medium' | 'large' => {
  if (count >= 10) return 'large'
  if (count >= 5) return 'medium'
  return 'small'
}

const loadTags = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/v1/tags')
    if (response.ok) {
      const data = await response.json()
      tags.value = data.data || []
    }
  } catch (error) {
    console.error('Failed to load tags:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTags()
})
</script>
