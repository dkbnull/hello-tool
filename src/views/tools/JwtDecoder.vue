<template>
  <div class="jwt-decoder">
    <h2>JWT解密工具</h2>

    <div class="layout-container">
      <!-- 左侧：JWT输入区域 -->
      <div class="left-panel">
        <div class="input-section">
          <textarea
              v-model="jwtToken"
              placeholder="粘贴JWT令牌"
              rows="10"
              @input="decodeJwt"
          ></textarea>
        </div>
      </div>

      <!-- 右侧：结果展示区域 -->
      <div class="right-panel">
        <div class="decoded-section">
          <h3>Header</h3>
          <pre>{{ decodedHeader }}</pre>
        </div>

        <div class="decoded-section">
          <h3>Payload</h3>
          <pre>{{ decodedPayload }}</pre>

          <div v-if="expTime" class="expiration-info">
            <strong>过期时间:</strong> {{ expTime }}
            <div :class="['status', expirationStatus]">
              {{ expirationText }}
            </div>
          </div>
        </div>

        <div v-if="error" class="error">
          {{ error }}
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'

const jwtToken = ref('')
const decodedHeader = ref(null)
const decodedPayload = ref(null)
const error = ref('')

const decodeJwt = () => {
  error.value = ''
  decodedHeader.value = null
  decodedPayload.value = null

  if (!jwtToken.value) return

  try {
    const parts = jwtToken.value.split('.')
    if (parts.length !== 3) {
      throw new Error('无效的JWT格式')
    }

    decodedHeader.value = JSON.parse(atob(parts[0]))
    decodedPayload.value = JSON.parse(atob(parts[1]))
  } catch (err) {
    error.value = '解码失败: ' + err.message
  }
}

const expTime = computed(() => {
  if (!decodedPayload.value?.exp) return null
  return new Date(decodedPayload.value.exp * 1000).toLocaleString('zh-CN')
})

const expirationStatus = computed(() => {
  if (!decodedPayload.value?.exp) return ''
  const exp = decodedPayload.value.exp * 1000
  const now = Date.now()
  return exp > now ? 'valid' : 'expired'
})

const expirationText = computed(() => {
  if (!decodedPayload.value?.exp) return ''
  return expirationStatus.value === 'valid' ? '未过期' : '已过期'
})
</script>

<style scoped>
.jwt-decoder {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.layout-container {
  display: flex;
  gap: 20px;
}

.left-panel {
  flex: 1;
}

.right-panel {
  flex: 2;
}

.input-section {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.input-section textarea {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: monospace;
  font-size: 14px;
  resize: none;
}

.decoded-section {
  background: #f8f9fa;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
}

.decoded-section h3 {
  margin-top: 0;
  color: #333;
}

.decoded-section pre {
  background: white;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: monospace;
  white-space: pre-wrap;
}

.expiration-info {
  margin-top: 15px;
  padding: 10px;
  background: white;
  border-radius: 4px;
}

.status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  margin-left: 10px;
  font-weight: bold;
}

.status.valid {
  background: #d4edda;
  color: #155724;
}

.status.expired {
  background: #f8d7da;
  color: #721c24;
}

.error {
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
}
</style>
