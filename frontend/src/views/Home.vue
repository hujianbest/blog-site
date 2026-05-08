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

    <!-- Hero Section -->
    <section class="bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">
            欢迎来到我的博客
          </h2>
          <p class="text-xl text-gray-600 mb-8">
            记录技术、生活和思考
          </p>
        </div>
      </div>
    </section>

    <!-- Naive UI 组件测试 -->
    <section class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">组件库测试</h3>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Naive UI 按钮</h4>
            <div class="flex flex-wrap gap-2">
              <n-button type="primary" size="small">主要</n-button>
              <n-button size="small">默认</n-button>
              <n-button type="info" size="small">信息</n-button>
              <n-button type="success" size="small">成功</n-button>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Naive UI 输入框</h4>
            <n-input placeholder="测试输入框..." size="small" />
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Naive UI 标签</h4>
            <div class="flex flex-wrap gap-2">
              <n-tag type="primary">Vue 3</n-tag>
              <n-tag type="info">TypeScript</n-tag>
              <n-tag type="success">Tailwind</n-tag>
              <n-tag type="warning">Naive UI</n-tag>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">最新文章</h3>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-2">示例文章</h4>
            <p class="text-gray-600 mb-4">这是一篇示例文章的摘要内容...</p>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">2026-05-08</span>
              <button class="text-primary-600 hover:text-primary-700 font-medium">
                阅读 →
              </button>
            </div>
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
import { NButton, NInput, NTag } from 'naive-ui'
// Home page logic
</script>
