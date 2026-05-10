import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true
})

/**
 * Convert markdown text to HTML
 * @param input - Markdown string
 * @returns Sanitized HTML string
 */
export function convertMarkdownToHtml(input: string): string {
  if (!input) return ''

  // Convert markdown to HTML
  const html = md.render(input)

  // Sanitize to prevent XSS
  return sanitizeHtml(html)
}

/**
 * Extract image URLs from markdown text
 * @param input - Markdown string
 * @returns Array of image URLs
 */
export function extractImageUrls(input: string): string[] {
  if (!input) return []

  const imageRegex = /!\[.*?\]\(([^)]+)\)/g
  const urls: string[] = []
  let match

  while ((match = imageRegex.exec(input)) !== null) {
    urls.push(match[1])
  }

  return urls
}

/**
 * Sanitize HTML to prevent XSS attacks
 * @param input - Raw HTML string
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(input: string): string {
  if (!input) return ''

  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class']
  })
}
