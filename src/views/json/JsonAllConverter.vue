<template>
  <div class="tool-container">
    <h2>JSON全能转换</h2>

    <div class="converter-container">
      <div class="input-section section-card">
        <div class="section-header">
          <h3>JSON输入</h3>
          <button @click="clearInput" class="btn btn-secondary btn-sm">清空</button>
        </div>
        <textarea v-model="jsonInput" rows="20"></textarea>
        <div class="button-row">
          <button @click="formatJson" class="btn btn-success">格式化</button>
          <button @click="minifyJson" class="btn btn-primary">压缩</button>
          <button @click="validateJson" class="btn btn-warning">验证</button>
        </div>
      </div>

      <div class="convert-actions">
        <button @click="jsonToXml" class="btn btn-primary convert-btn">转XML</button>
        <button @click="jsonToCsv" class="btn btn-purple convert-btn">转CSV</button>
        <button @click="jsonToYaml" class="btn btn-warning convert-btn">转YAML</button>
      </div>

      <div class="output-section section-card">
        <div class="section-header">
          <h3>转换结果</h3>
          <button @click="handleCopy(output)" class="btn btn-copy btn-sm" :disabled="!output">复制</button>
        </div>
        <pre class="output-area">{{ output }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useCopy} from '@/composables/useCopy'
import {showToast} from '@/utils/toast'

const {handleCopy} = useCopy()

const jsonInput = ref('')
const output = ref('')

const clearInput = () => {
  jsonInput.value = ''
  output.value = ''
}

const parseInput = () => {
  try {
    return JSON.parse(jsonInput.value)
  } catch (e) {
    return null
  }
}

const formatJson = () => {
  const obj = parseInput()
  if (!obj) {
    showToast({message: '无效的JSON格式'});
    return
  }
  jsonInput.value = JSON.stringify(obj, null, 2)
  output.value = ''
}

const minifyJson = () => {
  const obj = parseInput()
  if (!obj) {
    showToast({message: '无效的JSON格式'});
    return
  }
  jsonInput.value = JSON.stringify(obj)
  output.value = ''
}

const validateJson = () => {
  try {
    JSON.parse(jsonInput.value)
    showToast({message: '✅ JSON格式有效'})
  } catch (e) {
    showToast({message: '❌ 无效的JSON格式'})
  }
}

const jsonToXml = () => {
  const obj = parseInput()
  if (!obj) {
    output.value = '无效的JSON格式，请检查输入';
    return
  }
  output.value = toXml(obj, 'root')
}

const toXml = (obj, tag, indent = 0) => {
  const pad = '  '.repeat(indent)
  let xml = `${pad}<${tag}>`
  if (typeof obj === 'object' && obj !== null) {
    xml += '\n'
    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        obj[key].forEach(item => {
          xml += toXml(item, key, indent + 1)
        })
      } else {
        xml += toXml(obj[key], key, indent + 1)
      }
    }
    xml += pad
  } else {
    xml += obj
  }
  xml += `</${tag}>\n`
  return xml
}

const flattenObject = (obj, prefix = '') => {
  const result = {}
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      result[prefix ? `${prefix}.${key}` : key] = ''
    } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      Object.assign(result, flattenObject(obj[key], prefix ? `${prefix}.${key}` : key))
    } else if (Array.isArray(obj[key])) {
      result[prefix ? `${prefix}.${key}` : key] = JSON.stringify(obj[key])
    } else {
      result[prefix ? `${prefix}.${key}` : key] = obj[key]
    }
  }
  return result
}

const jsonToCsv = () => {
  const data = parseInput()
  if (!data) {
    output.value = '无效的JSON格式，请检查输入';
    return
  }

  let rows = []
  if (Array.isArray(data) && data.length > 0) {
    rows = data.map(item => {
      if (typeof item === 'object' && item !== null) {
        return flattenObject(item)
      }
      return {value: item}
    })
  } else if (typeof data === 'object' && data !== null) {
    rows = [flattenObject(data)]
  } else {
    output.value = '无法转换为CSV格式'
    return
  }

  const headers = [...new Set(rows.flatMap(r => Object.keys(r)))]
  let csv = headers.join(',') + '\n'
  rows.forEach(row => {
    csv += headers.map(h => {
      const v = row[h]
      if (v === undefined || v === null) return ''
      const str = String(v)
      return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str
    }).join(',') + '\n'
  })
  output.value = csv
}

const jsonToYaml = () => {
  const obj = parseInput()
  if (!obj) {
    output.value = '无效的JSON格式，请检查输入';
    return
  }
  output.value = toYaml(obj, 0)
}

const toYaml = (obj, indent) => {
  const pad = '  '.repeat(indent)
  let yaml = ''
  if (Array.isArray(obj)) {
    obj.forEach(item => {
      if (typeof item === 'object' && item !== null) {
        yaml += `${pad}-\n${toYaml(item, indent + 1)}`
      } else {
        yaml += `${pad}- ${item}\n`
      }
    })
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        yaml += `${pad}${key}:\n${toYaml(obj[key], indent + 1)}`
      } else {
        yaml += `${pad}${key}: ${obj[key]}\n`
      }
    }
  } else {
    yaml += `${pad}${obj}\n`
  }
  return yaml
}
</script>

<style scoped>
.converter-container {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.converter-container .input-section,
.converter-container .output-section {
  flex: 1;
  min-width: 300px;
}

.convert-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  padding: 0 0.5rem;
}

.convert-btn {
  min-width: 90px;
  padding: 0.65rem 1.25rem;
  font-size: 0.95rem;
}

.button-row {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.output-area {
  height: 450px;
  padding: 0.75rem;
  background: #f7fafc;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9rem;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: auto;
}

@media (max-width: 768px) {
  .converter-container {
    flex-direction: column;
  }

  .convert-actions {
    flex-direction: row;
    justify-content: center;
    padding: 0;
  }
}
</style>
