<template>
  <div class="tool-container">
    <h2>JWT解密</h2>
    <div class="jwt-decoder">
      <!-- 左侧输入区域 -->
      <div class="input-section">
        <div class="input-group">
          <div class="input-header">
            <h3><label for="jwt-token">JWT令牌</label></h3>
            <div class="input-actions">
              <button @click="clearInput" class="action-btn secondary">
                <i class="fas fa-trash-alt mr-1"></i>清空
              </button>
            </div>
          </div>
          <textarea
              id="jwt-token"
              v-model="jwtToken"
              placeholder="输入JWT令牌"
              rows="12"
          ></textarea>
        </div>
      </div>

      <!-- 右侧输出区域 -->
      <div class="output-section">
        <div class="result-section header-section">
          <div class="result-header">
            <h3>Header</h3>
            <button v-if="decodedHeader && decodedHeader !== '无效的JWT令牌格式' && decodedHeader !== '解码失败'"
                    @click="handleCopy(decodedHeader)" class="copy-btn">复制
            </button>
          </div>
          <pre>{{ decodedHeader }}</pre>
        </div>

        <div class="result-section payload-section">
          <div class="result-header">
            <h3>Payload</h3>
            <button v-if="decodedPayload" @click="handleCopy(decodedPayload)" class="copy-btn">复制</button>
          </div>
          <pre>{{ decodedPayload }}</pre>

          <div v-if="expirationInfo" class="expiration-info">
            <div class="expiration-item">
              <span>过期时间：</span>
              <span>{{ expirationInfo.date }}</span>
              <span :class="expirationInfo.isExpired ? 'expired' : 'not-expired'">
                {{ expirationInfo.isExpired ? '已过期' : '未过期' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref, watch} from 'vue'
import {copyToClipboard} from '../../utils/clipboard'
import {showToast} from '../../utils/toast'
import {timestampToDateTime} from '../../utils/time'

const jwtToken = ref('')
const decodedHeader = ref('')
const decodedPayload = ref('')
const payloadObject = ref(null)

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
  jwtToken.value = ''
  decodedHeader.value = ''
  decodedPayload.value = ''
  payloadObject.value = null
}

const decodeJwt = () => {
  if (!jwtToken.value) {
    decodedHeader.value = ''
    decodedPayload.value = ''
    payloadObject.value = null
    return
  }

  try {
    const parts = jwtToken.value.split('.')
    if (parts.length !== 3) {
      decodedHeader.value = '无效的JWT令牌格式'
      decodedPayload.value = ''
      payloadObject.value = null
      return
    }

    // 解码Header
    const header = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'))
    decodedHeader.value = JSON.stringify(JSON.parse(header), null, 2)

    // 解码Payload
    const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    const payloadObj = JSON.parse(payload)
    payloadObject.value = payloadObj
    decodedPayload.value = JSON.stringify(payloadObj, null, 2)
  } catch (error) {
    decodedHeader.value = '解码失败'
    decodedPayload.value = ''
    payloadObject.value = null
  }
}

// 计算过期时间和是否过期
const expirationInfo = computed(() => {
  if (!payloadObject.value || !payloadObject.value.exp) {
    return null
  }

  const expTimestamp = payloadObject.value.exp.toString()
  const {dateTime} = timestampToDateTime(expTimestamp)
  // 只保留到秒，去除毫秒部分
  const dateTimeWithoutMs = dateTime.split('.')[0]
  const isExpired = payloadObject.value.exp * 1000 < Date.now()

  return {
    date: dateTimeWithoutMs,
    isExpired
  }
})

watch(jwtToken, decodeJwt)
</script>

<style scoped>
.tool-container {
  margin: 0 auto;
  padding: 2rem;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

h3 {
  font-size: 1.25rem;
  color: #333;
  margin: 0;
}

.jwt-decoder {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.input-section {
  flex: 1;
  min-width: 400px;
}

.output-section {
  flex: 1;
  min-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .jwt-decoder {
    flex-direction: column;
  }
}

.input-group {
  width: 100%;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.result-header h3 {
  margin: 0;
  color: #42b883;
}

.header-section pre {
  background: #e8f4f8;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  border-left: 4px solid #3498db;
}

.payload-section pre {
  background: #f8f4e8;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  border-left: 4px solid #f39c12;
}

.expiration-info {
  margin-top: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
  border-left: 4px solid #9b59b6;
}

.expiration-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.expiration-item span:first-child {
  font-weight: bold;
}

.expired {
  color: #e74c3c;
  font-weight: bold;
}

.not-expired {
  color: #27ae60;
  font-weight: bold;
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
</style>