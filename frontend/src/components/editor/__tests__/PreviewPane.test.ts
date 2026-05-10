import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PreviewPane from '../PreviewPane.vue'

describe('PreviewPane.vue', () => {
  it('should render markdown as HTML', () => {
    const wrapper = mount(PreviewPane, {
      props: { content: '# Hello' }
    })

    expect(wrapper.html()).toContain('<h1>')
    expect(wrapper.html()).toContain('Hello')
  })

  it('should handle empty content', () => {
    const wrapper = mount(PreviewPane, {
      props: { content: '' }
    })

    expect(wrapper.html()).toBeTruthy()
  })

  it('should prevent XSS in content', () => {
    const wrapper = mount(PreviewPane, {
      props: { content: '<script>alert("xss")</script>' }
    })

    expect(wrapper.html()).not.toContain('<script>')
    expect(wrapper.html()).not.toContain('alert(')
  })
})
