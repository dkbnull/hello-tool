<template>
  <div class="tool-container">
    <h2>图片 Base64互转</h2>

    <div class="converter-container">
      <div class="section-card">
        <div class="section-header">
          <h3>图片预览</h3>
          <div class="flex-row">
            <button @click="clearInput" class="btn btn-secondary btn-sm">清空</button>
            <button @click="downloadImage" class="btn btn-success btn-sm" :disabled="!imageUrl">下载图片</button>
          </div>
        </div>
        <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleFileDrop"
             :class="{'has-file': imageUrl}">
          <input type="file" ref="fileInput" accept="image/*" @change="handleFileSelect" class="hidden-input"/>
          <div class="upload-content">
            <img v-if="imageUrl" :src="imageUrl" alt="预览" class="preview-image"/>
            <div v-else class="upload-placeholder">
              <span class="upload-icon">🖼️</span>
              <p>点击或拖拽文件到此处上传</p>
              <p class="upload-hint">支持JPG、PNG、GIF等图片格式</p>
            </div>
          </div>
        </div>
        <div v-if="error" class="error-message">{{ error }}</div>
      </div>

      <div class="section-card">
        <div class="section-header">
          <h3>Base64字符串</h3>
          <div class="flex-row">
            <button @click="clearInput" class="btn btn-secondary btn-sm">清空</button>
            <button @click="handleCopy(base64String)" class="btn btn-copy btn-sm" :disabled="!base64String">复制
            </button>
          </div>
        </div>
        <textarea v-model="base64String" rows="10" placeholder="请输入Base64字符串，或上传图片自动生成"
                  class="base64-textarea"></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import {useCopy} from '../../composables/useCopy'

const {handleCopy} = useCopy()

const base64String = ref('')
const imageUrl = ref('')
const error = ref('')
const fileInput = ref(null)

const clearInput = () => {
  base64String.value = ''
  imageUrl.value = ''
  error.value = ''
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
    error.value = '请上传图片文件';
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    base64String.value = e.target.result;
    imageUrl.value = e.target.result;
    error.value = ''
  }
  reader.onerror = () => {
    error.value = '文件读取失败'
  }
  reader.readAsDataURL(file)
}

watch(base64String, (val) => {
  if (!val) {
    imageUrl.value = '';
    return
  }
  try {
    imageUrl.value = val.startsWith('data:image/') ? val : 'data:image/png;base64,' + val
    error.value = ''
  } catch {
    error.value = '无效的Base64字符串'
  }
})

const downloadImage = () => {
  if (!imageUrl.value) return
  const link = document.createElement('a')
  link.href = imageUrl.value
  link.download = 'image.png'
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

.upload-area {
  width: 100%;
  min-height: 250px;
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8f9fa;
}

.upload-area:hover {
  border-color: var(--color-primary);
  background: var(--color-bg-hover);
}

.upload-area.has-file {
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

.base64-textarea {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.85rem;
  min-height: 250px;
}

@media (max-width: 768px) {
  .converter-container {
    flex-direction: column;
  }
}
</style>
