<template>
  <div class="tool-container">
    <h2>时间戳与日期转换</h2>

    <!-- 当前时间展示 -->
    <div class="current-time">
      <h3>当前时间</h3>
      <div class="current-time-content">
        <div class="current-time-item">
          <span>日期时间：</span>
          <span class="time-value">{{ currentTime }}</span>
          <button @click="handleCopy(currentTime)" class="copy-btn">复制</button>
        </div>
        <div class="current-time-item">
          <span>时间戳（秒）：</span>
          <span class="time-value">{{ currentTimestamp }}</span>
          <button @click="handleCopy(currentTimestamp)" class="copy-btn">复制</button>
        </div>
        <div class="current-time-item">
          <span>时间戳（毫秒）：</span>
          <span class="time-value">{{ currentTimestampMs }}</span>
          <button @click="handleCopy(currentTimestampMs)" class="copy-btn">复制</button>
        </div>
      </div>
    </div>

    <div class="converter">
      <div class="input-group">
        <label for="timestamp">UNIX时间戳（支持秒和毫秒）：</label>
        <div class="input-with-copy">
          <input
              type="text"
              id="timestamp"
              v-model="timestamp"
              placeholder="输入时间戳"
          />
          <button @click="handleCopy(timestamp)" class="copy-btn">复制</button>
        </div>
        <button @click="handleTimestampToDateTime" class="convert-btn">转换为日期</button>
        <div v-if="timestampError" class="error-message">{{ timestampError }}</div>
      </div>
      <div class="arrow">⇄</div>
      <div class="input-group">
        <label for="datetime">日期时间：</label>
        <div class="input-with-copy">
          <input
              type="datetime-local"
              id="datetime"
              v-model="dateTime"
              placeholder="yyyy-MM-dd hh:mm:ss"
              step="1"
          />
          <button @click="handleCopy(dateTime)" class="copy-btn">复制</button>
        </div>
        <button @click="handleDateTimeToTimestamp" class="convert-btn">转换为时间戳</button>
        <div v-if="dateTimeError" class="error-message">{{ dateTimeError }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {dateTimeToTimestamp, getCurrentTimeInfo, timestampToDateTime} from '../../utils/time'
import {copyToClipboard} from '../../utils/clipboard'
import {showToast} from '../../utils/toast'

const timestamp = ref('')
const dateTime = ref('')
const timestampError = ref('')
const dateTimeError = ref('')
const currentTime = ref('')
const currentTimestamp = ref('')
const currentTimestampMs = ref('')

// 获取当前时间
const updateCurrentTime = () => {
  const timeInfo = getCurrentTimeInfo()
  currentTime.value = timeInfo.currentTime
  currentTimestamp.value = timeInfo.currentTimestamp
  currentTimestampMs.value = timeInfo.currentTimestampMs
}

// 时间戳转日期
const handleTimestampToDateTime = () => {
  const result = timestampToDateTime(timestamp.value)
  dateTime.value = result.dateTime
  timestampError.value = result.error
  dateTimeError.value = ''
}

// 日期转时间戳
const handleDateTimeToTimestamp = () => {
  const result = dateTimeToTimestamp(dateTime.value)
  timestamp.value = result.timestamp
  dateTimeError.value = result.error
  timestampError.value = ''
}

// 复制到剪贴板
const handleCopy = async (text) => {
  if (text) {
    const success = await copyToClipboard(text)
    showToast({
      message: success ? '已复制到剪贴板' : '复制失败'
    })
  }
}

// 组件挂载时获取当前时间
onMounted(() => {
  updateCurrentTime()
  // 每秒更新当前时间
  setInterval(updateCurrentTime, 1000)
})
</script>

<style scoped>
.tool-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.current-time {
  background: #f5f5f5;
  padding: 2rem;
  border-radius: 4px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.current-time h3 {
  margin-top: 0;
  color: #42b883;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
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
  font-family: monospace;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.converter {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.arrow {
  align-self: center;
  font-size: 2rem;
  color: #42b883;
  font-weight: bold;
  margin: 0 1rem;
}

.input-group {
  flex: 1;
  min-width: 300px;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
  font-weight: bold;
}

.input-with-copy {
  position: relative;
  display: flex;
}

input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 1rem;
}

.error-message {
  color: #ff4d4f;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.copy-btn {
  padding: 0.75rem 1rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background 0.3s ease;
}

.copy-btn:hover {
  background: #38a169;
}

.convert-btn {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.convert-btn:hover {
  background: #38a169;
}

.arrow {
  font-size: 2rem;
  color: #42b883;
  font-weight: bold;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>