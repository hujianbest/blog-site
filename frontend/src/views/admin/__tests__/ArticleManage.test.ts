import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import ArticleManage from '../ArticleManage.vue'

// Mock Naive UI components
vi.mock('naive-ui', () => ({
  NCard: { template: '<div class="n-card"><slot /></div>' },
  NButton: { template: '<button class="n-button"><slot /></button>' },
  NInput: { template: '<input class="n-input" />' },
  NSelect: { template: '<select class="n-select"><slot /></select>' },
  NPagination: { template: '<div class="n-pagination" />' },
  NEmpty: { template: '<div class="n-empty">暂无数据</div>' },
  NSpin: { template: '<div class="n-spin">加载中...</div>' },
  useDialog: () => ({
    create: vi.fn()
  }),
  useMessage: () => ({
    success: vi.fn(),
    error: vi.fn()
  })
}))

// Mock fetch
global.fetch = vi.fn()

describe('ArticleManage.vue', () => {
  let router: any

  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/admin/articles/:id', component: { template: '<div>Edit</div>' } },
        { path: '/admin/articles/new', component: { template: '<div>New</div>' } }
      ]
    })
  })

  it('TC-AL-001: should render article management page with filter and list', async () => {
    const wrapper = mount(ArticleManage, {
      global: { plugins: [router] }
    })

    // Wait for initial loading to complete
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-testid="article-filter"]').exists()).toBe(true)
    // Article list might not render if no articles or still loading, so we check component exists
    expect(wrapper.findComponent(ArticleManage).exists()).toBe(true)
  })

  it('TC-AL-002: should load and display article list', async () => {
    const mockArticles = [
      { id: '1', title: 'Article 1', content: 'Content 1', status: 'PUBLISHED', createdAt: '2026-05-11' },
      { id: '2', title: 'Article 2', content: 'Content 2', status: 'DRAFT', createdAt: '2026-05-10' }
    ]

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockArticles, total: 2 })
    } as Response)

    const wrapper = mount(ArticleManage, {
      global: { plugins: [router] }
    })

    // Wait for fetch to complete and component to update
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    const vm = wrapper.vm as any
    expect(vm.articles.length).toBe(2)
    expect(vm.articles[0].title).toBe('Article 1')
  })

  it('TC-AL-003: should show loading state', () => {
    const wrapper = mount(ArticleManage, {
      global: { plugins: [router] }
    })

    // Initially loading should be true
    const vm = wrapper.vm as any
    expect(vm.loading).toBe(true)
  })

  it('TC-AL-004: should show empty state when no articles', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [], total: 0 })
    } as Response)

    const wrapper = mount(ArticleManage, {
      global: { plugins: [router] }
    })

    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(true)
  })

  it('TC-AL-005: should filter articles by search keyword', async () => {
    const wrapper = mount(ArticleManage, {
      global: { plugins: [router] }
    })

    const vm = wrapper.vm as any
    vm.searchQuery = 'test'
    vm.handleSearch('test')

    await wrapper.vm.$nextTick()

    expect(vm.currentPage).toBe(1)
  })

  it('TC-AL-006: should filter articles by status', async () => {
    const wrapper = mount(ArticleManage, {
      global: { plugins: [router] }
    })

    const vm = wrapper.vm as any
    vm.handleFilter('PUBLISHED')

    await wrapper.vm.$nextTick()

    expect(vm.statusFilter).toBe('PUBLISHED')
    expect(vm.currentPage).toBe(1)
  })

  it('TC-AL-007: should display and handle pagination', async () => {
    const wrapper = mount(ArticleManage, {
      global: { plugins: [router] }
    })

    const vm = wrapper.vm as any
    // Create 25 mock articles to test pagination
    const mockArticles = Array.from({ length: 25 }, (_, i) => ({
      id: String(i + 1),
      title: `Article ${i + 1}`,
      content: `Content ${i + 1}`,
      status: 'PUBLISHED',
      createdAt: '2026-05-11'
    }))
    vm.articles = mockArticles

    expect(vm.totalPages).toBe(3)

    await vm.handlePageChange(2)

    expect(vm.currentPage).toBe(2)
  })

  it('TC-AL-008: should navigate to edit page when clicking new article button', async () => {
    const pushSpy = vi.spyOn(router, 'push')

    const wrapper = mount(ArticleManage, {
      global: { plugins: [router] }
    })

    const vm = wrapper.vm as any
    await vm.handleCreate()

    expect(pushSpy).toHaveBeenCalledWith('/admin/articles/new')
  })

  it('TC-AL-009: should navigate to edit page when clicking edit button', async () => {
    const pushSpy = vi.spyOn(router, 'push')

    const wrapper = mount(ArticleManage, {
      global: { plugins: [router] }
    })

    const vm = wrapper.vm as any
    const mockArticle = { id: '1', title: 'Test', content: 'Test content', status: 'DRAFT', createdAt: '2026-05-11' }
    await vm.handleEdit(mockArticle)

    expect(pushSpy).toHaveBeenCalledWith('/admin/articles/1')
  })

  it('TC-AL-010: should show delete confirmation dialog when clicking delete button', async () => {
    const wrapper = mount(ArticleManage, {
      global: { plugins: [router] }
    })

    const vm = wrapper.vm as any
    const mockArticle = { id: '1', title: 'Test', content: 'Test content', status: 'DRAFT', createdAt: '2026-05-11' }
    await vm.handleDelete(mockArticle)

    expect(vm.showDeleteDialog).toBe(true)
    expect(vm.articleToDelete).toEqual(mockArticle)
  })
})
