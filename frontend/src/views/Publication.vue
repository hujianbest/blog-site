<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header />

    <main id="main-content" class="py-16 flex-1">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold text-gray-900 mb-8">多平台发布</h1>

        <!-- Article Selection -->
        <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 class="text-2xl font-semibold mb-6">选择文章</h2>
          <select
            v-model="selectedArticleId"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">请选择要发布的文章...</option>
            <option
              v-for="article in articles"
              :key="article.id"
              :value="article.id"
            >
              {{ article.title }}
            </option>
          </select>
        </div>

        <!-- Platform Selection -->
        <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 class="text-2xl font-semibold mb-6">选择平台</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              v-for="platform in platforms"
              :key="platform.platformId"
              class="platform-card p-6 border rounded-lg cursor-pointer transition-all"
              :class="{
                'border-blue-500 bg-blue-50': selectedPlatforms.has(platform.platformId),
                'border-gray-300 hover:border-gray-400': !selectedPlatforms.has(platform.platformId)
              }"
              @click="togglePlatform(platform.platformId)"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold">{{ platform.platformName }}</h3>
                <input
                  type="checkbox"
                  :checked="selectedPlatforms.has(platform.platformId)"
                  class="w-5 h-5 text-blue-600"
                  @click.stop
                />
              </div>
              <p class="text-sm text-gray-600">
                {{ platform.connected ? '✅ 已连接' : '⚠️ 未连接' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Content Preview -->
        <div v-if="selectedArticle" class="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 class="text-2xl font-semibold mb-6">内容预览</h2>
          <div class="space-y-4">
            <div v-for="platform in selectedPlatformsList" :key="platform" class="border-b pb-4">
              <h3 class="text-lg font-semibold mb-2">{{ getPlatformName(platform) }}</h3>
              <div class="bg-gray-50 p-4 rounded">
                <p class="font-medium mb-2">{{ selectedArticle.title }}</p>
                <p class="text-sm text-gray-600">{{ getPreview(platform) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Publish Button -->
        <div class="flex justify-end gap-4">
          <button
            class="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            @click="cancel"
          >
            取消
          </button>
          <button
            :disabled="!canPublish"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            @click="publish"
          >
            {{ isPublishing ? '发布中...' : '发布到选中的平台' }}
          </button>
        </div>

        <!-- Publication Status -->
        <div v-if="publicationStatus.length > 0" class="mt-8">
          <h2 class="text-2xl font-semibold mb-6">发布状态</h2>
          <div class="space-y-4">
            <div
              v-for="status in publicationStatus"
              :key="status.platform"
              class="bg-white rounded-lg shadow p-6"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold">{{ getPlatformName(status.platform) }}</h3>
                  <p class="text-sm" :class="getStatusColor(status.status)">
                    {{ getStatusText(status.status) }}
                  </p>
                </div>
                <div v-if="status.status === 'failed'" class="flex gap-2">
                  <button
                    class="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                    @click="retryPlatform(status.platform)"
                  >
                    重试
                  </button>
                </div>
              </div>
              <p v-if="status.error" class="mt-2 text-sm text-red-600">
                {{ status.error }}
              </p>
            </div>
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
import { getAllPlatforms } from '@/config/platforms'

interface Article {
  id: string
  title: string
  content: string
}

interface PublicationStatus {
  platform: string
  status: 'pending' | 'publishing' | 'success' | 'failed'
  error?: string
  postUrl?: string
}

const articles = ref<Article[]>([])
const platforms = ref<any[]>([])
const selectedArticleId = ref('')
const selectedPlatforms = ref<Set<string>>(new Set())
const isPublishing = ref(false)
const publicationStatus = ref<PublicationStatus[]>([])

const selectedArticle = computed(() => {
  return articles.value.find(a => a.id === selectedArticleId.value)
})

const selectedPlatformsList = computed(() => {
  return Array.from(selectedPlatforms.value)
})

const canPublish = computed(() => {
  return selectedArticle.value && selectedPlatforms.value.size > 0 && !isPublishing.value
})

const togglePlatform = (platformId: string) => {
  if (selectedPlatforms.value.has(platformId)) {
    selectedPlatforms.value.delete(platformId)
  } else {
    selectedPlatforms.value.add(platformId)
  }
}

const getPlatformName = (platformId: string) => {
  const platform = platforms.value.find(p => p.platformId === platformId)
  return platform?.platformName || platformId
}

const getPreview = (platformId: string) => {
  if (!selectedArticle.value) return ''
  
  const platform = platforms.value.find(p => p.platformId === platformId)
  
  if (platform?.features.supportsMarkdown) {
    return selectedArticle.value.content.substring(0, 200) + '...'
  } else {
    return selectedArticle.value.title
  }
}

const getStatusColor = (status: string) => {
  const colors = {
    pending: 'text-gray-600',
    publishing: 'text-blue-600',
    success: 'text-green-600',
    failed: 'text-red-600'
  }
  return colors[status as keyof typeof colors] || ''
}

const getStatusText = (status: string) => {
  const texts = {
    pending: '等待发布',
    publishing: '正在发布...',
    success: '✅ 发布成功',
    failed: '❌ 发布失败'
  }
  return texts[status as keyof typeof texts] || status
}

const publish = async () => {
  if (!canPublish.value) return

  isPublishing.value = true
  publicationStatus.value = selectedPlatformsList.value.map(platform => ({
    platform,
    status: 'pending'
  }))

  // Simulate publishing (in production, call actual API)
  for (const platform of selectedPlatformsList.value) {
    const statusIndex = publicationStatus.value.findIndex(s => s.platform === platform)
    publicationStatus.value[statusIndex].status = 'publishing'

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simulate success/failure
    const success = Math.random() > 0.3 // 70% success rate
    publicationStatus.value[statusIndex].status = success ? 'success' : 'failed'
    
    if (success) {
      publicationStatus.value[statusIndex].postUrl = `https://${platform}.example.com/post/123`
    } else {
      publicationStatus.value[statusIndex].error = '模拟的发布失败（在真实环境中会显示实际错误）'
    }
  }

  isPublishing.value = false
}

const retryPlatform = async (platform: string) => {
  // Retry logic
  console.log('Retrying', platform)
}

const cancel = () => {
  selectedArticleId.value = ''
  selectedPlatforms.value.clear()
  publicationStatus.value = []
}

const loadArticles = async () => {
  try {
    const response = await fetch('/api/v1/articles')
    if (response.ok) {
      const data = await response.json()
      articles.value = data.data || []
    }
  } catch (error) {
    console.error('Failed to load articles:', error)
  }
}

onMounted(() => {
  platforms.value = getAllPlatforms()
  loadArticles()
})
</script>
