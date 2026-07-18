<template>
  <div class="tool-container">
    <h2>IP地址查询</h2>

    <div class="section-card">
      <div class="input-group control-row">
        <label>IP地址：</label>
        <div class="input-with-btn">
          <input type="text" v-model="ip" placeholder="输入IP地址（留空查询本机IP）" @keyup.enter="queryIp"/>
          <button @click="queryIp" class="btn btn-success" :disabled="loading">
            {{ loading ? '查询中...' : '查询' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="result" class="result section-card">
      <h3>查询结果</h3>
      <div class="result-grid">
        <div v-for="item in resultItems" :key="item.label" class="result-item">
          <span class="result-label">{{ item.label }}</span>
          <span class="result-value">{{ item.value }}</span>
          <button v-if="item.value" @click="handleCopy(item.value)" class="btn btn-copy btn-sm">复制</button>
        </div>
      </div>
    </div>

    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useCopy} from '@/composables/useCopy'

const {handleCopy} = useCopy()

const ip = ref('')
const result = ref(null)
const loading = ref(false)
const error = ref('')

const resultItems = ref([])

const queryIp = async () => {
  loading.value = true
  error.value = ''
  result.value = null
  resultItems.value = []

  try {
    const url = ip.value ? `http://ip-api.com/json/${ip.value}?lang=zh-CN` : 'http://ip-api.com/json/?lang=zh-CN'
    const response = await fetch(url)
    const data = await response.json()

    if (data.status === 'fail') {
      error.value = '查询失败：' + (data.message || '无效的IP地址')
      return
    }

    result.value = data
    resultItems.value = [
      {label: 'IP地址', value: data.query},
      {label: '国家', value: data.country},
      {label: '省份', value: data.regionName},
      {label: '城市', value: data.city},
      {label: '运营商', value: data.isp},
      {label: '经度', value: data.lon},
      {label: '纬度', value: data.lat},
      {label: '时区', value: data.timezone},
    ]
  } catch (e) {
    error.value = '查询失败：网络错误'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.tool-container {
  max-width: 800px;
}

.control-row {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.input-with-btn {
  display: flex;
}

.input-with-btn input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
  font-size: 1rem;
}

.input-with-btn input:focus {
  border-color: var(--color-info);
  outline: none;
}

.input-with-btn .btn {
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  white-space: nowrap;
}

.result h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--color-primary);
}

.result-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: var(--radius-sm);
}

.result-label {
  font-weight: bold;
  min-width: 80px;
  color: var(--color-text-secondary);
}

.result-value {
  flex: 1;
  word-break: break-all;
}
</style>
