import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EditorToolbar from '../EditorToolbar.vue'

describe('EditorToolbar.vue', () => {
  it('should render all formatting buttons', () => {
    const wrapper = mount(EditorToolbar)
    expect(wrapper.find('[data-test="bold-button"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="italic-button"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="heading-button"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="list-button"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="code-button"]').exists()).toBe(true)
  })

  it('should emit bold event when bold button clicked', async () => {
    const wrapper = mount(EditorToolbar)
    const button = wrapper.find('[data-test="bold-button"]')

    await button.trigger('click')
    expect(wrapper.emitted('bold')).toBeTruthy()
  })

  it('should emit italic event when italic button clicked', async () => {
    const wrapper = mount(EditorToolbar)
    const button = wrapper.find('[data-test="italic-button"]')

    await button.trigger('click')
    expect(wrapper.emitted('italic')).toBeTruthy()
  })

  it('should emit heading event when heading button clicked', async () => {
    const wrapper = mount(EditorToolbar)
    const button = wrapper.find('[data-test="heading-button"]')

    await button.trigger('click')
    expect(wrapper.emitted('heading')).toBeTruthy()
  })

  it('should emit list event when list button clicked', async () => {
    const wrapper = mount(EditorToolbar)
    const button = wrapper.find('[data-test="list-button"]')

    await button.trigger('click')
    expect(wrapper.emitted('list')).toBeTruthy()
  })

  it('should emit code event when code button clicked', async () => {
    const wrapper = mount(EditorToolbar)
    const button = wrapper.find('[data-test="code-button"]')

    await button.trigger('click')
    expect(wrapper.emitted('code')).toBeTruthy()
  })
})
