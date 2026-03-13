<template>
  <div class="tool-container">
    <h2>图片处理工具</h2>
    <p class="tool-description">支持上传图片转Base64，以及Base64转图片</p>

    <div class="converter-container">
      <!-- 左侧输入区域 -->
      <div class="input-section">
        <div class="input-header">
          <h3>图片预览</h3>
          <!-- 图片上传 -->
          <div class="upload-section">
            <input
                type="file"
                id="imageUpload"
                accept="image/*"
                @change="handleFileUpload"
                class="file-input"
            />
            <label for="imageUpload" class="file-label action-btn primary">
              <i class="fas fa-upload mr-1"></i>选择图片
            </label>
          </div>
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
        <div class="upload-preview-container">
          <!-- 图片显示区域 -->
          <div class="image-container">
            <img v-if="imageUrl" :src="imageUrl" alt="预览图片" class="preview-image"/>
            <div v-else class="image-placeholder">
              请上传图片或在右侧输入Base64字符串
            </div>
          </div>
        </div>

        <div v-if="error" class="error-area">{{ error }}</div>
      </div>

      <!-- 右侧输出区域 -->
      <div class="output-section">
        <div class="output-header">
          <h3>Base64字符串</h3>
          <div class="output-actions">
            <button @click="copyToClipboard(base64String)" class="action-btn copy-btn" :disabled="!base64String">
              <i class="fas fa-copy mr-1"></i>复制Base64
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

  <!-- Toast提示 -->
  <div v-if="showToast" class="toast">
    {{ toastMessage }}
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'

const base64String = ref('')
const imageUrl = ref('')
const error = ref('')
const toastMessage = ref('')
const showToast = ref(false)
let toastTimeout = null

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

// 清空输入
const clearInput = () => {
  base64String.value = ''
  imageUrl.value = ''
  error.value = ''
  // 清空文件输入
  const fileInput = document.getElementById('imageUpload')
  if (fileInput) {
    fileInput.value = ''
  }
}

// 处理文件上传
const handleFileUpload = (event) => {
  const file = event.target.files[0]
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
  font-weight: semibold;
  color: #333;
  margin: 0;
}

h4 {
  font-size: 1rem;
  font-weight: semibold;
  color: #333;
  margin: 1rem 0 0.5rem 0;
}

.input-actions,
.output-actions {
  display: flex;
  gap: 0.5rem;
}

.upload-preview-container {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.image-container {
  flex: 1;
}

.upload-section {
  flex-shrink: 0;
}

.file-input {
  display: none;
}

.file-label {
  cursor: pointer;
}

.action-btn.primary {
  background: #4299e1;
  color: white;
}

.action-btn.primary:hover {
  background: #3182ce;
}

.base64-section {
  margin-top: 1rem;
}

.base64-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
  font-family: monospace;
  resize: vertical;
  min-height: 300px;
  max-height: 500px;
  overflow: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}


.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.action-btn.secondary:hover {
  background: #cbd5e0;
}

.action-btn.success {
  background: #48bb78;
  color: white;
}

.action-btn.success:hover:not(:disabled) {
  background: #38a169;
}

.action-btn.success:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.action-btn.copy-btn {
  background: #42b883;
  color: white;
}

.action-btn.copy-btn:hover:not(:disabled) {
  background: #35495e;
}

.action-btn.copy-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f7fafc;
  padding: 1rem;
  margin: 1rem 0;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 4px;
}

.image-placeholder {
  color: #666;
  text-align: center;
  font-size: 1rem;
}

.error-area {
  margin-top: 0.75rem;
  color: #e53e3e;
  font-size: 0.875rem;
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
</style>