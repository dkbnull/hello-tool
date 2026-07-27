<template>
  <div class="tool-container">
    <h2>JWT解密</h2>

    <div class="jwt-layout">
      <div class="left-panel">
        <div class="section-card">
          <div class="section-header">
            <h3>JWT 令牌</h3>
            <button @click="clearInput" class="btn btn-secondary btn-sm">清空</button>
          </div>
          <textarea v-model="token" placeholder="请输入JWT Token" rows="6" @input="parseJwt"></textarea>
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>

        <div v-if="parsed" class="section-card">
          <h3>常用字段说明</h3>
          <div class="claims-list">
            <div v-for="claim in parsed.claims" :key="claim.key" class="claim-item">
              <span class="claim-key">{{ claim.key }}</span>
              <span class="claim-desc">{{ claim.description }}</span>
              <span class="claim-value">{{ claim.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="right-panel">
        <template v-if="parsed">
          <div class="section-card">
            <div class="section-header">
              <h3>Header</h3>
              <button @click="handleCopy(parsed.header)" class="btn btn-copy btn-sm">复制</button>
            </div>
            <pre class="json-output">{{ parsed.header }}</pre>
          </div>

          <div class="section-card">
            <div class="section-header">
              <h3>Payload</h3>
              <button @click="handleCopy(parsed.payload)" class="btn btn-copy btn-sm">复制</button>
            </div>
            <pre class="json-output">{{ parsed.payload }}</pre>
            <div v-if="expInfo" class="exp-badge" :class="expInfo.expired ? 'exp-expired' : 'exp-valid'">
              <span class="exp-icon">{{ expInfo.expired ? '🔴' : '🟢' }}</span>
              <span>{{ expInfo.text }}</span>
            </div>
          </div>

          <div class="section-card">
            <div class="section-header">
              <h3>Signature</h3>
              <button @click="handleCopy(parsed.signature)" class="btn btn-copy btn-sm">复制</button>
            </div>
            <div class="signature-display">
              <span class="mono">{{ parsed.signature }}</span>
            </div>
          </div>
        </template>

        <div v-if="!parsed && !error" class="section-card empty-hint">
          <p>请在左侧输入JWT令牌进行解析</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useCopy } from '@/composables/useCopy'

const { handleCopy } = useCopy()

// 安全解析 JSON：将超出 JS 安全整数范围的长整型保留为字符串，避免精度丢失
const safeJsonParse = (jsonStr) => {
  // 匹配字符串字面量或数字字面量，字符串原样返回（避免误处理字符串内的数字）
  const tokenRegex = /"(?:\\.|[^"\\])*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g
  const processed = jsonStr.replace(tokenRegex, (match) => {
    if (match[0] === '"') return match
    // 仅处理纯整数且超出安全范围的情况，小数与科学计数法保持原样
    if (/^-?\d+$/.test(match) && !Number.isSafeInteger(Number(match))) {
      return `"${match}"`
    }
    return match
  })
  return JSON.parse(processed)
}

const token = ref('')
const parsed = ref(null)
const error = ref('')

const claimDescriptions = {
  iss: '签发者',
  sub: '主题',
  aud: '受众',
  exp: '过期时间',
  nbf: '生效时间',
  iat: '签发时间',
  jti: 'JWT ID',
}

const expInfo = computed(() => {
  if (!parsed.value) return null
  try {
    const payload = JSON.parse(parsed.value.payload)
    if (payload.exp) {
      const expDate = new Date(payload.exp * 1000)
      const now = new Date()
      const expired = now > expDate
      return {
        expired,
        text: expired
          ? `已过期（${expDate.toLocaleString('zh-CN')}）`
          : `未过期（${expDate.toLocaleString('zh-CN')}）`,
      }
    }
  } catch (e) { /* ignore */
  }
  return null
})

const clearInput = () => {
  token.value = ''
  parsed.value = null
  error.value = ''
}

const parseJwt = () => {
  error.value = ''
  parsed.value = null

  const parts = token.value.trim().split('.')
  if (parts.length !== 3) {
    if (token.value.trim()) error.value = '无效的JWT格式，应包含3个部分（用.分隔）'
    return
  }

  try {
    const decodeBase64 = (str) => {
      let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
      while (base64.length % 4) base64 += '='
      return decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''))
    }

    const header = safeJsonParse(decodeBase64(parts[0]))
    const payload = safeJsonParse(decodeBase64(parts[1]))

    const claims = Object.entries(payload)
      .filter(([key]) => claimDescriptions[key])
      .map(([key, value]) => {
        let displayValue = value
        if (typeof value === 'number' && key !== 'jti') {
          const date = new Date(value * 1000)
          if (!isNaN(date.getTime())) {
            displayValue = `${value} (${date.toLocaleString('zh-CN')})`
          }
        }
        return { key, description: claimDescriptions[key], value: displayValue }
      })

    parsed.value = {
      header: JSON.stringify(header, null, 2),
      payload: JSON.stringify(payload, null, 2),
      signature: parts[2],
      claims,
    }
  } catch (e) {
    error.value = '解析失败：' + e.message
  }
}
</script>

<style scoped>
.jwt-layout {
  display: flex;
  gap: 1.5rem;
}

.left-panel,
.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.empty-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 305px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h3 {
  margin: 0;
  color: var(--color-primary);
}

.json-output {
  background: var(--color-bg-output);
  padding: 1rem;
  border-radius: var(--radius-sm);
  overflow-x: auto;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.exp-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 600;
}

.exp-expired {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.exp-valid {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #86efac;
}

.exp-icon {
  font-size: 0.75rem;
}

.signature-display {
  padding: 1rem;
  background: var(--color-bg-output);
  border-radius: var(--radius-sm);
}

.signature-display .mono {
  word-break: break-all;
  font-size: 0.85rem;
  font-family: 'Consolas', 'Monaco', monospace;
  color: var(--color-text-secondary);
}

.claims-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.claim-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  background: var(--color-bg-output);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
}

.claim-key {
  font-weight: bold;
  font-family: 'Consolas', 'Monaco', monospace;
  min-width: 40px;
  color: var(--color-primary);
}

.claim-desc {
  min-width: 70px;
  color: var(--color-text-secondary);
  font-size: 0.85rem;
}

.claim-value {
  flex: 1;
  word-break: break-all;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.85rem;
}

.empty-hint {
  text-align: center;
  padding: 3rem 1.5rem;
  color: var(--color-text-muted);
}

.empty-hint p {
  margin: 0;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .jwt-layout {
    flex-direction: column;
  }

  .left-panel {
    width: 100%;
  }

  .claim-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>
