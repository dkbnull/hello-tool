<template>
  <div class="timestamp-converter">
    <h2>时间戳转换器</h2>

    <div class="layout-container">
      <!-- 左侧：输入区域 -->
      <div class="left-panel">
        <div class="converter-section">
          <h3>时间戳转日期</h3>
          <div class="input-group">
            <input
                v-model="timestampInput"
                placeholder="输入UNIX时间戳"
                @input="convertTimestampToDate"
            >
            <select v-model="timestampUnit" @change="convertTimestampToDate">
              <option value="seconds">秒</option>
              <option value="milliseconds">毫秒</option>
            </select>
          </div>
          <div class="result">日期: {{ dateResult }}</div>
        </div>

        <div class="converter-section">
          <h3>日期转时间戳</h3>
          <div class="input-group">
            <input
                v-model="dateInput"
                placeholder="输入日期 (yyyy-MM-dd HH:mm:ss)"
                @input="convertDateToTimestamp"
            >
          </div>
          <div class="result">
            <div>秒: {{ timestampSeconds }}</div>
            <div>毫秒: {{ timestampMilliseconds }}</div>
          </div>
        </div>
      </div>

      <!-- 右侧：当前时间信息 -->
      <div class="right-panel">
        <div class="current-time">
          <h3>当前时间信息</h3>
          <div>当前时间: {{ currentTime }}</div>
          <div>时间戳(秒): {{ currentTimestampSeconds }}</div>
          <div>时间戳(毫秒): {{ currentTimestampMilliseconds }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'

const timestampInput = ref('')
const timestampUnit = ref('seconds')
const dateInput = ref('')
const dateResult = ref('')
const timestampSeconds = ref('')
const timestampMilliseconds = ref('')
const currentTime = ref('')
const currentTimestampSeconds = ref('')
const currentTimestampMilliseconds = ref('')

const convertTimestampToDate = () => {
  try {
    let timestamp = parseInt(timestampInput.value)
    if (timestampUnit.value === 'seconds') {
      timestamp *= 1000
    }
    const date = new Date(timestamp)
    dateResult.value = date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    })
  } catch (error) {
    dateResult.value = '无效的时间戳'
  }
}

const convertDateToTimestamp = () => {
  try {
    const date = new Date(dateInput.value)
    if (isNaN(date.getTime())) {
      timestampSeconds.value = '无效日期'
      timestampMilliseconds.value = '无效日期'
      return
    }
    timestampSeconds.value = Math.floor(date.getTime() / 1000)
    timestampMilliseconds.value = date.getTime()
  } catch (error) {
    timestampSeconds.value = '无效日期'
    timestampMilliseconds.value = '无效日期'
  }
}

const updateCurrentTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN')
  currentTimestampSeconds.value = Math.floor(now.getTime() / 1000)
  currentTimestampMilliseconds.value = now.getTime()
}

onMounted(() => {
  updateCurrentTime()
  setInterval(updateCurrentTime, 1000)
})
</script>

<style scoped>
.timestamp-converter {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.layout-container {
  display: flex;
  gap: 20px;
}

.left-panel {
  flex: 1;
}

.right-panel {
  flex: 1;
}

.converter-section {
  background: #f8f9fa;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
}

.input-group {
  display: flex;
  gap: 5px;
  margin: 10px 0;
}

input, select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input {
  min-width: 220px;
}

input::placeholder {
  font-size: 14px;
  color: #999;
}

.result {
  margin-top: 10px;
  padding: 8px;
  background: white;
  border-radius: 4px;
  font-family: monospace;
  font-size: 14px;
}

.current-time {
  background: #e8f4fd;
  padding: 20px;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .layout-container {
    flex-direction: column;
  }

  .input-group {
    flex-direction: column;
    gap: 5px;
  }

  input {
    min-width: 100%;
  }

  .converter-section,
  .current-time {
    padding: 10px;
  }
}
</style>
