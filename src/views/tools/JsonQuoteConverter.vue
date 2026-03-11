<script setup>
import {ref, watch} from 'vue'

const singleQuoteJson = ref('')
const doubleQuoteJson = ref('')
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

const convertQuotes = () => {
  if (!singleQuoteJson.value) {
    doubleQuoteJson.value = ''
    return
  }

  try {
    // 替换单引号为双引号
    let converted = singleQuoteJson.value
        .replace(/'/g, '"')
        // 处理转义字符
        .replace(/\\'/g, "'")

    // 验证转换后的JSON
    JSON.parse(converted)
    doubleQuoteJson.value = JSON.stringify(JSON.parse(converted), null, 2)
  } catch (error) {
    doubleQuoteJson.value = '转换失败，请检查输入格式'
  }
}

watch(singleQuoteJson, convertQuotes)
</script>

<template>
  <div class="tool-container">
    <h2>JSON单引号转双引号</h2>
    <div class="converter">
      <div class="input-group">
        <label for="single-quote-json">单引号JSON：</label>
        <textarea
            id="single-quote-json"
            v-model="singleQuoteJson"
            placeholder="输入单引号JSON"
            rows="8"
        ></textarea>
      </div>
      <div class="arrow">→</div>
      <div class="input-group">
        <div class="input-header">
          <label for="double-quote-json">双引号JSON：</label>
          <button @click="copyToClipboard(doubleQuoteJson)" class="copy-btn" :disabled="!doubleQuoteJson">复制</button>
        </div>
        <textarea
            id="double-quote-json"
            v-model="doubleQuoteJson"
            placeholder="转换后的标准JSON"
            rows="8"
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
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.input-group {
  flex: 1;
  min-width: 400px;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
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
  min-height: 400px;
  resize: vertical;
}

textarea[readonly] {
  background: #f5f5f5;
}

.arrow {
  font-size: 2rem;
  color: #42b883;
  font-weight: bold;
}
</style>