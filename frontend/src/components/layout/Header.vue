<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <h1 class="text-2xl font-bold text-primary-600">我的博客</h1>
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex space-x-8">
          <router-link
            to="/"
            class="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            active-class="text-primary-600"
          >
            首页
          </router-link>
          <router-link
            to="/articles"
            class="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            active-class="text-primary-600"
          >
            文章
          </router-link>
          <router-link
            to="/categories"
            class="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            active-class="text-primary-600"
          >
            分类
          </router-link>
          <router-link
            to="/about"
            class="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            active-class="text-primary-600"
          >
            关于
          </router-link>
        </nav>

        <!-- Mobile Menu Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              v-if="!mobileMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <nav
        v-if="mobileMenuOpen"
        class="md:hidden py-4 border-t border-gray-200"
      >
        <div class="flex flex-col space-y-3">
          <router-link
            to="/"
            class="text-gray-700 hover:text-primary-600 transition-colors font-medium px-2 py-1"
            active-class="text-primary-600"
            @click="mobileMenuOpen = false"
          >
            首页
          </router-link>
          <router-link
            to="/articles"
            class="text-gray-700 hover:text-primary-600 transition-colors font-medium px-2 py-1"
            active-class="text-primary-600"
            @click="mobileMenuOpen = false"
          >
            文章
          </router-link>
          <router-link
            to="/categories"
            class="text-gray-700 hover:text-primary-600 transition-colors font-medium px-2 py-1"
            active-class="text-primary-600"
            @click="mobileMenuOpen = false"
          >
            分类
          </router-link>
          <router-link
            to="/about"
            class="text-gray-700 hover:text-primary-600 transition-colors font-medium px-2 py-1"
            active-class="text-primary-600"
            @click="mobileMenuOpen = false"
          >
            关于
          </router-link>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mobileMenuOpen = ref(false)
</script>
