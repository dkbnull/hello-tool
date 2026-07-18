<template>
  <div class="tool-container">
    <h2>RSA密钥生成</h2>

    <div class="section-card">
      <div class="control-row">
        <div class="input-group">
          <label>密钥长度：</label>
          <select v-model="keySize">
            <option value="1024">1024</option>
            <option value="2048">2048</option>
            <option value="4096">4096</option>
          </select>
        </div>
        <div class="input-group">
          <label>密钥格式：</label>
          <select v-model="keyFormat">
            <option value="pkcs8">PKCS#8（推荐，Java兼容）</option>
            <option value="pkcs1">PKCS#1</option>
          </select>
        </div>
        <button @click="generateRsaKeys" class="btn btn-success" :disabled="generating">
          {{ generating ? '生成中...' : '生成RSA密钥对' }}
        </button>
      </div>
      <div class="format-hint">
        <span class="hint-icon">💡</span>
        PKCS#8 格式（<code>-----BEGIN PRIVATE KEY-----</code>）兼容 Java/Go 等语言；PKCS#1 格式（<code>-----BEGIN RSA
        PRIVATE KEY-----</code>）兼容 OpenSSL 默认输出
      </div>
    </div>

    <div v-if="publicKey" class="section-card">
      <div class="section-header">
        <h3>公钥</h3>
        <button @click="handleCopy(publicKey)" class="btn btn-copy btn-sm">复制</button>
      </div>
      <pre class="key-output">{{ publicKey }}</pre>
    </div>

    <div v-if="privateKey" class="section-card">
      <div class="section-header">
        <h3>私钥</h3>
        <button @click="handleCopy(privateKey)" class="btn btn-copy btn-sm">复制</button>
      </div>
      <pre class="key-output">{{ privateKey }}</pre>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useCopy} from '@/composables/useCopy'

const {handleCopy} = useCopy()

const publicKey = ref('')
const privateKey = ref('')
const generating = ref(false)
const keySize = ref('2048')
const keyFormat = ref('pkcs8')

const arrayBufferToBase64 = (buffer) => {
  const binary = new Uint8Array(buffer)
  let base64 = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  for (let i = 0; i < binary.length; i += 3) {
    const triplet = (binary[i] << 16) | (binary[i + 1] << 8) | binary[i + 2]
    for (let j = 0; j < 4; j++) {
      base64 += (i + j < binary.length) ? chars[(triplet >> 6 * (3 - j)) & 0x3F] : '='
    }
  }

  return base64.match(/.{1,64}/g).join('\n')
}

const stripPkcs8Header = (pkcs8Buffer) => {
  const bytes = new Uint8Array(pkcs8Buffer)
  if (bytes[0] === 0x30 && bytes[1] === 0x82) {
    let offset = 2
    const lengthSize = bytes[1] & 0x80 ? (bytes[1] & 0x7f) : 0
    offset += lengthSize

    if (bytes[offset] === 0x02 && bytes[offset + 1] === 0x01 && bytes[offset + 2] === 0x00) {
      offset += 3

      if (bytes[offset] === 0x30) {
        const seqLength = bytes[offset + 1] & 0x80
            ? (2 + (bytes[offset + 1] & 0x7f))
            : 2
        offset += seqLength

        if (bytes[offset] === 0x04) {
          offset += 1
          if (bytes[offset] & 0x80) {
            const lenBytes = bytes[offset] & 0x7f
            offset += 1 + lenBytes
          } else {
            offset += 1
          }

          return bytes.slice(offset).buffer
        }
      }
    }
  }
  return pkcs8Buffer
}

const stripSpkiHeader = (spkiBuffer) => {
  const bytes = new Uint8Array(spkiBuffer)
  if (bytes[0] === 0x30 && bytes[1] === 0x82) {
    let offset = 2
    const lengthSize = bytes[1] & 0x80 ? (bytes[1] & 0x7f) : 0
    offset += lengthSize

    if (bytes[offset] === 0x30) {
      const seqLength = bytes[offset + 1] & 0x80
          ? (2 + (bytes[offset + 1] & 0x7f))
          : 2
      offset += seqLength

      if (bytes[offset] === 0x03) {
        offset += 1
        if (bytes[offset] & 0x80) {
          const lenBytes = bytes[offset] & 0x7f
          offset += 1 + lenBytes
        } else {
          offset += 1
        }
        offset += 1

        return bytes.slice(offset).buffer
      }
    }
  }
  return spkiBuffer
}

const formatPem = (base64Str, type) => {
  return `-----BEGIN ${type}-----\n${base64Str}\n-----END ${type} KEY-----`
}

const generateRsaKeys = async () => {
  generating.value = true
  try {
    const keyPair = await window.crypto.subtle.generateKey(
        {
          name: 'RSASSA-PKCS1-v1_5',
          modulusLength: parseInt(keySize.value),
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256'
        },
        true,
        ['sign', 'verify']
    )

    const pubBuffer = await window.crypto.subtle.exportKey('spki', keyPair.publicKey)
    const privBuffer = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey)

    if (keyFormat.value === 'pkcs8') {
      publicKey.value = formatPem(arrayBufferToBase64(pubBuffer), 'PUBLIC')
      privateKey.value = formatPem(arrayBufferToBase64(privBuffer), 'PRIVATE')
    } else {
      const pubRaw = stripSpkiHeader(pubBuffer)
      const privRaw = stripPkcs8Header(privBuffer)
      publicKey.value = formatPem(arrayBufferToBase64(pubRaw), 'RSA PUBLIC')
      privateKey.value = formatPem(arrayBufferToBase64(privRaw), 'RSA PRIVATE')
    }
  } catch {
    publicKey.value = '生成失败：浏览器不支持Web Crypto API'
    privateKey.value = ''
  } finally {
    generating.value = false
  }
}
</script>

<style scoped>
.tool-container {
  max-width: 800px;
}

.control-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
}

.control-row .input-group {
  flex: 1;
  min-width: 180px;
}

.control-row .input-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.control-row select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  background: white;
}

.control-row select:focus {
  border-color: var(--color-info);
  outline: none;
}

.format-hint {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--color-primary-light);
  border-radius: var(--radius-sm);
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.format-hint code {
  background: rgba(0, 0, 0, 0.06);
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  font-size: 0.75rem;
}

.hint-icon {
  font-size: 1rem;
  flex-shrink: 0;
}

.key-output {
  background: var(--color-bg-output);
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  max-height: 300px;
  overflow-y: auto;
  margin: 0;
}

@media (max-width: 768px) {
  .control-row {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
