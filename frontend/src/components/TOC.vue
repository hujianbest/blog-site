<template>
  <nav class="toc">
    <h3 class="text-lg font-semibold mb-4">目录</h3>
    <ul class="space-y-2 text-sm">
      <li
        v-for="heading in headings"
        :key="heading.id"
        :class="[
          'toc-item',
          `toc-level-${heading.level}`,
          { 'active': activeId === heading.id }
        ]"
      >
        <a
          :href="`#${heading.id}`"
          @click.prevent="scrollToHeading(heading.id)"
          class="hover:text-blue-600 transition-colors"
        >
          {{ heading.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Heading {
  id: string
  text: string
  level: number
}

interface Props {
  contentElementId: string
}

const props = defineProps<Props>()

const headings = ref<Heading[]>([])
const activeId = ref('')

const extractHeadings = () => {
  const element = document.getElementById(props.contentElementId)
  if (!element) return

  const headingElements = element.querySelectorAll('h1, h2, h3, h4')
  const extractedHeadings: Heading[] = []

  headingElements.forEach((heading, index) => {
    const id = `heading-${index}`
    heading.id = id

    extractedHeadings.push({
      id,
      text: heading.textContent || '',
      level: parseInt(heading.tagName.charAt(1))
    })
  })

  headings.value = extractedHeadings
}

const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const offset = 80 // Header height
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.scrollY - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

const updateActiveHeading = () => {
  const headingElements = headings.value.map(h => document.getElementById(h.id)).filter(Boolean) as HTMLElement[]

  for (let i = headingElements.length - 1; i >= 0; i--) {
    const element = headingElements[i]
    const rect = element.getBoundingClientRect()
    if (rect.top <= 100) {
      activeId.value = element.id
      return
    }
  }

  activeId.value = ''
}

const handleScroll = () => {
  window.requestAnimationFrame(updateActiveHeading)
}

onMounted(() => {
  // Delay to ensure content is rendered
  setTimeout(() => {
    extractHeadings()
    updateActiveHeading()
  }, 100)

  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.toc {
  position: sticky;
  top: 100px;
}

.toc-item {
  margin-left: 0;
  transition: margin-left 0.2s;
}

.toc-level-1 {
  margin-left: 0;
  font-weight: 600;
}

.toc-level-2 {
  margin-left: 1rem;
}

.toc-level-3 {
  margin-left: 2rem;
}

.toc-level-4 {
  margin-left: 3rem;
}

.toc-item.active {
  color: #2563eb;
  font-weight: 600;
}

.toc-item.active a {
  color: #2563eb;
}
</style>
