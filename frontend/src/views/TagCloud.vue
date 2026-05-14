<template>
  <div class="min-h-screen flex flex-col bg-[var(--color-bg-page)]">
    <Header />

    <main id="main-content" class="py-16 flex-1">
      <div class="ui-page">
        <h1 class="text-4xl font-bold text-[var(--color-fg-default)] mb-3 text-center">标签云</h1>
        <p class="text-[var(--color-fg-muted)] mb-8 text-center">从关键词进入文章脉络。</p>

        <!-- Loading State -->
        <div v-if="loading" data-ui-state="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[var(--color-border-default)] border-t-[var(--color-primary-text)]"></div>
        </div>

        <div v-else-if="errorMessage" data-ui-state="error" class="ui-surface text-center py-10 px-6">
          <p class="text-[var(--color-danger)] font-medium">{{ errorMessage }}</p>
          <button class="ui-link mt-4 inline-flex font-semibold" type="button" @click="loadTags">
            重新加载
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="tags.length === 0" data-ui-state="empty" class="ui-surface text-center py-10 px-6">
          <p class="text-[var(--color-fg-muted)]">暂无标签。</p>
        </div>

        <!-- Tag Cloud -->
        <div v-else data-ui="tag-cloud" class="max-w-4xl mx-auto bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-8">
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
import { getTagsAsync } from '@/data/content'

interface Tag {
  id: string
  name: string
  articleCount: number
}

const tags = ref<Tag[]>([])
const loading = ref(true)
const errorMessage = ref('')

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
  errorMessage.value = ''
  try {
    tags.value = (await getTagsAsync()).map(tag => ({
      id: String(tag.id),
      name: tag.name,
      articleCount: tag.articleCount || 0,
    }))
  } catch (error) {
    console.error('Failed to load tags:', error)
    errorMessage.value = '标签暂时无法加载，请稍后重试。'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTags()
})
</script>
