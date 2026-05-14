import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import CategoryDetail from '../CategoryDetail.vue'

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

const createTestRouter = () => createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/categories/:id', component: CategoryDetail },
    { path: '/articles/:id', component: { template: '<div>article</div>' } }
  ]
})

describe('CategoryDetail.vue', () => {
  let router: ReturnType<typeof createTestRouter>

  beforeEach(() => {
    router = createTestRouter()
    global.fetch = vi.fn()
  })

  it('renders category articles with tokenized article previews', async () => {
    router.push('/categories/1')
    await router.isReady()
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { id: 1, name: 'Technology' } })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [{ id: 2, title: 'Article in category' }] })
      } as Response)

    const wrapper = mount(CategoryDetail, { global: { plugins: [router] } })
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Technology')
    expect(wrapper.text()).toContain('Article in category')
    expect(wrapper.find('[data-test="article-preview"]').exists()).toBe(true)
  })

  it('retries from error state', async () => {
    router.push('/categories/1')
    await router.isReady()
    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [] }) } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: { id: 1, name: 'Technology' } }) } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [] }) } as Response)

    const wrapper = mount(CategoryDetail, { global: { plugins: [router] } })
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-ui-state="error"]').exists()).toBe(true)

    await wrapper.find('[data-ui-state="error"] button').trigger('click')
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    expect(fetch).toHaveBeenCalledTimes(4)
    expect(wrapper.find('[data-ui-state="error"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('该分类下暂无文章')
    expect(wrapper.text()).toContain('返回分类归档')
  })

  it('navigates article previews and reloads when category id changes', async () => {
    router.push('/categories/1')
    await router.isReady()
    const push = vi.spyOn(router, 'push')
    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: { id: 1, name: 'One' } }) } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [{ id: 7, title: 'First category article' }] }) } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: { id: 2, name: 'Two' } }) } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [] }) } as Response)

    const wrapper = mount(CategoryDetail, { global: { plugins: [router] } })
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    await wrapper.find('[data-test="article-preview"]').trigger('click')
    expect(push).toHaveBeenCalledWith('/articles/7')

    await router.push('/categories/2')
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    expect(fetch).toHaveBeenCalledWith('/api/v1/categories/2')
    expect(wrapper.text()).toContain('Two')
  })
})
