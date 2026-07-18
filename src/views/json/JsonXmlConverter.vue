<template>
  <div class="tool-container">
    <h2>JSON与XML互转</h2>

    <div class="converter-container">
      <div class="section-card">
        <div class="section-header">
          <h3>JSON</h3>
          <button @click="handleCopy(jsonInput)" class="btn btn-copy btn-sm" :disabled="!jsonInput">复制</button>
        </div>
        <textarea v-model="jsonInput" placeholder="输入JSON" rows="20"></textarea>
        <div v-if="jsonError" class="error-message">{{ jsonError }}</div>
      </div>

      <div class="section-card">
        <div class="section-header">
          <h3>XML</h3>
          <button @click="handleCopy(xmlInput)" class="btn btn-copy btn-sm" :disabled="!xmlInput">复制</button>
        </div>
        <textarea v-model="xmlInput" placeholder="输入XML" rows="20"></textarea>
        <div v-if="xmlError" class="error-message">{{ xmlError }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import {useCopy} from '@/composables/useCopy'

const {handleCopy} = useCopy()

const jsonInput = ref('')
const xmlInput = ref('')
const jsonError = ref('')
const xmlError = ref('')

const cleanTagName = (name) => {
  let cleaned = name.replace(/[^a-zA-Z0-9_:]/g, '_')
  if (/^[0-9:]/.test(cleaned)) cleaned = '_' + cleaned
  return cleaned
}

const jsonToXmlRecursive = (obj, tag, indent = 0) => {
  const pad = '  '.repeat(indent)
  const cleanTag = cleanTagName(tag)
  let xml = `${pad}<${cleanTag}>`
  if (typeof obj === 'object' && obj !== null) {
    xml += '\n'
    for (const key in obj) {
      const cleanKey = cleanTagName(key)
      if (Array.isArray(obj[key])) {
        obj[key].forEach(item => {
          xml += jsonToXmlRecursive(item, cleanKey, indent + 1)
        })
      } else {
        xml += jsonToXmlRecursive(obj[key], cleanKey, indent + 1)
      }
    }
    xml += pad
  } else {
    xml += obj
  }
  xml += `</${cleanTag}>\n`
  return xml
}

const xmlToJsonRecursive = (node) => {
  if (node.childNodes.length === 1 && node.childNodes[0].nodeType === 3) {
    return node.textContent
  }
  const obj = {}
  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i]
    if (child.nodeType === 1) {
      if (obj[child.nodeName]) {
        if (!Array.isArray(obj[child.nodeName])) obj[child.nodeName] = [obj[child.nodeName]]
        obj[child.nodeName].push(xmlToJsonRecursive(child))
      } else {
        obj[child.nodeName] = xmlToJsonRecursive(child)
      }
    }
  }
  return obj
}

const jsonToXml = () => {
  if (!jsonInput.value) {
    xmlInput.value = '';
    jsonError.value = '';
    return
  }
  try {
    xmlInput.value = jsonToXmlRecursive(JSON.parse(jsonInput.value), 'root')
    jsonError.value = ''
  } catch {
    jsonError.value = '无效的JSON格式'
  }
}

const xmlToJson = () => {
  if (!xmlInput.value) {
    jsonInput.value = '';
    xmlError.value = '';
    return
  }
  try {
    const xmlDoc = new DOMParser().parseFromString(xmlInput.value, 'text/xml')
    if (xmlDoc.querySelector('parsererror')) {
      xmlError.value = '无效的XML格式';
      return
    }
    jsonInput.value = JSON.stringify(xmlToJsonRecursive(xmlDoc.documentElement), null, 2)
    xmlError.value = ''
  } catch {
    xmlError.value = '无效的XML格式'
  }
}

let jsonTimer, xmlTimer
watch(jsonInput, () => {
  clearTimeout(jsonTimer);
  jsonTimer = setTimeout(jsonToXml, 500)
})
watch(xmlInput, () => {
  clearTimeout(xmlTimer);
  xmlTimer = setTimeout(xmlToJson, 500)
})
</script>

<style scoped>
.converter-container {
  display: flex;
  gap: 1.5rem;
}

.converter-container .section-card {
  flex: 1;
  min-width: 300px;
}
</style>
