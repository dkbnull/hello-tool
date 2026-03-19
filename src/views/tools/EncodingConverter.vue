<template>
  <div class="tool-container">
    <h2>编码转换工具</h2>
    <p class="tool-description">支持Unicode与中文互转、ASCII与Unicode互转、URL编码解码</p>

    <!-- 转换模式选择 -->
    <div class="mode-section">
      <div class="mode-grid">
        <button
            v-for="mode in conversionModes"
            :key="mode.value"
            @click="conversionMode = mode.value"
            class="mode-btn"
            :class="{ active: conversionMode === mode.value }"
        >
          {{ mode.label }}
        </button>
      </div>
    </div>

    <div class="converter-container">
      <!-- 输入区域 -->
      <div class="input-section">
        <div class="input-header">
          <h3>输入</h3>
          <button @click="clearInput" class="action-btn secondary">
            <i class="fas fa-trash-alt mr-1"></i>清空
          </button>
        </div>
        <textarea
            v-model="input"
            rows="10"
        ></textarea>
        <div class="input-footer">
          <button @click="handleConvert" class="action-btn success full-width">
            <i class="fas fa-exchange-alt mr-1"></i>转换
          </button>
        </div>
      </div>

      <!-- 输出区域 -->
      <div class="output-section">
        <div class="output-header">
          <h3>结果</h3>
          <button @click="handleCopy(output)" class="action-btn copy-btn" :disabled="!output">
            <i class="fas fa-copy mr-1"></i>复制
          </button>
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

const input = ref('')
const output = ref('')
const error = ref('')
const conversionMode = ref('unicodeToChinese')

const conversionModes = [
  {value: 'unicodeToChinese', label: 'Unicode转中文'},
  {value: 'chineseToUnicode', label: '中文转Unicode'},
  {value: 'asciiToUnicode', label: 'ASCII转Unicode'},
  {value: 'unicodeToAscii', label: 'Unicode转ASCII'},
  {value: 'urlEncode', label: 'URL编码'},
  {value: 'urlDecode', label: 'URL解码'}
]

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
  input.value = ''
  output.value = ''
  error.value = ''
}

// Unicode转中文
const unicodeToChinese = () => {
  try {
    // 处理\uXXXX格式的Unicode
    output.value = input.value.replace(/\\u([0-9a-fA-F]{4})/g, (match, p1) => {
      return String.fromCharCode(parseInt(p1, 16))
    })
    error.value = ''
  } catch (err) {
    error.value = '转换失败: ' + err.message
  }
}

// 中文转Unicode
const chineseToUnicode = () => {
  try {
    let result = ''
    for (let i = 0; i < input.value.length; i++) {
      const charCode = input.value.charCodeAt(i)
      // 只对非ASCII字符进行转换
      if (charCode > 127) {
        result += '\\u' + charCode.toString(16).padStart(4, '0')
      } else {
        result += input.value[i]
      }
    }
    output.value = result
    error.value = ''
  } catch (err) {
    error.value = '转换失败: ' + err.message
  }
}

// ASCII转Unicode
const asciiToUnicode = () => {
  try {
    let result = ''
    for (let i = 0; i < input.value.length; i++) {
      const charCode = input.value.charCodeAt(i)
      result += '\\u' + charCode.toString(16).padStart(4, '0')
    }
    output.value = result
    error.value = ''
  } catch (err) {
    error.value = '转换失败: ' + err.message
  }
}

// Unicode转ASCII
const unicodeToAscii = () => {
  try {
    // 处理\uXXXX格式的Unicode
    const chineseText = input.value.replace(/\\u([0-9a-fA-F]{4})/g, (match, p1) => {
      return String.fromCharCode(parseInt(p1, 16))
    })
    // 只保留ASCII字符
    output.value = chineseText.replace(/[^\x00-\x7F]/g, '')
    error.value = ''
  } catch (err) {
    error.value = '转换失败: ' + err.message
  }
}

// URL编码
const urlEncode = () => {
  try {
    output.value = encodeURIComponent(input.value)
    error.value = ''
  } catch (err) {
    error.value = '编码失败: ' + err.message
  }
}

// URL解码
const urlDecode = () => {
  try {
    output.value = decodeURIComponent(input.value)
    error.value = ''
  } catch (err) {
    error.value = '解码失败: ' + err.message
  }
}

// 处理转换操作
const handleConvert = () => {
  const converters = {
    unicodeToChinese: unicodeToChinese,
    chineseToUnicode: chineseToUnicode,
    asciiToUnicode: asciiToUnicode,
    unicodeToAscii: unicodeToAscii,
    urlEncode: urlEncode,
    urlDecode: urlDecode
  }

  const converter = converters[conversionMode.value]
  if (converter) {
    converter()
  }
}
</script>

<style scoped>
.tool-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 1rem;
  box-sizing: border-box;
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
  margin-bottom: 1.5rem;
}

/* 转换模式选择区域 */
.mode-section {
  margin-bottom: 1.5rem;
}

.mode-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
}

.mode-btn {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.mode-btn:hover {
  border-color: #42b883;
  background: #f0f9f0;
}

.mode-btn.active {
  background: #42b883;
  color: white;
  border-color: #42b883;
}

/* 输入输出容器 */
.converter-container {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.input-section,
.output-section {
  flex: 1;
  min-width: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.input-header,
.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.input-footer {
  margin-top: 1rem;
}

.full-width {
  width: 100%;
}

h3 {
  font-size: 1.25rem;
  color: #333;
  margin: 0;
}

textarea {
  flex: 1;
  padding: 0.75rem;
  resize: none;
  min-height: 250px;
}

.output-area {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: monospace;
  background: #f7fafc;
  overflow: auto;
  min-height: 250px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .converter-container {
    grid-template-columns: 1fr;
  }

  .mode-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  textarea,
  .output-area {
    min-height: 200px;
  }
}
</style>