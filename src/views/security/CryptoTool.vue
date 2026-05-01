<template>
  <div class="tool-container">
    <h2>加解密工具</h2>

    <div class="section-card">
      <div class="control-row">
        <div class="input-group">
          <label>加密模式：</label>
          <select v-model="cryptoMode">
            <option value="base64">Base64</option>
            <option value="aes">AES</option>
            <option value="des">DES</option>
            <option value="tripleDes">3DES</option>
            <option value="md5">MD5</option>
            <option value="sha">SHA</option>
            <option value="sha256">SHA256</option>
          </select>
        </div>

        <div v-if="cryptoMode === 'aes'" class="input-group">
          <label>AES密钥：</label>
          <input type="text" v-model="aesKey" placeholder="请输入AES密钥"/>
        </div>
        <div v-if="cryptoMode === 'des'" class="input-group">
          <label>DES密钥：</label>
          <input type="text" v-model="desKey" placeholder="请输入DES密钥"/>
        </div>
        <div v-if="cryptoMode === 'tripleDes'" class="input-group">
          <label>3DES密钥：</label>
          <input type="text" v-model="tripleDesKey" placeholder="请输入3DES密钥"/>
        </div>

        <div class="button-group-inline">
          <button @click="handleEncrypt" class="btn btn-success">加密</button>
          <button @click="handleDecrypt" class="btn btn-warning" :disabled="isHashMode">解密</button>
        </div>
      </div>
    </div>

    <div class="converter-container">
      <div class="input-section section-card">
        <div class="section-header">
          <h3>输入</h3>
          <button @click="clearInput" class="btn btn-secondary btn-sm">清空</button>
        </div>
        <textarea v-model="input" rows="15"></textarea>
      </div>

      <div class="output-section section-card">
        <div class="section-header">
          <h3>结果</h3>
          <button @click="handleCopy(output)" class="btn btn-copy btn-sm" :disabled="!output">复制</button>
        </div>
        <pre class="output-area">{{ output }}</pre>
        <div v-if="error" class="error-message">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import CryptoJS from 'crypto-js'
import {useCopy} from '@/composables/useCopy'

const {handleCopy} = useCopy()

const input = ref('')
const output = ref('')
const error = ref('')
const cryptoMode = ref('base64')
const aesKey = ref('')
const desKey = ref('')
const tripleDesKey = ref('')

const isHashMode = computed(() => ['md5', 'sha', 'sha256'].includes(cryptoMode.value))

const clearInput = () => {
  input.value = ''
  output.value = ''
  error.value = ''
}

const encryptors = {
  base64: () => {
    try {
      output.value = btoa(unescape(encodeURIComponent(input.value)))
      error.value = ''
    } catch (e) {
      error.value = '加密失败: ' + e.message
    }
  },
  aes: () => {
    if (!aesKey.value) {
      error.value = '请输入密钥';
      return
    }
    try {
      output.value = CryptoJS.AES.encrypt(input.value, aesKey.value).toString()
      error.value = ''
    } catch (e) {
      error.value = '加密失败: ' + e.message
    }
  },
  des: () => {
    if (!desKey.value) {
      error.value = '请输入DES密钥';
      return
    }
    try {
      output.value = CryptoJS.DES.encrypt(input.value, desKey.value).toString()
      error.value = ''
    } catch (e) {
      error.value = '加密失败: ' + e.message
    }
  },
  tripleDes: () => {
    if (!tripleDesKey.value) {
      error.value = '请输入3DES密钥';
      return
    }
    try {
      output.value = CryptoJS.TripleDES.encrypt(input.value, tripleDesKey.value).toString()
      error.value = ''
    } catch (e) {
      error.value = '加密失败: ' + e.message
    }
  },
  md5: () => {
    try {
      output.value = CryptoJS.MD5(input.value).toString()
      error.value = ''
    } catch (e) {
      error.value = '加密失败: ' + e.message
    }
  },
  sha: () => {
    try {
      output.value = CryptoJS.SHA1(input.value).toString()
      error.value = ''
    } catch (e) {
      error.value = '加密失败: ' + e.message
    }
  },
  sha256: () => {
    try {
      output.value = CryptoJS.SHA256(input.value).toString()
      error.value = ''
    } catch (e) {
      error.value = '加密失败: ' + e.message
    }
  }
}

const decryptors = {
  base64: () => {
    try {
      output.value = decodeURIComponent(escape(atob(input.value)))
      error.value = ''
    } catch (e) {
      error.value = '解密失败: ' + e.message
    }
  },
  aes: () => {
    if (!aesKey.value) {
      error.value = '请输入密钥';
      return
    }
    try {
      output.value = CryptoJS.AES.decrypt(input.value, aesKey.value).toString(CryptoJS.enc.Utf8)
      error.value = ''
    } catch (e) {
      error.value = '解密失败: ' + e.message
    }
  },
  des: () => {
    if (!desKey.value) {
      error.value = '请输入DES密钥';
      return
    }
    try {
      output.value = CryptoJS.DES.decrypt(input.value, desKey.value).toString(CryptoJS.enc.Utf8)
      error.value = ''
    } catch (e) {
      error.value = '解密失败: ' + e.message
    }
  },
  tripleDes: () => {
    if (!tripleDesKey.value) {
      error.value = '请输入3DES密钥';
      return
    }
    try {
      output.value = CryptoJS.TripleDES.decrypt(input.value, tripleDesKey.value).toString(CryptoJS.enc.Utf8)
      error.value = ''
    } catch (e) {
      error.value = '解密失败: ' + e.message
    }
  }
}

const handleEncrypt = () => {
  const fn = encryptors[cryptoMode.value]
  if (fn) fn()
}

const handleDecrypt = () => {
  const fn = decryptors[cryptoMode.value]
  if (fn) fn()
}
</script>

<style scoped>
.control-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.control-row .input-group {
  flex: 1;
  min-width: 200px;
}

.control-row select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 1rem;
  background: white;
}

.control-row select:focus {
  border-color: var(--color-info);
  outline: none;
}

.control-row .input-group select {
  max-width: 200px;
}

.control-row .input-group input {
  width: 500px;
}

.control-row .input-group select,
.control-row .input-group input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: var(--radius-sm);
  font-size: 1rem;
}

.button-group-inline {
  display: flex;
  gap: 0.75rem;
}

.converter-container {
  display: flex;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.converter-container .input-section,
.converter-container .output-section {
  flex: 1;
  min-width: 300px;
}

.output-area {
  min-height: 310px;
  padding: 0.75rem;
  background: #f7fafc;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9rem;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: auto;
}

@media (max-width: 768px) {
  .converter-container {
    flex-direction: column;
  }

  .control-row {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
