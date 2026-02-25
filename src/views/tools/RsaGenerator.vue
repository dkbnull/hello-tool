<template>
  <div class="rsa-generator">
    <h2>RSA密钥生成器</h2>

    <!-- 配置区域 -->
    <div class="config-section">
      <div class="form-group">
        <label>密钥长度:</label>
        <select v-model="keySize">
          <option :value="1024">1024位</option>
          <option :value="2048">2048位</option>
          <option :value="4096">4096位</option>
        </select>
      </div>

      <button @click="generateKeys" :disabled="generating">
        {{ generating ? '生成中...' : '生成RSA密钥对' }}
      </button>
    </div>

    <!-- 密钥展示区域 -->
    <div v-if="publicKey || privateKey" class="keys-section">
      <div class="key-container">
        <h3>公钥 (Public Key)</h3>
        <div class="key-content">
          <textarea readonly v-model="publicKey" rows="8"></textarea>
          <button @click="copyToClipboard(publicKey)">复制公钥</button>
        </div>
      </div>

      <div class="key-container">
        <h3>私钥 (Private Key)</h3>
        <div class="key-content">
          <textarea readonly v-model="privateKey" rows="12"></textarea>
          <button @click="copyToClipboard(privateKey)">复制私钥</button>
        </div>
      </div>
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'

const keySize = ref(2048)
const publicKey = ref('')
const privateKey = ref('')
const generating = ref(false)
const error = ref('')

const generateKeys = async () => {
  generating.value = true
  error.value = ''

  try {
    // 使用 Web Crypto API 生成 RSA 密钥对
    const keyPair = await window.crypto.subtle.generateKey(
        {
          name: 'RSASSA-PKCS1-v1_5',
          modulusLength: keySize.value,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256'
        },
        true,
        ['sign', 'verify']
    )

    // 导出公钥为 PEM 格式
    const exportedPublicKey = await window.crypto.subtle.exportKey('spki', keyPair.publicKey)
    publicKey.value = arrayBufferToPem(exportedPublicKey, 'PUBLIC KEY')

    // 导出私钥为 PEM 格式
    const exportedPrivateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey)
    privateKey.value = arrayBufferToPem(exportedPrivateKey, 'PRIVATE KEY')
  } catch (err) {
    error.value = '密钥生成失败: ' + err.message
  } finally {
    generating.value = false
  }
}

// ArrayBuffer 转换为 PEM 格式
const arrayBufferToPem = (arrayBuffer, type) => {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
  const pem = `-----BEGIN ${type}-----\n`
  const formattedBase64 = base64.match(/.{1,64}/g).join('\n')
  return pem + formattedBase64 + `\n-----END ${type}-----`
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    alert('已复制到剪贴板')
  } catch (err) {
    alert('复制失败: ' + err.message)
  }
}
</script>

<style scoped>
.rsa-generator {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.config-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.keys-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.key-container {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.key-container h3 {
  margin-top: 0;
  color: #333;
}

.key-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.key-content textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  resize: vertical;
}

.key-content button {
  align-self: flex-start;
  background: #28a745;
}

.key-content button:hover {
  background: #218838;
}

.error {
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .keys-section {
    grid-template-columns: 1fr;
  }
}
</style>
