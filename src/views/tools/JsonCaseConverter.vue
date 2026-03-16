<template>
  <div class="tool-container">
    <h2>JSON大小写转换</h2>
    <div class="converter">
      <div class="input-group">
        <div class="input-header">
          <h3><label for="original-json">原始JSON</label></h3>
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
          <h3>驼峰命名</h3>
          <button @click="handleCopy(camelCaseJson)" class="copy-btn" :disabled="!camelCaseJson">复制</button>
        </div>
        <textarea
            v-model="camelCaseJson"
            rows="6"
            readonly
        ></textarea>
      </div>

      <div class="result-section">
        <div class="input-header">
          <h3>下划线命名</h3>
          <button @click="handleCopy(snakeCaseJson)" class="copy-btn" :disabled="!snakeCaseJson">复制</button>
        </div>
        <textarea
            v-model="snakeCaseJson"
            rows="6"
            readonly
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import {copyToClipboard} from '../../utils/clipboard'
import {showToast} from '../../utils/toast'
import {toCamelCase, toSnakeCase} from '../../utils/naming'

const originalJson = ref('')
const camelCaseJson = ref('')
const snakeCaseJson = ref('')

// 复制到剪贴板
const handleCopy = async (text) => {
  if (text) {
    const success = await copyToClipboard(text)
    showToast({
      message: success ? '已复制到剪贴板' : '复制失败'
    })
  }
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

watch(originalJson, convertCase)
</script>

<style scoped>
.tool-container {
  max-width: 1000px;
  margin: 0 auto;
}

h2 {
  text-align: center;
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

.input-header h3 {
  margin: 0;
  color: #42b883;
}

label,
h3 {
  display: block;
  margin: 0;
}

h3 {
  color: #42b883;
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