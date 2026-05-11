import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ArticleCard from '../ArticleCard.vue'

describe('ArticleCard.vue', () => {
  const mockArticle = {
    id: '1',
    title: 'Test Article',
    content: 'This is a test article content',
    status: 'DRAFT',
    createdAt: '2026-05-11T00:00:00Z'
  }

  it('TC-AC-001: should render article card with title, excerpt, status, and date', () => {
    const wrapper = mount(ArticleCard, {
      props: { article: mockArticle }
    })

    expect(wrapper.text()).toContain('Test Article')
    expect(wrapper.text()).toContain('This is a test article content')
    expect(wrapper.text()).toContain('2026-05-11')
  })

  it('TC-AC-002: should display article status badge (draft/published)', () => {
    const wrapper = mount(ArticleCard, {
      props: { article: mockArticle }
    })

    expect(wrapper.text()).toContain('草稿')
  })

  it('TC-AC-003: should display edit and delete buttons', () => {
    const wrapper = mount(ArticleCard, {
      props: { article: mockArticle }
    })

    const editButton = wrapper.find('[data-testid="edit-button"]')
    const deleteButton = wrapper.find('[data-testid="delete-button"]')

    expect(editButton.exists()).toBe(true)
    expect(deleteButton.exists()).toBe(true)
  })

  it('TC-AC-004: should emit edit event when edit button is clicked', async () => {
    const wrapper = mount(ArticleCard, {
      props: { article: mockArticle }
    })

    const editButton = wrapper.find('[data-testid="edit-button"]')
    await editButton.trigger('click')

    expect(wrapper.emitted('edit')).toBeTruthy()
    expect(wrapper.emitted('edit')![0]).toEqual([mockArticle])
  })

  it('TC-AC-005: should emit delete event when delete button is clicked', async () => {
    const wrapper = mount(ArticleCard, {
      props: { article: mockArticle }
    })

    const deleteButton = wrapper.find('[data-testid="delete-button"]')
    await deleteButton.trigger('click')

    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')![0]).toEqual([mockArticle])
  })

  it('TC-AC-006: should have hover effect on card', () => {
    const wrapper = mount(ArticleCard, {
      props: { article: mockArticle }
    })

    const card = wrapper.find('.article-card')
    expect(card.classes()).toContain('hover:shadow-lg')
  })
})
