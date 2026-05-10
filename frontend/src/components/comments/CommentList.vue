<template>
  <div>
    <!-- Comment Form -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">发表评论</h3>
      <form @submit.prevent="submitComment" class="space-y-4">
        <div>
          <label for="author-name" class="block text-sm font-medium text-gray-700 mb-1">
            姓名
          </label>
          <input
            id="author-name"
            v-model="form.authorName"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="请输入您的姓名"
          />
        </div>

        <div>
          <label for="author-email" class="block text-sm font-medium text-gray-700 mb-1">
            邮箱
          </label>
          <input
            id="author-email"
            v-model="form.authorEmail"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label for="content" class="block text-sm font-medium text-gray-700 mb-1">
            评论内容
          </label>
          <textarea
            id="content"
            v-model="form.content"
            rows="4"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="请输入您的评论..."
          />
        </div>

        <button
          type="submit"
          :disabled="submitting"
          class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ submitting ? '提交中...' : '提交评论' }}
        </button>
      </form>
    </div>

    <!-- Comments List -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">加载评论中...</p>
    </div>

    <div v-else-if="comments.length === 0" class="text-center py-8">
      <p class="text-gray-600">暂无评论，快来发表第一条评论吧！</p>
    </div>

    <div v-else class="space-y-6">
      <h3 class="text-lg font-semibold text-gray-900">
        评论 ({{ comments.length }})
      </h3>

      <div
        v-for="comment in comments"
        :key="comment.id"
        class="border-b border-gray-200 pb-6 last:border-b-0"
      >
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span class="text-primary-600 font-semibold">
                {{ comment.authorName.charAt(0).toUpperCase() }}
              </span>
            </div>
          </div>

          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-1">
              <span class="font-semibold text-gray-900">{{ comment.authorName }}</span>
              <span class="text-sm text-gray-500">{{ formatDate(comment.createdAt) }}</span>
            </div>

            <p class="text-gray-700 whitespace-pre-wrap">{{ comment.content }}</p>

            <button
              v-if="canReply(comment)"
              @click="toggleReplyForm(comment.id)"
              class="mt-2 text-sm text-primary-600 hover:text-primary-700"
            >
              回复
            </button>

            <!-- Reply Form -->
            <div v-if="replyFormVisible === comment.id" class="mt-4 space-y-2">
              <textarea
                v-model="replyContent"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="请输入回复内容..."
              />
              <div class="flex space-x-2">
                <button
                  @click="submitReply(comment.id)"
                  class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                >
                  提交回复
                </button>
                <button
                  @click="cancelReply"
                  class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                >
                  取消
                </button>
              </div>
            </div>

            <!-- Replies -->
            <div v-if="comment.replies && comment.replies.length > 0" class="mt-4 space-y-4 ml-8">
              <div
                v-for="reply in comment.replies"
                :key="reply.id"
                class="border-l-2 border-gray-200 pl-4"
              >
                <div class="flex items-center space-x-2 mb-1">
                  <span class="font-semibold text-gray-900">{{ reply.authorName }}</span>
                  <span class="text-sm text-gray-500">{{ formatDate(reply.createdAt) }}</span>
                </div>
                <p class="text-gray-700 whitespace-pre-wrap">{{ reply.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Comment {
  id: string
  authorName: string
  authorEmail: string
  content: string
  createdAt: string
  replies?: Comment[]
}

interface Props {
  articleId: string
}

const props = defineProps<Props>()

const comments = ref<Comment[]>([])
const loading = ref(true)
const submitting = ref(false)
const replyFormVisible = ref<string | null>(null)
const replyContent = ref('')

const form = ref({
  authorName: '',
  authorEmail: '',
  content: ''
})

async function loadComments() {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/articles/${props.articleId}/comments`)
    if (response.ok) {
      const data = await response.json()
      comments.value = data.comments || []
    }
  } catch (error) {
    console.error('Failed to load comments:', error)
  } finally {
    loading.value = false
  }
}

async function submitComment() {
  submitting.value = true
  try {
    const response = await fetch(`http://localhost:3000/api/v1/articles/${props.articleId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form.value)
    })

    if (response.ok) {
      // Reset form
      form.value = {
        authorName: '',
        authorEmail: '',
        content: ''
      }
      // Reload comments
      await loadComments()
    } else {
      alert('评论提交失败，请稍后重试')
    }
  } catch (error) {
    console.error('Failed to submit comment:', error)
    alert('评论提交失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

function canReply(_comment: Comment): boolean {
  return true // Allow all users to reply for now
}

function toggleReplyForm(commentId: string) {
  if (replyFormVisible.value === commentId) {
    replyFormVisible.value = null
  } else {
    replyFormVisible.value = commentId
  }
}

function cancelReply() {
  replyFormVisible.value = null
  replyContent.value = ''
}

async function submitReply(_parentId: string) {
  // Implement reply submission
  alert('回复功能开发中')
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMins = Math.floor(diffInMs / 60000)
  const diffInHours = Math.floor(diffInMs / 3600000)
  const diffInDays = Math.floor(diffInMs / 86400000)

  if (diffInMins < 1) return '刚刚'
  if (diffInMins < 60) return `${diffInMins} 分钟前`
  if (diffInHours < 24) return `${diffInHours} 小时前`
  if (diffInDays < 7) return `${diffInDays} 天前`

  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

onMounted(() => {
  loadComments()
})
</script>
