<template>
  <div class="tool-container">
    <h2>常用命令速查</h2>
    <p class="tool-description">Linux、Windows CMD、Docker、Redis 常用命令，支持分类切换、搜索与一键复制</p>

    <CheatSheet :categories="commandCategories" key-label="命令" />
  </div>
</template>

<script setup>
import CheatSheet from '@/components/CheatSheet.vue'
import { commandCategories } from './commandsData'
</script>
