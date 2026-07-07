<template>
  <div class="tool-container">
    <h2>编码转换工具</h2>

    <div class="section-card">
      <div class="mode-grid">
        <button
          v-for="mode in conversionModes"
          :key="mode.value"
          @click="conversionMode = mode.value"
          class="mode-btn"
          :class="{active: conversionMode === mode.value}"
        >
          {{ mode.label }}
        </button>
      </div>
    </div>

    <div class="converter-container">
      <div class="input-section section-card">
        <div class="section-header">
          <h3>输入</h3>
          <button @click="clearInput" class="btn btn-secondary btn-sm">清空</button>
        </div>
        <textarea v-model="input" rows="10"></textarea>
        <button @click="handleConvert" class="btn btn-success mt-lg w-full">转换</button>
      </div>

      <div class="output-section section-card">
        <div class="section-header">
          <h3>结果</h3>
          <button @click="handleCopy(output)" class="btn btn-copy btn-sm" :disabled="!output">复制</button>
        </div>
        <pre class="output-area">{{ output }}</pre>
        <div v-if="error" class="error-message">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCopy } from '@/composables/useCopy'

const { handleCopy } = useCopy()

const input = ref('')
const output = ref('')
const error = ref('')
const conversionMode = ref('unicodeToChinese')

const conversionModes = [
  { value: 'unicodeToChinese', label: 'Unicode转中文' },
  { value: 'chineseToUnicode', label: '中文转Unicode' },
  { value: 'asciiToUnicode', label: 'ASCII转Unicode' },
  { value: 'unicodeToAscii', label: 'Unicode转ASCII' },
  { value: 'asciiToChinese', label: 'ASCII转中文' },
  { value: 'chineseToAscii', label: '中文转ASCII' },
  { value: 'urlEncode', label: 'URL编码' },
  { value: 'urlDecode', label: 'URL解码' },
]

// 统一执行转换，处理异常与错误提示
const runConvert = (action, errorMsg = '转换失败') => {
  try {
    output.value = action()
    error.value = ''
  } catch (e) {
    error.value = errorMsg + ': ' + e.message
  }
}

const converters = {
  unicodeToChinese: () => runConvert(() =>
    input.value.replace(/\\u([0-9a-fA-F]{4})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16)))
  ),
  chineseToUnicode: () => runConvert(() =>
    Array.from(input.value).map(c => c.charCodeAt(0) > 127 ? '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0') : c).join('')
  ),
  asciiToUnicode: () => runConvert(() =>
    Array.from(input.value).map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).join('')
  ),
  unicodeToAscii: () => runConvert(() => {
    const text = input.value.replace(/\\u([0-9a-fA-F]{4})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16)))
    return text.replace(/[^\x00-\x7F]/g, '')
  }),
  asciiToChinese: () => runConvert(() =>
    input.value.split(/[\s,]+/).filter(Boolean).map(c => String.fromCharCode(parseInt(c))).join('')
  ),
  chineseToAscii: () => runConvert(() =>
    Array.from(input.value).map(c => c.charCodeAt(0)).join(' ')
  ),
  urlEncode: () => runConvert(() => encodeURIComponent(input.value), '编码失败'),
  urlDecode: () => runConvert(() => decodeURIComponent(input.value), '解码失败'),
}

const clearInput = () => {
  input.value = ''
  output.value = ''
  error.value = ''
}

const handleConvert = () => {
  converters[conversionMode.value]?.()
}
</script>

<style scoped>
.mode-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
}

.converter-container {
  display: flex;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.converter-container .input-section,
.converter-container .output-section {
  flex: 1;
  min-width: 300px;
}

.output-area {
  min-height: 250px;
  padding: 0.75rem;
  background: #f7fafc;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9rem;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: auto;
  margin: 0;
}

@media (max-width: 768px) {
  .converter-container {
    flex-direction: column;
  }

  .mode-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
</style>
