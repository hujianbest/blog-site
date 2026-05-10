<template>
  <div class="editor-toolbar">
    <button
      data-test="bold-button"
      class="toolbar-button"
      title="Bold (Ctrl+B)"
      @click="$emit('bold')"
    >
      <strong>B</strong>
    </button>
    <button
      data-test="italic-button"
      class="toolbar-button"
      title="Italic (Ctrl+I)"
      @click="$emit('italic')"
    >
      <em>I</em>
    </button>
    <button
      data-test="heading-button"
      class="toolbar-button"
      title="Heading"
      @click="$emit('heading')"
    >
      H
    </button>
    <button
      data-test="list-button"
      class="toolbar-button"
      title="List"
      @click="$emit('list')"
    >
      UL
    </button>
    <button
      data-test="code-button"
      class="toolbar-button"
      title="Code"
      @click="$emit('code')"
    >
      &lt;/&gt;
    </button>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  bold: []
  italic: []
  heading: []
  list: []
  code: []
}>()
</script>

<style scoped>
.editor-toolbar {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #fafafa;
  border-bottom: 1px solid #e5e5e5;
}

.toolbar-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0.25rem 0.5rem;
  background-color: #ffffff;
  border: 1px solid #d4d4d4;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.toolbar-button:hover {
  background-color: #f5f5f5;
  border-color: #a3a3a3;
}

.toolbar-button:active {
  background-color: #e5e5e5;
}
</style>
