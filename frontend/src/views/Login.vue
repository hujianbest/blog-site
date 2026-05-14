<template>
  <div data-ui="auth-page" class="min-h-screen bg-[var(--color-bg-page)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-[var(--color-fg-default)]">
          登录到写作平台
        </h2>
        <p class="mt-2 text-center text-sm text-[var(--color-fg-muted)]">
          或
          <router-link to="/register" class="ui-link font-medium">
            创建新账号
          </router-link>
        </p>
      </div>

      <section data-ui="auth-card" class="ui-surface mt-8 p-6">
        <n-form ref="formRef" :model="formValue" :rules="rules" size="large">
          <!-- Email -->
          <n-form-item label="邮箱" path="email">
            <n-input
              v-model:value="formValue.email"
              placeholder="your@email.com"
              :input-props="{ autocomplete: 'email' }"
              @keydown.enter="handleLogin"
            />
          </n-form-item>

          <!-- Password -->
          <n-form-item label="密码" path="password">
            <n-input
              v-model:value="formValue.password"
              type="password"
              placeholder="•••••••••"
              :input-props="{ autocomplete: 'current-password' }"
              show-password-on="click"
              @keydown.enter="handleLogin"
            />
          </n-form-item>

          <!-- Error Message -->
          <n-alert
            v-if="errorMessage"
            type="error"
            data-ui-state="error"
            class="mb-4 border border-[var(--color-danger)]"
          >
            {{ errorMessage }}
          </n-alert>

          <!-- Submit Button -->
          <div class="flex items-center justify-between">
            <n-button
              type="primary"
              data-ui="auth-submit"
              @click="handleLogin"
              :loading="loading"
              size="large"
              class="ui-button-primary flex-1"
            >
              登录
            </n-button>
          </div>
        </n-form>
      </section>

      <!-- Test Credentials Hint -->
      <div class="mt-4 text-center text-sm text-[var(--color-fg-muted)]">
        <p>测试账号：test@example.com / password123</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NAlert, NButton, NForm, NFormItem, NInput, useMessage } from 'naive-ui'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const message = useMessage()
const authStore = useAuthStore()

const formRef = ref()
const formValue = ref({
  email: '',
  password: '',
})

const errorMessage = ref('')
const loading = ref(false)

const rules = {
  email: [
    {
      required: true,
      message: '请输入邮箱',
      trigger: ['blur', 'change'],
    },
    {
      type: 'email',
      message: '请输入有效的邮箱地址',
      trigger: ['blur', 'change'],
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: ['blur', 'change'],
    },
    {
      min: 6,
      message: '密码至少6个字符',
      trigger: ['blur', 'change'],
    },
  ],
}

async function handleLogin() {
  try {
    await formRef.value?.validate()
    loading.value = true
    errorMessage.value = ''

    await authStore.login(formValue.value.email, formValue.value.password)

    message.success('登录成功！')
    router.push('/')
  } catch (error: any) {
    errorMessage.value = error.message || '登录失败，请检查邮箱和密码'
  } finally {
    loading.value = false
  }
}
</script>
