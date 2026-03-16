<template>
  <div class="tool-container">
    <h2>二维码生成器</h2>

    <div class="converter-container">
      <!-- 左侧输入区域 -->
      <div class="input-section">
        <div class="input-header">
          <h3>输入内容</h3>
          <div class="input-actions">
            <button @click="clearInput" class="action-btn secondary">
              <i class="fas fa-trash-alt mr-1"></i>清空
            </button>
          </div>
        </div>
        <textarea
            v-model="input"
            rows="6"
            placeholder="请输入要转换为二维码的内容，如文本、网址等"
        ></textarea>

        <!-- 二维码大小设置 -->
        <div class="size-setting">
          <label for="qrSize">二维码大小：</label>
          <input
              type="number"
              id="qrSize"
              v-model.number="qrCodeSize"
              min="100"
              max="500"
              class="size-input"
          />
          <span>px</span>
        </div>

        <div class="input-buttons">
          <button @click="generateQRCode" class="action-btn success">
            <i class="fas fa-qrcode mr-1"></i>生成二维码
          </button>
        </div>
      </div>

      <!-- 右侧输出区域 -->
      <div class="output-section">
        <div class="output-header">
          <h3>二维码</h3>
          <div class="output-actions">
            <button @click="downloadQRCode" class="action-btn success" :disabled="!qrCodeUrl">
              <i class="fas fa-download mr-1"></i>下载
            </button>
          </div>
        </div>
        <div class="qr-code-container">
          <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="二维码" class="qr-code-image"/>
          <div v-else class="qr-code-placeholder">
            请输入内容并点击生成按钮
          </div>
        </div>
        <div v-if="error" class="error-area">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import QRCode from 'qrcode'

const input = ref('')
const error = ref('')
const qrCodeUrl = ref('')
const qrCodeSize = ref(200)

// 清空输入
const clearInput = () => {
  input.value = ''
  qrCodeUrl.value = ''
  error.value = ''
}

// 生成二维码
const generateQRCode = () => {
  if (!input.value) {
    error.value = '请输入内容'
    return
  }

  try {
    QRCode.toDataURL(input.value, {
      width: qrCodeSize.value,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
        .then(url => {
          qrCodeUrl.value = url
          error.value = ''
        })
        .catch(err => {
          error.value = '生成失败: ' + err.message
        })
  } catch (err) {
    error.value = '生成失败: ' + err.message
  }
}

// 下载二维码
const downloadQRCode = () => {
  if (!qrCodeUrl.value) {
    error.value = '请先生成二维码'
    return
  }

  const link = document.createElement('a')
  link.href = qrCodeUrl.value
  link.download = 'qrcode.png'
  link.click()
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

.converter-container {
  padding: 2rem;
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

@media (min-width: 1024px) {
  .converter-container {
    flex-wrap: nowrap;
  }

  .input-section,
  .output-section {
    flex: 1;
  }
}

.input-section,
.output-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
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

.input-actions {
  display: flex;
  gap: 0.5rem;
}

textarea {
  max-height: 400px;
}

.size-setting {
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.size-input {
  width: 100px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.input-buttons {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}


.qr-code-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f7fafc;
  padding: 2rem;
}

.qr-code-image {
  max-width: 100%;
  max-height: 100%;
}

.qr-code-placeholder {
  color: #666;
  text-align: center;
  font-size: 1rem;
}

.error-area {
  margin-top: 0.75rem;
  color: #e53e3e;
  font-size: 0.875rem;
}
</style>