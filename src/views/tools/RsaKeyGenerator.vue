<template>
  <div class="tool-container">
    <h2>生成RSA密钥</h2>
    <div class="rsa-generator">
      <button @click="generateRsaKeys" class="action-btn success">生成密钥对</button>

      <div class="key-section">
        <h3>公钥</h3>
        <pre>{{ publicKey }}</pre>
        <button @click="handleCopy(publicKey)" class="copy-btn">复制公钥</button>
      </div>

      <div class="key-section">
        <h3>私钥</h3>
        <pre>{{ privateKey }}</pre>
        <button @click="handleCopy(privateKey)" class="copy-btn">复制私钥</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {copyToClipboard} from '../../utils/clipboard'
import {showToast} from '../../utils/toast'

const publicKey = ref('')
const privateKey = ref('')

// 复制到剪贴板
const handleCopy = async (text) => {
  if (text) {
    const success = await copyToClipboard(text)
    showToast({
      message: success ? '已复制到剪贴板' : '复制失败'
    })
  }
}

const generateRsaKeys = () => {
  try {
    // 这里使用Web Crypto API生成RSA密钥对
    window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256'
        },
        true,
        ['encrypt', 'decrypt']
    ).then((keyPair) => {
      // 导出公钥
      return window.crypto.subtle.exportKey('spki', keyPair.publicKey)
          .then((publicKeyBuffer) => {
            publicKey.value = arrayBufferToBase64(publicKeyBuffer, 'PUBLIC')
            return keyPair.privateKey
          })
          .then((privateKey) => {
            // 导出私钥
            return window.crypto.subtle.exportKey('pkcs8', privateKey)
          })
          .then((privateKeyBuffer) => {
            privateKey.value = arrayBufferToBase64(privateKeyBuffer, 'PRIVATE')
          })
    }).catch((error) => {
      console.error('生成RSA密钥失败:', error)
      publicKey.value = '生成失败'
      privateKey.value = '生成失败'
    })
  } catch (error) {
    publicKey.value = '浏览器不支持Web Crypto API'
    privateKey.value = '浏览器不支持Web Crypto API'
  }
}

// ArrayBuffer转Base64
const arrayBufferToBase64 = (buffer, type) => {
  const binary = new Uint8Array(buffer)
  let base64 = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  for (let i = 0; i < binary.length; i += 3) {
    const triplet = (binary[i] << 16) | (binary[i + 1] << 8) | binary[i + 2]
    for (let j = 0; j < 4; j++) {
      if (i + j < binary.length) {
        base64 += chars[(triplet >> 6 * (3 - j)) & 0x3F]
      } else {
        base64 += '='
      }
    }
  }

  // 添加PEM格式头和尾
  const header = type === 'PUBLIC' ? 'PUBLIC' : 'PRIVATE'
  return `-----BEGIN ${header} KEY-----\n` +
      base64.match(/.{1,64}/g).join('\n') +
      `\n-----END ${header} KEY-----`
}
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

.rsa-generator {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.action-btn.success {
  padding: 1rem 2rem;
  font-size: 1rem;
}

.key-section {
  margin-top: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.key-section h3 {
  margin-bottom: 1rem;
  color: #42b883;
  font-size: 1.1rem;
  font-weight: 600;
}

pre {
  background: white;
  padding: 1.25rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow-x: auto;
  white-space: pre-wrap;
  max-height: 300px;
  overflow-y: auto;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9rem;
  line-height: 1.4;
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

.copy-btn {
  margin-top: 0.5rem;
}
</style>