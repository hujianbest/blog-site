import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import Login from '../Login.vue'
import Register from '../Register.vue'

const stubs = {
  'router-link': {
    template: '<a :href="to" :class="$attrs.class"><slot /></a>',
    props: ['to']
  },
  'n-card': {
    template: '<section v-bind="$attrs"><slot /></section>'
  },
  'n-form': {
    template: '<form><slot /></form>'
  },
  'n-form-item': {
    template: '<label><slot /></label>'
  },
  'n-input': {
    template: '<input />'
  },
  'n-alert': {
    template: '<div v-bind="$attrs"><slot /></div>'
  },
  'n-button': {
    template: '<button v-bind="$attrs"><slot /></button>'
  }
}

const createTestRouter = () => createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div>home</div>' } },
    { path: '/login', component: Login },
    { path: '/register', component: Register }
  ]
})

describe('Auth pages', () => {
  let router: ReturnType<typeof createTestRouter>

  beforeEach(async () => {
    router = createTestRouter()
    router.push('/login')
    await router.isReady()
  })

  it('Login uses the auth visual contract', () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router, createPinia()],
        stubs
      }
    })

    const page = wrapper.find('[data-ui="auth-page"]')
    expect(page.exists()).toBe(true)
    expect(page.classes()).toContain('bg-[var(--color-bg-page)]')

    const card = wrapper.find('[data-ui="auth-card"]')
    expect(card.exists()).toBe(true)
    expect(card.classes()).toContain('ui-surface')

    const submit = wrapper.find('[data-ui="auth-submit"]')
    expect(submit.classes()).toContain('ui-button-primary')

    const link = wrapper.find('a[href="/register"]')
    expect(link.classes()).toContain('ui-link')
  })

  it('Register uses the auth visual contract', () => {
    const wrapper = mount(Register, {
      global: {
        plugins: [router, createPinia()],
        stubs
      }
    })

    expect(wrapper.find('[data-ui="auth-page"]').classes()).toContain('bg-[var(--color-bg-page)]')
    expect(wrapper.find('[data-ui="auth-card"]').classes()).toContain('ui-surface')
    expect(wrapper.find('[data-ui="auth-submit"]').classes()).toContain('ui-button-primary')
    expect(wrapper.find('a[href="/login"]').classes()).toContain('ui-link')
  })

  it('renders tokenized auth error state', async () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router, createPinia()],
        stubs
      }
    })

    wrapper.vm.errorMessage = '登录失败'
    await wrapper.vm.$nextTick()

    const error = wrapper.find('[data-ui-state="error"]')
    expect(error.exists()).toBe(true)
    expect(error.classes()).toContain('border-[var(--color-danger)]')
  })
})
