<template>
  <div class="tool-container">
    <h2>JSON引号转换</h2>

    <div class="converter-container">
      <div class="section-card">
        <div class="section-header">
          <h3>单引号JSON</h3>
        </div>
        <textarea v-model="singleQuoteJson" placeholder="输入单引号JSON" rows="20"></textarea>
      </div>

      <div class="section-card">
        <div class="section-header">
          <h3>双引号JSON</h3>
          <button @click="handleCopy(doubleQuoteJson)" class="btn btn-copy btn-sm" :disabled="!doubleQuoteJson">复制
          </button>
        </div>
        <textarea v-model="doubleQuoteJson" placeholder="转换后的标准JSON" rows="20" readonly
                  class="output-area"></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import {useCopy} from '../../composables/useCopy'

const {handleCopy} = useCopy()

const singleQuoteJson = ref('')
const doubleQuoteJson = ref('')

const convertQuotes = () => {
  if (!singleQuoteJson.value) {
    doubleQuoteJson.value = ''
    return
  }
  try {
    const converted = singleQuoteJson.value.replace(/'/g, '"').replace(/\\'/g, "'")
    doubleQuoteJson.value = JSON.stringify(JSON.parse(converted), null, 2)
  } catch {
    doubleQuoteJson.value = '转换失败，请检查输入格式'
  }
}

watch(singleQuoteJson, convertQuotes)
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

.output-area {
  background: #f8f9fa;
}
</style>
