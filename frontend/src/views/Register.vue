<template>
  <div data-ui="auth-page" class="min-h-screen bg-[var(--color-bg-page)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-[var(--color-fg-default)]">
          创建新账号
        </h2>
        <p class="mt-2 text-center text-sm text-[var(--color-fg-muted)]">
          或
          <router-link to="/login" class="ui-link font-medium">
            已有账号？登录
          </router-link>
        </p>
      </div>

      <section data-ui="auth-card" class="ui-surface mt-8 p-6">
        <n-form ref="formRef" :model="formValue" :rules="rules" size="large">
          <!-- Name -->
          <n-form-item label="姓名" path="name">
            <n-input
              v-model:value="formValue.name"
              placeholder="您的姓名"
              :input-props="{ autocomplete: 'name' }"
              @keydown.enter="handleRegister"
            />
          </n-form-item>

          <!-- Email -->
          <n-form-item label="邮箱" path="email">
            <n-input
              v-model:value="formValue.email"
              placeholder="your@email.com"
              :input-props="{ autocomplete: 'email' }"
              @keydown.enter="handleRegister"
            />
          </n-form-item>

          <!-- Password -->
          <n-form-item label="密码" path="password">
            <n-input
              v-model:value="formValue.password"
              type="password"
              placeholder="至少6个字符"
              :input-props="{ autocomplete: 'new-password' }"
              show-password-on="click"
              @keydown.enter="handleRegister"
            />
          </n-form-item>

          <!-- Confirm Password -->
          <n-form-item label="确认密码" path="confirmPassword">
            <n-input
              v-model:value="formValue.confirmPassword"
              type="password"
              placeholder="再次输入密码"
              :input-props="{ autocomplete: 'new-password' }"
              show-password-on="click"
              @keydown.enter="handleRegister"
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
              @click="handleRegister"
              :loading="loading"
              size="large"
              class="ui-button-primary flex-1"
            >
              注册
            </n-button>
          </div>
        </n-form>
      </section>
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
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errorMessage = ref('')
const loading = ref(false)

const rules = {
  name: [
    {
      required: true,
      message: '请输入姓名',
      trigger: ['blur', 'change'],
    },
  ],
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
  confirmPassword: [
    {
      required: true,
      message: '请确认密码',
      trigger: ['blur', 'change'],
    },
    {
      validator: (_rule: any, value: string) => {
        return value === formValue.value.password
      },
      message: '两次输入的密码不一致',
      trigger: ['blur', 'change'],
    },
  ],
}

async function handleRegister() {
  try {
    await formRef.value?.validate()
    loading.value = true
    errorMessage.value = ''

    await authStore.register(
      formValue.value.name,
      formValue.value.email,
      formValue.value.password
    )

    message.success('注册成功！')
    router.push('/')
  } catch (error: any) {
    errorMessage.value = error.message || '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>
