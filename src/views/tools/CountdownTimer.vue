<template>
  <div class="tool-container">
    <h2>倒计时定时器</h2>

    <div class="timer-container">
      <div class="input-section">
        <div class="input-header">
          <h3>设置时间</h3>
        </div>

        <div class="time-input">
          <div class="time-field">
            <input
                type="number"
                v-model.number="hours"
                class="input-field"
                placeholder="00"
                min="0"
            >
            <span class="field-label">小时</span>
          </div>
          <div class="time-field">
            <input
                type="number"
                v-model.number="minutes"
                class="input-field"
                placeholder="00"
                min="0"
                max="59"
            >
            <span class="field-label">分钟</span>
          </div>
          <div class="time-field">
            <input
                type="number"
                v-model.number="seconds"
                class="input-field"
                placeholder="00"
                min="0"
                max="59"
            >
            <span class="field-label">秒</span>
          </div>
        </div>

        <div class="display" id="display">{{ displayTime }}</div>

        <div class="controls">
          <button @click="startTimer" class="action-btn primary" :disabled="isRunning">
            <i class="fas fa-play mr-1"></i> 开始
          </button>
          <button @click="pauseTimer" class="action-btn secondary" :disabled="!isRunning">
            <i class="fas fa-pause mr-1"></i> 暂停
          </button>
          <button @click="resetTimer" class="action-btn secondary">
            <i class="fas fa-redo mr-1"></i> 重置
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onUnmounted, ref} from 'vue'
import {showToast} from '../../utils/toast'

const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
const totalSeconds = ref(0)
const isRunning = ref(false)
let timer = null

const displayTime = computed(() => {
  const h = Math.floor(totalSeconds.value / 3600)
  const m = Math.floor((totalSeconds.value % 3600) / 60)
  const s = totalSeconds.value % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const startTimer = () => {
  if (isRunning.value) return

  totalSeconds.value = hours.value * 3600 + minutes.value * 60 + seconds.value

  if (totalSeconds.value <= 0) {
    showToast({message: '请输入有效时间!'})
    return
  }

  isRunning.value = true
  timer = setInterval(updateTimer, 1000)
}

const updateTimer = () => {
  if (totalSeconds.value <= 0) {
    clearInterval(timer)
    isRunning.value = false
    showToast({message: '时间到'})
    return
  }

  totalSeconds.value--
}

const pauseTimer = () => {
  clearInterval(timer)
  isRunning.value = false
}

const resetTimer = () => {
  clearInterval(timer)
  isRunning.value = false
  totalSeconds.value = 0
  hours.value = 0
  minutes.value = 0
  seconds.value = 0
}

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
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

.timer-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

h3 {
  font-size: 1.25rem;
  color: #333;
  margin: 0;
}

.time-input {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.time-field {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.input-field {
  width: 80px;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1.25rem;
  text-align: center;
  transition: all 0.3s ease;
}

.input-field:focus {
  border-color: #4299e1;
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

.field-label {
  font-size: 0.875rem;
  color: #666;
}

.display {
  font-size: 3.5rem;
  font-weight: bold;
  color: #333;
  margin: 2rem 0;
  text-align: center;
  letter-spacing: 2px;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.primary {
  background: #4299e1;
  color: white;
}

.action-btn.primary:hover:not(:disabled) {
  background: #3182ce;
}

.action-btn.secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.action-btn.secondary:hover:not(:disabled) {
  background: #cbd5e0;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .time-input {
    gap: 1rem;
  }

  .input-field {
    width: 70px;
    font-size: 1rem;
  }

  .display {
    font-size: 2.5rem;
  }

  .controls {
    flex-wrap: wrap;
  }

  .action-btn {
    flex: 1;
    min-width: 100px;
  }
}
</style>