<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-primary-600">我的博客</h1>
          </div>
          <nav class="flex space-x-8">
            <router-link to="/" class="text-gray-700 hover:text-primary-600">首页</router-link>
            <router-link to="/about" class="text-gray-700 hover:text-primary-600">关于</router-link>
          </nav>
        </div>
      </div>
    </header>

    <!-- About Content -->
    <section class="py-16">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">关于我</h2>

        <div class="bg-white rounded-lg shadow-md p-8">
          <div class="flex items-center mb-6">
            <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <span class="text-3xl">👤</span>
            </div>
            <div class="ml-6">
              <h3 class="text-xl font-semibold text-gray-900">博主名称</h3>
              <p class="text-gray-600">全栈开发者</p>
            </div>
          </div>

          <div class="prose max-w-none">
            <p class="text-gray-700 mb-4">
              你好！欢迎来到我的博客。这里是我记录技术学习、生活感悟和思考的地方。
            </p>
            <h4 class="text-lg font-semibold text-gray-900 mb-2">技能栈</h4>
            <ul class="list-disc list-inside text-gray-700 mb-4">
              <li>前端：Vue 3, React, TypeScript</li>
              <li>后端：Node.js, Python, PostgreSQL</li>
              <li>工具：Docker, Git, CI/CD</li>
            </ul>
            <h4 class="text-lg font-semibold text-gray-900 mb-2">联系方式</h4>
            <p class="text-gray-700">
              <a href="https://github.com" class="text-primary-600 hover:text-primary-700">GitHub</a> •
              <a href="https://twitter.com" class="text-primary-600 hover:text-primary-700">Twitter</a> •
              <a href="mailto:hello@example.com" class="text-primary-600 hover:text-primary-700">Email</a>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p class="text-center text-gray-600">
          © 2026 我的博客. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// About page logic
</script>
