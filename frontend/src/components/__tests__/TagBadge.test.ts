import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TagBadge from '../TagBadge.vue'

describe('TagBadge.vue', () => {
  const stubs = {
    'router-link': {
      template: '<a :href="to" :class="$attrs.class"><slot /></a>',
      props: ['to']
    }
  }

  it('uses tokenized discovery styling', () => {
    const wrapper = mount(TagBadge, {
      props: {
        tag: { id: '1', name: 'Vue', articleCount: 3 },
        size: 'medium'
      },
      global: { stubs }
    })

    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/tags/Vue')
    expect(link.classes()).toContain('bg-[var(--color-bg-accent-subtle)]')
    expect(link.classes()).toContain('text-[var(--color-primary-text)]')
    expect(link.attributes('class')).not.toContain('bg-blue-100')
  })
})
