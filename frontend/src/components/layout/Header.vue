<template>
  <header class="bg-[var(--color-bg-surface)] border-b border-[var(--color-border-default)] sticky top-0 z-50">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[var(--radius-md)] focus:bg-[var(--color-bg-surface)] focus:px-4 focus:py-2 focus:text-[var(--color-primary-text)]"
    >
      跳到正文
    </a>
    <nav class="ui-page py-4">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <router-link to="/" class="text-2xl font-bold text-[var(--color-fg-default)] hover:text-[var(--color-primary-text)] transition-colors">
          hujian's bolg
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex space-x-8">
          <router-link
            to="/"
            class="text-[var(--color-fg-muted)] hover:text-[var(--color-primary-text)] transition-colors font-medium"
            active-class="text-[var(--color-primary-text)]"
          >
            首页
          </router-link>
          <router-link
            to="/articles"
            class="text-[var(--color-fg-muted)] hover:text-[var(--color-primary-text)] transition-colors font-medium"
            active-class="text-[var(--color-primary-text)]"
          >
            文章
          </router-link>
          <router-link
            to="/categories"
            class="text-[var(--color-fg-muted)] hover:text-[var(--color-primary-text)] transition-colors font-medium"
            active-class="text-[var(--color-primary-text)]"
          >
            分类
          </router-link>
          <router-link
            to="/write"
            class="text-[var(--color-fg-muted)] hover:text-[var(--color-primary-text)] transition-colors font-medium"
            active-class="text-[var(--color-primary-text)]"
          >
            写作
          </router-link>
          <router-link
            to="/about"
            class="text-[var(--color-fg-muted)] hover:text-[var(--color-primary-text)] transition-colors font-medium"
            active-class="text-[var(--color-primary-text)]"
          >
            关于
          </router-link>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden min-h-11 min-w-11 p-2 rounded-[var(--radius-md)] text-[var(--color-fg-default)] hover:bg-[var(--color-bg-accent-subtle)] transition-colors"
          aria-label="Toggle menu"
          aria-controls="public-navigation-mobile"
          :aria-expanded="String(mobileMenuOpen)"
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
      <div
        v-if="mobileMenuOpen"
        id="public-navigation-mobile"
        class="md:hidden mt-4 pb-4 border-t border-[var(--color-border-default)] pt-4"
      >
        <div class="flex flex-col space-y-4">
          <router-link
            to="/"
            @click="closeMobileMenu"
            class="text-[var(--color-fg-muted)] hover:text-[var(--color-primary-text)] transition-colors font-medium"
            active-class="text-[var(--color-primary-text)]"
          >
            首页
          </router-link>
          <router-link
            to="/articles"
            @click="closeMobileMenu"
            class="text-[var(--color-fg-muted)] hover:text-[var(--color-primary-text)] transition-colors font-medium"
            active-class="text-[var(--color-primary-text)]"
          >
            文章
          </router-link>
          <router-link
            to="/categories"
            @click="closeMobileMenu"
            class="text-[var(--color-fg-muted)] hover:text-[var(--color-primary-text)] transition-colors font-medium"
            active-class="text-[var(--color-primary-text)]"
          >
            分类
          </router-link>
          <router-link
            to="/write"
            @click="closeMobileMenu"
            class="text-[var(--color-fg-muted)] hover:text-[var(--color-primary-text)] transition-colors font-medium"
            active-class="text-[var(--color-primary-text)]"
          >
            写作
          </router-link>
          <router-link
            to="/about"
            @click="closeMobileMenu"
            class="text-[var(--color-fg-muted)] hover:text-[var(--color-primary-text)] transition-colors font-medium"
            active-class="text-[var(--color-primary-text)]"
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
