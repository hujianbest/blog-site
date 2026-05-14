import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
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
    expect(wrapper.find('[data-ui-state="loading"]').exists()).toBe(true)
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
    expect(wrapper.find('[data-ui-state="error"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('返回文章列表')
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
    expect(content.html()).toContain('<h2')
  })

  it('should demote markdown h1 headings inside article content', async () => {
    const mockArticle = {
      id: '1',
      title: 'Title',
      content: '# Markdown H1',
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

    expect(wrapper.findAll('main h1').length).toBe(1)
    expect(wrapper.find('#article-content h2').exists()).toBe(true)
  })

  it('should normalize escaped newline markdown from the API', async () => {
    const mockArticle = {
      id: '1',
      title: 'Escaped Markdown',
      content: '# Heading\\n\\nBody text',
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
    expect(content.html()).not.toContain('\\n')
    expect(content.html()).toContain('<h2')
    expect(content.html()).toContain('<p>')
  })

  it('should render tokenized code blocks', async () => {
    const mockArticle = {
      id: '1',
      title: 'Code Article',
      content: '```ts\nconst value = 1\n```',
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

    const pre = wrapper.find('#article-content pre')
    expect(pre.classes()).toContain('bg-[var(--color-fg-default)]')
    const source = readFileSync(resolve(__dirname, '../ArticleDetail.vue'), 'utf8')
    expect(source).toContain('background-color: var(--color-fg-default)')
    expect(source).not.toContain('background-color: #1f2937')
    expect(source).not.toContain('#3b82f6')
    expect(source).not.toContain('#2563eb')
    expect(source).not.toContain('#e5e7eb')
    expect(source).not.toContain('#f9fafb')
  })

  it('should reload when route article id changes', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { id: '1', title: 'First', content: 'First body', publishedAt: '2026-05-11T00:00:00Z' } })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { id: '2', title: 'Second', content: 'Second body', publishedAt: '2026-05-12T00:00:00Z' } })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] })
      } as Response)

    router.push('/articles/1')
    await router.isReady()

    const wrapper = mount(ArticleDetail, {
      global: { plugins: [router] }
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('First')

    await router.push('/articles/2')
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    expect(fetch).toHaveBeenCalledWith('/api/v1/articles/2')
    expect(wrapper.text()).toContain('Second')
  })

  it('should show error state for non-ok article responses', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({})
    } as Response)

    const wrapper = mount(ArticleDetail, {
      global: { plugins: [router] }
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-ui-state="error"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('文章未找到')
  })

  it('should use the editorial reading surface contract', async () => {
    const mockArticle = {
      id: '1',
      title: 'Reading Contract',
      content: '# Heading\n\nBody text',
      publishedAt: '2026-05-11T00:00:00Z',
      tags: [{ id: '1', name: 'Design' }]
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

    const article = wrapper.find('[data-ui="article-detail"]')
    expect(article.exists()).toBe(true)
    expect(article.classes()).toContain('bg-[var(--color-bg-surface)]')
    expect(article.classes()).toContain('border-[var(--color-border-default)]')

    const body = wrapper.find('#article-content')
    expect(body.classes()).toContain('ui-reading')
    expect(body.classes()).toContain('text-[18px]')
    expect(body.classes()).toContain('leading-[1.8]')

    const tag = wrapper.find('[data-ui="article-tag"]')
    expect(tag.classes()).toContain('bg-[var(--color-bg-accent-subtle)]')
    expect(tag.classes()).toContain('text-[var(--color-primary-text)]')
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
