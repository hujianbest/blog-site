import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MarkdownEditor from '../MarkdownEditor.vue'

// Mock Naive UI message
vi.mock('naive-ui', () => ({
  useMessage: () => ({
    success: vi.fn(),
    error: vi.fn()
  })
}))

describe('MarkdownEditor Auto-save Integration', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('TC-INT-001: should trigger auto-save after 30 seconds of inactivity', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    } as Response)

    const wrapper = mount(MarkdownEditor, {
      props: {
        articleId: 'test-123',
        modelValue: '# Test Content'
      }
    })

    // Simulate user input
    const textarea = wrapper.find('textarea')
    await textarea.setValue('# Updated Content')

    // Wait 30 seconds
    await vi.advanceTimersByTimeAsync(30000)

    expect(fetch).toHaveBeenCalledWith(
      '/api/v1/articles/test-123/draft',
      expect.objectContaining({
        method: 'PUT'
      })
    )
  })

  it('TC-INT-002: should trigger manual save on Ctrl+S', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    } as Response)

    const wrapper = mount(MarkdownEditor, {
      props: {
        articleId: 'test-123',
        modelValue: '# Test Content'
      }
    })

    // Simulate Ctrl+S keypress
    const event = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true
    })
    document.dispatchEvent(event)

    await vi.advanceTimersByTimeAsync(100)

    expect(fetch).toHaveBeenCalledWith(
      '/api/v1/articles/test-123/draft',
      expect.objectContaining({
        method: 'PUT'
      })
    )
  })

  it('TC-INT-003: should save draft to localStorage on auto-save', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    } as Response)

    const wrapper = mount(MarkdownEditor, {
      props: {
        articleId: 'test-123',
        modelValue: '# Test Content'
      }
    })

    // Simulate user input
    const textarea = wrapper.find('textarea')
    await textarea.setValue('# Updated Content')

    // Trigger auto-save
    await vi.advanceTimersByTimeAsync(30000)

    const savedDraft = localStorage.getItem('draft-test-123')
    expect(savedDraft).toBe('# Updated Content')
  })

  it('TC-INT-004: should restore draft from localStorage on mount', async () => {
    // Save draft to localStorage
    localStorage.setItem('draft-test-123', '# Saved Draft Content')

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    } as Response)

    const wrapper = mount(MarkdownEditor, {
      props: {
        articleId: 'test-123',
        modelValue: ''
      }
    })

    await wrapper.vm.$nextTick()

    // Should emit the restored draft content
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['# Saved Draft Content'])
  })

  it('TC-INT-005: should show toast notification on save success/failure', async () => {
    const mockMessage = {
      success: vi.fn(),
      error: vi.fn()
    }

    vi.doMock('naive-ui', () => ({
      useMessage: () => mockMessage
    }))

    // Test success
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    } as Response)

    const wrapper = mount(MarkdownEditor, {
      props: {
        articleId: 'test-123',
        modelValue: '# Test'
      }
    })

    await vi.advanceTimersByTimeAsync(30000)

    expect(mockMessage.success).toHaveBeenCalledWith('保存成功')

    // Test failure
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Save failed' })
    } as Response)

    await wrapper.vm.$nextTick()
    await vi.advanceTimersByTimeAsync(30000)

    expect(mockMessage.error).toHaveBeenCalledWith('保存失败')
  })
})
