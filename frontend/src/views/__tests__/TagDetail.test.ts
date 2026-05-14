import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import TagDetail from '../TagDetail.vue'

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
    { path: '/tags/:name', component: TagDetail },
    { path: '/articles/:id', component: { template: '<div>article</div>' } }
  ]
})

describe('TagDetail.vue', () => {
  let router: ReturnType<typeof createTestRouter>

  beforeEach(() => {
    router = createTestRouter()
    global.fetch = vi.fn()
  })

  it('renders tag articles and navigates on article click', async () => {
    router.push('/tags/Vue')
    await router.isReady()
    const push = vi.spyOn(router, 'push')
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [{ id: 5, title: 'Vue article' }] })
    } as Response)

    const wrapper = mount(TagDetail, { global: { plugins: [router] } })
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Vue article')
    await wrapper.find('[data-test="article-preview"]').trigger('click')
    expect(push).toHaveBeenCalledWith('/articles/5')
  })

  it('retries from error state', async () => {
    router.push('/tags/Vue')
    await router.isReady()
    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [] }) } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [] }) } as Response)

    const wrapper = mount(TagDetail, { global: { plugins: [router] } })
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-ui-state="error"]').exists()).toBe(true)

    await wrapper.find('[data-ui-state="error"] button').trigger('click')
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    expect(fetch).toHaveBeenCalled()
    expect(wrapper.find('[data-ui-state="error"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('该标签下暂无文章')
    expect(wrapper.text()).toContain('浏览分类')
  })

  it('reloads when tag route changes', async () => {
    router.push('/tags/Vue')
    await router.isReady()
    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [{ id: 1, title: 'Vue one' }] }) } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [{ id: 2, title: 'React one' }] }) } as Response)

    const wrapper = mount(TagDetail, { global: { plugins: [router] } })
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Vue one')

    await router.push('/tags/React')
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    expect(fetch).toHaveBeenCalledWith('/api/v1/tags/React/articles')
    expect(wrapper.text()).toContain('React one')
  })
})
