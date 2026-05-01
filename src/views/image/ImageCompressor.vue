<template>
  <div class="tool-container">
    <h2>图片压缩工具</h2>

    <div class="section-card mb-lg">
      <div class="control-row">
        <div class="control-group">
          <label>压缩质量：</label>
          <input type="range" v-model.number="quality" min="10" max="100" step="1" class="quality-slider"/>
          <span class="quality-value">{{ quality }}%</span>
        </div>
        <div class="control-group">
          <label>尺寸调整：</label>
          <select v-model="sizeOption" class="size-select">
            <option value="original">原始尺寸</option>
            <option value="50">50%</option>
            <option value="75">75%</option>
            <option value="custom">自定义</option>
          </select>
          <div v-if="sizeOption === 'custom'" class="custom-size">
            <input type="number" v-model.number="customWidth" placeholder="宽" class="size-input"/>
            <span>x</span>
            <input type="number" v-model.number="customHeight" placeholder="高" class="size-input"/>
          </div>
        </div>
        <button @click="compressImage" class="btn btn-success" :disabled="!imageUrl">压缩图片</button>
      </div>
    </div>

    <div class="converter-container">
      <div class="section-card">
        <div class="section-header">
          <h3>原始图片</h3>
          <button @click="clearInput" class="btn btn-secondary btn-sm">清空</button>
        </div>
        <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleFileDrop"
             :class="{'has-file': imageUrl}">
          <input type="file" ref="fileInput" accept="image/*" @change="handleFileSelect" class="hidden-input"/>
          <div class="upload-content">
            <img v-if="imageUrl" :src="imageUrl" alt="原始图片" class="preview-image"/>
            <div v-else class="upload-placeholder">
              <span class="upload-icon">🖼️</span>
              <p>点击或拖拽文件到此处上传</p>
              <p class="upload-hint">支持JPG、PNG、GIF等图片格式</p>
            </div>
          </div>
        </div>
        <div v-if="originalImageInfo" class="image-info">
          <span>尺寸：{{ originalImageInfo.width }} × {{ originalImageInfo.height }}</span>
          <span>大小：{{ formatFileSize(originalImageInfo.size) }}</span>
        </div>
        <div v-if="error" class="error-message">{{ error }}</div>
      </div>

      <div class="section-card">
        <div class="section-header">
          <h3>压缩后图片</h3>
          <div class="flex-row">
            <button @click="downloadCompressedImage" class="btn btn-success btn-sm" :disabled="!compressedImageUrl">
              下载
            </button>
            <button @click="handleCopy(compressedImageUrl)" class="btn btn-copy btn-sm" :disabled="!compressedImageUrl">
              复制
            </button>
          </div>
        </div>
        <div class="preview-area">
          <img v-if="compressedImageUrl" :src="compressedImageUrl" alt="压缩后" class="preview-image"/>
          <div v-else class="upload-placeholder">
            <span class="upload-icon">📷</span>
            <p>压缩后的图片将显示在这里</p>
          </div>
        </div>
        <div v-if="compressedImageInfo" class="image-info">
          <span>尺寸：{{ compressedImageInfo.width }} × {{ compressedImageInfo.height }}</span>
          <span>大小：{{ formatFileSize(compressedImageInfo.size) }}</span>
          <span v-if="compressionRatio !== null" class="compression-ratio">压缩率：{{
              compressionRatio.toFixed(1)
            }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useCopy} from '@/composables/useCopy'
import {
  calculateCompressionRatio,
  compressImage as compressImageUtil,
  downloadImage,
  formatFileSize
} from '@/utils/image'

const {handleCopy} = useCopy()

const imageUrl = ref('')
const compressedImageUrl = ref('')
const error = ref('')
const fileInput = ref(null)
const quality = ref(80)
const sizeOption = ref('original')
const customWidth = ref('')
const customHeight = ref('')
const originalImageInfo = ref(null)
const compressedImageInfo = ref(null)
const compressionRatio = ref(null)

const clearInput = () => {
  imageUrl.value = ''
  compressedImageUrl.value = ''
  error.value = ''
  originalImageInfo.value = null
  compressedImageInfo.value = null
  compressionRatio.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const triggerFileInput = () => {
  fileInput.value?.click()
}
const handleFileSelect = (e) => {
  handleFile(e.target.files[0])
}
const handleFileDrop = (e) => {
  handleFile(e.dataTransfer.files[0])
}

const handleFile = (file) => {
  if (!file) return
  if (!file.type.startsWith('image/')) {
    error.value = '请上传图片文件'
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    imageUrl.value = e.target.result
    error.value = ''
    const img = new Image()
    img.onload = () => {
      originalImageInfo.value = {width: img.width, height: img.height, size: file.size}
    }
    img.src = e.target.result
  }
  reader.onerror = () => {
    error.value = '文件读取失败'
  }
  reader.readAsDataURL(file)
}

const compressImage = async () => {
  if (!imageUrl.value) {
    error.value = '请先上传图片'
    return
  }
  try {
    let sizeVal = sizeOption.value
    if (sizeVal === 'custom' && customWidth.value && customHeight.value) {
      sizeVal = {width: customWidth.value, height: customHeight.value}
    }
    const result = await compressImageUtil(imageUrl.value, {quality: quality.value, size: sizeVal})
    compressedImageUrl.value = result.url
    compressedImageInfo.value = {width: result.width, height: result.height, size: result.size}
    if (originalImageInfo.value) {
      compressionRatio.value = calculateCompressionRatio(originalImageInfo.value.size, result.size)
    }
  } catch (e) {
    error.value = '压缩失败: ' + e.message
  }
}

const downloadCompressedImage = () => {
  if (!compressedImageUrl.value) return
  downloadImage(compressedImageUrl.value, 'compressed_image.jpg')
}
</script>

<style scoped>
.control-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 200px;
}

.quality-slider {
  flex: 1;
  min-width: 120px;
}

.quality-value {
  min-width: 45px;
  text-align: right;
  font-weight: 600;
}

.size-select {
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
}

.custom-size {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.size-input {
  width: 70px;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
}

.converter-container {
  display: flex;
  gap: 1.5rem;
}

.converter-container .section-card {
  flex: 1;
  min-width: 300px;
}

.upload-area, .preview-area {
  width: 100%;
  min-height: 250px;
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--color-bg-output);
}

.upload-area:hover {
  border-color: var(--color-primary);
  background: var(--color-bg-hover);
}

.upload-area.has-file {
  border-color: var(--color-success);
  background: #f0fff4;
}

.preview-area {
  cursor: default;
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
  max-height: 250px;
  border-radius: var(--radius-sm);
}

.image-info {
  display: flex;
  gap: 1rem;
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: var(--color-bg-output-hover);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  flex-wrap: wrap;
}

.compression-ratio {
  font-weight: 600;
  color: var(--color-info);
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
