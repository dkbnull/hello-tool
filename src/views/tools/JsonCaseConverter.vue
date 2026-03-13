<template>
  <div class="tool-container">
    <h2>JSON大小写转换</h2>
    <div class="converter">
      <div class="input-group">
        <div class="input-header">
          <label for="original-json">原始JSON：</label>
        </div>
        <textarea
            id="original-json"
            v-model="originalJson"
            placeholder="输入JSON"
            rows="6"
        ></textarea>
      </div>

      <div class="result-section">
        <div class="input-header">
          <h3>驼峰命名：</h3>
          <button @click="copyToClipboard(camelCaseJson)" class="copy-btn" :disabled="!camelCaseJson">复制</button>
        </div>
        <textarea
            v-model="camelCaseJson"
            rows="6"
            readonly
        ></textarea>
      </div>

      <div class="result-section">
        <div class="input-header">
          <h3>下划线命名：</h3>
          <button @click="copyToClipboard(snakeCaseJson)" class="copy-btn" :disabled="!snakeCaseJson">复制</button>
        </div>
        <textarea
            v-model="snakeCaseJson"
            rows="6"
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

<script setup>
import {ref, watch} from 'vue'

const originalJson = ref('')
const camelCaseJson = ref('')
const snakeCaseJson = ref('')
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

// 转换JSON大小写
const convertCase = () => {
  if (!originalJson.value) {
    camelCaseJson.value = ''
    snakeCaseJson.value = ''
    return
  }

  try {
    const obj = JSON.parse(originalJson.value)

    // 转换为驼峰命名
    camelCaseJson.value = JSON.stringify(convertKeys(obj, toCamelCase), null, 2)

    // 转换为下划线命名
    snakeCaseJson.value = JSON.stringify(convertKeys(obj, toSnakeCase), null, 2)
  } catch (error) {
    camelCaseJson.value = '无效的JSON格式'
    snakeCaseJson.value = '无效的JSON格式'
  }
}

// 递归转换对象键名
const convertKeys = (obj, converter) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertKeys(item, converter))
  }

  const result = {}
  for (const key in obj) {
    result[converter(key)] = convertKeys(obj[key], converter)
  }
  return result
}

// 下划线转驼峰
const toCamelCase = (str) => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

// 驼峰转下划线
const toSnakeCase = (str) => {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase()
}

watch(originalJson, convertCase)
</script>

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