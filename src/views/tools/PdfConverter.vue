<template>
  <div class="tool-container">
    <h2>PDF转Word/Excel</h2>

    <div class="section-card center-narrow">
      <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleFileDrop"
           :class="{'has-file': selectedFile}">
        <input type="file" ref="fileInput" accept=".pdf" @change="handleFileSelect" class="hidden-input"/>
        <div class="upload-content">
          <span class="upload-icon">📄</span>
          <p>{{ selectedFile ? selectedFile.name : '点击或拖拽文件到此处上传' }}</p>
          <p class="upload-hint">支持PDF格式文件，最大10MB</p>
        </div>
      </div>

      <div v-if="selectedFile" class="options-section">
        <div class="options-row">
          <select v-model="outputFormat" class="size-select">
            <option value="word">Word (.docx)</option>
            <option value="excel">Excel (.xlsx)</option>
          </select>
          <button @click="convertPdf" class="btn btn-primary" :disabled="isConverting">
            {{ isConverting ? '转换中...' : '开始转换' }}
          </button>
        </div>
      </div>

      <div v-if="conversionResult" class="result-section">
        <p :class="{'error-text': conversionResult.error}">{{ conversionResult.message }}</p>
        <button v-if="conversionResult.downloadUrl" @click="downloadResult" class="btn btn-success">下载文件</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {HttpService} from '../../utils/http'
import {DownloadService} from '../../utils/download'

const MAX_FILE_SIZE = 10 * 1024 * 1024
const API_PATHS = {word: '/convert/pdf-to-word', excel: '/convert/pdf-to-excel'}
const FORMAT_NAMES = {word: 'Word', excel: 'Excel'}

const fileInput = ref(null)
const selectedFile = ref(null)
const outputFormat = ref('word')
const isConverting = ref(false)
const conversionResult = ref(null)

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
  if (file.type !== 'application/pdf') {
    conversionResult.value = {message: '请上传PDF格式文件', error: true};
    return
  }
  if (file.size > MAX_FILE_SIZE) {
    conversionResult.value = {message: '文件大小不能超过10MB', error: true};
    return
  }
  selectedFile.value = file
  conversionResult.value = null
}

const convertPdf = async () => {
  if (!selectedFile.value) return
  isConverting.value = true
  conversionResult.value = null
  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    const result = await HttpService.post(API_PATHS[outputFormat.value], formData)
    if (result.code === 200) {
      conversionResult.value = {
        message: `PDF已成功转换为${FORMAT_NAMES[outputFormat.value]}格式，请尽快下载。`,
        downloadUrl: `/convert/download/${result.data.filename}`,
        filename: result.data.filename,
      }
    } else {
      throw new Error(result.message || '转换失败')
    }
  } catch (e) {
    conversionResult.value = {message: '转换失败，请重试', error: e.message}
  } finally {
    isConverting.value = false
  }
}

const downloadResult = async () => {
  if (!conversionResult.value?.downloadUrl) return
  try {
    const blob = await HttpService.download(conversionResult.value.downloadUrl)
    const filename = DownloadService.generateFilename(selectedFile.value, outputFormat.value)
    DownloadService.downloadFile(blob, filename)
  } catch (e) {
    conversionResult.value = {message: '下载失败，请重试', error: e.message}
  }
}
</script>

<style scoped>
.tool-container {
  max-width: 600px;
}

.upload-area {
  width: 100%;
  min-height: 180px;
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
}

.upload-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.75rem;
}

.upload-content p {
  margin: 0.25rem 0;
  color: var(--color-text-secondary);
}

.upload-hint {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.options-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.options-row {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.size-select {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
}

.result-section {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f1f5f9;
  border-radius: var(--radius-md);
  text-align: center;
}

.result-section p {
  margin: 0 0 0.75rem;
  color: var(--color-text-secondary);
}

.error-text {
  color: var(--color-danger);
}

@media (max-width: 768px) {
  .options-row {
    flex-direction: column;
  }
}
</style>
