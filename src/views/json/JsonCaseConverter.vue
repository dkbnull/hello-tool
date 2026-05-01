<template>
  <div class="tool-container">
    <h2>JSON大小写转换</h2>

    <div class="section-card">
      <div class="section-header">
        <h3>原始JSON</h3>
      </div>
      <textarea v-model="originalJson" placeholder="输入JSON" rows="6"></textarea>
    </div>

    <div class="results-grid">
      <div class="section-card">
        <div class="section-header">
          <h3>驼峰命名 (camelCase)</h3>
          <button @click="handleCopy(camelCaseJson)" class="btn btn-copy btn-sm" :disabled="!camelCaseJson">复制
          </button>
        </div>
        <textarea v-model="camelCaseJson" readonly rows="6" class="output-area"></textarea>
      </div>

      <div class="section-card">
        <div class="section-header">
          <h3>下划线命名 (snake_case)</h3>
          <button @click="handleCopy(snakeCaseJson)" class="btn btn-copy btn-sm" :disabled="!snakeCaseJson">复制
          </button>
        </div>
        <textarea v-model="snakeCaseJson" readonly rows="6" class="output-area"></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import {useCopy} from '@/composables/useCopy'

const {handleCopy} = useCopy()

const originalJson = ref('')
const camelCaseJson = ref('')
const snakeCaseJson = ref('')

const toCamelCase = (str) => str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '').replace(/^./, s => s.toLowerCase())
const toSnakeCase = (str) => str.replace(/([A-Z])/g, '_$1').replace(/[-\s]+/g, '_').toLowerCase().replace(/^_+|_+$/g, '')

const convertKeys = (obj, converter) => {
  if (typeof obj !== 'object' || obj === null) return obj
  if (Array.isArray(obj)) return obj.map(item => convertKeys(item, converter))
  const result = {}
  for (const key in obj) {
    result[converter(key)] = convertKeys(obj[key], converter)
  }
  return result
}

const convertCase = () => {
  if (!originalJson.value) {
    camelCaseJson.value = ''
    snakeCaseJson.value = ''
    return
  }
  try {
    const obj = JSON.parse(originalJson.value)
    camelCaseJson.value = JSON.stringify(convertKeys(obj, toCamelCase), null, 2)
    snakeCaseJson.value = JSON.stringify(convertKeys(obj, toSnakeCase), null, 2)
  } catch {
    camelCaseJson.value = '无效的JSON格式'
    snakeCaseJson.value = '无效的JSON格式'
  }
}

watch(originalJson, convertCase)
</script>

<style scoped>
.results-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.output-area {
  background: #f8f9fa;
}

@media (max-width: 768px) {
  .results-grid {
    grid-template-columns: 1fr;
  }
}
</style>
