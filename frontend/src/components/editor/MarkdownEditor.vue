<template>
  <div class="markdown-editor">
    <EditorToolbar
      @bold="insertBold"
      @italic="insertItalic"
      @heading="insertHeading"
      @list="insertList"
      @code="insertCode"
    />
    <div class="editor-container">
      <textarea
        ref="editorRef"
        v-model="content"
        class="editor-pane"
        placeholder="Start writing your article..."
        @input="onInput"
        @scroll="onScroll"
        @keydown="onKeydown"
      />
      <PreviewPane
        ref="previewRef"
        :content="content"
        class="preview-pane"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import EditorToolbar from './EditorToolbar.vue'
import PreviewPane from './PreviewPane.vue'

interface Props {
  modelValue?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'save', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const content = ref(props.modelValue || '')
const editorRef = ref<HTMLTextAreaElement>()
const previewRef = ref<InstanceType<typeof PreviewPane>>()
let autoSaveTimer: ReturnType<typeof setTimeout> | null = null

watch(() => props.modelValue, (newValue) => {
  if (newValue !== content.value) {
    content.value = newValue || ''
  }
})

function onInput() {
  emit('update:modelValue', content.value)
  scheduleAutoSave()
}

function scheduleAutoSave() {
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
  }
  autoSaveTimer = setTimeout(() => {
    emit('save', content.value)
  }, 30000)
}

function onScroll(event: Event) {
  const target = event.target as HTMLTextAreaElement
  const scrollPercentage = target.scrollTop / (target.scrollHeight - target.clientHeight)

  if (previewRef.value?.$el) {
    const previewEl = previewRef.value.$el as HTMLElement
    const previewScrollTop = scrollPercentage * (previewEl.scrollHeight - previewEl.clientHeight)
    previewEl.scrollTop = previewScrollTop
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.ctrlKey || event.metaKey) {
    switch (event.key.toLowerCase()) {
      case 'b':
        event.preventDefault()
        insertBold()
        break
      case 'i':
        event.preventDefault()
        insertItalic()
        break
      case 's':
        event.preventDefault()
        emit('save', content.value)
        break
    }
  }
}

function insertMarkdown(prefix: string, suffix: string = '') {
  const editor = editorRef.value
  if (!editor) return

  const start = editor.selectionStart
  const end = editor.selectionEnd
  const selectedText = content.value.substring(start, end)
  const replacement = prefix + selectedText + suffix

  content.value = content.value.substring(0, start) + replacement + content.value.substring(end)

  emit('update:modelValue', content.value)

  // Restore cursor position
  setTimeout(() => {
    editor.focus()
    editor.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length)
  }, 0)
}

function insertBold() {
  insertMarkdown('**', '**')
}

function insertItalic() {
  insertMarkdown('*', '*')
}

function insertHeading() {
  const editor = editorRef.value
  if (!editor) return

  const start = editor.selectionStart
  const lineStart = content.value.lastIndexOf('\n', start - 1) + 1

  // Check if line already has heading
  const lineEnd = content.value.indexOf('\n', start)
  const currentLine = content.value.substring(lineStart, lineEnd === -1 ? undefined : lineEnd)

  if (currentLine.startsWith('# ')) {
    // Already h1, remove heading
    const endPos = lineEnd === -1 ? content.value.length : lineEnd
    content.value = content.value.substring(0, lineStart) + currentLine.substring(2) + content.value.substring(endPos)
  } else if (currentLine.startsWith('## ')) {
    // h2 to h1
    const endPos = lineEnd === -1 ? content.value.length : lineEnd
    content.value = content.value.substring(0, lineStart) + '# ' + currentLine.substring(3) + content.value.substring(endPos)
  } else {
    // Add heading
    const endPos = lineEnd === -1 ? content.value.length : lineEnd
    content.value = content.value.substring(0, lineStart) + '# ' + currentLine + content.value.substring(endPos)
  }

  emit('update:modelValue', content.value)
}

function insertList() {
  const editor = editorRef.value
  if (!editor) return

  const start = editor.selectionStart
  const lineStart = content.value.lastIndexOf('\n', start - 1) + 1

  // Check if line already has list marker
  const lineEnd = content.value.indexOf('\n', start)
  const currentLine = content.value.substring(lineStart, lineEnd === -1 ? undefined : lineEnd)

  if (currentLine.startsWith('- ')) {
    // Already has list marker, remove it
    const endPos = lineEnd === -1 ? content.value.length : lineEnd
    content.value = content.value.substring(0, lineStart) + currentLine.substring(2) + content.value.substring(endPos)
  } else {
    // Add list marker
    const endPos = lineEnd === -1 ? content.value.length : lineEnd
    content.value = content.value.substring(0, lineStart) + '- ' + currentLine + content.value.substring(endPos)
  }

  emit('update:modelValue', content.value)
}

function insertCode() {
  insertMarkdown('```\n', '\n```')
}
</script>

<style scoped>
.markdown-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
}

.editor-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.editor-pane {
  flex: 1;
  padding: 1rem;
  border: none;
  border-right: 1px solid #e5e5e5;
  resize: none;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  outline: none;
  background-color: #fafafa;
}

.editor-pane::placeholder {
  color: #a3a3a3;
}

.preview-pane {
  flex: 1;
  overflow: hidden;
}
</style>
