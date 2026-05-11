<template>
  <div class="image-viewer">
    <div
      v-for="image in imageList"
      :key="image.id"
      class="image-item"
      @mouseenter="handleMouseEnter(image.id)"
      @mouseleave="handleMouseLeave(image.id)"
    >
      <img :src="image.thumbnailUrl || image.url" :alt="image.id" class="image-thumb" />
      <button
        v-show="hoveredImageId === image.id"
        @click="removeImage(image.id)"
        class="delete-button"
        title="删除图片"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div v-if="imageList.length === 0" class="empty-state">
      <p>暂无图片</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Image {
  id: string
  url: string
  thumbnailUrl?: string
}

const props = defineProps<{
  images: Image[]
}>()

const emit = defineEmits<{
  remove: [id: string]
}>()

const hoveredImageId = ref<string | null>(null)
const imageList = ref<Image[]>([...props.images])

watch(() => props.images, (newImages) => {
  imageList.value = [...newImages]
}, { deep: true })

function handleMouseEnter(id: string): void {
  hoveredImageId.value = id
}

function handleMouseLeave(id: string): void {
  if (hoveredImageId.value === id) {
    hoveredImageId.value = null
  }
}

function removeImage(id: string): void {
  const index = imageList.value.findIndex(img => img.id === id)
  if (index > -1) {
    imageList.value.splice(index, 1)
  }
  emit('remove', id)
}

defineExpose({
  removeImage
})
</script>

<style scoped>
.image-viewer {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  width: 100%;
}

.image-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.image-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s;
}

.image-item:hover .image-thumb {
  transform: scale(1.05);
}

.delete-button {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  background-color: rgba(239, 68, 68, 0.9);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-button:hover {
  background-color: rgba(220, 38, 38, 1);
  transform: scale(1.1);
}

.delete-button svg {
  width: 16px;
  height: 16px;
  color: white;
}

.empty-state {
  grid-column: 1 / -1;
  padding: 2rem;
  text-align: center;
  color: #9ca3af;
}
</style>
