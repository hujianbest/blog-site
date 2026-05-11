import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Image {
  id: string
  url: string
  thumbnailUrl?: string
  filename: string
  size: number
  mimeType: string
  createdAt: Date
}

export const useImageStore = defineStore('images', () => {
  const images = ref<Image[]>([])
  const selectedImageId = ref<string | null>(null)
  const isUploading = ref(false)
  const uploadProgress = ref(0)

  function addImage(image: Image): void {
    images.value.push(image)
  }

  function removeImage(id: string): void {
    const index = images.value.findIndex(img => img.id === id)
    if (index > -1) {
      images.value.splice(index, 1)
    }
  }

  function updateImage(id: string, updates: Partial<Image>): void {
    const image = images.value.find(img => img.id === id)
    if (image) {
      Object.assign(image, updates)
    }
  }

  function selectImage(id: string | null): void {
    selectedImageId.value = id
  }

  function getSelectedImage(): Image | undefined {
    return images.value.find(img => img.id === selectedImageId.value)
  }

  function clearImages(): void {
    images.value = []
    selectedImageId.value = null
  }

  function setUploadProgress(progress: number): void {
    uploadProgress.value = progress
  }

  function setUploading(isUp: boolean): void {
    isUploading.value = isUp
  }

  return {
    images,
    selectedImageId,
    isUploading,
    uploadProgress,
    addImage,
    removeImage,
    updateImage,
    selectImage,
    getSelectedImage,
    clearImages,
    setUploadProgress,
    setUploading
  }
})
