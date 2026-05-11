<template>
  <div class="image-uploader">
    <div
      class="upload-area"
      :class="{ 'drag-over': isDragOver }"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      @paste="handlePaste"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        @change="handleFileChange"
        class="file-input"
      />
      <div class="upload-content">
        <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p class="upload-text">点击或拖拽上传图片</p>
        <p class="upload-hint">支持 JPG、PNG、GIF、WebP 格式，最大 5MB</p>
        <p class="upload-paste">或使用 Ctrl+V 粘贴图片</p>
      </div>
    </div>

    <div v-if="uploadProgress > 0 && uploadProgress < 100" class="upload-progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
      </div>
      <p class="progress-text">上传中... {{ uploadProgress }}%</p>
    </div>

    <div v-if="uploadError" class="upload-error">
      <p>{{ uploadError }}</p>
      <button @click="uploadError = ''" class="error-close">×</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  upload: [url: string, imageData: any]
}>()

const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)
const uploadProgress = ref(0)
const uploadError = ref('')

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

function validateFile(file: File): boolean {
  if (!ALLOWED_TYPES.includes(file.type)) {
    uploadError.value = 'Invalid file format. Please upload JPG, PNG, GIF, or WebP images.'
    return false
  }

  if (file.size > MAX_FILE_SIZE) {
    uploadError.value = 'File size exceeds 5MB limit'
    return false
  }

  return true
}

async function uploadFile(file: File): Promise<void> {
  if (!validateFile(file)) {
    return
  }

  uploadError.value = ''
  uploadProgress.value = 0

  const formData = new FormData()
  formData.append('file', file)

  try {
    uploadProgress.value = 50

    const response = await fetch('/api/v1/images/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: formData
    })

    const data = await response.json()

    if (!response.ok) {
      uploadError.value = data.error?.message || 'Upload failed'
      return
    }

    uploadProgress.value = 100
    emit('upload', data.data.url, data.data)
    setTimeout(() => {
      uploadProgress.value = 0
    }, 1000)
  } catch (error) {
    uploadError.value = 'Upload failed. Please try again.'
    uploadProgress.value = 0
  }
}

function handleFileChange(event: Event): void {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    uploadFile(files[0])
  }
  target.value = ''
}

function handleDragOver(event: DragEvent): void {
  event.preventDefault()
  isDragOver.value = true
}

function handleDragLeave(event: DragEvent): void {
  event.preventDefault()
  isDragOver.value = false
}

function handleDrop(event: DragEvent): void {
  event.preventDefault()
  isDragOver.value = false

  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    uploadFile(files[0])
  }
}

function handlePaste(event: ClipboardEvent): void {
  const items = event.clipboardData?.items
  if (!items) return

  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) {
        uploadFile(file)
        break
      }
    }
  }
}

defineExpose({
  uploadError,
  uploadProgress
})
</script>

<style scoped>
.image-uploader {
  width: 100%;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s;
  background-color: #f9fafb;
  cursor: pointer;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.file-input {
  display: none;
}

.upload-content {
  pointer-events: none;
}

.upload-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
  color: #9ca3af;
}

.upload-text {
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.upload-hint {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.upload-paste {
  font-size: 0.875rem;
  color: #6b7280;
}

.upload-progress {
  margin-top: 1rem;
}

.progress-bar {
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #3b82f6;
  transition: width 0.3s;
}

.progress-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
}

.upload-error {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 4px;
  color: #991b1b;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #991b1b;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
}
</style>
