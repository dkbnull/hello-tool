<template>
  <div class="tool-container">
    <h2>正则表达式测试</h2>

    <div class="section-card">
      <div class="input-group">
        <H3>正则表达式</H3>
        <div class="regex-input-row">
          <span class="regex-delimiter">/</span>
          <input type="text" v-model="pattern" placeholder="输入正则表达式" class="regex-input"/>
          <span class="regex-delimiter">/</span>
          <input type="text" v-model="flags" placeholder="gi" class="flags-input"/>
        </div>
      </div>

      <div class="input-group">
        <H3>测试文本</H3>
        <textarea v-model="testText" placeholder="输入测试文本" rows="6"></textarea>
      </div>

      <div class="button-row">
        <button @click="testRegex" class="btn btn-success">测试匹配</button>
        <button @click="clearAll" class="btn btn-danger">清空</button>
      </div>
    </div>

    <div v-if="matchResults !== null" class="results section-card">
      <h3>匹配结果</h3>
      <div v-if="matchResults.length === 0" class="no-match">未找到匹配项</div>
      <div v-else>
        <div class="match-summary">共找到 <strong>{{ matchResults.length }}</strong> 个匹配项</div>
        <div v-for="(match, index) in matchResults" :key="index" class="match-item">
          <span class="match-index">{{ index + 1 }}.</span>
          <span class="match-value">{{ match }}</span>
          <button @click="handleCopy(match)" class="btn btn-copy btn-sm">复制</button>
        </div>
      </div>
    </div>

    <div v-if="regexError" class="error-message">{{ regexError }}</div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useCopy} from '@/composables/useCopy'

const {handleCopy} = useCopy()

const pattern = ref('')
const flags = ref('g')
const testText = ref('')
const matchResults = ref(null)
const regexError = ref('')

const testRegex = () => {
  regexError.value = ''
  matchResults.value = null

  if (!pattern.value || !testText.value) return

  try {
    const regex = new RegExp(pattern.value, flags.value)
    const matches = []
    let match

    if (flags.value.includes('g')) {
      while ((match = regex.exec(testText.value)) !== null) {
        matches.push(match[0])
        if (!match[0]) regex.lastIndex++
      }
    } else {
      match = regex.exec(testText.value)
      if (match) matches.push(match[0])
    }

    matchResults.value = matches
  } catch (e) {
    regexError.value = '正则表达式错误：' + e.message
  }
}

const clearAll = () => {
  pattern.value = ''
  testText.value = ''
  matchResults.value = null
  regexError.value = ''
}
</script>

<style scoped>
.tool-container {
  max-width: 800px;
}

.input-group {
  margin-bottom: 1rem;
}

.regex-input-row {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.regex-delimiter {
  font-size: 1.5rem;
  color: var(--color-primary);
  font-weight: bold;
  font-family: 'Consolas', 'Monaco', monospace;
}

.regex-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 1rem;
}

.regex-input:focus {
  border-color: var(--color-info);
  outline: none;
}

.flags-input {
  width: 60px;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 1rem;
  text-align: center;
}

.flags-input:focus {
  border-color: var(--color-info);
  outline: none;
}

.button-row {
  display: flex;
  gap: 0.75rem;
}

.results h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--color-primary);
}

.no-match {
  color: var(--color-text-secondary);
  font-style: italic;
}

.match-summary {
  margin-bottom: 1rem;
  color: var(--color-text-secondary);
}

.match-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: var(--radius-sm);
}

.match-index {
  color: var(--color-text-secondary);
  min-width: 30px;
  font-weight: bold;
}

.match-value {
  flex: 1;
  font-family: 'Consolas', 'Monaco', monospace;
  word-break: break-all;
  color: var(--color-primary);
  font-weight: bold;
}
</style>
