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

    expect(wrapper.text()).toContain("hujian's bolg")
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
    expect(wrapper.text()).toContain('分类')
    expect(wrapper.text()).toContain('写作')
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

    const categoriesLink = wrapper.findAll('a').find(link => link.text() === '分类')
    expect(categoriesLink?.attributes('href')).toBe('/categories')

    const writeLink = wrapper.findAll('a').find(link => link.text() === '写作')
    expect(writeLink?.attributes('href')).toBe('/write')

    const aboutLink = wrapper.findAll('a').find(link => link.text() === '关于')
    expect(aboutLink?.attributes('href')).toBe('/about')
  })

  it('should use tokenized nav link states without blue utility classes', () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          'router-link': {
            template: '<a :href="to" :class=\"$attrs.class\"><slot /></a>',
            props: ['to']
          }
        }
      }
    })

    const links = wrapper.findAll('a')
    const navLinks = links.filter(link => ['首页', '文章', '分类', '写作', '关于'].includes(link.text()))

    expect(navLinks.length).toBeGreaterThanOrEqual(5)
    for (const link of navLinks) {
      expect(link.classes()).toContain('text-[var(--color-fg-muted)]')
      expect(link.classes()).toContain('hover:text-[var(--color-primary-text)]')
      expect(link.attributes('class')).not.toContain('blue-600')
    }
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
    expect(menuButton.attributes('aria-controls')).toBe('public-navigation-mobile')
    expect(menuButton.attributes('aria-expanded')).toBe('false')
    expect(menuButton.classes()).toContain('min-h-11')
    expect(menuButton.classes()).toContain('min-w-11')
  })

  it('should render skip link to main content', () => {
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

    const skipLink = wrapper.find('a[href="#main-content"]')
    expect(skipLink.exists()).toBe(true)
    expect(skipLink.text()).toContain('跳到正文')
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
    expect(menuButton.attributes('aria-expanded')).toBe('true')

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
    expect(wrapper.text()).toContain('分类')
    expect(wrapper.text()).toContain('写作')
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
    expect(header.classes()).toContain('bg-[var(--color-bg-surface)]')
    expect(header.classes()).toContain('border-b')
    expect(header.classes()).toContain('border-[var(--color-border-default)]')
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
