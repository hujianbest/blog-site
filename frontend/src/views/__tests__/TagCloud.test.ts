import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TagCloud from '../TagCloud.vue'

// Mock child components
vi.mock('@/components/layout/Header.vue', () => ({
  default: { name: 'Header', template: '<header data-test="header" />' }
}))
vi.mock('@/components/layout/Footer.vue', () => ({
  default: { name: 'Footer', template: '<footer data-test="footer" />' }
}))
vi.mock('@/components/TagBadge.vue', () => ({
  default: {
    name: 'TagBadge',
    props: ['tag', 'size'],
    template: '<span class="tag-badge" :data-size="size">{{ tag.name }} ({{ tag.articleCount }})</span>'
  }
}))

describe('TagCloud.vue', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('should render page title', () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] })
    } as Response)

    const wrapper = mount(TagCloud)

    expect(wrapper.text()).toContain('标签云')
  })

  it('should show loading state initially', () => {
    vi.mocked(fetch).mockImplementation(() => new Promise(() => {}))

    const wrapper = mount(TagCloud)

    expect(wrapper.vm.loading).toBe(true)
    expect(wrapper.find('.animate-spin').exists()).toBe(true)
  })

  it('should load tags on mount', async () => {
    const mockTags = [
      { id: '1', name: 'Vue', articleCount: 15 },
      { id: '2', name: 'React', articleCount: 8 },
      { id: '3', name: 'TypeScript', articleCount: 3 }
    ]

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockTags })
    } as Response)

    const wrapper = mount(TagCloud)

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    expect(fetch).toHaveBeenCalledWith('/api/v1/tags')
    expect(wrapper.vm.tags).toEqual(mockTags)
  })

  it('should show empty state when no tags', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] })
    } as Response)

    const wrapper = mount(TagCloud)

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('暂无标签')
  })

  it('should sort tags by article count', async () => {
    const mockTags = [
      { id: '1', name: 'A', articleCount: 5 },
      { id: '2', name: 'B', articleCount: 15 },
      { id: '3', name: 'C', articleCount: 10 }
    ]

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockTags })
    } as Response)

    const wrapper = mount(TagCloud)

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    const sorted = wrapper.vm.sortedTags
    expect(sorted[0].name).toBe('B') // 15 articles
    expect(sorted[1].name).toBe('C') // 10 articles
    expect(sorted[2].name).toBe('A') // 5 articles
  })

  it('should determine tag sizes correctly', async () => {
    const mockTags = [
      { id: '1', name: 'Large', articleCount: 10 },
      { id: '2', name: 'Medium', articleCount: 5 },
      { id: '3', name: 'Small', articleCount: 2 }
    ]

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockTags })
    } as Response)

    const wrapper = mount(TagCloud)

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.getTagSize(10)).toBe('large')
    expect(wrapper.vm.getTagSize(5)).toBe('medium')
    expect(wrapper.vm.getTagSize(2)).toBe('small')
  })

  it('should render TagBadge components', async () => {
    const mockTags = [
      { id: '1', name: 'Vue', articleCount: 15 }
    ]

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockTags })
    } as Response)

    const wrapper = mount(TagCloud)

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Vue')
    expect(wrapper.text()).toContain('15')
  })
})
