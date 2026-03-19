<template>
  <div class="tool-container">
    <h2>JSON全能转换</h2>

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
            <button @click="handleCopy(output)" class="action-btn copy-btn" :disabled="!output">
              <i class="fas fa-copy mr-1"></i>复制
            </button>
          </div>
        </div>
        <pre class="output-area">{{ output }}</pre>
        <div v-if="error" class="error-message">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {copyToClipboard} from '../../utils/clipboard'
import {showToast} from '../../utils/toast'

const jsonInput = ref('')
const output = ref('')
const error = ref('')

// 复制到剪贴板
const handleCopy = async (text) => {
  if (text) {
    const success = await copyToClipboard(text)
    showToast({
      message: success ? '已复制到剪贴板' : '复制失败'
    })
  }
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
    showToast({
      message: 'JSON格式有效'
    })
    error.value = ''
  } catch (err) {
    showToast({
      message: '无效的JSON格式: ' + err.message
    })
    error.value = ''
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

<style scoped>
.tool-container {
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

.converter-container {
  padding: 2rem;
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
    flex: 0 0 150px;
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
.output-section {
  flex: 1;
  min-width: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.options-section {
  border-radius: 8px;
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
  color: #333;
  margin: 0;
}

.input-actions,
.output-actions {
  display: flex;
  gap: 0.5rem;
}

textarea {
  min-height: 300px;
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
  color: white;
  width: 100%;
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
  height: 300px;
  white-space: pre-wrap;
  word-wrap: break-word;
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