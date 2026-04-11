<template>
  <div class="tool-container">
    <h2>二维码生成器</h2>

    <div class="converter-container">
      <div class="section-card">
        <div class="section-header">
          <h3>输入内容</h3>
          <button @click="clearInput" class="btn btn-secondary btn-sm">清空</button>
        </div>
        <div class="input-group">
          <textarea v-model="text" placeholder="请输入要生成二维码的文本或URL" rows="4"></textarea>
        </div>

        <div class="options">
          <div class="option-row">
            <label>尺寸：</label>
            <input
                type="range"
                v-model.number="size"
                min="128"
                max="512"
                step="1"
                class="size-slider"
            />
            <span class="size-value">{{ size }}px</span>
          </div>
          <div class="option-row">
            <label>容错级别：</label>
            <select v-model="errorCorrectionLevel">
              <option value="L">L (低)</option>
              <option value="M">M (中)</option>
              <option value="Q">Q (较高)</option>
              <option value="H">H (高)</option>
            </select>
          </div>
          <button @click="generateQrCode" class="btn btn-success" :disabled="!text">生成二维码</button>
        </div>
      </div>

      <div class="section-card">
        <div class="section-header">
          <h3>二维码</h3>
          <button @click="downloadQrCode" class="btn btn-primary" :disabled="!qrCodeUrl">下载二维码</button>
        </div>
        <div class="qrcode-image-wrapper">
          <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="QR Code" class="qrcode-image"/>
          <div v-else class="qr-code-placeholder">
            请输入内容并点击生成二维码按钮
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import QRCode from 'qrcode'

const text = ref('')
const size = ref(256)
const errorCorrectionLevel = ref('M')
const qrCodeUrl = ref('')

const clearInput = () => {
  text.value = ''
  qrCodeUrl.value = ''
}

const generateQrCode = async () => {
  if (!text.value) return
  try {
    qrCodeUrl.value = await QRCode.toDataURL(text.value, {
      width: size.value,
      margin: 2,
      errorCorrectionLevel: errorCorrectionLevel.value,
    })
  } catch (e) {
    qrCodeUrl.value = ''
  }
}

const downloadQrCode = () => {
  if (!qrCodeUrl.value) return
  const link = document.createElement('a')
  link.download = 'qrcode.png'
  link.href = qrCodeUrl.value
  link.click()
}
</script>

<style scoped>
.converter-container {
  display: flex;
  gap: 1.5rem;
}

.converter-container .section-card {
  flex: 1;
  min-width: 300px;
}

.options {
  display: flex;
  gap: 1.5rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.size-slider {
  flex: 1;
  min-width: 200px;
}

.option-row > label {
  color: var(--color-text-secondary);
  font-weight: bold;
  white-space: nowrap;
}

.option-row select {
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  background: white;
}

.qrcode-image-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  border-radius: 4px;
  background: #f7fafc;
}

.qrcode-image {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.qr-code-placeholder {
  color: #666;
  text-align: center;
  font-size: 1rem;
}
</style>
