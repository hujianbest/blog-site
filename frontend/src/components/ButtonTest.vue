<template>
  <div class="p-8">
    <h2 class="text-2xl font-bold mb-4">Naive UI 组件测试</h2>
    
    <div class="space-y-4">
      <!-- NButton 测试 -->
      <div>
        <h3 class="text-lg font-semibold mb-2">按钮组件</h3>
        <div class="flex gap-2">
          <n-button type="primary">主要按钮</n-button>
          <n-button>默认按钮</n-button>
          <n-button type="info">信息按钮</n-button>
          <n-button type="success">成功按钮</n-button>
          <n-button type="warning">警告按钮</n-button>
          <n-button type="error">错误按钮</n-button>
        </div>
      </div>

      <!-- NInput 测试 -->
      <div>
        <h3 class="text-lg font-semibold mb-2">输入框组件</h3>
        <n-input placeholder="请输入内容..." class="max-w-md" />
      </div>

      <!-- NCard 测试 -->
      <div>
        <h3 class="text-lg font-semibold mb-2">卡片组件</h3>
        <n-card title="卡片标题" class="max-w-md">
          这是一个使用 Naive UI 的卡片组件示例。
        </n-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton, NInput, NCard } from 'naive-ui'
</script>
