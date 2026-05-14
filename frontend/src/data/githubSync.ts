import type { Article } from './content'

interface SyncOptions {
  token: string
  articles: Article[]
  owner?: string
  repo?: string
  branch?: string
}

interface GitRefResponse {
  object: {
    sha: string
  }
}

interface GitCommitResponse {
  tree: {
    sha: string
  }
}

interface GitBlobResponse {
  sha: string
}

interface GitTreeResponse {
  sha: string
}

interface GitNewCommitResponse {
  sha: string
}

const defaultOwner = 'hujianbest'
const defaultRepo = 'hujianbest.github.io'
const defaultBranch = 'master'

function encodeBase64(content: string): string {
  const bytes = new TextEncoder().encode(content)
  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary)
}

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{Letter}\p{Number}-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || `article-${Date.now()}`
}

function articleToMarkdown(article: Article): string {
  const tags = (article.tags || []).map(tag => tag.name).join(', ')
  const date = article.publishedAt || article.createdAt || new Date().toISOString()

  return [
    '---',
    `title: ${JSON.stringify(article.title)}`,
    `date: ${date}`,
    `category: ${JSON.stringify(article.categoryName || article.category?.name || 'Writing')}`,
    `tags: ${JSON.stringify(tags)}`,
    '---',
    '',
    article.content,
    '',
  ].join('\n')
}

async function githubFetch<T>(path: string, token: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.headers || {}),
    },
  })

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText)
    throw new Error(`GitHub API ${response.status}: ${message}`)
  }

  return await response.json() as T
}

export async function syncPublishedArticlesToGitHub({
  token,
  articles,
  owner = defaultOwner,
  repo = defaultRepo,
  branch = defaultBranch,
}: SyncOptions): Promise<{ commitSha: string; count: number }> {
  const publishedArticles = articles.filter(article => article.status !== 'DRAFT')

  if (publishedArticles.length === 0) {
    throw new Error('没有可同步的已发布文章。')
  }

  const ref = await githubFetch<GitRefResponse>(`/repos/${owner}/${repo}/git/ref/heads/${branch}`, token)
  const currentCommitSha = ref.object.sha
  const currentCommit = await githubFetch<GitCommitResponse>(`/repos/${owner}/${repo}/git/commits/${currentCommitSha}`, token)

  const indexContent = JSON.stringify({
    updatedAt: new Date().toISOString(),
    articles: publishedArticles,
  }, null, 2)

  const blobs = await Promise.all([
    githubFetch<GitBlobResponse>(`/repos/${owner}/${repo}/git/blobs`, token, {
      method: 'POST',
      body: JSON.stringify({
        content: encodeBase64(indexContent),
        encoding: 'base64',
      }),
    }).then(blob => ({
      path: 'data/articles.json',
      mode: '100644',
      type: 'blob',
      sha: blob.sha,
    })),
    ...publishedArticles.map(async (article) => {
      const markdown = articleToMarkdown(article)
      const blob = await githubFetch<GitBlobResponse>(`/repos/${owner}/${repo}/git/blobs`, token, {
        method: 'POST',
        body: JSON.stringify({
          content: encodeBase64(markdown),
          encoding: 'base64',
        }),
      })

      return {
        path: `articles/${slugify(article.title)}.md`,
        mode: '100644',
        type: 'blob',
        sha: blob.sha,
      }
    }),
  ])

  const tree = await githubFetch<GitTreeResponse>(`/repos/${owner}/${repo}/git/trees`, token, {
    method: 'POST',
    body: JSON.stringify({
      base_tree: currentCommit.tree.sha,
      tree: blobs,
    }),
  })

  const commit = await githubFetch<GitNewCommitResponse>(`/repos/${owner}/${repo}/git/commits`, token, {
    method: 'POST',
    body: JSON.stringify({
      message: `Publish ${publishedArticles.length} article(s) from browser editor`,
      tree: tree.sha,
      parents: [currentCommitSha],
    }),
  })

  await githubFetch(`/repos/${owner}/${repo}/git/refs/heads/${branch}`, token, {
    method: 'PATCH',
    body: JSON.stringify({
      sha: commit.sha,
    }),
  })

  return {
    commitSha: commit.sha,
    count: publishedArticles.length,
  }
}
