<script setup>
import {ref, watch} from 'vue'

const jsonInput = ref('')
const xmlInput = ref('')
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

// JSON转XML
const jsonToXml = () => {
  if (!jsonInput.value) {
    xmlInput.value = ''
    return
  }

  try {
    const obj = JSON.parse(jsonInput.value)
    xmlInput.value = jsonToXmlRecursive(obj, 'root')
  } catch (error) {
    xmlInput.value = '无效的JSON格式'
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

// XML转JSON
const xmlToJson = () => {
  if (!xmlInput.value) {
    jsonInput.value = ''
    return
  }

  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlInput.value, 'text/xml')
    const root = xmlDoc.documentElement
    const obj = xmlToJsonRecursive(root)
    jsonInput.value = JSON.stringify(obj, null, 2)
  } catch (error) {
    jsonInput.value = '无效的XML格式'
  }
}

// 递归转换XML为JSON
const xmlToJsonRecursive = (node) => {
  const obj = {}

  if (node.childNodes.length === 1 && node.childNodes[0].nodeType === 3) {
    return node.textContent
  }

  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i]
    if (child.nodeType === 1) {
      if (obj[child.nodeName]) {
        if (!Array.isArray(obj[child.nodeName])) {
          obj[child.nodeName] = [obj[child.nodeName]]
        }
        obj[child.nodeName].push(xmlToJsonRecursive(child))
      } else {
        obj[child.nodeName] = xmlToJsonRecursive(child)
      }
    }
  }

  return obj
}

// 监听输入变化
watch(jsonInput, jsonToXml)
watch(xmlInput, xmlToJson)
</script>

<template>
  <div class="tool-container">
    <h2>JSON XML互转</h2>
    <div class="converter">
      <div class="input-group">
        <div class="input-header">
          <label for="json-input">JSON：</label>
          <button @click="copyToClipboard(jsonInput)" class="copy-btn" :disabled="!jsonInput">复制</button>
        </div>
        <textarea
            id="json-input"
            v-model="jsonInput"
            placeholder="输入JSON"
            rows="8"
        ></textarea>
      </div>
      <div class="arrow">⇄</div>
      <div class="input-group">
        <div class="input-header">
          <label for="xml-input">XML：</label>
          <button @click="copyToClipboard(xmlInput)" class="copy-btn" :disabled="!xmlInput">复制</button>
        </div>
        <textarea
            id="xml-input"
            v-model="xmlInput"
            placeholder="输入XML"
            rows="8"
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
  padding: 0.25rem 0.75rem;
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

textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
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