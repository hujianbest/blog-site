<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header />

    <main class="py-16 flex-1">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <!-- Header Section -->
          <div class="bg-white rounded-lg shadow-lg p-8 md:p-12 mb-8">
            <div class="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <!-- Avatar -->
              <div class="flex-shrink-0">
                <div class="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl md:text-6xl font-bold">
                  MB
                </div>
              </div>

              <!-- Bio -->
              <div class="flex-1 text-center md:text-left">
                <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  关于我
                </h1>
                <p class="text-lg text-gray-600 mb-6">
                  全栈开发者 / 技术博主 / 开源爱好者
                </p>
                <p class="text-gray-700 leading-relaxed">
                  热爱编程，享受创造的过程。专注于 Web 开发，喜欢探索新技术。
                  这个博客是我记录学习心得、分享技术思考的地方。希望我的文章能对你有所帮助。
                </p>

                <!-- Social Links -->
                <div class="flex gap-4 mt-6 justify-center md:justify-start">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    aria-label="GitHub"
                  >
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    aria-label="Twitter"
                  >
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a
                    href="mailto:hello@example.com"
                    class="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    aria-label="Email"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Skills Section -->
          <div class="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">技能栈</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Frontend -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  前端开发
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Vue.js</span>
                  <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">React</span>
                  <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">TypeScript</span>
                  <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Tailwind CSS</span>
                  <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Vite</span>
                </div>
              </div>

              <!-- Backend -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                  后端开发
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Node.js</span>
                  <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Spring Boot</span>
                  <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">PostgreSQL</span>
                  <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">RESTful API</span>
                </div>
              </div>

              <!-- Tools -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  开发工具
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Git</span>
                  <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Docker</span>
                  <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">VS Code</span>
                  <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Linux</span>
                </div>
              </div>

              <!-- Other -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332-.477 4.5-1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332-.477-4.5-1.253" />
                  </svg>
                  其他
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">Agile</span>
                  <span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">TDD</span>
                  <span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">CI/CD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
</script>
