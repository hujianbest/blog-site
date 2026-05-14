import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ArticlePreview from '../ArticlePreview.vue'

describe('ArticlePreview.vue', () => {
  const mockArticle = {
    id: '1',
    title: 'Test Article',
    content: '# This is a test article\n\nWith some **content** and *formatting*.',
    publishedAt: '2026-05-11T00:00:00Z',
    category: { id: 'cat1', name: 'Technology' },
    tags: [
      { id: 'tag1', name: 'Vue' },
      { id: 'tag2', name: 'TypeScript' },
      { id: 'tag3', name: 'Testing' }
    ]
  }

  it('should render article title', () => {
    const wrapper = mount(ArticlePreview, {
      props: { article: mockArticle }
    })

    expect(wrapper.text()).toContain('Test Article')
  })

  it('should render article excerpt without markdown', () => {
    const wrapper = mount(ArticlePreview, {
      props: { article: mockArticle }
    })

    const excerpt = wrapper.find('[data-ui="article-excerpt"]')
    expect(excerpt.text()).not.toContain('#')
    expect(excerpt.text()).not.toContain('**')
    expect(excerpt.text()).toContain('This is a test article')
  })

  it('should render excerpt-only article data without crashing', () => {
    const wrapper = mount(ArticlePreview, {
      props: {
        article: {
          id: 'fallback-1',
          title: 'Fallback Article',
          excerpt: 'Fallback excerpt from article list response',
          createdAt: '2026-05-10T00:00:00Z'
        }
      }
    })

    expect(wrapper.text()).toContain('Fallback Article')
    expect(wrapper.text()).toContain('Fallback excerpt from article list response')
    expect(wrapper.text()).toContain('2026')
  })

  it('should normalize escaped newline content from API fixtures', () => {
    const wrapper = mount(ArticlePreview, {
      props: {
        article: {
          ...mockArticle,
          content: 'First line\\n\\nSecond line'
        }
      }
    })

    const excerpt = wrapper.find('[data-ui="article-excerpt"]')
    expect(excerpt.text()).toContain('First line')
    expect(excerpt.text()).toContain('Second line')
    expect(excerpt.text()).not.toContain('\\n')
  })

  it('should truncate long content to 150 characters', () => {
    const longContent = '# Test\n\n'.repeat(50)
    const wrapper = mount(ArticlePreview, {
      props: {
        article: {
          ...mockArticle,
          content: longContent
        }
      }
    })

    const excerpt = wrapper.find('[data-ui="article-excerpt"]')
    expect(excerpt.text().length).toBe(153) // 150 + '...'
    expect(excerpt.text()).toContain('...')
  })

  it('should render cover image when provided', () => {
    const wrapper = mount(ArticlePreview, {
      props: {
        article: {
          ...mockArticle,
          coverImage: 'https://example.com/image.jpg'
        }
      }
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/image.jpg')
    expect(img.attributes('alt')).toBe('Test Article')
  })

  it('should not render cover image when not provided', () => {
    const wrapper = mount(ArticlePreview, {
      props: { article: mockArticle }
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(false)
  })

  it('should format date correctly', () => {
    const wrapper = mount(ArticlePreview, {
      props: { article: mockArticle }
    })

    expect(wrapper.text()).toContain('2026')
    expect(wrapper.text()).toContain('05')
    expect(wrapper.text()).toContain('11')
  })

  it('should render category when provided', () => {
    const wrapper = mount(ArticlePreview, {
      props: { article: mockArticle }
    })

    expect(wrapper.text()).toContain('Technology')
  })

  it('should not render category when not provided', () => {
    const wrapper = mount(ArticlePreview, {
      props: {
        article: {
          ...mockArticle,
          category: undefined
        }
      }
    })

    // Should still have date but not category
    const text = wrapper.text()
    expect(text).toContain('2026')
    expect(text).not.toContain('Technology')
  })

  it('should render up to 3 tags', () => {
    const wrapper = mount(ArticlePreview, {
      props: { article: mockArticle }
    })

    expect(wrapper.text()).toContain('#Vue')
    expect(wrapper.text()).toContain('#TypeScript')
    expect(wrapper.text()).toContain('#Testing')
  })

  it('should limit to first 3 tags when more are provided', () => {
    const wrapper = mount(ArticlePreview, {
      props: {
        article: {
          ...mockArticle,
          tags: [
            { id: 'tag1', name: 'Vue' },
            { id: 'tag2', name: 'TypeScript' },
            { id: 'tag3', name: 'Testing' },
            { id: 'tag4', name: 'JavaScript' },
            { id: 'tag5', name: 'CSS' }
          ]
        }
      }
    })

    expect(wrapper.text()).toContain('#Vue')
    expect(wrapper.text()).toContain('#TypeScript')
    expect(wrapper.text()).toContain('#Testing')
    expect(wrapper.text()).not.toContain('#JavaScript')
    expect(wrapper.text()).not.toContain('#CSS')
  })

  it('should emit click event with article data when clicked', async () => {
    const wrapper = mount(ArticlePreview, {
      props: { article: mockArticle }
    })

    const article = wrapper.find('article')
    await article.trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')?.[0]).toEqual([mockArticle])
  })

  it('should be keyboard accessible', async () => {
    const wrapper = mount(ArticlePreview, {
      props: { article: mockArticle }
    })

    const article = wrapper.find('article')
    expect(article.attributes('role')).toBe('link')
    expect(article.attributes('tabindex')).toBe('0')

    await article.trigger('keydown.enter')
    await article.trigger('keydown.space')

    expect(wrapper.emitted('click')?.length).toBe(2)
  })

  it('should not render tags when empty array provided', () => {
    const wrapper = mount(ArticlePreview, {
      props: {
        article: {
          ...mockArticle,
          tags: []
        }
      }
    })

    expect(wrapper.text()).not.toContain('#')
  })

  it('should have correct CSS classes for styling', () => {
    const wrapper = mount(ArticlePreview, {
      props: { article: mockArticle }
    })

    const article = wrapper.find('article')
    expect(article.classes()).toContain('bg-[var(--color-bg-surface)]')
    expect(article.classes()).toContain('border')
    expect(article.classes()).toContain('border-[var(--color-border-default)]')
    expect(article.classes()).toContain('rounded-[var(--radius-lg)]')
    expect(article.classes()).not.toContain('bg-white')
    expect(article.classes()).not.toContain('shadow')
  })

  it('should use tokenized title, metadata, and tag styles', () => {
    const wrapper = mount(ArticlePreview, {
      props: { article: mockArticle }
    })

    const title = wrapper.find('[data-ui="article-title"]')
    expect(title.classes()).toContain('text-[var(--color-fg-default)]')
    expect(title.classes()).toContain('hover:text-[var(--color-primary-text)]')
    expect(title.attributes('class')).not.toContain('blue-600')

    const meta = wrapper.find('[data-ui="article-meta"]')
    expect(meta.classes()).toContain('text-[var(--color-fg-muted)]')

    const tag = wrapper.find('[data-ui="article-tag"]')
    expect(tag.classes()).toContain('bg-[var(--color-bg-accent-subtle)]')
    expect(tag.classes()).toContain('text-[var(--color-primary-text)]')
    expect(tag.attributes('class')).not.toContain('bg-gray-100')
  })
})
