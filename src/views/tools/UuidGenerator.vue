<template>
  <div class="tool-container">
    <h2>UUID生成器</h2>

    <div class="section-card">
      <div class="options">
        <div class="option-row">
          <label>生成数量：</label>
          <input type="number" v-model.number="count" min="1" max="100" class="count-input"/>
        </div>
        <div class="option-row">
          <label class="checkbox-label">
            <input type="checkbox" v-model="uppercase"/>
            大写
          </label>
          <label class="checkbox-label">
            <input type="checkbox" v-model="noDash"/>
            去除横线
          </label>
        </div>
      </div>

      <div class="button-row">
        <button @click="generateUuids" class="btn btn-success">生成UUID</button>
        <button @click="handleCopy(allUuids)" class="btn btn-copy">复制全部</button>
        <button @click="uuids = []" class="btn btn-danger">清空</button>
      </div>
    </div>

    <div v-if="uuids.length > 0" class="results section-card">
      <div v-for="(uuid, index) in uuids" :key="index" class="result-item">
        <span class="result-index">{{ index + 1 }}.</span>
        <span class="result-value">{{ uuid }}</span>
        <button @click="handleCopy(uuid)" class="btn btn-copy btn-sm">复制</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import {useCopy} from '../../composables/useCopy'

const {handleCopy} = useCopy()

const count = ref(1)
const uppercase = ref(false)
const noDash = ref(false)
const uuids = ref([])

const allUuids = computed(() => uuids.value.join('\n'))

const generateUuid = () => {
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
  if (noDash.value) uuid = uuid.replace(/-/g, '')
  if (uppercase.value) uuid = uuid.toUpperCase()
  return uuid
}

const generateUuids = () => {
  uuids.value = Array.from({length: count.value}, generateUuid)
}
</script>

<style scoped>
.tool-container {
  max-width: 800px;
}

.options {
  margin-bottom: 1.5rem;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.option-row > label {
  color: var(--color-text-secondary);
  font-weight: bold;
}

.count-input {
  width: 80px;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 1rem;
  text-align: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--color-text-secondary);
}

.button-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.results {
  margin-top: 2rem;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: var(--radius-sm);
}

.result-index {
  color: var(--color-text-secondary);
  min-width: 30px;
  font-weight: bold;
}

.result-value {
  flex: 1;
  font-family: 'Consolas', 'Monaco', monospace;
  word-break: break-all;
  font-size: 0.95rem;
}
</style>
