<template>
  <div class="reading-progress">
    <div
      class="h-1 bg-blue-600 transition-all duration-150"
      :style="{ width: `${progress}%` }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  contentElementId: string
}

const props = defineProps<Props>()

const progress = ref(0)

const updateProgress = () => {
  const element = document.getElementById(props.contentElementId)
  if (!element) return

  const scrollTop = window.scrollY
  const docHeight = element.offsetHeight
  const winHeight = window.innerHeight

  const totalScroll = docHeight - winHeight
  const currentProgress = (scrollTop / totalScroll) * 100

  progress.value = Math.min(Math.max(currentProgress, 0), 100)
}

const handleScroll = () => {
  window.requestAnimationFrame(updateProgress)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  updateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
