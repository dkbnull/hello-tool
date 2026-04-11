<template>
  <div class="tool-container">
    <h2>倒计时定时器</h2>

    <div class="countdown-display section-card">
      <div class="countdown-time">{{ formattedTime }}</div>
      <div v-if="isFinished" class="countdown-finished">⏰ 时间到！</div>
    </div>

    <div class="countdown-controls section-card">
      <div class="input-row">
        <div class="input-group">
          <label>时</label>
          <input type="number" v-model.number="hours" min="0" max="99" :disabled="isRunning"/>
        </div>
        <div class="input-group">
          <label>分</label>
          <input type="number" v-model.number="minutes" min="0" max="59" :disabled="isRunning"/>
        </div>
        <div class="input-group">
          <label>秒</label>
          <input type="number" v-model.number="seconds" min="0" max="59" :disabled="isRunning"/>
        </div>
      </div>

      <div class="button-group">
        <button @click="startCountdown" :disabled="isRunning" class="btn btn-success">开始</button>
        <button @click="pauseCountdown" :disabled="!isRunning" class="btn btn-warning">暂停</button>
        <button @click="resetCountdown" class="btn btn-danger">重置</button>
      </div>
    </div>

    <div class="presets section-card">
      <h3>快速设置</h3>
      <div class="preset-buttons">
        <button v-for="preset in presets" :key="preset.label" @click="setPreset(preset)" :disabled="isRunning"
                class="btn btn-primary btn-sm">
          {{ preset.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'

const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
const remainingTime = ref(0)
const isRunning = ref(false)
const isFinished = ref(false)

let timer = null

const presets = [
  {label: '1分钟', h: 0, m: 1, s: 0},
  {label: '5分钟', h: 0, m: 5, s: 0},
  {label: '10分钟', h: 0, m: 10, s: 0},
  {label: '15分钟', h: 0, m: 15, s: 0},
  {label: '30分钟', h: 0, m: 30, s: 0},
  {label: '45分钟', h: 0, m: 45, s: 0},
  {label: '1小时', h: 1, m: 0, s: 0},
  {label: '2小时', h: 2, m: 0, s: 0},
]

const formattedTime = computed(() => {
  const total = remainingTime.value
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const setPreset = (preset) => {
  hours.value = preset.h
  minutes.value = preset.m
  seconds.value = preset.s
  resetCountdown()
}

const startCountdown = () => {
  if (remainingTime.value <= 0) {
    remainingTime.value = hours.value * 3600 + minutes.value * 60 + seconds.value
  }
  if (remainingTime.value <= 0) return

  isRunning.value = true
  isFinished.value = false
  timer = setInterval(() => {
    remainingTime.value--
    if (remainingTime.value <= 0) {
      clearInterval(timer)
      timer = null
      isRunning.value = false
      isFinished.value = true
    }
  }, 1000)
}

const pauseCountdown = () => {
  isRunning.value = false
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const resetCountdown = () => {
  pauseCountdown()
  remainingTime.value = 0
  isFinished.value = false
}
</script>

<style scoped>
.tool-container {
  max-width: 800px;
}

.countdown-display {
  text-align: center;
  margin-bottom: 2rem;
}

.countdown-time {
  font-size: 4rem;
  font-weight: bold;
  font-family: 'Consolas', 'Monaco', monospace;
  color: var(--color-primary);
  letter-spacing: 4px;
}

.countdown-finished {
  font-size: 1.5rem;
  color: var(--color-danger);
  margin-top: 1rem;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.input-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.input-row .input-group {
  flex: 1;
}

.input-row label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-text-secondary);
  font-weight: bold;
  text-align: center;
}

.input-row input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 1.5rem;
  text-align: center;
  font-family: 'Consolas', 'Monaco', monospace;
}

.input-row input:focus {
  border-color: var(--color-info);
  outline: none;
}

.input-row input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.presets h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--color-primary);
}

.preset-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

@media (max-width: 480px) {
  .countdown-time {
    font-size: 2.5rem;
  }

  .input-row input {
    font-size: 1.2rem;
    padding: 0.5rem;
  }
}
</style>
