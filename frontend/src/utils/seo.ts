/**
 * SEO utilities for dynamic meta tags and structured data
 */

export interface MetaTags {
  title: string
  description: string
  ogImage?: string
  ogType?: string
  twitterCard?: string
}

export interface ArticleStructuredData {
  title: string
  description: string
  publishedDate: string
  modifiedDate?: string
  authorName: string
  images?: string[]
}

/**
 * Set dynamic meta tags for the page
 */
export function setMetaTags(meta: MetaTags): void {
  document.title = meta.title
  setMetaTag('name', 'description', meta.description)
  setMetaTag('property', 'og:title', meta.title)
  setMetaTag('property', 'og:description', meta.description)
  setMetaTag('property', 'og:type', meta.ogType || 'website')
  if (meta.ogImage) {
    setMetaTag('property', 'og:image', meta.ogImage)
  }
  setMetaTag('name', 'twitter:card', meta.twitterCard || 'summary_large_image')
  setMetaTag('name', 'twitter:title', meta.title)
  setMetaTag('name', 'twitter:description', meta.description)
  if (meta.ogImage) {
    setMetaTag('name', 'twitter:image', meta.ogImage)
  }
}

function setMetaTag(attrName: string, attrValue: string, content: string): void {
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attrName, attrValue)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

/**
 * Generate JSON-LD structured data for an article
 */
export function generateArticleStructuredData(data: ArticleStructuredData): string {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    datePublished: data.publishedDate,
    dateModified: data.modifiedDate || data.publishedDate,
    author: {
      '@type': 'Person',
      name: data.authorName
    },
    ...(data.images && data.images.length > 0 && { image: data.images })
  }
  return JSON.stringify(structuredData)
}

/**
 * Inject JSON-LD structured data into the page
 */
export function injectStructuredData(jsonLd: string): void {
  const existing = document.getElementById('structured-data')
  if (existing) existing.remove()
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.id = 'structured-data'
  script.text = jsonLd
  document.head.appendChild(script)
}
