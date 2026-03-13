<template>
  <div class="tool-container">
    <h2>生成RSA密钥</h2>
    <div class="rsa-generator">
      <button @click="generateRsaKeys" class="generate-btn">生成密钥对</button>

      <div class="key-section">
        <h3>公钥：</h3>
        <pre>{{ publicKey }}</pre>
        <button @click="copyToClipboard(publicKey)" class="copy-btn">复制公钥</button>
      </div>

      <div class="key-section">
        <h3>私钥：</h3>
        <pre>{{ privateKey }}</pre>
        <button @click="copyToClipboard(privateKey)" class="copy-btn">复制私钥</button>
      </div>
    </div>
  </div>

  <!-- Toast提示 -->
  <div v-if="showToast" class="toast">
    {{ toastMessage }}
  </div>
</template>

<script setup>
import {ref} from 'vue'

const publicKey = ref('')
const privateKey = ref('')
const toastMessage = ref('')
const showToast = ref(false)
let toastTimeout = null

// 显示toast提示
const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true

  // 清除之前的定时器
  if (toastTimeout) {
    clearTimeout(toastTimeout)
  }

  // 3秒后自动隐藏
  toastTimeout = setTimeout(() => {
    showToast.value = false
  }, 3000)
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
            publicKey.value = arrayBufferToBase64(publicKeyBuffer)
            return keyPair.privateKey
          })
          .then((privateKey) => {
            // 导出私钥
            return window.crypto.subtle.exportKey('pkcs8', privateKey)
          })
          .then((privateKeyBuffer) => {
            privateKey.value = arrayBufferToBase64(privateKeyBuffer)
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
const arrayBufferToBase64 = (buffer) => {
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
  return '-----BEGIN PUBLIC KEY-----\n' +
      base64.match(/.{1,64}/g).join('\n') +
      '\n-----END PUBLIC KEY-----'
}

// 复制到剪贴板
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
      .then(() => {
        showToastMessage('已复制到剪贴板')
      })
      .catch((error) => {
        console.error('复制失败:', error)
        showToastMessage('复制失败')
      })
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

.generate-btn {
  padding: 1rem 2rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.generate-btn:hover {
  background: #35495e;
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

.copy-btn {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: #35495e;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.copy-btn:hover {
  background: #42b883;
}
</style>