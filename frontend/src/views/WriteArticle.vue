<template>
  <div class="min-h-screen bg-[var(--color-bg-page)] flex flex-col">
    <Header />

    <main id="main-content" class="ui-page py-10 flex-1">
      <div data-ui="write-page" class="space-y-6">
        <header class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="text-sm font-medium text-[var(--color-primary-text)]">Online writing</p>
            <h1 class="text-3xl md:text-4xl font-bold text-[var(--color-fg-default)]">
              开始写作
            </h1>
            <p class="mt-2 text-[var(--color-fg-muted)]">
              使用 Markdown 编写文章，保存为草稿或直接发布。
            </p>
          </div>

          <div class="flex gap-3">
            <button
              data-action="save-draft"
              type="button"
              class="ui-link font-semibold"
              :disabled="saving"
              @click="submitArticle('DRAFT')"
            >
              保存草稿
            </button>
            <button
              data-action="publish"
              type="button"
              class="ui-button-primary px-5 py-2 font-semibold disabled:opacity-60"
              :disabled="saving"
              @click="submitArticle('PUBLISHED')"
            >
              发布文章
            </button>
          </div>
        </header>

        <section class="ui-surface p-5 space-y-4">
          <div>
            <h2 class="text-xl font-bold text-[var(--color-fg-default)]">同步到 GitHub Pages</h2>
            <p class="mt-1 text-sm text-[var(--color-fg-muted)]">
              输入只对 `hujianbest/hujianbest.github.io` 有写权限的 GitHub Token。Token 只保存在当前页面内存中，不会写入本地存储。
            </p>
          </div>
          <label class="block">
            <span class="text-sm font-medium text-[var(--color-fg-muted)]">GitHub Token</span>
            <input
              v-model="githubToken"
              data-ui="github-token"
              type="password"
              autocomplete="off"
              class="mt-2 w-full rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] px-4 py-3 text-[var(--color-fg-default)] focus:border-[var(--color-border-strong)]"
              placeholder="github_pat_..."
            />
          </label>
          <button
            data-action="sync-github"
            type="button"
            class="ui-button-primary px-5 py-2 font-semibold disabled:opacity-60"
            :disabled="syncing"
            @click="syncToGitHub"
          >
            同步已发布文章到 GitHub Pages
          </button>
        </section>

        <section class="ui-surface p-5 space-y-4">
          <label class="block">
            <span class="text-sm font-medium text-[var(--color-fg-muted)]">标题</span>
            <input
              v-model="title"
              aria-label="文章标题"
              class="mt-2 w-full rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] px-4 py-3 text-[var(--color-fg-default)] focus:border-[var(--color-border-strong)]"
              placeholder="输入文章标题"
            />
          </label>

          <MarkdownEditor
            v-model="content"
            :auto-save="false"
            class="min-h-[560px]"
            @save="submitArticle('DRAFT')"
          />
        </section>

        <div
          v-if="statusMessage"
          :data-ui-state="statusType"
          class="ui-surface px-4 py-3"
          :class="statusType === 'error' ? 'border-[var(--color-danger)] text-[var(--color-danger)]' : 'text-[var(--color-success)]'"
        >
          {{ statusMessage }}
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import MarkdownEditor from '@/components/editor/MarkdownEditor.vue'
import { getLocalArticles, saveLocalArticle } from '@/data/content'
import { syncPublishedArticlesToGitHub } from '@/data/githubSync'

type ArticleStatus = 'DRAFT' | 'PUBLISHED'

const router = useRouter()
const title = ref('')
const content = ref('')
const saving = ref(false)
const syncing = ref(false)
const githubToken = ref('')
const statusMessage = ref('')
const statusType = ref<'success' | 'error'>('success')
const currentArticleId = ref<string | number | undefined>()

const excerpt = computed(() => content.value.replace(/[#*`>\-]/g, '').trim().slice(0, 160))

async function submitArticle(status: ArticleStatus) {
  statusMessage.value = ''

  if (!title.value.trim() || !content.value.trim()) {
    statusType.value = 'error'
    statusMessage.value = '请先填写标题和正文。'
    return
  }

  saving.value = true

  try {
    const article = saveLocalArticle({
      id: currentArticleId.value,
      title: title.value.trim(),
      content: content.value,
      excerpt: excerpt.value,
      status
    })
    currentArticleId.value = article.id
    statusType.value = 'success'
    statusMessage.value = status === 'DRAFT' ? '草稿已保存到本地浏览器' : '文章已发布到本地站点'

    if (status === 'PUBLISHED') {
      router.push(`/articles/${article.id}`)
    }
  } catch (error) {
    console.error('Failed to submit article:', error)
    statusType.value = 'error'
    statusMessage.value = '保存失败，请稍后重试。'
  } finally {
    saving.value = false
  }
}

async function syncToGitHub() {
  statusMessage.value = ''

  if (!githubToken.value.trim()) {
    statusType.value = 'error'
    statusMessage.value = '请先输入 GitHub Token。'
    return
  }

  if (title.value.trim() && content.value.trim()) {
    const article = saveLocalArticle({
      id: currentArticleId.value,
      title: title.value.trim(),
      content: content.value,
      excerpt: excerpt.value,
      status: 'PUBLISHED'
    })
    currentArticleId.value = article.id
  }

  syncing.value = true

  try {
    const result = await syncPublishedArticlesToGitHub({
      token: githubToken.value.trim(),
      articles: getLocalArticles(),
    })
    statusType.value = 'success'
    statusMessage.value = `已同步 ${result.count} 篇文章到 GitHub Pages。提交 ${result.commitSha.slice(0, 7)}`
  } catch (error: any) {
    console.error('Failed to sync to GitHub:', error)
    statusType.value = 'error'
    statusMessage.value = error.message || '同步失败，请检查 Token 权限后重试。'
  } finally {
    syncing.value = false
  }
}
</script>
