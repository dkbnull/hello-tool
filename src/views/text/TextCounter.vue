<template>
  <div class="tool-container">
    <h2>文本字数统计</h2>

    <div class="section-card">
      <textarea v-model="text" placeholder="请输入要统计的文本" rows="20" @input="calculateStats"></textarea>
    </div>

    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.label" class="stat-card section-card">
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'

const text = ref('')

const stats = computed(() => {
  const t = text.value
  return [
    {label: '字符数', value: t.length},
    {label: '字符数（不含空格）', value: t.replace(/\s/g, '').length},
    {label: '字数', value: t.trim() ? t.trim().split(/\s+/).length : 0},
    {label: '行数', value: t ? t.split('\n').length : 0},
    {label: '段落数', value: t.trim() ? t.trim().split(/\n\s*\n/).length : 0},
    {label: '中文字符', value: (t.match(/[\u4e00-\u9fa5]/g) || []).length},
    {label: '英文字母', value: (t.match(/[a-zA-Z]/g) || []).length},
    {label: '数字', value: (t.match(/[0-9]/g) || []).length},
  ]
})

const calculateStats = () => {
}
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.stat-card {
  text-align: center;
  padding: 1.5rem 1rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-primary);
  font-family: 'Consolas', 'Monaco', monospace;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin-top: 0.5rem;
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
