<template>
  <div class="tool-container">
    <h2>时间戳与日期转换</h2>

    <div class="current-time section-card">
      <h3>当前时间</h3>
      <div class="current-time-content">
        <div class="current-time-item">
          <span>日期时间：</span>
          <span class="time-value">{{ currentTime }}</span>
          <button @click="handleCopy(currentTime)" class="btn btn-copy btn-sm">复制</button>
        </div>
        <div class="current-time-item">
          <span>时间戳（秒）：</span>
          <span class="time-value">{{ currentTimestamp }}</span>
          <button @click="handleCopy(currentTimestamp)" class="btn btn-copy btn-sm">复制</button>
        </div>
        <div class="current-time-item">
          <span>时间戳（毫秒）：</span>
          <span class="time-value">{{ currentTimestampMs }}</span>
          <button @click="handleCopy(currentTimestampMs)" class="btn btn-copy btn-sm">复制</button>
        </div>
      </div>
    </div>

    <div class="converter">
      <div class="input-group">
        <label>UNIX时间戳（支持秒和毫秒）：</label>
        <div class="input-with-btn">
          <input type="text" v-model="timestamp" placeholder="输入时间戳"/>
          <button @click="handleCopy(timestamp)" class="btn btn-copy">复制</button>
        </div>
        <button @click="handleTimestampToDateTime" class="btn btn-success mt-sm">转换为日期</button>
        <div v-if="timestampError" class="error-message">{{ timestampError }}</div>
      </div>
      <div class="arrow">⇄</div>
      <div class="input-group">
        <label>日期时间：</label>
        <div class="input-with-btn">
          <input type="datetime-local" v-model="dateTime" step="1"/>
          <button @click="handleCopy(dateTime)" class="btn btn-copy">复制</button>
        </div>
        <button @click="handleDateTimeToTimestamp" class="btn btn-success mt-sm">转换为时间戳</button>
        <div v-if="dateTimeError" class="error-message">{{ dateTimeError }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from 'vue'
import {dateTimeToTimestamp, getCurrentTimeInfo, timestampToDateTime} from '@/utils/time'
import {useCopy} from '@/composables/useCopy'

const {handleCopy} = useCopy()

const timestamp = ref('')
const dateTime = ref('')
const timestampError = ref('')
const dateTimeError = ref('')
const currentTime = ref('')
const currentTimestamp = ref('')
const currentTimestampMs = ref('')

let timer = null

const updateCurrentTime = () => {
  const timeInfo = getCurrentTimeInfo()
  currentTime.value = timeInfo.currentTime
  currentTimestamp.value = timeInfo.currentTimestamp
  currentTimestampMs.value = timeInfo.currentTimestampMs
}

const handleTimestampToDateTime = () => {
  const result = timestampToDateTime(timestamp.value)
  dateTime.value = result.dateTime
  timestampError.value = result.error
  dateTimeError.value = ''
}

const handleDateTimeToTimestamp = () => {
  const result = dateTimeToTimestamp(dateTime.value)
  timestamp.value = result.timestamp
  dateTimeError.value = result.error
  timestampError.value = ''
}

onMounted(() => {
  updateCurrentTime()
  timer = setInterval(updateCurrentTime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.tool-container {
  max-width: 800px;
}

.current-time {
  margin-bottom: 2rem;
}

.current-time h3 {
  margin-top: 0;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.current-time-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.current-time-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.current-time-item span:first-child {
  font-weight: bold;
  min-width: 120px;
}

.time-value {
  flex: 1;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--color-text);
}

.input-with-btn {
  display: flex;
}

.input-with-btn input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
  font-size: 1rem;
}

.input-with-btn input:focus {
  border-color: var(--color-info);
  outline: none;
}

.input-with-btn .btn {
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-text-secondary);
  font-weight: bold;
}
</style>
