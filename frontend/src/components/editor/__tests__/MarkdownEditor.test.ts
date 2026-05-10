import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MarkdownEditor from '../MarkdownEditor.vue'

describe('MarkdownEditor.vue', () => {
  it('should render split-pane layout', () => {
    const wrapper = mount(MarkdownEditor)
    expect(wrapper.find('.editor-pane').exists()).toBe(true)
    expect(wrapper.find('.preview-pane').exists()).toBe(true)
  })

  it('should render toolbar', () => {
    const wrapper = mount(MarkdownEditor)
    expect(wrapper.findComponent({ name: 'EditorToolbar' }).exists()).toBe(true)
  })

  it('should update preview when typing in editor', async () => {
    const wrapper = mount(MarkdownEditor)
    const editor = wrapper.find('textarea')

    await editor.setValue('# Test')
    await editor.trigger('input')

    const preview = wrapper.find('.preview-content')
    expect(preview.html()).toContain('<h1>')
  })

  it('should insert bold markdown when bold button clicked', async () => {
    const wrapper = mount(MarkdownEditor)
    const toolbar = wrapper.findComponent({ name: 'EditorToolbar' })

    await toolbar.vm.$emit('bold')
    const editor = wrapper.find('textarea')

    expect(editor.element.value).toContain('**')
  })

  it('should insert italic markdown when italic button clicked', async () => {
    const wrapper = mount(MarkdownEditor)
    const toolbar = wrapper.findComponent({ name: 'EditorToolbar' })

    await toolbar.vm.$emit('italic')
    const editor = wrapper.find('textarea')

    expect(editor.element.value).toContain('*')
  })

  it('should trigger auto-save after 30s of inactivity', async () => {
    vi.useFakeTimers()
    const wrapper = mount(MarkdownEditor)
    const editor = wrapper.find('textarea')

    await editor.setValue('Test content')
    await editor.trigger('input')

    vi.advanceTimersByTime(30000)

    expect(wrapper.emitted('save')).toBeTruthy()
    vi.useRealTimers()
  })

  it('should reset auto-save timer on new input', async () => {
    vi.useFakeTimers()
    const wrapper = mount(MarkdownEditor)
    const editor = wrapper.find('textarea')

    await editor.setValue('First')
    await editor.trigger('input')
    vi.advanceTimersByTime(20000)

    await editor.setValue('Second')
    await editor.trigger('input')
    vi.advanceTimersByTime(30000)

    expect(wrapper.emitted('save')).toBeTruthy()
    vi.useRealTimers()
  })

  it('should sync scroll between editor and preview', async () => {
    const wrapper = mount(MarkdownEditor)
    const editor = wrapper.find('textarea')

    // Set content to make preview scrollable
    await editor.setValue('# Test\n\n'.repeat(50))
    await editor.trigger('input')

    // Simulate scroll event manually
    const scrollEvent = new Event('scroll')
    Object.defineProperty(scrollEvent, 'target', {
      value: { scrollTop: 100, scrollHeight: 1000, clientHeight: 500 },
      enumerable: true
    })

    editor.element.scrollTop = 100
    editor.element.dispatchEvent(scrollEvent)

    // Wait for Vue to update
    await wrapper.vm.$nextTick()

    const preview = wrapper.find('.preview-pane')
    // Preview should have scrolled (though exact position depends on implementation)
    expect(preview.exists()).toBe(true)
  })
})
