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

    expect(wrapper.text()).toContain('MB')
  })

  it('should render bio description', () => {
    const wrapper = mount(About, { global: { stubs } })

    expect(wrapper.text()).toContain('全栈开发者')
    expect(wrapper.text()).toContain('技术博主')
    expect(wrapper.text()).toContain('开源爱好者')
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

  it('should render skills section', () => {
    const wrapper = mount(About, { global: { stubs } })

    expect(wrapper.text()).toContain('技能栈')
  })

  it('should render frontend skills', () => {
    const wrapper = mount(About, { global: { stubs } })

    expect(wrapper.text()).toContain('Vue.js')
    expect(wrapper.text()).toContain('React')
    expect(wrapper.text()).toContain('TypeScript')
    expect(wrapper.text()).toContain('Tailwind CSS')
  })

  it('should render backend skills', () => {
    const wrapper = mount(About, { global: { stubs } })

    expect(wrapper.text()).toContain('Node.js')
    expect(wrapper.text()).toContain('Spring Boot')
    expect(wrapper.text()).toContain('PostgreSQL')
  })

  it('should render tools', () => {
    const wrapper = mount(About, { global: { stubs } })

    expect(wrapper.text()).toContain('Git')
    expect(wrapper.text()).toContain('Docker')
    expect(wrapper.text()).toContain('VS Code')
  })

  it('should have responsive layout', () => {
    const wrapper = mount(About, { global: { stubs } })

    const grid = wrapper.find('.grid')
    expect(grid.classes()).toContain('grid-cols-1')
    expect(grid.classes()).toContain('md:grid-cols-2')
  })

  it('should have gradient avatar background', () => {
    const wrapper = mount(About, { global: { stubs } })

    const avatar = wrapper.find('.from-blue-500')
    expect(avatar.exists()).toBe(true)
    expect(avatar.classes()).toContain('to-purple-600')
  })
})
