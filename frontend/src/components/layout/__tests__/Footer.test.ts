import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Footer from '../Footer.vue'

describe('Footer.vue', () => {
  const stubs = {
    'router-link': {
      template: '<a :href="to"><slot /></a>',
      props: ['to']
    }
  }

  it('should render about section', () => {
    const wrapper = mount(Footer, { global: { stubs } })

    expect(wrapper.text()).toContain('关于')
    expect(wrapper.text()).toContain('一个简洁的个人写作网站')
  })

  it('should render quick links section', () => {
    const wrapper = mount(Footer, { global: { stubs } })

    expect(wrapper.text()).toContain('快速链接')
    expect(wrapper.text()).toContain('首页')
    expect(wrapper.text()).toContain('文章')
    expect(wrapper.text()).toContain('关于')
  })

  it('should render social links section', () => {
    const wrapper = mount(Footer, { global: { stubs } })

    expect(wrapper.text()).toContain('社交链接')
  })

  it('should have correct routes for quick links', () => {
    const wrapper = mount(Footer, { global: { stubs } })

    const links = wrapper.findAll('a')
    const homeLink = links.find(link => link.text() === '首页')
    const articlesLink = links.find(link => link.text() === '文章')
    const aboutLink = links.find(link => link.text() === '关于')

    expect(homeLink?.attributes('href')).toBe('/')
    expect(articlesLink?.attributes('href')).toBe('/articles')
    expect(aboutLink?.attributes('href')).toBe('/about')
  })

  it('should render GitHub link with correct attributes', () => {
    const wrapper = mount(Footer, { global: { stubs } })

    const githubLink = wrapper.findAll('a').find(link =>
      link.attributes('href')?.includes('github')
    )

    expect(githubLink?.exists()).toBe(true)
    expect(githubLink?.attributes('target')).toBe('_blank')
    expect(githubLink?.attributes('rel')).toBe('noopener noreferrer')
    expect(githubLink?.attributes('aria-label')).toBe('GitHub')
  })

  it('should render Twitter link with correct attributes', () => {
    const wrapper = mount(Footer, { global: { stubs } })

    const twitterLink = wrapper.findAll('a').find(link =>
      link.attributes('href')?.includes('twitter')
    )

    expect(twitterLink?.exists()).toBe(true)
    expect(twitterLink?.attributes('target')).toBe('_blank')
    expect(twitterLink?.attributes('rel')).toBe('noopener noreferrer')
    expect(twitterLink?.attributes('aria-label')).toBe('Twitter')
  })

  it('should display current year in copyright', () => {
    const wrapper = mount(Footer, { global: { stubs } })

    const currentYear = new Date().getFullYear()
    expect(wrapper.text()).toContain(currentYear.toString())
    expect(wrapper.text()).toContain('My Blog. All rights reserved')
  })

  it('should have correct CSS classes for footer', () => {
    const wrapper = mount(Footer, { global: { stubs } })

    const footer = wrapper.find('footer')
    expect(footer.classes()).toContain('bg-gray-900')
    expect(footer.classes()).toContain('text-white')
    expect(footer.classes()).toContain('mt-auto')
  })

  it('should have three columns in responsive grid', () => {
    const wrapper = mount(Footer, { global: { stubs } })

    const grid = wrapper.find('.grid')
    expect(grid.classes()).toContain('grid-cols-1')
    expect(grid.classes()).toContain('md:grid-cols-3')
  })

  it('should have copyright section with border', () => {
    const wrapper = mount(Footer, { global: { stubs } })

    const copyright = wrapper.find('.border-t')
    expect(copyright.classes()).toContain('border-gray-800')
    expect(copyright.classes()).toContain('text-center')
  })

  it('should have SVG icons for social links', () => {
    const wrapper = mount(Footer, { global: { stubs } })

    const svgs = wrapper.findAll('svg')
    expect(svgs.length).toBeGreaterThanOrEqual(2) // At least GitHub and Twitter
  })

  it('should have proper semantic HTML structure', () => {
    const wrapper = mount(Footer, { global: { stubs } })

    expect(wrapper.find('footer').exists()).toBe(true)
    expect(wrapper.findAll('h3').length).toBe(3) // Three section headers
    expect(wrapper.findAll('ul').length).toBeGreaterThan(0) // Lists for links
  })
})
