<template>
  <div class="tool-container">
    <h2>闪电反应测试</h2>

    <div class="test-container">
      <div class="stats-section">
        <div class="stats">
          <div>
            <span class="stat-label">最佳记录:</span>
            <span class="stat-value">{{ bestTime }} ms</span>
          </div>
          <div>
            <span class="stat-label">平均:</span>
            <span class="stat-value">{{ avgTime }} ms</span>
          </div>
        </div>
      </div>

      <div
          @click="handleClick"
          class="target-area"
          :class="{
          'bg-green-500': isTesting && startTime,
          'bg-red-500': isTesting && !startTime,
          'bg-gray-200': !isTesting,
          'pulse': isTesting && !startTime
        }"
      >
        <p class="instruction">{{ instruction }}</p>
      </div>

      <div class="controls-section">
        <div class="controls">
          <button @click="startTest" class="action-btn primary" :disabled="isTesting">
            开始测试
          </button>
          <select v-model="difficulty" class="select-field" :disabled="isTesting">
            <option value="easy">简单模式</option>
            <option value="medium">中等模式</option>
            <option value="hard">困难模式</option>
          </select>
        </div>
      </div>

      <div class="history-section">
        <h3 class="history-title">测试记录 (毫秒)</h3>
        <div class="history">
          <span
              v-for="(time, index) in reactionTimes"
              :key="index"
              class="history-item"
          >
            {{ time }}
          </span>
          <span v-if="reactionTimes.length === 0" class="history-empty">
            暂无记录
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from 'vue'

const instruction = ref('点击开始测试')
const difficulty = ref('medium')
const bestTime = ref('-')
const avgTime = ref('-')
const reactionTimes = ref([])
let startTime = ref(null)
let isTesting = ref(false)
let timeoutId = null
let delayTime = 0

const updateStats = () => {
  if (reactionTimes.value.length === 0) {
    bestTime.value = '-'
    avgTime.value = '-'
    return
  }

  const best = Math.min(...reactionTimes.value)
  const avg = Math.round(reactionTimes.value.reduce((a, b) => a + b, 0) / reactionTimes.value.length)

  bestTime.value = best
  avgTime.value = avg
}

const startTest = () => {
  if (isTesting.value) return

  isTesting.value = true
  instruction.value = "准备..."
  startTime.value = null

  // 根据难度设置延迟时间
  if (difficulty.value === 'easy') {
    delayTime = 2000 + Math.random() * 3000 // 2-5秒
  } else if (difficulty.value === 'medium') {
    delayTime = 1000 + Math.random() * 2000 // 1-3秒
  } else {
    delayTime = 500 + Math.random() * 1500 // 0.5-2秒
  }

  timeoutId = setTimeout(() => {
    instruction.value = "立即点击!"
    startTime.value = new Date().getTime()
  }, delayTime)
}

const handleClick = () => {
  if (!isTesting.value) {
    startTest()
    return
  }

  if (!startTime.value) {
    // 提前点击
    clearTimeout(timeoutId)
    instruction.value = "太快了! 等待绿色"
    setTimeout(resetTest, 1500)
    return
  }

  const endTime = new Date().getTime()
  const reactionTime = endTime - startTime.value

  reactionTimes.value.push(reactionTime)
  localStorage.setItem('reactionTimes', JSON.stringify(reactionTimes.value))

  instruction.value = `${reactionTime} 毫秒`
  updateStats()

  setTimeout(resetTest, 1500)
}

const resetTest = () => {
  isTesting.value = false
  startTime.value = null
  instruction.value = "点击开始测试"
}

// 从本地存储加载历史记录
onMounted(() => {
  const savedTimes = localStorage.getItem('reactionTimes')
  if (savedTimes) {
    reactionTimes.value = JSON.parse(savedTimes)
    updateStats()
  }
})

onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})
</script>

<style scoped>
.tool-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.75rem;
  font-weight: bold;
}

.test-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.stats-section {
  margin-bottom: 1.5rem;
}

.stats {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.stat-label {
  color: #666;
  font-size: 0.875rem;
}

.stat-value {
  font-weight: bold;
  margin-left: 0.5rem;
  color: #333;
}

.target-area {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 1.5rem;
}

.bg-green-500 {
  background-color: #4ade80 !important;
}

.bg-red-500 {
  background-color: #f87171 !important;
}

.bg-gray-200 {
  background-color: #e2e8f0 !important;
}

.instruction {
  font-size: 1.25rem;
  color: #333;
}

.pulse {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.controls-section {
  margin-bottom: 1.5rem;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.3s ease;
}

.action-btn.primary {
  background: #4299e1;
  color: white;
}

.action-btn.primary:hover:not(:disabled) {
  background: #3182ce;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.select-field {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
  background: white;
}

.history-section {
  background: #f1f5f9;
  border-radius: 8px;
  padding: 1rem;
}

.history-title {
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.75rem;
}

.history {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.history-item {
  background: #e2e8f0;
  color: #4a5568;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.history-empty {
  color: #94a3b8;
  font-style: italic;
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .action-btn {
    width: 100%;
  }

  .select-field {
    width: 100%;
  }
}

.bg-green-500 {
  background-color: #4ade80 !important;
}

.bg-red-500 {
  background-color: #f87171 !important;
}

.bg-gray-200 {
  background-color: #e2e8f0 !important;
}

.bg-green-500 .instruction,
.bg-red-500 .instruction {
  color: white !important;
  font-weight: bold;
}
</style>