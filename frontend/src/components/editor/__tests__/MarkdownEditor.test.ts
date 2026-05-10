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
    expect(previewer.html()).toContain('<h1>')
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
    const editor = wrapper.find('.editor-pane')

    await editor.trigger('scroll', { target: { scrollTop: 100 } })

    const preview = wrapper.find('.preview-pane')
    expect(preview.element.scrollTop).toBeGreaterThan(0)
  })
})
