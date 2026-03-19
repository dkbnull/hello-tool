<template>
  <div class="tool-container">
    <h2>图片 Base64互转</h2>
    <p class="tool-description">支持上传图片转Base64，以及Base64转图片</p>

    <div class="converter-container">
      <!-- 左侧输入区域 -->
      <div class="input-section">
        <div class="input-header">
          <h3>图片预览</h3>
          <div class="input-actions">
            <button @click="clearInput" class="action-btn secondary">
              <i class="fas fa-trash-alt mr-1"></i>清空
            </button>
            <button @click="downloadImage" class="action-btn success" :disabled="!imageUrl">
              <i class="fas fa-download mr-1"></i>下载图片
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
              <img v-if="imageUrl" :src="imageUrl" alt="预览图片" class="preview-image"/>
              <div v-else class="upload-placeholder">
                <span class="upload-icon">🖼️</span>
                <p class="upload-text">点击或拖拽文件到此处上传</p>
                <p class="upload-hint">支持JPG、PNG、GIF等图片格式</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>
      </div>

      <!-- 右侧输出区域 -->
      <div class="output-section">
        <div class="output-header">
          <h3>Base64字符串</h3>
          <div class="output-actions">
            <button @click="clearInput" class="action-btn secondary">
              <i class="fas fa-trash-alt mr-1"></i>清空
            </button>
            <button @click="handleCopy(base64String)" class="action-btn copy-btn" :disabled="!base64String">
              <i class="fas fa-copy mr-1"></i>复制
            </button>
          </div>
        </div>

        <!-- Base64输入/输出区域 -->
        <div class="base64-section">
          <textarea
              v-model="base64String"
              rows="10"
              placeholder="请输入Base64字符串，或上传图片自动生成"
              class="base64-textarea"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import {copyToClipboard} from '../../utils/clipboard'
import {showToast} from '../../utils/toast'

const base64String = ref('')
const imageUrl = ref('')
const error = ref('')
const fileInput = ref(null)

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
  base64String.value = ''
  imageUrl.value = ''
  error.value = ''
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
    base64String.value = base64Value
    imageUrl.value = base64Value
    error.value = ''
  }
  reader.onerror = () => {
    error.value = '文件读取失败'
  }
  reader.readAsDataURL(file)
}

// 监听base64String变化，更新图片
watch(base64String, (newValue) => {
  if (newValue) {
    try {
      // 检查Base64字符串是否有效
      if (!newValue.startsWith('data:image/')) {
        // 如果没有data:image前缀，尝试添加
        const tempValue = 'data:image/png;base64,' + newValue
        imageUrl.value = tempValue
      } else {
        imageUrl.value = newValue
      }
      error.value = ''
    } catch (err) {
      error.value = '无效的Base64字符串'
    }
  }
})

// 下载图片
const downloadImage = () => {
  if (!imageUrl.value) {
    error.value = '请先生成图片'
    return
  }

  const link = document.createElement('a')
  link.href = imageUrl.value
  link.download = 'image.png'
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

.tool-description {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

.converter-container {
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
  flex: 1;
  min-width: 400px;
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
}

h3 {
  font-size: 1.25rem;
  color: #333;
  margin: 0;
}

h4 {
  font-size: 1rem;
  color: #333;
  margin: 1rem 0 0.5rem 0;
}

.input-actions,
.output-actions {
  display: flex;
  gap: 0.5rem;
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

.base64-section {
  margin-top: 1rem;
}

.base64-textarea {
  font-size: 0.875rem;
  font-family: monospace;
  min-height: 300px;
  max-height: 500px;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 4px;
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