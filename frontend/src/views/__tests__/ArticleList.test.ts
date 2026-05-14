import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import ArticleList from '../ArticleList.vue'

vi.mock('@/components/layout/Header.vue', () => ({
  default: { name: 'Header', template: '<header data-test="header" />' }
}))

vi.mock('@/components/layout/Footer.vue', () => ({
  default: { name: 'Footer', template: '<footer data-test="footer" />' }
}))

vi.mock('@/components/ArticlePreview.vue', () => ({
  default: {
    name: 'ArticlePreview',
    props: ['article'],
    emits: ['click'],
    template: '<article data-test="article-preview" @click="$emit(\'click\', article)">{{ article.title }}</article>'
  }
}))

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/articles', component: ArticleList },
    { path: '/articles/:id', component: { template: '<div>detail</div>' } },
    { path: '/categories', component: { template: '<div>categories</div>' } }
  ]
})

describe('ArticleList.vue', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('shows loading state initially', () => {
    vi.mocked(fetch).mockImplementation(() => new Promise(() => {}))

    const wrapper = mount(ArticleList, {
      global: { plugins: [router] }
    })

    expect(wrapper.find('[data-ui-state="loading"]').exists()).toBe(true)
  })

  it('renders empty state with discovery action', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] })
    } as Response)

    const wrapper = mount(ArticleList, {
      global: { plugins: [router] }
    })

    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-ui-state="empty"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('浏览分类')
  })

  it('renders error state for non-ok response', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({})
    } as Response)

    const wrapper = mount(ArticleList, {
      global: { plugins: [router] }
    })

    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-ui-state="error"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('文章列表暂时无法加载')
    expect(wrapper.text()).toContain('重新加载')
  })

  it('retries loading articles from the error state', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({})
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ id: 2, title: 'Recovered article', excerpt: 'Recovered', publishedAt: '2026-05-13' }]
        })
      } as Response)

    const wrapper = mount(ArticleList, {
      global: { plugins: [router] }
    })

    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-ui-state="error"]').exists()).toBe(true)

    await wrapper.find('[data-ui-state="error"] button').trigger('click')
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    expect(fetch).toHaveBeenCalledTimes(2)
    expect(wrapper.find('[data-ui-state="error"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Recovered article')
  })

  it('navigates when an article preview is clicked', async () => {
    const push = vi.spyOn(router, 'push')
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [{ id: 1, title: 'Article one', excerpt: 'Excerpt', publishedAt: '2026-05-13' }]
      })
    } as Response)

    const wrapper = mount(ArticleList, {
      global: { plugins: [router] }
    })

    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()
    await wrapper.find('[data-test="article-preview"]').trigger('click')

    expect(push).toHaveBeenCalledWith('/articles/1')
  })
})
