<template>
  <div class="min-h-screen bg-gray-50">
    <LayoutHeader />

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">加载中...</p>
      </div>

      <!-- Profile Content -->
      <div v-else class="bg-white rounded-lg shadow-sm p-6 md:p-8">
        <!-- Profile Header -->
        <div class="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-8">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <div
              v-if="profile.avatar"
              class="w-24 h-24 rounded-full overflow-hidden bg-primary-100"
            >
              <img
                :src="profile.avatar"
                :alt="profile.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              v-else
              class="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center"
            >
              <span class="text-4xl">👤</span>
            </div>
          </div>

          <!-- Name and Title -->
          <div class="text-center md:text-left flex-1">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              {{ profile.name || '博主名称' }}
            </h1>
            <p class="text-lg text-gray-600 mb-4">
              {{ profile.title || '全栈开发者' }}
            </p>

            <!-- Social Links -->
            <div class="flex flex-wrap justify-center md:justify-start gap-4">
              <a
                v-if="profile.github"
                :href="profile.github"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fill-rule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>GitHub</span>
              </a>

              <a
                v-if="profile.twitter"
                :href="profile.twitter"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
                  />
                </svg>
                <span>Twitter</span>
              </a>

              <a
                v-if="profile.email"
                :href="`mailto:${profile.email}`"
                class="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>Email</span>
              </a>
            </div>
          </div>

          <!-- Edit Button (for logged-in users) -->
          <div v-if="canEdit" class="flex-shrink-0">
            <button
              @click="editing = !editing"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              {{ editing ? '取消' : '编辑' }}
            </button>
          </div>
        </div>

        <!-- Edit Form -->
        <div v-if="editing" class="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">编辑个人资料</h3>
          <form @submit.prevent="saveProfile" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                姓名
              </label>
              <input
                id="name"
                v-model="editForm.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                职位/头衔
              </label>
              <input
                id="title"
                v-model="editForm.title"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label for="bio" class="block text-sm font-medium text-gray-700 mb-1">
                简介
              </label>
              <textarea
                id="bio"
                v-model="editForm.bio"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="github" class="block text-sm font-medium text-gray-700 mb-1">
                  GitHub
                </label>
                <input
                  id="github"
                  v-model="editForm.github"
                  type="url"
                  placeholder="https://github.com/username"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label for="twitter" class="block text-sm font-medium text-gray-700 mb-1">
                  Twitter
                </label>
                <input
                  id="twitter"
                  v-model="editForm.twitter"
                  type="url"
                  placeholder="https://twitter.com/username"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                邮箱
              </label>
              <input
                id="email"
                v-model="editForm.email"
                type="email"
                placeholder="your@email.com"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              :disabled="saving"
              class="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ saving ? '保存中...' : '保存' }}
            </button>
          </form>
        </div>

        <!-- Bio -->
        <section v-if="profile.bio" class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">简介</h2>
          <div class="prose max-w-none text-gray-700">
            <p>{{ profile.bio }}</p>
          </div>
        </section>

        <!-- Skills -->
        <section v-if="profile.skills && profile.skills.length > 0" class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">技能栈</h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in profile.skills"
              :key="skill"
              class="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
            >
              {{ skill }}
            </span>
          </div>
        </section>
      </div>
    </main>

    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LayoutHeader from '../components/layout/Header.vue'
import LayoutFooter from '../components/layout/Footer.vue'
import { setMetaTags } from '../utils/seo'

interface Profile {
  name?: string
  title?: string
  bio?: string
  avatar?: string
  github?: string
  twitter?: string
  email?: string
  skills?: string[]
}

const profile = ref<Profile>({
  name: '博主名称',
  title: '全栈开发者',
  bio: '你好！欢迎来到我的博客。这里是我记录技术学习、生活感悟和思考的地方。',
  github: 'https://github.com',
  twitter: 'https://twitter.com',
  email: 'contact@example.com',
  skills: ['Vue 3', 'React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'Git', 'CI/CD']
})

const editing = ref(false)
const saving = ref(false)
const canEdit = ref(false) // Would be true if user is logged in
const loading = ref(true)

const editForm = ref<Profile>({ ...profile.value })

async function loadProfile() {
  try {
    const response = await fetch('http://localhost:3000/api/v1/profile')
    if (response.ok) {
      const data = await response.json()
      profile.value = data.profile || profile.value
    }
  } catch (error) {
    console.error('Failed to load profile:', error)
    // Use default profile
  } finally {
    loading.value = false
  }
}

async function saveProfile() {
  saving.value = true
  try {
    const response = await fetch('http://localhost:3000/api/v1/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editForm.value)
    })

    if (response.ok) {
      profile.value = { ...editForm.value }
      editing.value = false
    } else {
      alert('保存失败，请稍后重试')
    }
  } catch (error) {
    console.error('Failed to save profile:', error)
    alert('保存失败，请稍后重试')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  // Set SEO meta tags
  setMetaTags({
    title: '关于 - 我的博客',
    description: profile.value.bio || '了解更多关于我的信息',
    ogType: 'website',
    canonical: window.location.origin + '/about'
  })

  loadProfile()
})
</script>
