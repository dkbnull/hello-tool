<template>
  <div class="tool-container">
    <h2>JSON单引号转双引号</h2>
    <div class="converter">
      <div class="input-group">
        <h3><label for="single-quote-json">单引号JSON</label></h3>
        <textarea
            id="single-quote-json"
            v-model="singleQuoteJson"
            placeholder="输入单引号JSON"
            rows="8"
        ></textarea>
      </div>
      <div class="arrow">→</div>
      <div class="input-group">
        <div class="input-header">
          <h3><label for="double-quote-json">双引号JSON</label></h3>
          <button @click="handleCopy(doubleQuoteJson)" class="copy-btn" :disabled="!doubleQuoteJson">复制</button>
        </div>
        <textarea
            id="double-quote-json"
            v-model="doubleQuoteJson"
            placeholder="转换后的标准JSON"
            rows="8"
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

const singleQuoteJson = ref('')
const doubleQuoteJson = ref('')

// 复制到剪贴板
const handleCopy = async (text) => {
  if (text) {
    const success = await copyToClipboard(text)
    showToast({
      message: success ? '已复制到剪贴板' : '复制失败'
    })
  }
}

const convertQuotes = () => {
  if (!singleQuoteJson.value) {
    doubleQuoteJson.value = ''
    return
  }

  try {
    // 替换单引号为双引号
    let converted = singleQuoteJson.value
        .replace(/'/g, '"')
        // 处理转义字符
        .replace(/\\'/g, "'")

    // 验证转换后的JSON
    JSON.parse(converted)
    doubleQuoteJson.value = JSON.stringify(JSON.parse(converted), null, 2)
  } catch (error) {
    doubleQuoteJson.value = '转换失败，请检查输入格式'
  }
}

watch(singleQuoteJson, convertQuotes)
</script>

<style scoped>
h2 {
  text-align: center;
  margin-bottom: 2rem;
}

h3 {
  font-size: 1.25rem;
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

textarea {
  min-height: 400px;
}

.arrow {
  font-size: 2rem;
  color: #42b883;
  font-weight: bold;
}
</style>