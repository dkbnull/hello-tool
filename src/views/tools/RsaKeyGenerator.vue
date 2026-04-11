<template>
  <div class="tool-container">
    <h2>RSA密钥生成</h2>

    <div class="section-card text-center">
      <button @click="generateRsaKeys" class="btn btn-success" :disabled="generating">
        {{ generating ? '生成中...' : '生成RSA密钥对' }}
      </button>
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
import {useCopy} from '../../composables/useCopy'

const {handleCopy} = useCopy()

const publicKey = ref('')
const privateKey = ref('')
const generating = ref(false)

const arrayBufferToPem = (buffer, type) => {
  const binary = new Uint8Array(buffer)
  let base64 = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  for (let i = 0; i < binary.length; i += 3) {
    const triplet = (binary[i] << 16) | (binary[i + 1] << 8) | binary[i + 2]
    for (let j = 0; j < 4; j++) {
      base64 += (i + j < binary.length) ? chars[(triplet >> 6 * (3 - j)) & 0x3F] : '='
    }
  }

  return `-----BEGIN ${type} KEY-----\n${base64.match(/.{1,64}/g).join('\n')}\n-----END ${type} KEY-----`
}

const generateRsaKeys = async () => {
  generating.value = true
  try {
    const keyPair = await window.crypto.subtle.generateKey(
        {name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256'},
        true,
        ['encrypt', 'decrypt']
    )
    const pubBuffer = await window.crypto.subtle.exportKey('spki', keyPair.publicKey)
    const privBuffer = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey)
    publicKey.value = arrayBufferToPem(pubBuffer, 'PUBLIC')
    privateKey.value = arrayBufferToPem(privBuffer, 'PRIVATE')
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

.key-output {
  background: #f8f9fa;
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
</style>
