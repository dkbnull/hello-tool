<template>
  <div class="tool-container">
    <h2>加解密工具</h2>
    <p class="tool-description">支持Base64、AES、DES、3DES和MD5加解密</p>

    <div class="converter-container">

      <!-- 控制区域 -->
      <div class="control-section">
        <div class="control-row">
          <!-- 加密模式选择 -->
          <div class="mode-selector">
            <label>加密模式：</label>
            <select v-model="cryptoMode" class="mode-select">
              <option value="base64">Base64</option>
              <option value="aes">AES</option>
              <option value="des">DES</option>
              <option value="tripleDes">3DES</option>
              <option value="md5">MD5</option>
            </select>
          </div>

          <!-- 密钥输入 -->
          <div class="key-input-container">
            <!-- AES密钥输入 -->
            <div v-if="cryptoMode === 'aes'" class="key-input">
              <label for="aesKey">AES密钥：</label>
              <input
                  type="text"
                  id="aesKey"
                  v-model="aesKey"
                  placeholder="请输入AES密钥"
                  class="key-input-field"
              />
            </div>

            <!-- DES密钥输入 -->
            <div v-if="cryptoMode === 'des'" class="key-input">
              <label for="desKey">DES密钥：</label>
              <input
                  type="text"
                  id="desKey"
                  v-model="desKey"
                  placeholder="请输入DES密钥"
                  class="key-input-field"
              />
            </div>

            <!-- 3DES密钥输入 -->
            <div v-if="cryptoMode === 'tripleDes'" class="key-input">
              <label for="tripleDesKey">3DES密钥：</label>
              <input
                  type="text"
                  id="tripleDesKey"
                  v-model="tripleDesKey"
                  placeholder="请输入3DES密钥"
                  class="key-input-field"
              />
            </div>
          </div>

          <!-- 加密解密按钮 -->
          <div class="input-buttons">
            <button @click="handleEncrypt" class="action-btn success">
              <i class="fas fa-lock mr-1"></i>加密
            </button>
            <button @click="handleDecrypt" class="action-btn warning">
              <i class="fas fa-unlock mr-1"></i>解密
            </button>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-section">
        <div class="input-header">
          <h3>输入</h3>
          <button @click="clearInput" class="action-btn secondary">
            <i class="fas fa-trash-alt mr-1"></i>清空
          </button>
        </div>
        <textarea
            v-model="input"
            rows="8"
        ></textarea>
      </div>

      <!-- 输出区域 -->
      <div class="output-section">
        <div class="output-header">
          <h3>结果</h3>
          <button @click="handleCopy(output)" class="action-btn copy-btn" :disabled="!output">
            <i class="fas fa-copy mr-1"></i>复制
          </button>
        </div>
        <pre class="output-area">{{ output }}</pre>
        <div v-if="error" class="error-message">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import CryptoJS from 'crypto-js'
import {copyToClipboard} from '../../utils/clipboard'
import {showToast} from '../../utils/toast'

const input = ref('')
const output = ref('')
const error = ref('')
const cryptoMode = ref('base64')
const aesKey = ref('')
const desKey = ref('')
const tripleDesKey = ref('')
const rsaPublicKey = ref('')
const rsaPrivateKey = ref('')

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
  input.value = ''
  output.value = ''
  error.value = ''
}

// Base64加密
const base64Encrypt = () => {
  try {
    output.value = btoa(unescape(encodeURIComponent(input.value)))
    error.value = ''
  } catch (err) {
    error.value = '加密失败: ' + err.message
  }
}

// Base64解密
const base64Decrypt = () => {
  try {
    output.value = decodeURIComponent(escape(atob(input.value)))
    error.value = ''
  } catch (err) {
    error.value = '解密失败: ' + err.message
  }
}

// AES加密
const aesEncrypt = () => {
  if (!aesKey.value) {
    error.value = '请输入密钥'
    return
  }
  try {
    const encrypted = CryptoJS.AES.encrypt(input.value, aesKey.value).toString()
    output.value = encrypted
    error.value = ''
  } catch (err) {
    error.value = '加密失败: ' + err.message
  }
}

// AES解密
const aesDecrypt = () => {
  if (!aesKey.value) {
    error.value = '请输入密钥'
    return
  }
  try {
    const decrypted = CryptoJS.AES.decrypt(input.value, aesKey.value).toString(CryptoJS.enc.Utf8)
    output.value = decrypted
    error.value = ''
  } catch (err) {
    error.value = '解密失败: ' + err.message
  }
}

// DES加密
const desEncrypt = () => {
  if (!desKey.value) {
    error.value = '请输入DES密钥'
    return
  }
  try {
    const encrypted = CryptoJS.DES.encrypt(input.value, desKey.value).toString()
    output.value = encrypted
    error.value = ''
  } catch (err) {
    error.value = '加密失败: ' + err.message
  }
}

// DES解密
const desDecrypt = () => {
  if (!desKey.value) {
    error.value = '请输入DES密钥'
    return
  }
  try {
    const decrypted = CryptoJS.DES.decrypt(input.value, desKey.value).toString(CryptoJS.enc.Utf8)
    output.value = decrypted
    error.value = ''
  } catch (err) {
    error.value = '解密失败: ' + err.message
  }
}

// 3DES加密
const tripleDesEncrypt = () => {
  if (!tripleDesKey.value) {
    error.value = '请输入3DES密钥'
    return
  }
  try {
    const encrypted = CryptoJS.TripleDES.encrypt(input.value, tripleDesKey.value).toString()
    output.value = encrypted
    error.value = ''
  } catch (err) {
    error.value = '加密失败: ' + err.message
  }
}

// 3DES解密
const tripleDesDecrypt = () => {
  if (!tripleDesKey.value) {
    error.value = '请输入3DES密钥'
    return
  }
  try {
    const decrypted = CryptoJS.TripleDES.decrypt(input.value, tripleDesKey.value).toString(CryptoJS.enc.Utf8)
    output.value = decrypted
    error.value = ''
  } catch (err) {
    error.value = '解密失败: ' + err.message
  }
}

// MD5加密
const md5Encrypt = () => {
  try {
    const encrypted = CryptoJS.MD5(input.value).toString()
    output.value = encrypted
    error.value = ''
  } catch (err) {
    error.value = '加密失败: ' + err.message
  }
}

// RSA加密（使用Web Crypto API）
const rsaEncrypt = () => {
  if (!rsaPublicKey.value) {
    error.value = '请输入RSA公钥'
    return
  }
  try {
    // 这里使用简化的RSA加密实现
    // 实际项目中可能需要更复杂的实现
    output.value = 'RSA加密功能需要完整的Web Crypto API实现'
    error.value = ''
  } catch (err) {
    error.value = '加密失败: ' + err.message
  }
}

// RSA解密（使用Web Crypto API）
const rsaDecrypt = () => {
  if (!rsaPrivateKey.value) {
    error.value = '请输入RSA私钥'
    return
  }
  try {
    // 这里使用简化的RSA解密实现
    // 实际项目中可能需要更复杂的实现
    output.value = 'RSA解密功能需要完整的Web Crypto API实现'
    error.value = ''
  } catch (err) {
    error.value = '解密失败: ' + err.message
  }
}

// 处理加密操作
const handleEncrypt = () => {
  const encryptors = {
    base64: base64Encrypt,
    aes: aesEncrypt,
    des: desEncrypt,
    tripleDes: tripleDesEncrypt,
    md5: md5Encrypt,
    rsa: rsaEncrypt
  }

  const encryptor = encryptors[cryptoMode.value]
  if (encryptor) {
    encryptor()
  }
}

// 处理解密操作
const handleDecrypt = () => {
  const decrypts = {
    base64: base64Decrypt,
    aes: aesDecrypt,
    des: desDecrypt,
    tripleDes: tripleDesDecrypt,
    rsa: rsaDecrypt
  }

  const decryptor = decrypts[cryptoMode.value]
  if (decryptor) {
    decryptor()
  }
}
</script>

<style scoped>
.tool-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 1rem;
  box-sizing: border-box;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.75rem;
  font-weight: bold;
}

.tool-description {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

.converter-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.input-section,
.output-section,
.control-section {
  width: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.control-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
}

.mode-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 200px;
}

.key-input-container {
  flex: 2;
  min-width: 300px;
}

.key-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.key-input-field {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-width: 200px;
}

.input-buttons {
  display: flex;
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .control-row {
    flex-direction: column;
    align-items: stretch;
  }

  .mode-selector,
  .key-input-container,
  .input-buttons {
    width: 100%;
  }

  .key-input {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
}

.input-header,
.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

h3 {
  font-size: 1.25rem;
  color: #333;
  margin: 0;
}

.mode-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mode-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.key-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.key-input-field {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.input-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.output-area {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: monospace;
  background: #f7fafc;
  overflow: auto;
  min-height: 200px;
  max-height: 500px;
  white-space: pre-wrap;
  word-wrap: break-word;
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