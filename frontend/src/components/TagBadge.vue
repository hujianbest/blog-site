<template>
  <router-link
    :to="`/tags/${tag.name}`"
    class="tag-badge inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
    :class="sizeClass"
  >
    <span>#{{ tag.name }}</span>
    <span class="text-xs opacity-75">({{ tag.articleCount }})</span>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Tag {
  id: string
  name: string
  articleCount: number
}

interface Props {
  tag: Tag
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium'
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'text-xs'
    case 'large':
      return 'text-lg'
    default:
      return 'text-sm'
  }
})
</script>
