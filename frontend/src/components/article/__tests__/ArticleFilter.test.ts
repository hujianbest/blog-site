import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ArticleFilter from '../ArticleFilter.vue'

describe('ArticleFilter.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('TC-AF-001: should render search input', () => {
    const wrapper = mount(ArticleFilter)

    const searchInput = wrapper.find('[data-testid="search-input"]')
    expect(searchInput.exists()).toBe(true)
    expect(searchInput.attributes('placeholder')).toBe('搜索文章...')
  })

  it('TC-AF-002: should render status filter dropdown (all, published, draft)', () => {
    const wrapper = mount(ArticleFilter)

    const filterSelect = wrapper.find('[data-testid="status-filter"]')
    expect(filterSelect.exists()).toBe(true)
  })

  it('TC-AF-003: should render new article button', () => {
    const wrapper = mount(ArticleFilter)

    const createButton = wrapper.find('[data-testid="create-button"]')
    expect(createButton.exists()).toBe(true)
    expect(createButton.text()).toContain('新建文章')
  })

  it('TC-AF-004: should emit search event after debounce delay', async () => {
    const wrapper = mount(ArticleFilter)

    const searchInput = wrapper.find('[data-testid="search-input"]')
    await searchInput.setValue('test search')

    // Fast-forward 500ms (debounce delay)
    await vi.advanceTimersByTimeAsync(500)

    expect(wrapper.emitted('search')).toBeTruthy()
    expect(wrapper.emitted('search')![0]).toEqual(['test search'])
  })

  it('TC-AF-005: should emit filter event when status is selected', async () => {
    const wrapper = mount(ArticleFilter)

    const filterSelect = wrapper.find('[data-testid="status-filter"]')
    await filterSelect.setValue('PUBLISHED')

    expect(wrapper.emitted('filter')).toBeTruthy()
    expect(wrapper.emitted('filter')![0]).toEqual(['PUBLISHED'])
  })

  it('TC-AF-006: should emit create event when new article button is clicked', async () => {
    const wrapper = mount(ArticleFilter)

    const createButton = wrapper.find('[data-testid="create-button"]')
    await createButton.trigger('click')

    expect(wrapper.emitted('create')).toBeTruthy()
  })
})
