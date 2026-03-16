<template>
  <div class="tool-container">
    <h2>JSON与XML互转</h2>
    <div class="converter">
      <div class="input-group">
        <div class="input-header">
          <h3><label for="json-input">JSON</label></h3>
          <button @click="handleCopy(jsonInput)" class="copy-btn" :disabled="!jsonInput">复制</button>
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
          <h3><label for="xml-input">XML</label></h3>
          <button @click="handleCopy(xmlInput)" class="copy-btn" :disabled="!xmlInput">复制</button>
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
</template>

<script setup>
import {ref, watch} from 'vue'
import {copyToClipboard} from '../../utils/clipboard'
import {showToast} from '../../utils/toast'

const jsonInput = ref('')
const xmlInput = ref('')

// 复制到剪贴板
const handleCopy = async (text) => {
  if (text) {
    const success = await copyToClipboard(text)
    showToast({
      message: success ? '已复制到剪贴板' : '复制失败'
    })
  }
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

// 清理XML标签名，确保符合XML命名规则
const cleanXmlTagName = (tagName) => {
  // 移除无效字符，只保留字母、数字、下划线和冒号
  let cleaned = tagName.replace(/[^a-zA-Z0-9_:]/g, '_')
  // 确保标签名不以数字或冒号开头
  if (/^[0-9:]/.test(cleaned)) {
    cleaned = '_' + cleaned
  }
  return cleaned
}

// 递归转换JSON为XML
const jsonToXmlRecursive = (obj, root, indent = 0) => {
  const indentStr = '  '.repeat(indent)
  const cleanedRoot = cleanXmlTagName(root)
  let xml = `${indentStr}<${cleanedRoot}>`

  if (typeof obj === 'object' && obj !== null) {
    xml += '\n'
    for (const key in obj) {
      const cleanedKey = cleanXmlTagName(key)
      if (Array.isArray(obj[key])) {
        obj[key].forEach(item => {
          xml += jsonToXmlRecursive(item, cleanedKey, indent + 1)
        })
      } else {
        xml += jsonToXmlRecursive(obj[key], cleanedKey, indent + 1)
      }
    }
    xml += indentStr
  } else {
    xml += obj
  }

  xml += `</${cleanedRoot}>`
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

// 防抖函数
const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

// 监听输入变化
watch(jsonInput, debounce(jsonToXml, 300))
watch(xmlInput, debounce(xmlToJson, 300))
</script>

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

h3 {
  font-size: 1.25rem;
  color: #333;
  margin: 0;
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


textarea {
  min-height: 400px;
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