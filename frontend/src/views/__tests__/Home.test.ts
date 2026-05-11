import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import Home from '../Home.vue'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import ArticlePreview from '@/components/ArticlePreview.vue'

// Mock child components
vi.mock('@/components/layout/Header.vue', () => ({
  default: {
    name: 'Header',
    template: '<header data-test="header"><slot /></header>'
  }
}))

vi.mock('@/components/layout/Footer.vue', () => ({
  default: {
    name: 'Footer',
    template: '<footer data-test="footer"><slot /></footer>'
  }
}))

vi.mock('@/components/ArticlePreview.vue', () => ({
  default: {
    name: 'ArticlePreview',
    props: ['article'],
    template: '<div data-test="article-preview">{{ article.title }}</div>',
    emits: ['click']
  }
}))

describe('Home.vue', () => {
  let router: any

  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: Home },
        { path: '/articles', component: { template: '<div>Articles</div>' } },
        { path: '/articles/:id', component: { template: '<div>Article Detail</div>' } },
        { path: '/about', component: { template: '<div>About</div>' } }
      ]
    })

    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render header and footer', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.findComponent({ name: 'Header' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'Footer' }).exists()).toBe(true)
  })

  it('should render hero section', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.text()).toContain('欢迎来到我的博客')
    expect(wrapper.text()).toContain('记录技术探索，分享学习心得')
  })

  it('should render latest articles section', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.text()).toContain('最新文章')
  })

  it('should render browse articles button', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [router]
      }
    })

    const browseButton = wrapper.find('a[href="/articles"]')
    expect(browseButton.exists()).toBe(true)
    expect(browseButton.text()).toContain('浏览文章')
  })

  it('should show loading state initially', () => {
    vi.mocked(fetch).mockImplementation(() => new Promise(() => {})) // Never resolves

    const wrapper = mount(Home, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.vm.loading).toBe(true)
    expect(wrapper.find('.animate-spin').exists()).toBe(true)
    expect(wrapper.text()).toContain('加载中')
  })

  it('should load articles on mount', async () => {
    const mockArticles = [
      {
        id: '1',
        title: 'Test Article 1',
        content: 'Content 1',
        publishedAt: '2026-05-11T00:00:00Z'
      },
      {
        id: '2',
        title: 'Test Article 2',
        content: 'Content 2',
        publishedAt: '2026-05-10T00:00:00Z'
      }
    ]

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockArticles })
    } as Response)

    const wrapper = mount(Home, {
      global: {
        plugins: [router]
      }
    })

    // Wait for component to mount and fetch to complete
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    expect(fetch).toHaveBeenCalledWith('/api/v1/articles?status=PUBLISHED&limit=9')
  })

  it('should render articles when loaded', async () => {
    const mockArticles = [
      {
        id: '1',
        title: 'Test Article 1',
        content: 'Content 1',
        publishedAt: '2026-05-11T00:00:00Z'
      }
    ]

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockArticles })
    } as Response)

    const wrapper = mount(Home, {
      global: {
        plugins: [router]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.articles).toEqual(mockArticles)
    expect(wrapper.vm.loading).toBe(false)
  })

  it('should show empty state when no articles', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] })
    } as Response)

    const wrapper = mount(Home, {
      global: {
        plugins: [router]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.articles.length).toBe(0)
    expect(wrapper.vm.loading).toBe(false)
    expect(wrapper.text()).toContain('暂无文章')
  })

  it('should handle fetch errors gracefully', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'))

    const wrapper = mount(Home, {
      global: {
        plugins: [router]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.loading).toBe(false)
    expect(wrapper.vm.articles.length).toBe(0)
  })

  it('should navigate to article detail when article clicked', async () => {
    const push = vi.spyOn(router, 'push')

    const mockArticles = [
      {
        id: '1',
        title: 'Test Article 1',
        content: 'Content 1',
        publishedAt: '2026-05-11T00:00:00Z'
      }
    ]

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockArticles })
    } as Response)

    const wrapper = mount(Home, {
      global: {
        plugins: [router]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    await wrapper.vm.handleArticleClick(mockArticles[0])

    expect(push).toHaveBeenCalledWith('/articles/1')
  })

  it('should have correct CSS classes for layout', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [router]
      }
    })

    const container = wrapper.find('.min-h-screen')
    expect(container.classes()).toContain('flex')
    expect(container.classes()).toContain('flex-col')
    expect(container.classes()).toContain('bg-gray-50')
  })

  it('should have hero section with gradient background', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [router]
      }
    })

    const hero = wrapper.find('.bg-gradient-to-br')
    expect(hero.classes()).toContain('from-blue-600')
    expect(hero.classes()).toContain('to-purple-600')
  })

  it('should have responsive grid for articles', async () => {
    const mockArticles = [
      {
        id: '1',
        title: 'Test Article 1',
        content: 'Content 1',
        publishedAt: '2026-05-11T00:00:00Z'
      }
    ]

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockArticles })
    } as Response)

    const wrapper = mount(Home, {
      global: {
        plugins: [router]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    const grid = wrapper.find('.grid')
    expect(grid.exists()).toBe(true)
    expect(grid.classes()).toContain('grid-cols-1')
    expect(grid.classes()).toContain('md:grid-cols-2')
    expect(grid.classes()).toContain('lg:grid-cols-3')
  })
})
