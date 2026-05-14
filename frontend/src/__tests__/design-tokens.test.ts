import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const css = readFileSync(resolve(__dirname, '../style.css'), 'utf8')

describe('Editorial Studio design tokens', () => {
  it('defines the approved color token contract', () => {
    expect(css).toContain('--color-bg-page: #fbf7ef')
    expect(css).toContain('--color-fg-default: #241c15')
    expect(css).toContain('--color-primary-bg: #9f4f10')
    expect(css).toContain('--color-on-primary: #ffffff')
    expect(css).toContain('--color-primary-text: #9f4f10')
  })

  it('defines spacing, radius, shadow, motion, and layout tokens', () => {
    for (const token of [
      '--space-1',
      '--space-2',
      '--space-3',
      '--space-4',
      '--space-6',
      '--space-8',
      '--space-12',
      '--space-16',
      '--layout-page-max',
      '--layout-reading-max',
      '--radius-sm',
      '--radius-md',
      '--radius-lg',
      '--shadow-elevation-1',
      '--shadow-elevation-2',
      '--motion-fast',
      '--motion-normal',
    ]) {
      expect(css).toContain(token)
    }
  })

  it('maps primary controls and links to accessible foreground tokens', () => {
    expect(css).toMatch(/a:not\(\[class\]\)[\s\S]*color:\s*var\(--color-primary-text\)/)
    expect(css).toMatch(/\.ui-button-primary[\s\S]*background:\s*var\(--color-primary-bg\)/)
    expect(css).toMatch(/\.ui-button-primary[\s\S]*color:\s*var\(--color-on-primary\)/)
    expect(css).toMatch(/\.ui-link[\s\S]*color:\s*var\(--color-primary-text\)/)
  })

  it('defines global focus and reduced-motion behavior', () => {
    expect(css).toContain(':focus-visible')
    expect(css).toContain('@media (prefers-reduced-motion: reduce)')
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*transform:\s*none !important/)
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*transition-property:\s*color, background-color, border-color, text-decoration-color, opacity !important/)
  })
})
