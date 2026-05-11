import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import ArticleDetail from '../ArticleDetail.vue'

// Mock child components
vi.mock('@/components/layout/Header.vue', () => ({
  default: { name: 'Header', template: '<header data-test="header" />' }
}))
vi.mock('@/components/layout/Footer.vue', () => ({
  default: { name: 'Footer', template: '<footer data-test="footer" />' }
}))
vi.mock('@/components/ReadingProgress.vue', () => ({
  default: { name: 'ReadingProgress', template: '<div data-test="reading-progress" />' }
}))
vi.mock('@/components/TOC.vue', () => ({
  default: { name: 'TOC', template: '<div data-test="toc" />' }
}))

describe('ArticleDetail.vue', () => {
  let router: any

  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/articles/:id', component: ArticleDetail }
      ]
    })
    global.fetch = vi.fn()
  })

  it('should render back button', () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: null })
    } as Response)

    const wrapper = mount(ArticleDetail, {
      global: { plugins: [router] }
    })

    expect(wrapper.text()).toContain('返回首页')
  })

  it('should show loading state initially', () => {
    vi.mocked(fetch).mockImplementation(() => new Promise(() => {}))

    const wrapper = mount(ArticleDetail, {
      global: { plugins: [router] }
    })

    expect(wrapper.vm.loading).toBe(true)
    expect(wrapper.find('.animate-spin').exists()).toBe(true)
  })

  it('should load article on mount', async () => {
    const mockArticle = {
      id: '1',
      title: 'Test Article',
      content: '# Test Content',
      publishedAt: '2026-05-11T00:00:00Z'
    }

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockArticle })
    } as Response)

    const wrapper = mount(ArticleDetail, {
      global: { plugins: [router] }
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.article).toEqual(mockArticle)
  })

  it('should render article title when loaded', async () => {
    const mockArticle = {
      id: '1',
      title: 'Test Article',
      content: '# Test',
      publishedAt: '2026-05-11T00:00:00Z'
    }

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockArticle })
    } as Response)

    const wrapper = mount(ArticleDetail, {
      global: { plugins: [router] }
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Test Article')
  })

  it('should show error state when article not found', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: null })
    } as Response)

    const wrapper = mount(ArticleDetail, {
      global: { plugins: [router] }
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('文章未找到')
  })

  it('should render markdown content', async () => {
    const mockArticle = {
      id: '1',
      title: 'Test',
      content: '# Heading\n\n**Bold** text',
      publishedAt: '2026-05-11T00:00:00Z'
    }

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockArticle })
    } as Response)

    const wrapper = mount(ArticleDetail, {
      global: { plugins: [router] }
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    const content = wrapper.find('#article-content')
    expect(content.html()).toContain('<h1')
  })

  it('should copy link when share button clicked', async () => {
    const mockArticle = {
      id: '1',
      title: 'Test',
      content: '# Test',
      publishedAt: '2026-05-11T00:00:00Z'
    }

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockArticle })
    } as Response)

    const mockClipboard = {
      writeText: vi.fn().mockResolvedValue(undefined)
    }

    Object.defineProperty(navigator, 'clipboard', {
      value: mockClipboard,
      writable: true
    })

    const wrapper = mount(ArticleDetail, {
      global: { plugins: [router] }
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    await wrapper.vm.copyLink()

    expect(mockClipboard.writeText).toHaveBeenCalled()
    expect(wrapper.vm.copied).toBe(true)
  })
})
