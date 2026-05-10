<template>
  <div class="preview-pane">
    <div
      v-if="content"
      class="preview-content"
      v-html="sanitizedContent"
    />
    <div v-else class="preview-empty">
      预览区域
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { convertMarkdownToHtml } from '../../utils/markdown'

interface Props {
  content: string
}

const props = defineProps<Props>()

const sanitizedContent = computed(() => {
  return convertMarkdownToHtml(props.content)
})
</script>

<style scoped>
.preview-pane {
  height: 100%;
  overflow-y: auto;
  padding: 1rem;
  background-color: #ffffff;
  border-left: 1px solid #e5e5e5;
}

.preview-content {
  line-height: 1.6;
  color: #171717;
}

.preview-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #a3a3a3;
  font-size: 0.875rem;
}

/* Markdown content styling */
.preview-content :deep(h1) {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #171717;
}

.preview-content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #171717;
}

.preview-content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #171717;
}

.preview-content :deep(p) {
  margin-bottom: 1rem;
}

.preview-content :deep(strong) {
  font-weight: 600;
}

.preview-content :deep(em) {
  font-style: italic;
}

.preview-content :deep(code) {
  background-color: #f5f5f5;
  padding: 0.125rem 0.25rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.875em;
}

.preview-content :deep(pre) {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.preview-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.preview-content :deep(ul),
.preview-content :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.preview-content :deep(li) {
  margin-bottom: 0.25rem;
}

.preview-content :deep(a) {
  color: #f97316;
  text-decoration: underline;
}

.preview-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
}

.preview-content :deep(blockquote) {
  border-left: 4px solid #f97316;
  padding-left: 1rem;
  margin-bottom: 1rem;
  color: #525252;
  font-style: italic;
}

.preview-content :deep(hr) {
  border: none;
  border-top: 1px solid #e5e5e5;
  margin: 2rem 0;
}

.preview-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.preview-content :deep(th),
.preview-content :deep(td) {
  border: 1px solid #e5e5e5;
  padding: 0.5rem;
  text-align: left;
}

.preview-content :deep(th) {
  background-color: #fafafa;
  font-weight: 600;
}
</style>
