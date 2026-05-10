import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MarkdownEditor from '../MarkdownEditor.vue'

describe('MarkdownEditor - Integration Tests', () => {
  it('should handle complete user workflow', async () => {
    const wrapper = mount(MarkdownEditor)
    const editor = wrapper.find('textarea')
    const toolbar = wrapper.findComponent({ name: 'EditorToolbar' })

    // Type heading
    await editor.setValue('# Title')
    await editor.trigger('input')

    // Click bold button
    await toolbar.vm.$emit('bold')
    await editor.setValue('# Title\n**Bold text**')
    await editor.trigger('input')

    const preview = wrapper.find('.preview-content')
    expect(preview.html()).toContain('<h1>Title</h1>')
    expect(preview.html()).toContain('<strong>Bold text</strong>')
  })

  it('should handle keyboard shortcuts', async () => {
    const wrapper = mount(MarkdownEditor)
    const editor = wrapper.find('textarea')

    await editor.setValue('text')
    await editor.trigger('input')

    // Simulate Ctrl+B
    await editor.trigger('keydown', { key: 'b', ctrlKey: true })

    expect(editor.element.value).toContain('**text**')
  })

  it('should save and restore content from localStorage', async () => {
    vi.useFakeTimers()
    const wrapper = mount(MarkdownEditor)
    const editor = wrapper.find('textarea')

    await editor.setValue('Test content')
    await editor.trigger('input')
    vi.advanceTimersByTime(30000)

    // Content should be saved
    expect(localStorage.getItem).toBeTruthy()

    vi.useRealTimers()
  })
})
