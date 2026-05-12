<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Author Name -->
    <div>
      <label for="authorName" class="block text-sm font-medium text-gray-700 mb-1">
        姓名 *
      </label>
      <input
        id="authorName"
        v-model="formData.authorName"
        type="text"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="请输入您的姓名"
      />
    </div>

    <!-- Author Email -->
    <div>
      <label for="authorEmail" class="block text-sm font-medium text-gray-700 mb-1">
        邮箱 *
      </label>
      <input
        id="authorEmail"
        v-model="formData.authorEmail"
        type="email"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="请输入您的邮箱"
      />
    </div>

    <!-- Comment Content -->
    <div>
      <label for="content" class="block text-sm font-medium text-gray-700 mb-1">
        评论内容 *
      </label>
      <textarea
        id="content"
        v-model="formData.content"
        required
        rows="4"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder="请输入您的评论..."
      />
    </div>

    <!-- Submit Button -->
    <div class="flex justify-end">
      <button
        type="submit"
        :disabled="isSubmitting"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {{ isSubmitting ? '提交中...' : '提交评论' }}
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
      {{ errorMessage }}
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg">
      {{ successMessage }}
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface CommentFormData {
  authorName: string
  authorEmail: string
  content: string
}

interface Props {
  articleId: string
  parentId?: string
}

interface Emits {
  (e: 'submitted', comment: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = reactive<CommentFormData>({
  authorName: '',
  authorEmail: '',
  content: ''
})

const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleSubmit = async () => {
  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const url = props.parentId
      ? `/api/v1/articles/${props.articleId}/comments/${props.parentId}/replies`
      : `/api/v1/articles/${props.articleId}/comments`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })

    if (response.ok) {
      const data = await response.json()
      successMessage.value = '评论提交成功，等待审核'

      // Reset form
      formData.authorName = ''
      formData.authorEmail = ''
      formData.content = ''

      // Emit submitted event
      emit('submitted', data.data)

      // Clear success message after 3 seconds
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    } else {
      const error = await response.json()
      errorMessage.value = error.message || '提交失败，请稍后重试'
    }
  } catch (error) {
    console.error('Failed to submit comment:', error)
    errorMessage.value = '网络错误，请稍后重试'
  } finally {
    isSubmitting.value = false
  }
}
</script>
