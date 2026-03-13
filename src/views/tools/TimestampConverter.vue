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
          <button @click="copyToClipboard(currentTime)" class="copy-btn">复制</button>
        </div>
        <div class="current-time-item">
          <span>时间戳（秒）：</span>
          <span class="time-value">{{ currentTimestamp }}</span>
          <button @click="copyToClipboard(currentTimestamp)" class="copy-btn">复制</button>
        </div>
        <div class="current-time-item">
          <span>时间戳（毫秒）：</span>
          <span class="time-value">{{ currentTimestampMs }}</span>
          <button @click="copyToClipboard(currentTimestampMs)" class="copy-btn">复制</button>
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
          <button @click="copyToClipboard(timestamp)" class="copy-btn">复制</button>
        </div>
        <button @click="timestampToDateTime" class="convert-btn">转换为日期</button>
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
          <button @click="copyToClipboard(dateTime)" class="copy-btn">复制</button>
        </div>
        <button @click="dateTimeToTimestamp" class="convert-btn">转换为时间戳</button>
        <div v-if="dateTimeError" class="error-message">{{ dateTimeError }}</div>
      </div>
    </div>
  </div>

  <!-- Toast提示 -->
  <div v-if="showToast" class="toast">
    {{ toastMessage }}
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'

const timestamp = ref('')
const dateTime = ref('')
const timestampError = ref('')
const dateTimeError = ref('')
const currentTime = ref('')
const currentTimestamp = ref('')
const currentTimestampMs = ref('')
const toastMessage = ref('')
const showToast = ref(false)
let timestampTimeout = null
let toastTimeout = null

// 获取当前时间
const getCurrentTime = () => {
  const now = new Date()
  currentTime.value = now.toISOString().replace('T', ' ').replace('Z', '')
  currentTimestamp.value = Math.floor(now.getTime() / 1000).toString()
  currentTimestampMs.value = now.getTime().toString()
}

// 时间戳转日期
const timestampToDateTime = () => {
  timestampError.value = ''
  dateTimeError.value = ''

  if (timestamp.value) {
    const ts = timestamp.value.trim()
    // 检查是否为数字
    if (!/^\d+$/.test(ts)) {
      timestampError.value = '无效的时间戳格式'
      dateTime.value = ''
      return
    }

    let timestampNum = parseInt(ts)
    // 判断是秒还是毫秒
    if (ts.length === 10) {
      // 秒
      timestampNum *= 1000
    } else if (ts.length === 13) {
      // 毫秒
    } else {
      timestampError.value = '时间戳格式错误（应为10位秒或13位毫秒）'
      dateTime.value = ''
      return
    }

    const date = new Date(timestampNum)
    if (!isNaN(date.getTime())) {
      dateTime.value = date.toISOString().replace('T', ' ').replace('Z', '')
    } else {
      timestampError.value = '无效的时间戳'
      dateTime.value = ''
    }
  } else {
    dateTime.value = ''
  }
}

// 日期转时间戳
const dateTimeToTimestamp = () => {
  timestampError.value = ''
  dateTimeError.value = ''

  if (dateTime.value) {
    const date = new Date(dateTime.value)
    if (!isNaN(date.getTime())) {
      timestamp.value = Math.floor(date.getTime() / 1000).toString()
    } else {
      dateTimeError.value = '无效的日期格式'
      timestamp.value = ''
    }
  } else {
    timestamp.value = ''
  }
}

// 复制到剪贴板
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
      .then(() => {
        showToastMessage('已复制到剪贴板')
      })
      .catch((error) => {
        console.error('复制失败:', error)
        showToastMessage('复制失败')
      })
}

// 显示toast提示
const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true

  // 清除之前的定时器
  if (toastTimeout) {
    clearTimeout(toastTimeout)
  }

  // 3秒后自动隐藏
  toastTimeout = setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// 防抖函数
const debounce = (func, delay) => {
  return function () {
    clearTimeout(timestampTimeout)
    timestampTimeout = setTimeout(() => func.apply(this, arguments), delay)
  }
}

// 移除自动监听，改为手动触发转换

// 组件挂载时获取当前时间
onMounted(() => {
  getCurrentTime()
  // 每秒更新当前时间
  setInterval(getCurrentTime, 1000)
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
  background: #35495e;
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
  background: #35495e;
}

.arrow {
  font-size: 2rem;
  color: #42b883;
  font-weight: bold;
}

.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #35495e;
  color: white;
  padding: 1rem 2rem;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
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