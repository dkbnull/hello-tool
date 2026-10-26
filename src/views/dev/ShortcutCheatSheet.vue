<template>
  <div class="tool-container">
    <h2>编辑器快捷键速查</h2>
    <p class="tool-description">IntelliJ IDEA 与 VS Code 常用快捷键，支持分类切换与搜索</p>

    <CheatSheet :categories="shortcutCategories" key-label="快捷键" />
  </div>
</template>

<script setup>
import CheatSheet from '@/components/CheatSheet.vue'
import { shortcutCategories } from './shortcutsData'
</script>

