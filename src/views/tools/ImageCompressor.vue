<template>
  <div class="tool-container">
    <h2>图片压缩工具</h2>
    <p class="tool-description">支持上传图片并进行压缩，可调整压缩质量和尺寸</p>

    <!-- 控制区域 -->
    <div class="control-section">
      <div class="control-row">
        <!-- 压缩质量选择 -->
        <div class="quality-selector">
          <label>压缩质量：</label>
          <input
              type="range"
              v-model.number="quality"
              min="10"
              max="100"
              step="1"
              class="quality-slider"
          />
          <span class="quality-value">{{ quality }}%</span>
        </div>

        <!-- 尺寸调整选择 -->
        <div class="size-selector">
          <label>尺寸调整：</label>
          <select v-model="sizeOption" class="size-select">
            <option value="original">原始尺寸</option>
            <option value="50">50%</option>
            <option value="75">75%</option>
            <option value="custom">自定义</option>
          </select>
          <div v-if="sizeOption === 'custom'" class="custom-size-inputs">
            <input
                type="number"
                v-model.number="customWidth"
                placeholder="宽度"
                class="size-input"
            />
            <span class="size-separator">x</span>
            <input
                type="number"
                v-model.number="customHeight"
                placeholder="高度"
                class="size-input"
            />
          </div>
        </div>

        <!-- 压缩按钮 -->
        <div class="input-buttons">
          <button @click="compressImage" class="action-btn success" :disabled="!imageUrl">
            <i class="fas fa-compress mr-1"></i>压缩图片
          </button>
        </div>
      </div>
    </div>

    <div class="converter-container">
      <!-- 左侧输入区域 -->
      <div class="input-section">
        <div class="input-header">
          <h3>原始图片</h3>
          <div class="input-actions">
            <button @click="clearInput" class="action-btn secondary">
              <i class="fas fa-trash-alt mr-1"></i>清空
            </button>
          </div>
        </div>

        <!-- 图片上传和预览区域 -->
        <div class="upload-section">
          <div
              class="upload-area"
              @click="triggerFileInput"
              @dragover.prevent
              @drop.prevent="handleFileDrop"
              :class="{ 'has-file': imageUrl }"
          >
            <input
                type="file"
                ref="fileInput"
                accept="image/*"
                @change="handleFileSelect"
                class="file-input"
            />
            <div class="upload-content">
              <img v-if="imageUrl" :src="imageUrl" alt="原始图片" class="preview-image"/>
              <div v-else class="upload-placeholder">
                <span class="upload-icon">🖼️</span>
                <p class="upload-text">点击或拖拽文件到此处上传</p>
                <p class="upload-hint">支持JPG、PNG、GIF等图片格式</p>
              </div>
            </div>
          </div>
          <div v-if="originalImageInfo" class="image-info">
            <p>尺寸：{{ originalImageInfo.width }} × {{ originalImageInfo.height }}</p>
            <p>大小：{{ formatFileSize(originalImageInfo.size) }}</p>
          </div>
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>
      </div>

      <!-- 右侧输出区域 -->
      <div class="output-section">
        <div class="output-header">
          <h3>压缩后图片</h3>
          <div class="output-actions">
            <button @click="downloadCompressedImage" class="action-btn success" :disabled="!compressedImageUrl">
              <i class="fas fa-download mr-1"></i>下载
            </button>
            <button @click="copyCompressedImage" class="action-btn copy-btn" :disabled="!compressedImageUrl">
              <i class="fas fa-copy mr-1"></i>复制
            </button>
          </div>
        </div>

        <!-- 压缩后图片预览区域 -->
        <div class="preview-section">
          <img v-if="compressedImageUrl" :src="compressedImageUrl" alt="压缩后图片" class="preview-image"/>
          <div v-else class="preview-placeholder">
            <span class="preview-icon">📷</span>
            <p class="preview-text">压缩后的图片将显示在这里</p>
          </div>
        </div>
        <div v-if="compressedImageInfo" class="image-info">
          <p>尺寸：{{ compressedImageInfo.width }} × {{ compressedImageInfo.height }}</p>
          <p>大小：{{ formatFileSize(compressedImageInfo.size) }}</p>
          <p v-if="compressionRatio !== null" class="compression-ratio">
            压缩率：{{ compressionRatio.toFixed(1) }}%
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {copyToClipboard} from '../../utils/clipboard'
import {showToast} from '../../utils/toast'
import {
  calculateCompressionRatio,
  compressImage as compressImageUtil,
  downloadImage,
  formatFileSize
} from '../../utils/image'

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

// 复制压缩后的图片Base64
const copyCompressedImage = async () => {
  if (compressedImageUrl.value) {
    const success = await copyToClipboard(compressedImageUrl.value)
    showToast({
      message: success ? '已复制到剪贴板' : '复制失败'
    })
  }
}

// 清空输入
const clearInput = () => {
  imageUrl.value = ''
  compressedImageUrl.value = ''
  error.value = ''
  originalImageInfo.value = null
  compressedImageInfo.value = null
  compressionRatio.value = null
  // 清空文件输入
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 处理文件选择
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  handleFile(file)
}

// 处理文件拖拽
const handleFileDrop = (event) => {
  const file = event.dataTransfer.files[0]
  handleFile(file)
}

// 处理文件
const handleFile = (file) => {
  if (!file) return

  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    error.value = '请上传图片文件'
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const base64Value = e.target.result
    imageUrl.value = base64Value
    error.value = ''

    // 获取原始图片信息
    const img = new Image()
    img.onload = () => {
      originalImageInfo.value = {
        width: img.width,
        height: img.height,
        size: file.size
      }
    }
    img.src = base64Value
  }
  reader.onerror = () => {
    error.value = '文件读取失败'
  }
  reader.readAsDataURL(file)
}

// 压缩图片
const compressImage = async () => {
  if (!imageUrl.value) {
    error.value = '请先上传图片'
    return
  }

  try {
    let sizeOptionValue = sizeOption.value;
    if (sizeOptionValue === 'custom' && customWidth.value && customHeight.value) {
      sizeOptionValue = {
        width: customWidth.value,
        height: customHeight.value
      };
    }

    const result = await compressImageUtil(imageUrl.value, {
      quality: quality.value,
      size: sizeOptionValue
    });

    compressedImageUrl.value = result.url;
    compressedImageInfo.value = {
      width: result.width,
      height: result.height,
      size: result.size
    };

    // 计算压缩率
    if (originalImageInfo.value) {
      compressionRatio.value = calculateCompressionRatio(originalImageInfo.value.size, result.size);
    }
  } catch (err) {
    error.value = '压缩失败: ' + err.message;
  }
}

// 下载压缩后的图片
const downloadCompressedImage = () => {
  if (!compressedImageUrl.value) {
    error.value = '请先生成压缩图片'
    return
  }

  downloadImage(compressedImageUrl.value, 'compressed_image.jpg');
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
  gap: 1.5rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .converter-container {
    flex-direction: column;
  }
}

.input-section,
.output-section {
  flex: 1;
  min-width: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

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

.quality-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 200px;
}

.size-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 200px;
}

.quality-slider {
  flex: 1;
  min-width: 150px;
}

.quality-value {
  min-width: 50px;
  text-align: right;
}

.size-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-width: 120px;
}

.custom-size-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 0.5rem;
}

.size-input {
  width: 80px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.size-separator {
  margin: 0 0.25rem;
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

  .quality-selector,
  .size-selector,
  .input-buttons {
    width: 100%;
  }

  .custom-size-inputs {
    margin-left: 0;
    margin-top: 0.5rem;
  }
}

.input-header,
.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.input-actions,
.output-actions {
  display: flex;
  gap: 0.5rem;
}

h3 {
  font-size: 1.25rem;
  color: #333;
  margin: 0;
}

.upload-section {
  margin: 1rem 0;
}

.upload-area {
  width: 100%;
  min-height: 300px;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f1f5f9;
}

.upload-area:hover {
  border-color: #4299e1;
  background-color: #edf2f7;
}

.upload-area.has-file {
  border-color: #48bb78;
  background-color: #f0fff4;
}

.upload-content {
  text-align: center;
  padding: 2rem;
  width: 100%;
}

.upload-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.upload-text {
  font-size: 1.1rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.upload-hint {
  font-size: 0.875rem;
  color: #718096;
}

.file-input {
  display: none;
}

.preview-section {
  width: 100%;
  min-height: 300px;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f5f9;
  margin: 1rem 0;
}

.preview-placeholder {
  text-align: center;
  padding: 2rem;
}

.preview-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.preview-text {
  font-size: 1.1rem;
  color: #4a5568;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 4px;
}

.image-info {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f7fafc;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #4a5568;
}

.image-info p {
  margin: 0.25rem 0;
}

.compression-ratio {
  font-weight: bold;
  color: #2b6cb0;
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