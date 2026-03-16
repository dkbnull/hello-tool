<template>
  <div class="tool-container">
    <h2>实体类属性命名转换</h2>
    <div class="converter">
      <div class="input-group">
        <div class="input-header">
          <h3><label for="input-text">输入文本</label></h3>
        </div>
        <textarea
            id="input-text"
            v-model="inputText"
            placeholder="输入属性名，多个属性名请换行"
            rows="4"
        ></textarea>
      </div>

      <div class="result-section">
        <div class="input-header">
          <h3>驼峰命名</h3>
          <button @click="handleCopy(camelCaseOutput)" class="copy-btn" :disabled="!camelCaseOutput">复制</button>
        </div>
        <textarea
            v-model="camelCaseOutput"
            rows="4"
            readonly
        ></textarea>
      </div>

      <div class="result-section">
        <div class="input-header">
          <h3>下划线命名</h3>
          <button @click="handleCopy(snakeCaseOutput)" class="copy-btn" :disabled="!snakeCaseOutput">复制</button>
        </div>
        <textarea
            v-model="snakeCaseOutput"
            rows="4"
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

const inputText = ref('')
const camelCaseOutput = ref('')
const snakeCaseOutput = ref('')

// 复制到剪贴板
const handleCopy = async (text) => {
  if (text) {
    const success = await copyToClipboard(text)
    showToast({
      message: success ? '已复制到剪贴板' : '复制失败'
    })
  }
}

// 转换命名格式
const convertNaming = () => {
  if (!inputText.value) {
    camelCaseOutput.value = ''
    snakeCaseOutput.value = ''
    return
  }

  // 转换为驼峰命名
  camelCaseOutput.value = toCamelCase(inputText.value)

  // 转换为下划线命名
  snakeCaseOutput.value = toSnakeCase(inputText.value)
}

// 转换为驼峰命名
const toCamelCase = (str) => {
  return str
      .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
      .replace(/^./, str => str.toLowerCase())
}

// 转换为下划线命名
const toSnakeCase = (str) => {
  return str
      .replace(/([A-Z])/g, '_$1')
      .replace(/[-\s]+/g, '_')
      .toLowerCase()
      .replace(/^_+|_+$/g, '')
}

watch(inputText, convertNaming)
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
  color: #333;
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