import { vi } from 'vitest';
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import About from '../About.vue'

// Mock child components
vi.mock('@/components/layout/Header.vue', () => ({
  default: { name: 'Header', template: '<header data-test="header" />' }
}))
vi.mock('@/components/layout/Footer.vue', () => ({
  default: { name: 'Footer', template: '<footer data-test="footer" />' }
}))

describe('About.vue', () => {
  const stubs = {
    'router-link': {
      template: '<a :href="to"><slot /></a>',
      props: ['to']
    }
  }

  it('should render page title', () => {
    const wrapper = mount(About, { global: { stubs } })

    expect(wrapper.text()).toContain('关于我')
  })

  it('should render avatar with initials', () => {
    const wrapper = mount(About, { global: { stubs } })

    expect(wrapper.text()).toContain('hujian')
  })

  it('should render bio description', () => {
    const wrapper = mount(About, { global: { stubs } })

    expect(wrapper.text()).toContain('全栈开发者')
    expect(wrapper.text()).toContain('工程实践')
    expect(wrapper.text()).toContain('长期思考')
    expect(wrapper.text()).not.toContain('热爱编程，享受创造的过程')
  })

  it('should render social links', () => {
    const wrapper = mount(About, { global: { stubs } })

    const githubLink = wrapper.findAll('a').find(link => link.attributes('href')?.includes('github'))
    expect(githubLink?.exists()).toBe(true)

    const twitterLink = wrapper.findAll('a').find(link => link.attributes('href')?.includes('twitter'))
    expect(twitterLink?.exists()).toBe(true)

    const emailLink = wrapper.findAll('a').find(link => link.attributes('href')?.includes('mailto'))
    expect(emailLink?.exists()).toBe(true)
  })

  it('should render editorial topics section', () => {
    const wrapper = mount(About, { global: { stubs } })

    expect(wrapper.text()).toContain('写作主题')
    expect(wrapper.text()).toContain('工程实践')
    expect(wrapper.text()).toContain('长期思考')
  })

  it('should avoid generic tool-list filler content', () => {
    const wrapper = mount(About, { global: { stubs } })

    expect(wrapper.text()).not.toContain('React')
    expect(wrapper.text()).not.toContain('Docker')
    expect(wrapper.text()).not.toContain('VS Code')
    expect(wrapper.text()).not.toContain('CI/CD')
  })

  it('should have responsive layout', () => {
    const wrapper = mount(About, { global: { stubs } })

    const grid = wrapper.find('.grid')
    expect(grid.classes()).toContain('grid-cols-1')
    expect(grid.classes()).toContain('md:grid-cols-2')
  })

  it('should use the editorial token avatar treatment', () => {
    const wrapper = mount(About, { global: { stubs } })

    const avatar = wrapper.find('[data-ui="about-avatar"]')
    expect(avatar.exists()).toBe(true)
    expect(avatar.classes()).toContain('bg-[var(--color-bg-accent-subtle)]')
    expect(avatar.classes()).not.toContain('from-blue-500')
    expect(avatar.classes()).not.toContain('to-purple-600')
  })
})
