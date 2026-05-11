<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <router-link to="/" class="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
          My Blog
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex space-x-8">
          <router-link
            to="/"
            class="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            active-class="text-blue-600"
          >
            首页
          </router-link>
          <router-link
            to="/articles"
            class="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            active-class="text-blue-600"
          >
            文章
          </router-link>
          <router-link
            to="/about"
            class="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            active-class="text-blue-600"
          >
            关于
          </router-link>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden p-2 rounded-lg hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden mt-4 pb-4 border-t pt-4">
        <div class="flex flex-col space-y-4">
          <router-link
            to="/"
            @click="closeMobileMenu"
            class="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            active-class="text-blue-600"
          >
            首页
          </router-link>
          <router-link
            to="/articles"
            @click="closeMobileMenu"
            class="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            active-class="text-blue-600"
          >
            文章
          </router-link>
          <router-link
            to="/about"
            @click="closeMobileMenu"
            class="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            active-class="text-blue-600"
          >
            关于
          </router-link>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
</script>
