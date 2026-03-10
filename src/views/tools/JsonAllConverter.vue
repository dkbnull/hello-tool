<script setup>
import {ref} from 'vue'

const jsonInput = ref('')
const output = ref('')
const error = ref('')
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

// 清空输入
const clearInput = () => {
  jsonInput.value = ''
  output.value = ''
  error.value = ''
}

// 格式化JSON
const formatJson = () => {
  try {
    const obj = JSON.parse(jsonInput.value)
    jsonInput.value = JSON.stringify(obj, null, 2)
    error.value = ''
  } catch (err) {
    error.value = '无效的JSON格式'
  }
}

// 压缩JSON
const minifyJson = () => {
  try {
    const obj = JSON.parse(jsonInput.value)
    jsonInput.value = JSON.stringify(obj)
    error.value = ''
  } catch (err) {
    error.value = '无效的JSON格式'
  }
}

// 验证JSON
const validateJson = () => {
  try {
    JSON.parse(jsonInput.value)
    error.value = 'JSON格式有效'
  } catch (err) {
    error.value = '无效的JSON格式: ' + err.message
  }
}

// JSON转XML
const jsonToXml = () => {
  try {
    const obj = JSON.parse(jsonInput.value)
    output.value = jsonToXmlRecursive(obj, 'root')
    error.value = ''
  } catch (err) {
    error.value = '无效的JSON格式'
  }
}

// 递归转换JSON为XML
const jsonToXmlRecursive = (obj, root, indent = 0) => {
  const indentStr = '  '.repeat(indent)
  let xml = `${indentStr}<${root}>`

  if (typeof obj === 'object' && obj !== null) {
    xml += '\n'
    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        obj[key].forEach(item => {
          xml += jsonToXmlRecursive(item, key, indent + 1)
        })
      } else {
        xml += jsonToXmlRecursive(obj[key], key, indent + 1)
      }
    }
    xml += indentStr
  } else {
    xml += obj
  }

  xml += `</${root}>`
  xml += '\n'
  return xml
}

// JSON转CSV
const jsonToCsv = () => {
  try {
    const data = JSON.parse(jsonInput.value)
    const array = Array.isArray(data) ? data : [data]

    if (array.length === 0) {
      output.value = ''
      return
    }

    const headers = Object.keys(array[0])
    const csv = [
      headers.join(','),
      ...array.map(row => {
        return headers.map(header => {
          const value = row[header]
          if (Array.isArray(value)) {
            return `"${value.join(', ')}"`
          } else if (typeof value === 'object' && value !== null) {
            return `"${JSON.stringify(value)}"`
          } else {
            const isString = typeof value === 'string'
            const needsQuotes = isString && (value.includes(',') || value.includes('"') || value.includes('\n'))
            return needsQuotes ? `"${value.replace(/"/g, '""')}"` : value
          }
        }).join(',')
      })
    ].join('\n')

    output.value = csv
    error.value = ''
  } catch (err) {
    error.value = '无效的JSON格式'
  }
}

// JSON转YAML
const jsonToYaml = () => {
  try {
    const obj = JSON.parse(jsonInput.value)
    output.value = jsonToYamlRecursive(obj, 0)
    error.value = ''
  } catch (err) {
    error.value = '无效的JSON格式'
  }
}

// 递归转换JSON为YAML
const jsonToYamlRecursive = (obj, indent) => {
  const spaces = '  '.repeat(indent)
  let yaml = ''

  if (Array.isArray(obj)) {
    obj.forEach(item => {
      if (typeof item === 'object' && item !== null) {
        yaml += `${spaces}-\n${jsonToYamlRecursive(item, indent + 1)}`
      } else {
        yaml += `${spaces}- ${item}\n`
      }
    })
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        yaml += `${spaces}${key}:\n${jsonToYamlRecursive(obj[key], indent + 1)}`
      } else {
        yaml += `${spaces}${key}: ${obj[key]}\n`
      }
    }
  } else {
    yaml += `${spaces}${obj}\n`
  }

  return yaml
}
</script>

<template>
  <div class="tool-container">
    <h2>JSON全能转换器</h2>
    <p class="tool-description">支持格式化、压缩、转XML/CSV/YAML</p>

    <div class="converter-container">
      <!-- 左侧输入区域 -->
      <div class="input-section">
        <div class="input-header">
          <h3>JSON</h3>
          <div class="input-actions">
            <button @click="clearInput" class="action-btn secondary">
              <i class="fas fa-trash-alt mr-1"></i>清空
            </button>
          </div>
        </div>
        <textarea
            v-model="jsonInput"
            rows="8"
        ></textarea>

        <div class="input-buttons">
          <button @click="formatJson" class="action-btn success">
            <i class="fas fa-align-left mr-1"></i>格式化
          </button>
          <button @click="minifyJson" class="action-btn purple">
            <i class="fas fa-compress-alt mr-1"></i>压缩
          </button>
          <button @click="validateJson" class="action-btn warning">
            <i class="fas fa-check-circle mr-1"></i>验证
          </button>
        </div>
      </div>

      <!-- 中间转换选项区域 -->
      <div class="options-section">
        <div class="options-buttons">
          <button id="toXmlBtn" @click="jsonToXml" class="option-btn indigo">
            <i class="fas fa-code mr-1"></i>转XML
          </button>
          <button id="toCsvBtn" @click="jsonToCsv" class="option-btn teal">
            <i class="fas fa-file-csv mr-1"></i>转CSV
          </button>
          <button id="toYamlBtn" @click="jsonToYaml" class="option-btn amber">
            <i class="fas fa-file-alt mr-1"></i>转YAML
          </button>
        </div>
      </div>

      <!-- 右侧输出区域 -->
      <div class="output-section">
        <div class="output-header">
          <h3>转换结果</h3>
          <div class="output-actions">
            <button @click="copyToClipboard(output)" class="action-btn copy-btn" :disabled="!output">
              <i class="fas fa-copy mr-1"></i>复制
            </button>
          </div>
        </div>
        <pre class="output-area">{{ output }}</pre>
        <div v-if="error" class="error-area">{{ error }}</div>
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
  margin-bottom: 0.5rem;
  font-size: 1.75rem;
  font-weight: bold;
}

.tool-description {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

.converter-container {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

@media (min-width: 1024px) {
  .converter-container {
    flex-wrap: nowrap;
  }

  .input-section {
    flex: 1;
  }

  .options-section {
    flex: 0 0 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .output-section {
    flex: 1;
  }
}

.input-section,
.options-section,
.output-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.input-header,
.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

h3 {
  font-size: 1.25rem;
  font-weight: semibold;
  color: #333;
  margin: 0;
}

.input-actions,
.output-actions {
  display: flex;
  gap: 0.5rem;
}

textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: monospace;
  resize: vertical;
  min-height: 200px;
}

.input-buttons {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.options-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.action-btn,
.option-btn {
  padding: 0.5rem 1rem;
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

.action-btn.primary:hover {
  background: #3182ce;
}

.action-btn.secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.action-btn.secondary:hover {
  background: #cbd5e0;
}

.action-btn.success {
  background: #48bb78;
  color: white;
}

.action-btn.success:hover {
  background: #38a169;
}

.action-btn.warning {
  background: #ed8936;
  color: white;
}

.action-btn.warning:hover {
  background: #dd6b20;
}

.action-btn.purple {
  background: #9f7aea;
  color: white;
}

.action-btn.purple:hover {
  background: #805ad5;
}

.action-btn.copy-btn {
  background: #42b883;
  color: white;
}

.action-btn.copy-btn:hover:not(:disabled) {
  background: #35495e;
}

.action-btn.copy-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.option-btn {
  width: 100%;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.option-btn.indigo {
  background: #4f46e5;
}

.option-btn.indigo:hover {
  background: #4338ca;
}

.option-btn.teal {
  background: #0d9488;
}

.option-btn.teal:hover {
  background: #0f766e;
}

.option-btn.amber {
  background: #d97706;
}

.option-btn.amber:hover {
  background: #b45309;
}

.output-area {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: monospace;
  background: #f7fafc;
  overflow: auto;
  height: 200px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.error-area {
  margin-top: 0.75rem;
  color: #e53e3e;
  font-size: 0.875rem;
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