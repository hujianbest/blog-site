<template>
  <div class="comments-section">
    <h3 class="text-2xl font-bold mb-6">评论 ({{ comments.length }})</h3>

    <!-- Comment Form -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <h4 class="text-lg font-semibold mb-4">发表评论</h4>
      <form @submit.prevent="submitComment" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            v-model="form.authorName"
            type="text"
            placeholder="昵称 *"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            v-model="form.authorEmail"
            type="email"
            placeholder="邮箱 *"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <textarea
          v-model="form.content"
          placeholder="写下你的评论..."
          rows="4"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {{ isSubmitting ? '提交中...' : '发表评论' }}
        </button>
      </form>
    </div>

    <!-- Comments List -->
    <div class="space-y-6">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="bg-white rounded-lg shadow p-6"
      >
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
            {{ comment.authorName.charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-semibold">{{ comment.authorName }}</h4>
              <span class="text-sm text-gray-500">{{ formatDate(comment.createdAt) }}</span>
            </div>
            <p class="text-gray-700 whitespace-pre-wrap">{{ comment.content }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="comments.length === 0" class="text-center py-12 text-gray-500">
      还没有评论，快来抢沙发吧！
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

interface Comment {
  id: string
  authorName: string
  content: string
  createdAt: string
}

const route = useRoute()
const comments = ref<Comment[]>([])
const isSubmitting = ref(false)

const form = ref({
  authorName: '',
  authorEmail: '',
  content: ''
})

const submitComment = async () => {
  isSubmitting.value = true
  try {
    const response = await fetch(`/api/v1/articles/${route.params.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })

    if (response.ok) {
      form.value = { authorName: '', authorEmail: '', content: '' }
      await loadComments()
    }
  } catch (error) {
    console.error('Failed to submit comment:', error)
  } finally {
    isSubmitting.value = false
  }
}

const loadComments = async () => {
  try {
    const response = await fetch(`/api/v1/articles/${route.params.id}/comments`)
    if (response.ok) {
      const data = await response.json()
      comments.value = data.data || []
    }
  } catch (error) {
    console.error('Failed to load comments:', error)
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

onMounted(() => {
  loadComments()
})
</script>
