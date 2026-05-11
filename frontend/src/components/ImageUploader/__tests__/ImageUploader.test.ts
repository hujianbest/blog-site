import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ImageUploader from '../ImageUploader.vue'
import ImageViewer from '../../ImageViewer/ImageViewer.vue'

// Mock fetch API
global.fetch = vi.fn()

describe('ImageUploader.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset fetch mock
    global.fetch = vi.fn()
  })

  it('should render file input', () => {
    const wrapper = mount(ImageUploader)
    const input = wrapper.find('input[type="file"]')

    expect(input.exists()).toBe(true)
  })

  it('should accept valid image files (JPG, PNG, GIF, WebP)', () => {
    const wrapper = mount(ImageUploader)
    const input = wrapper.find('input[type="file"]')

    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' })
    Object.defineProperty(input.element, 'files', {
      value: [mockFile]
    })

    input.trigger('change')

    // Should not throw error, validation should pass
    expect(wrapper.vm.uploadError).toBe('')
  })

  it('should reject files larger than 5MB', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({
          error: { message: 'File size exceeds 5MB limit' }
        })
      })
    )

    const wrapper = mount(ImageUploader)
    const input = wrapper.find('input[type="file"]')

    // Create a 6MB file
    const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg'
    })
    Object.defineProperty(input.element, 'files', {
      value: [largeFile]
    })

    await input.trigger('change')

    // Should show error
    expect(wrapper.vm.uploadError).toBeTruthy()
  })

  it('should reject non-image files', () => {
    const wrapper = mount(ImageUploader)
    const input = wrapper.find('input[type="file"]')

    const textFile = new File(['content'], 'test.txt', { type: 'text/plain' })
    Object.defineProperty(input.element, 'files', {
      value: [textFile]
    })

    input.trigger('change')

    // Should show error
    expect(wrapper.vm.uploadError).toContain('Invalid file format')
  })

  it('should call upload API on valid file', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          id: '1',
          url: '/uploads/image.jpg',
          thumbnailUrl: '/uploads/image_thumb.jpg'
        })
      })
    )

    const wrapper = mount(ImageUploader)
    const input = wrapper.find('input[type="file"]')

    const validFile = new File(['content'], 'image.jpg', { type: 'image/jpeg' })
    Object.defineProperty(input.element, 'files', {
      value: [validFile]
    })

    await input.trigger('change')

    // Should call API
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/images/upload'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': expect.stringContaining('multipart/form-data')
        })
      })
    )
  })
})

describe('ImageViewer.vue', () => {
  it('should display image grid', () => {
    const images = [
      { id: '1', url: '/uploads/img1.jpg', thumbnailUrl: '/uploads/img1_thumb.jpg' },
      { id: '2', url: '/uploads/img2.jpg', thumbnailUrl: '/uploads/img2_thumb.jpg' }
    ]

    const wrapper = mount(ImageViewer, {
      props: { images }
    })

    expect(wrapper.findAll('.image-item')).toHaveLength(2)
  })

  it('should show delete button on image hover', async () => {
    const images = [
      { id: '1', url: '/uploads/img1.jpg', thumbnailUrl: '/uploads/img1_thumb.jpg' }
    ]

    const wrapper = mount(ImageViewer, {
      props: { images }
    })

    const imageItem = wrapper.find('.image-item')
    await imageItem.trigger('mouseenter')

    expect(wrapper.find('.delete-button').exists()).toBe(true)
  })

  it('should remove image from list when deleted', async () => {
    const images = [
      { id: '1', url: '/uploads/img1.jpg', thumbnailUrl: '/uploads/img1_thumb.jpg' },
      { id: '2', url: '/uploads/img2.jpg', thumbnailUrl: '/uploads/img2_thumb.jpg' }
    ]

    const wrapper = mount(ImageViewer, {
      props: { images }
    })

    // Simulate delete
    await wrapper.vm.removeImage('1')

    expect(wrapper.findAll('.image-item')).toHaveLength(1)
  })
})
