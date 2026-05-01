<template>
  <div class="tool-container">
    <h2>文本差异对比</h2>

    <div class="diff-inputs">
      <div class="input-group">
        <h3>原始文本</h3>
        <textarea v-model="originalText" placeholder="输入原始文本" rows="20"></textarea>
      </div>
      <div class="input-group">
        <h3>修改文本</h3>
        <textarea v-model="modifiedText" placeholder="输入修改后的文本" rows="20"></textarea>
      </div>
    </div>

    <div class="button-row">
      <button @click="compareTexts" class="btn btn-success">对比</button>
      <button @click="handleCopy(diffResult)" class="btn btn-copy" :disabled="!diffResult">复制结果</button>
      <button @click="clearAll" class="btn btn-danger">清空</button>
    </div>

    <div v-if="diffResult" class="diff-result section-card">
      <h3>对比结果</h3>
      <pre class="diff-output">{{ diffResult }}</pre>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useCopy} from '@/composables/useCopy'

const {handleCopy} = useCopy()

const originalText = ref('')
const modifiedText = ref('')
const diffResult = ref('')

const compareTexts = () => {
  const original = originalText.value.split('\n')
  const modified = modifiedText.value.split('\n')
  const maxLen = Math.max(original.length, modified.length)
  const lines = []

  for (let i = 0; i < maxLen; i++) {
    const oLine = original[i] ?? ''
    const mLine = modified[i] ?? ''

    if (oLine === mLine) {
      lines.push('  ' + oLine)
    } else {
      if (oLine) lines.push('- ' + oLine)
      if (mLine) lines.push('+ ' + mLine)
    }
  }

  diffResult.value = lines.join('\n')
}

const clearAll = () => {
  originalText.value = ''
  modifiedText.value = ''
  diffResult.value = ''
}
</script>

<style scoped>
.diff-inputs {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.diff-inputs .input-group {
  flex: 1;
}

.button-row {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.diff-result h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--color-primary);
}

.diff-output {
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: var(--radius-sm);
  overflow-x: auto;
}

@media (max-width: 768px) {
  .diff-inputs {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
