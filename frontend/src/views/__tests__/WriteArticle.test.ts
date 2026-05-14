import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import WriteArticle from '../WriteArticle.vue'

vi.mock('@/components/layout/Header.vue', () => ({
  default: { name: 'Header', template: '<header />' }
}))

vi.mock('@/components/layout/Footer.vue', () => ({
  default: { name: 'Footer', template: '<footer />' }
}))

vi.mock('@/components/editor/MarkdownEditor.vue', () => ({
  default: {
    name: 'MarkdownEditor',
    props: ['modelValue', 'autoSave'],
    emits: ['update:modelValue', 'save'],
    template: '<textarea data-test="markdown-editor" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />'
  }
}))

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/write', component: WriteArticle },
    { path: '/articles/:id', component: { template: '<div>article</div>' } }
  ]
})

describe('WriteArticle.vue', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('renders the online writing surface', () => {
    const wrapper = mount(WriteArticle, { global: { plugins: [router] } })

    expect(wrapper.find('[data-ui="write-page"]').exists()).toBe(true)
    expect(wrapper.find('input[aria-label="文章标题"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="markdown-editor"]').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'MarkdownEditor' }).props('autoSave')).toBe(false)
  })

  it('saves a draft to local browser storage', async () => {
    const wrapper = mount(WriteArticle, { global: { plugins: [router] } })
    await wrapper.find('input[aria-label="文章标题"]').setValue('Draft title')
    await wrapper.find('[data-test="markdown-editor"]').setValue('Draft body')
    await wrapper.find('[data-action="save-draft"]').trigger('click')

    const localArticles = JSON.parse(localStorage.getItem('blog-site-local-articles') || '[]')
    expect(localArticles[0]).toMatchObject({
      title: 'Draft title',
      content: 'Draft body',
      excerpt: 'Draft body',
      status: 'DRAFT'
    })
    expect(wrapper.text()).toContain('草稿已保存到本地浏览器')
  })

  it('publishes to local browser storage', async () => {
    const wrapper = mount(WriteArticle, { global: { plugins: [router] } })
    await wrapper.find('input[aria-label="文章标题"]').setValue('Publish title')
    await wrapper.find('[data-test="markdown-editor"]').setValue('Publish body')
    await wrapper.find('[data-action="publish"]').trigger('click')

    const localArticles = JSON.parse(localStorage.getItem('blog-site-local-articles') || '[]')
    expect(localArticles[0]).toMatchObject({
      title: 'Publish title',
      content: 'Publish body',
      excerpt: 'Publish body',
      status: 'PUBLISHED'
    })
  })
})
