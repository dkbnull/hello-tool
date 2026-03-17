<template>
  <div class="tool-container">
    <h2>PDF转Word/Excel</h2>
    <p class="tool-description">上传PDF文档并转换为Word或Excel格式</p>

    <div class="card">
      <!-- 上传区域 -->
      <div class="upload-section">
        <div
            class="upload-area"
            @click="triggerFileInput"
            @dragover.prevent
            @drop.prevent="handleFileDrop"
            :class="{ 'has-file': selectedFile }"
        >
          <input
              type="file"
              ref="fileInput"
              accept=".pdf"
              @change="handleFileSelect"
              style="display: none;"
          />
          <div class="upload-content">
            <span class="upload-icon">📄</span>
            <p class="upload-text">{{ selectedFile ? selectedFile.name : '点击或拖拽文件到此处上传' }}</p>
            <p class="upload-hint">支持PDF格式文件，最大10MB</p>
          </div>
        </div>
      </div>

      <!-- 转换选项 -->
      <div class="options-section" v-if="selectedFile">
        <h3 class="section-subtitle">转换选项</h3>
        <div class="options">
          <select v-model="outputFormat" class="select-field">
            <option value="word">Word (.docx)</option>
            <option value="excel">Excel (.xlsx)</option>
          </select>
          <button
              @click="convertPdf"
              class="action-btn primary"
              :disabled="isConverting"
          >
            {{ isConverting ? '转换中...' : '开始转换' }}
          </button>
        </div>
      </div>

      <!-- 转换结果 -->
      <div class="result-section" v-if="conversionResult">
        <h3 class="section-subtitle">转换结果</h3>
        <div class="result">
          <p class="result-message" :class="{ 'error': conversionResult.error }">{{ conversionResult.message }}</p>
          <button
              @click="downloadResult"
              class="action-btn success"
              v-if="conversionResult.downloadUrl"
          >
            下载文件
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {HttpService} from '../../utils/http'
import {DownloadService} from '../../utils/download'

const fileInput = ref(null)
const selectedFile = ref(null)
const outputFormat = ref('word')
const isConverting = ref(false)
const conversionResult = ref(null)

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value.click()
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

  // 验证文件类型
  if (file.type !== 'application/pdf') {
    conversionResult.value = {
      message: '请上传PDF格式文件',
      error: true
    }
    return
  }

  // 验证文件大小（10MB限制）
  if (file.size > 10 * 1024 * 1024) {
    conversionResult.value = {
      message: '文件大小不能超过10MB',
      error: true
    }
    return
  }

  selectedFile.value = file
  conversionResult.value = null
}

// 获取API URL
const getApiUrl = (format) => {
  return format === 'word' ? '/convert/pdf-to-word' : '/convert/pdf-to-excel'
}

// 获取格式名称
const getFormatName = (format) => {
  return format === 'word' ? 'Word' : 'Excel'
}

// 转换PDF
const convertPdf = async () => {
  if (!selectedFile.value) return

  isConverting.value = true
  conversionResult.value = null

  try {
    // 创建FormData对象
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    // 根据输出格式选择接口地址
    const apiUrl = getApiUrl(outputFormat.value)

    // 调用后端接口
    const result = await HttpService.post(apiUrl, formData)

    // 处理转换结果
    if (result.code === 200) {
      conversionResult.value = {
        message: `PDF已成功转换为${getFormatName(outputFormat.value)}格式，请尽快下载，文件将在10分钟后自动删除。`,
        downloadUrl: `/convert/download/${result.data.filename}`,
        filename: result.data.filename
      }
    } else {
      throw new Error(result.message || '转换失败')
    }
  } catch (error) {
    conversionResult.value = {
      message: '转换失败，请重试',
      error: error.message
    }
  } finally {
    isConverting.value = false
  }
}

// 下载结果
const downloadResult = async () => {
  if (!conversionResult.value?.downloadUrl) return

  try {
    // 使用HttpService下载文件
    const blob = await HttpService.download(conversionResult.value.downloadUrl)

    // 生成下载文件名
    const downloadFilename = DownloadService.generateFilename(selectedFile.value, outputFormat.value)

    // 下载文件
    DownloadService.downloadFile(blob, downloadFilename)
  } catch (error) {
    console.error('下载失败:', error)
    conversionResult.value = {
      message: '下载失败，请重试',
      error: error.message
    }
  }
}
</script>

<style scoped>
.tool-container {
  max-width: 600px;
}

h2 {
  text-align: center;
  margin-bottom: 0.5rem;
  font-size: 1.75rem;
  font-weight: bold;
}

.tool-description {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

.upload-section {
  margin-bottom: 1.5rem;
}

.upload-area {
  width: 100%;
  min-height: 200px;
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

.options-section {
  margin-bottom: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.section-subtitle {
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.75rem;
}

.options {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.select-field {
  flex: 1;
}

.action-btn {
  padding: 0.75rem;
}

.result-section {
  background: #f1f5f9;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1.5rem;
}

.result-message {
  color: #4a5568;
  margin-bottom: 1rem;
}

.result-message.error {
  color: #e53e3e;
}

@media (max-width: 768px) {
  .options {
    flex-direction: column;
    align-items: stretch;
  }

  .action-btn {
    width: 100%;
  }

  .select-field {
    width: 100%;
  }
}
</style>