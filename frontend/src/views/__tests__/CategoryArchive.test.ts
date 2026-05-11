import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CategoryArchive from '../CategoryArchive.vue'

// Mock child components
vi.mock('@/components/layout/Header.vue', () => ({
  default: { name: 'Header', template: '<header data-test="header" />' }
}))
vi.mock('@/components/layout/Footer.vue', () => ({
  default: { name: 'Footer', template: '<footer data-test="footer" />' }
}))

describe('CategoryArchive.vue', () => {
  const stubs = {
    'router-link': {
      template: '<a :href="to"><slot /></a>',
      props: ['to']
    }
  }

  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('should render page title', () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] })
    } as Response)

    const wrapper = mount(CategoryArchive, { global: { stubs } })

    expect(wrapper.text()).toContain('分类归档')
  })

  it('should show loading state initially', () => {
    vi.mocked(fetch).mockImplementation(() => new Promise(() => {}))

    const wrapper = mount(CategoryArchive, { global: { stubs } })

    expect(wrapper.vm.loading).toBe(true)
    expect(wrapper.find('.animate-spin').exists()).toBe(true)
  })

  it('should load categories on mount', async () => {
    const mockCategories = [
      { id: '1', name: 'Tech', articleCount: 10, parentId: null },
      { id: '2', name: 'Life', articleCount: 5, parentId: null }
    ]

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockCategories })
    } as Response)

    const wrapper = mount(CategoryArchive, { global: { stubs } })

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    expect(fetch).toHaveBeenCalledWith('/api/v1/categories')
    expect(wrapper.vm.categories).toEqual(mockCategories)
  })

  it('should show empty state when no categories', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] })
    } as Response)

    const wrapper = mount(CategoryArchive, { global: { stubs } })

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('暂无分类')
  })

  it('should build category tree correctly', async () => {
    const mockCategories = [
      { id: '1', name: 'Tech', articleCount: 10, parentId: null },
      { id: '2', name: 'Vue', articleCount: 5, parentId: '1' },
      { id: '3', name: 'Life', articleCount: 3, parentId: null }
    ]

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockCategories })
    } as Response)

    const wrapper = mount(CategoryArchive, { global: { stubs } })

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    const tree = wrapper.vm.categoryTree
    expect(tree.length).toBe(2) // 2 root categories

    const techCategory = tree.find(c => c.name === 'Tech')
    expect(techCategory.children.length).toBe(1)
    expect(techCategory.children[0].name).toBe('Vue')

    const lifeCategory = tree.find(c => c.name === 'Life')
    expect(lifeCategory.children.length).toBe(0)
  })

  it('should render categories with article counts', async () => {
    const mockCategories = [
      { id: '1', name: 'Tech', articleCount: 10, parentId: null }
    ]

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockCategories })
    } as Response)

    const wrapper = mount(CategoryArchive, { global: { stubs } })

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Tech')
    expect(wrapper.text()).toContain('10 篇文章')
  })

  it('should render subcategories', async () => {
    const mockCategories = [
      { id: '1', name: 'Tech', articleCount: 10, parentId: null },
      { id: '2', name: 'Vue', articleCount: 5, parentId: '1' }
    ]

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockCategories })
    } as Response)

    const wrapper = mount(CategoryArchive, { global: { stubs } })

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Tech')
    expect(wrapper.text()).toContain('Vue')
  })
})
