<template>
  <div class="tool-container">
    <h2>代码格式化</h2>

    <div class="converter-container">
      <div class="section-card">
        <div class="input-group control-row">
          <label>选择语言</label>
          <select v-model="language">
            <option value="sql">SQL</option>
            <option value="xml">XML</option>
            <option value="css">CSS</option>
          </select>
        </div>

        <div class="input-group">
          <h3>输入代码</h3>
          <textarea v-model="input" placeholder="请输入要格式化的代码" rows="10"></textarea>
        </div>

        <div class="button-row">
          <button @click="formatCode" class="btn btn-success">格式化</button>
          <button @click="compressCode" class="btn btn-primary">压缩</button>
          <button @click="handleCopy(output)" class="btn btn-copy" :disabled="!output">复制结果</button>
          <button @click="clearAll" class="btn btn-danger">清空</button>
        </div>
      </div>

      <div class="result section-card">
        <h3>格式化结果</h3>
        <textarea v-model="output" readonly rows="16" class="output-area"></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useCopy} from '@/composables/useCopy'
import {format as sqlFormat} from 'sql-formatter'
import vkbeautify from 'vkbeautify'

const {handleCopy} = useCopy()

const language = ref('sql')
const input = ref('')
const output = ref('')

const formatCode = () => {
  if (!input.value) return
  try {
    switch (language.value) {
      case 'sql':
        output.value = sqlFormat(input.value)
        break
      case 'xml':
        output.value = vkbeautify.xml(input.value)
        break
      case 'css':
        output.value = vkbeautify.css(input.value)
        break
    }
  } catch (e) {
    output.value = '格式化失败：' + e.message
  }
}

const compressCode = () => {
  if (!input.value) return
  try {
    switch (language.value) {
      case 'sql':
        output.value = input.value.replace(/\s+/g, ' ').trim()
        break
      case 'xml':
        output.value = vkbeautify.xmlmin(input.value)
        break
      case 'css':
        output.value = vkbeautify.cssmin(input.value)
        break
    }
  } catch (e) {
    output.value = '压缩失败：' + e.message
  }
}

const clearAll = () => {
  input.value = ''
  output.value = ''
}
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

.control-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.control-row label {
  font-weight: bold;
  font-size: 1.2em;
}

select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 1rem;
  background: white;
  cursor: pointer;
  display: flex;
  flex: 1;
}

select:focus {
  border-color: var(--color-info);
  outline: none;
}

.button-row {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.result h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--color-primary);
}

.output-area {
  background: #f8f9fa;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9rem;
}
</style>
