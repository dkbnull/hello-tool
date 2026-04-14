<template>
  <div class="tool-container">
    <h2>二维码生成器</h2>

    <div class="converter-container">
      <div class="section-card">
        <div class="section-header">
          <h3>文本内容</h3>
          <div class="flex-row">
            <button @click="handleCopy(text)" class="btn btn-copy btn-sm" :disabled="!text">复制</button>
            <button @click="clearAll" class="btn btn-secondary btn-sm">清空</button>
          </div>
        </div>
        <div class="input-group">
          <textarea v-model="text" placeholder="请输入要生成二维码的文本或URL，或上传二维码图片后点击识别"
                    rows="10"></textarea>
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
        </div>

        <button @click="generateQrCode" class="btn btn-success action-btn" :disabled="!text">
          生成二维码 <span class="arrow">→</span>
        </button>
      </div>

      <div class="section-card">
        <div class="section-header">
          <h3>二维码图片</h3>
          <div class="flex-row">
            <button @click="downloadQrCode" class="btn btn-primary btn-sm" :disabled="!imageUrl">下载</button>
            <button @click="clearAll" class="btn btn-secondary btn-sm">清空</button>
          </div>
        </div>
        <div class="image-area"
             @click="triggerFileInput"
             @dragover.prevent="onDragOver"
             @dragleave.prevent="onDragLeave"
             @drop.prevent="handleFileDrop"
             :class="{'drag-over': isDragOver, 'has-image': imageUrl}">
          <input type="file" ref="fileInput" accept="image/*" @change="handleFileSelect" class="hidden-input"/>
          <div class="upload-content">
            <img v-if="imageUrl" :src="imageUrl" alt="二维码" class="preview-image"/>
            <div v-else class="upload-placeholder">
              <span class="upload-icon">📷</span>
              <p>点击或拖拽二维码图片到此处</p>
              <p class="upload-hint">上传二维码图片可识别内容</p>
            </div>
          </div>
        </div>

        <div v-if="decodeLoading" class="decode-status decode-loading">
          <span class="loading-spinner"></span>
          <span>正在识别...</span>
        </div>
        <div v-else-if="decodeError" class="decode-status decode-error">
          ❌ {{ decodeError }}
        </div>

        <button @click="decodeQrCode" class="btn btn-primary action-btn" :disabled="!imageUrl">
          <span class="arrow">←</span> 识别二维码
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import QRCode from 'qrcode'
import jsQR from 'jsqr'
import {useCopy} from '../../composables/useCopy'

const {handleCopy} = useCopy()

const text = ref('')
const size = ref(256)
const errorCorrectionLevel = ref('M')
const imageUrl = ref('')
const imageSource = ref('')

const fileInput = ref(null)
const isDragOver = ref(false)
const decodeLoading = ref(false)
const decodeError = ref('')

const clearAll = () => {
  text.value = ''
  imageUrl.value = ''
  imageSource.value = ''
  decodeError.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

const generateQrCode = async () => {
  if (!text.value) return
  try {
    imageUrl.value = await QRCode.toDataURL(text.value, {
      width: size.value,
      margin: 2,
      errorCorrectionLevel: errorCorrectionLevel.value,
    })
    imageSource.value = 'generated'
    decodeError.value = ''
  } catch (e) {
    imageUrl.value = ''
    imageSource.value = ''
  }
}

const downloadQrCode = () => {
  if (!imageUrl.value) return
  const link = document.createElement('a')
  link.download = 'qrcode.png'
  link.href = imageUrl.value
  link.click()
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const onDragOver = () => {
  isDragOver.value = true
}

const onDragLeave = () => {
  isDragOver.value = false
}

const handleFileSelect = (e) => {
  handleFile(e.target.files[0])
}

const handleFileDrop = (e) => {
  isDragOver.value = false
  handleFile(e.dataTransfer.files[0])
}

const handleFile = (file) => {
  if (!file) return
  if (!file.type.startsWith('image/')) {
    decodeError.value = '请上传图片文件'
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    imageUrl.value = e.target.result
    imageSource.value = 'uploaded'
    decodeError.value = ''
  }
  reader.onerror = () => {
    decodeError.value = '文件读取失败'
  }
  reader.readAsDataURL(file)
}

const decodeQrCode = () => {
  if (!imageUrl.value) return
  decodeLoading.value = true
  decodeError.value = ''

  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(imageData.data, imageData.width, imageData.height)
    decodeLoading.value = false
    if (code) {
      text.value = code.data
    } else {
      decodeError.value = '未能在图片中识别到二维码，请确保图片包含有效的二维码'
    }
  }
  img.onerror = () => {
    decodeLoading.value = false
    decodeError.value = '图片加载失败'
  }
  img.src = imageUrl.value
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

.action-btn {
  width: 100%;
  margin-top: 1rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.action-btn .arrow {
  font-size: 1.2rem;
  font-weight: bold;
}

.image-area {
  width: 100%;
  min-height: 265px;
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8f9fa;
}

.image-area:hover {
  border-color: var(--color-primary);
  background: var(--color-bg-hover);
}

.image-area.drag-over {
  border-color: var(--color-primary);
  background: rgba(66, 153, 225, 0.1);
  transform: scale(1.01);
}

.image-area.has-image {
  border-style: solid;
  border-color: var(--color-success);
  background: #f0fff4;
}

.upload-content {
  text-align: center;
  padding: 1.5rem;
  width: 100%;
}

.upload-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.75rem;
}

.upload-placeholder {
  text-align: center;
}

.upload-placeholder p {
  margin: 0.25rem 0;
  color: var(--color-text-secondary);
}

.upload-hint {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.preview-image {
  max-width: 100%;
  max-height: 280px;
  border-radius: var(--radius-sm);
}

.decode-status {
  margin-top: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
}

.decode-loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
  background: #f7fafc;
}

.decode-error {
  color: #e53e3e;
  background: #fff5f5;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.hidden-input {
  display: none;
}

@media (max-width: 768px) {
  .converter-container {
    flex-direction: column;
  }
}
</style>
