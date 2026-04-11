<template>
  <div class="tool-container">
    <h2>进制转换</h2>

    <div class="section-card">
      <div class="input-group">
        <label>输入数值：</label>
        <input type="text" v-model="input" placeholder="请输入数值" @input="convert"/>
      </div>

      <div class="input-group">
        <label>输入进制：</label>
        <select v-model="fromBase" @change="convert">
          <option v-for="base in bases" :key="base.value" :value="base.value">{{ base.label }}</option>
        </select>
      </div>
    </div>

    <div class="results section-card">
      <h3>转换结果</h3>
      <div v-for="base in bases" :key="base.value" class="result-item">
        <span class="result-label">{{ base.label }}</span>
        <span class="result-value mono">{{ results[base.value] || '-' }}</span>
        <button @click="handleCopy(results[base.value])" class="btn btn-copy btn-sm" :disabled="!results[base.value]">
          复制
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {reactive, ref} from 'vue'
import {useCopy} from '../../composables/useCopy'

const {handleCopy} = useCopy()

const input = ref('')
const fromBase = ref(10)
const results = reactive({})
const error = ref('')

const bases = [
  {value: 2, label: '二进制 (Binary)'},
  {value: 8, label: '八进制 (Octal)'},
  {value: 10, label: '十进制 (Decimal)'},
  {value: 16, label: '十六进制 (Hex)'},
]

const convert = () => {
  error.value = ''
  if (!input.value) {
    Object.keys(results).forEach(key => delete results[key])
    return
  }

  try {
    const decimal = parseInt(input.value, fromBase.value)
    if (isNaN(decimal)) throw new Error('无效数值')
    results[2] = decimal.toString(2)
    results[8] = decimal.toString(8)
    results[10] = decimal.toString(10)
    results[16] = decimal.toString(16).toUpperCase()
  } catch {
    Object.keys(results).forEach(key => delete results[key])
  }
}
</script>

<style scoped>
.tool-container {
  max-width: 800px;
}

input,
select {
  width: 200px;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 1rem;
  background: white;
  cursor: pointer;
}

select:focus {
  border-color: var(--color-info);
  outline: none;
}

.results h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--color-primary);
}

.result-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: var(--radius-sm);
}

.result-label {
  font-weight: bold;
  min-width: 150px;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.result-value {
  flex: 1;
  word-break: break-all;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .result-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
