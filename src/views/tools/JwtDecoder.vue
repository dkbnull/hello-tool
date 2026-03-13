<template>
  <div class="tool-container">
    <h2>JWT解密</h2>
    <div class="jwt-decoder">
      <div class="input-group">
        <label for="jwt-token">JWT令牌：</label>
        <textarea
            id="jwt-token"
            v-model="jwtToken"
            placeholder="输入JWT令牌"
            rows="4"
        ></textarea>
      </div>

      <div class="result-section header-section">
        <div class="result-header">
          <h3>Header：</h3>
          <button v-if="decodedHeader && decodedHeader !== '无效的JWT令牌格式' && decodedHeader !== '解码失败'"
                  @click="handleCopy(decodedHeader)" class="copy-btn">复制
          </button>
        </div>
        <pre>{{ decodedHeader }}</pre>
      </div>

      <div class="result-section payload-section">
        <div class="result-header">
          <h3>Payload：</h3>
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
</template>

<script setup>
import {computed, ref, watch} from 'vue'
import {copyToClipboard} from '../../utils/clipboard'
import {showToast} from '../../utils/toast'

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

  const expTimestamp = payloadObject.value.exp * 1000
  const expDate = new Date(expTimestamp)
  const isExpired = expTimestamp < Date.now()

  return {
    date: expDate.toISOString().replace('T', ' ').replace('Z', ''),
    isExpired
  }
})

watch(jwtToken, decodeJwt)
</script>

<style scoped>
.tool-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.jwt-decoder {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  width: 100%;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
}

.result-section {
  margin-top: 1rem;
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

.copy-btn {
  padding: 0.5rem 1rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.3s ease;
}

.copy-btn:hover {
  background: #35495e;
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

.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #35495e;
  color: white;
  padding: 1rem 2rem;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
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