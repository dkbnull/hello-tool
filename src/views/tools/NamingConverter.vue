<script setup>
import {ref, watch} from 'vue'

const inputText = ref('')
const camelCaseOutput = ref('')
const snakeCaseOutput = ref('')
const toastMessage = ref('')
const showToast = ref(false)
let toastTimeout = null

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

// 转换命名格式
const convertNaming = () => {
  if (!inputText.value) {
    camelCaseOutput.value = ''
    snakeCaseOutput.value = ''
    return
  }

  // 转换为驼峰命名
  camelCaseOutput.value = toCamelCase(inputText.value)

  // 转换为下划线命名
  snakeCaseOutput.value = toSnakeCase(inputText.value)
}

// 转换为驼峰命名
const toCamelCase = (str) => {
  return str
      .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
      .replace(/^./, str => str.toLowerCase())
}

// 转换为下划线命名
const toSnakeCase = (str) => {
  return str
      .replace(/([A-Z])/g, '_$1')
      .replace(/[-\s]+/g, '_')
      .toLowerCase()
      .replace(/^_+|_+$/g, '')
}

watch(inputText, convertNaming)
</script>

<template>
  <div class="tool-container">
    <h2>实体类属性命名转换</h2>
    <div class="converter">
      <div class="input-group">
        <div class="input-header">
          <label for="input-text">输入文本：</label>
        </div>
        <textarea
            id="input-text"
            v-model="inputText"
            placeholder="输入属性名，多个属性名请换行"
            rows="4"
        ></textarea>
      </div>

      <div class="result-section">
        <div class="input-header">
          <h3>驼峰命名：</h3>
          <button @click="copyToClipboard(camelCaseOutput)" class="copy-btn" :disabled="!camelCaseOutput">复制</button>
        </div>
        <textarea
            v-model="camelCaseOutput"
            rows="4"
            readonly
        ></textarea>
      </div>

      <div class="result-section">
        <div class="input-header">
          <h3>下划线命名：</h3>
          <button @click="copyToClipboard(snakeCaseOutput)" class="copy-btn" :disabled="!snakeCaseOutput">复制</button>
        </div>
        <textarea
            v-model="snakeCaseOutput"
            rows="4"
            readonly
        ></textarea>
      </div>
    </div>
  </div>

  <!-- Toast提示 -->
  <div v-if="showToast" class="toast">
    {{ toastMessage }}
  </div>
</template>

<style scoped>
.tool-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.converter {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group,
.result-section {
  width: 100%;
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.input-header label {
  margin: 0;
  color: #666;
}

.input-header h3 {
  margin: 0;
  color: #42b883;
}

label,
h3 {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

h3 {
  color: #42b883;
}

.copy-btn {
  padding: 0.5rem 1rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.3s ease;
}

.copy-btn:hover:not(:disabled) {
  background: #35495e;
}

.copy-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
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

textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
}

textarea[readonly] {
  background: #f5f5f5;
}
</style>