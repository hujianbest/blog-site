/**
 * SEO Utilities
 * Helper functions for search engine optimization
 */

interface MetaTags {
  title?: string
  description?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  twitterCard?: 'summary' | 'summary_large_image'
  canonical?: string
  keywords?: string[]
  noIndex?: boolean
}

/**
 * Set page meta tags for SEO
 */
export function setMetaTags(tags: MetaTags): void {
  // Set title
  if (tags.title) {
    document.title = tags.title
  }

  // Set or update meta tags
  updateMetaTag('name', 'description', tags.description)
  updateMetaTag('property', 'og:title', tags.ogTitle || tags.title)
  updateMetaTag('property', 'og:description', tags.ogDescription || tags.description)
  updateMetaTag('property', 'og:image', tags.ogImage)
  updateMetaTag('property', 'og:type', tags.ogType || 'website')
  updateMetaTag('name', 'twitter:card', tags.twitterCard || 'summary')
  updateMetaTag('name', 'twitter:title', tags.ogTitle || tags.title)
  updateMetaTag('name', 'twitter:description', tags.ogDescription || tags.description)
  updateMetaTag('name', 'twitter:image', tags.ogImage)

  // Set canonical URL
  if (tags.canonical) {
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.rel = 'canonical'
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.href = tags.canonical
  }

  // Set keywords
  if (tags.keywords && tags.keywords.length > 0) {
    updateMetaTag('name', 'keywords', tags.keywords.join(', '))
  }

  // Set no-index
  if (tags.noIndex) {
    updateMetaTag('name', 'robots', 'noindex, nofollow')
  }
}

/**
 * Update or create a meta tag
 */
function updateMetaTag(
  attrName: 'name' | 'property',
  attrValue: string,
  content?: string
): void {
  if (!content) return

  let meta = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement

  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute(attrName, attrValue)
    document.head.appendChild(meta)
  }

  meta.content = content
}

/**
 * Generate structured data (JSON-LD) for an article
 */
export function generateArticleStructuredData(article: {
  title: string
  description: string
  publishDate: string
  modifyDate?: string
  author: string
  image?: string
  url: string
}): string {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image || [],
    datePublished: article.publishDate,
    dateModified: article.modifyDate || article.publishDate,
    author: {
      '@type': 'Person',
      name: article.author
    },
    publisher: {
      '@type': 'Organization',
      name: '我的博客',
      logo: {
        '@type': 'ImageObject',
        url: '/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url
    }
  }

  return JSON.stringify(structuredData)
}

/**
 * Generate structured data (JSON-LD) for website
 */
export function generateWebsiteStructuredData(): string {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '我的博客',
    url: window.location.origin,
    description: '记录技术、生活和思考的个人博客',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: window.location.origin + '/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  }

  return JSON.stringify(structuredData)
}

/**
 * Inject structured data into the page
 */
export function injectStructuredData(structuredData: string): void {
  // Remove existing structured data if any
  const existingScript = document.querySelector('script[type="application/ld+json"]')
  if (existingScript) {
    existingScript.remove()
  }

  // Create and inject new structured data
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.text = structuredData
  document.head.appendChild(script)
}

/**
 * Generate page title with site name suffix
 */
export function generatePageTitle(title: string): string {
  return `${title} - 我的博客`
}

/**
 * Generate article description (truncate content if necessary)
 */
export function generateDescription(content: string, maxLength = 160): string {
  // Remove markdown syntax
  const plainText = content
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/\*\*/g, '') // Remove bold
    .replace(/\*/g, '') // Remove italic
    .replace(/`/g, '') // Remove code
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .trim()

  // Truncate if necessary
  if (plainText.length <= maxLength) {
    return plainText
  }

  return plainText.substring(0, maxLength - 3) + '...'
}

/**
 * Generate Open Graph image URL
 */
export function generateOgImageUrl(imageUrl?: string): string | undefined {
  if (!imageUrl) {
    return `${window.location.origin}/default-og-image.png`
  }

  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }

  return `${window.location.origin}${imageUrl}`
}
