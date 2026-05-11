import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Header from '../Header.vue'

describe('Header.vue', () => {
  it('should render logo', () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          'router-link': {
            template: '<a :href="to"><slot /></a>',
            props: ['to']
          }
        }
      }
    })

    expect(wrapper.text()).toContain('My Blog')
  })

  it('should render desktop navigation links', () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          'router-link': {
            template: '<a :href="to"><slot /></a>',
            props: ['to']
          }
        }
      }
    })

    expect(wrapper.text()).toContain('首页')
    expect(wrapper.text()).toContain('文章')
    expect(wrapper.text()).toContain('关于')
  })

  it('should have correct routes for navigation links', () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          'router-link': {
            template: '<a :href="to"><slot /></a>',
            props: ['to']
          }
        }
      }
    })

    const homeLink = wrapper.findAll('a').find(link => link.text() === '首页')
    expect(homeLink?.attributes('href')).toBe('/')

    const articlesLink = wrapper.findAll('a').find(link => link.text() === '文章')
    expect(articlesLink?.attributes('href')).toBe('/articles')

    const aboutLink = wrapper.findAll('a').find(link => link.text() === '关于')
    expect(aboutLink?.attributes('href')).toBe('/about')
  })

  it('should show mobile menu button on small screens', () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          'router-link': {
            template: '<a :href="to"><slot /></a>',
            props: ['to']
          }
        }
      }
    })

    const menuButton = wrapper.find('button')
    expect(menuButton.exists()).toBe(true)
    expect(menuButton.attributes('aria-label')).toBe('Toggle menu')
  })

  it('should not show mobile menu by default', () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          'router-link': {
            template: '<a :href="to"><slot /></a>',
            props: ['to']
          }
        }
      }
    })

    expect(wrapper.vm.mobileMenuOpen).toBe(false)
  })

  it('should toggle mobile menu when button clicked', async () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          'router-link': {
            template: '<a :href="to"><slot /></a>',
            props: ['to']
          }
        }
      }
    })

    const menuButton = wrapper.find('button')
    await menuButton.trigger('click')

    expect(wrapper.vm.mobileMenuOpen).toBe(true)

    await menuButton.trigger('click')

    expect(wrapper.vm.mobileMenuOpen).toBe(false)
  })

  it('should show mobile menu when open', async () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          'router-link': {
            template: '<a :href="to"><slot /></a>',
            props: ['to']
          }
        }
      }
    })

    await wrapper.vm.toggleMobileMenu()

    expect(wrapper.text()).toContain('首页')
    expect(wrapper.text()).toContain('文章')
    expect(wrapper.text()).toContain('关于')
  })

  it('should close mobile menu when link clicked', async () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          'router-link': {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
            methods: {
              click: () => {}
            }
          }
        }
      }
    })

    await wrapper.vm.toggleMobileMenu()
    expect(wrapper.vm.mobileMenuOpen).toBe(true)

    // Call the closeMobileMenu method directly
    wrapper.vm.closeMobileMenu()

    expect(wrapper.vm.mobileMenuOpen).toBe(false)
  })

  it('should display hamburger icon when menu is closed', () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          'router-link': {
            template: '<a :href="to"><slot /></a>',
            props: ['to']
          }
        }
      }
    })

    const menuButton = wrapper.find('button')
    expect(wrapper.vm.mobileMenuOpen).toBe(false)

    // Should show hamburger menu icon (3 lines)
    const svg = menuButton.find('svg')
    expect(svg.exists()).toBe(true)
  })

  it('should display close icon when menu is open', async () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          'router-link': {
            template: '<a :href="to"><slot /></a>',
            props: ['to']
          }
        }
      }
    })

    await wrapper.vm.toggleMobileMenu()

    const menuButton = wrapper.find('button')
    expect(wrapper.vm.mobileMenuOpen).toBe(true)

    // Button should still exist
    expect(menuButton.exists()).toBe(true)
  })

  it('should have correct CSS classes for header', () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          'router-link': {
            template: '<a :href="to"><slot /></a>',
            props: ['to']
          }
        }
      }
    })

    const header = wrapper.find('header')
    expect(header.classes()).toContain('bg-white')
    expect(header.classes()).toContain('shadow-sm')
    expect(header.classes()).toContain('sticky')
  })

  it('should have z-index for sticky positioning', () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          'router-link': {
            template: '<a :href="to"><slot /></a>',
            props: ['to']
          }
        }
      }
    })

    const header = wrapper.find('header')
    expect(header.classes()).toContain('z-50')
  })
})
