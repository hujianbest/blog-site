import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AutoSaveIndicator from '../AutoSaveIndicator.vue'

describe('AutoSaveIndicator.vue', () => {
  it('TC-ASI-001: should render save status indicator', () => {
    const wrapper = mount(AutoSaveIndicator, {
      props: {
        status: 'idle',
        lastSavedTime: null
      }
    })

    expect(wrapper.find('[data-testid="auto-save-indicator"]').exists()).toBe(true)
  })

  it('TC-ASI-002: should display last saved time', () => {
    const lastSaved = new Date('2026-05-11T10:30:00')
    const wrapper = mount(AutoSaveIndicator, {
      props: {
        status: 'saved',
        lastSavedTime: lastSaved
      }
    })

    expect(wrapper.text()).toContain('最后保存')
  })

  it('TC-ASI-003: should display saving status', () => {
    const wrapper = mount(AutoSaveIndicator, {
      props: {
        status: 'saving',
        lastSavedTime: null
      }
    })

    expect(wrapper.text()).toContain('保存中...')
  })

  it('TC-ASI-004: should display saved success status', () => {
    const wrapper = mount(AutoSaveIndicator, {
      props: {
        status: 'saved',
        lastSavedTime: new Date()
      }
    })

    expect(wrapper.find('.save-success').exists()).toBe(true)
  })

  it('TC-ASI-005: should display save error status', () => {
    const wrapper = mount(AutoSaveIndicator, {
      props: {
        status: 'error',
        lastSavedTime: null
      }
    })

    expect(wrapper.find('.save-error').exists()).toBe(true)
    expect(wrapper.text()).toContain('保存失败')
  })
})
