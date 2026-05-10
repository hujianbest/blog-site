import { describe, it, expect } from 'vitest'
import {
  convertMarkdownToHtml,
  extractImageUrls,
  sanitizeHtml
} from '../markdown'

describe('markdown.ts - Utility Functions', () => {
  describe('convertMarkdownToHtml', () => {
    it('should convert basic heading', () => {
      const input = '# Hello'
      const result = convertMarkdownToHtml(input)
      expect(result).toContain('<h1>')
      expect(result).toContain('Hello')
    })

    it('should convert bold text', () => {
      const input = '**bold**'
      const result = convertMarkdownToHtml(input)
      expect(result).toContain('<strong>')
      expect(result).toContain('bold')
    })

    it('should convert italic text', () => {
      const input = '*italic*'
      const result = convertMarkdownToHtml(input)
      expect(result).toContain('<em>')
      expect(result).toContain('italic')
    })

    it('should convert code block', () => {
      const input = '```javascript\nconsole.log("test");\n```'
      const result = convertMarkdownToHtml(input)
      expect(result).toContain('<pre>')
      expect(result).toContain('<code>')
    })

    it('should convert links', () => {
      const input = '[text](https://example.com)'
      const result = convertMarkdownToHtml(input)
      expect(result).toContain('<a href="https://example.com">')
      expect(result).toContain('>text</a>')
    })

    it('should convert images', () => {
      const input = '![alt](https://example.com/img.jpg)'
      const result = convertMarkdownToHtml(input)
      expect(result).toContain('<img')
      expect(result).toContain('src="https://example.com/img.jpg"')
      expect(result).toContain('alt="alt"')
    })

    it('should convert lists', () => {
      const input = '* item1\n* item2'
      const result = convertMarkdownToHtml(input)
      expect(result).toContain('<ul>')
      expect(result).toContain('<li>item1</li>')
      expect(result).toContain('<li>item2</li>')
    })

    it('should prevent XSS attacks', () => {
      const input = '<script>alert("xss")</script>'
      const result = convertMarkdownToHtml(input)
      expect(result).not.toContain('<script>')
      expect(result).not.toContain('alert(')
    })

    it('should handle empty input', () => {
      const input = ''
      const result = convertMarkdownToHtml(input)
      expect(result).toBe('')
    })

    it('should handle invalid markdown gracefully', () => {
      const input = '@@invalid@@@'
      const result = convertMarkdownToHtml(input)
      expect(result).toBeTruthy()
      expect(result).toContain('@@invalid@@@')
    })
  })

  describe('extractImageUrls', () => {
    it('should extract single image URL', () => {
      const input = '![alt](https://example.com/img.jpg)'
      const result = extractImageUrls(input)
      expect(result).toEqual(['https://example.com/img.jpg'])
    })

    it('should extract multiple image URLs', () => {
      const input = '![a](url1) ![b](url2)'
      const result = extractImageUrls(input)
      expect(result).toEqual(['url1', 'url2'])
    })

    it('should return empty array when no images', () => {
      const input = 'Just text'
      const result = extractImageUrls(input)
      expect(result).toEqual([])
    })
  })

  describe('sanitizeHtml', () => {
    it('should remove script tags', () => {
      const input = '<script>alert("xss")</script><p>content</p>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('<script>')
      expect(result).toContain('<p>')
    })

    it('should remove onclick attributes', () => {
      const input = '<p onclick="alert("xss")">content</p>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('onclick')
    })

    it('should preserve safe HTML', () => {
      const input = '<p><strong>bold</strong></p>'
      const result = sanitizeHtml(input)
      expect(result).toContain('<p>')
      expect(result).toContain('<strong>')
    })
  })
})
