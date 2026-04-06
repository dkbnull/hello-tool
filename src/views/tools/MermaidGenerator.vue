<template>
  <div class="tool-container">
    <h2>Mermaid UML 图生成器</h2>

    <!-- 图表类型切换 -->
    <div class="chart-type-selector">
      <button
          v-for="type in chartTypes"
          :key="type.value"
          @click="currentChartType = type.value"
          :class="['type-btn', { active: currentChartType === type.value }]"
      >
        {{ type.label }}
      </button>
    </div>

    <div class="mermaid-container">
      <!-- 左侧代码录入区 -->
      <div class="code-section">
        <div class="section-header">
          <h3>Mermaid 代码</h3>
          <div class="code-actions">
            <button @click="loadExample" class="action-btn secondary">加载示例</button>
            <button @click="clearCode" class="action-btn secondary">清空</button>
          </div>
        </div>
        <textarea
            v-model="mermaidCode"
            placeholder="请输入 Mermaid 代码..."
            class="code-input"
            @input="debouncedRender"
        ></textarea>
      </div>

      <!-- 右侧图形展示区 -->
      <div class="preview-section">
        <div class="section-header">
          <h3>预览</h3>
          <div class="preview-actions">
            <div class="download-controls">
              <button @click="downloadImage('png')" class="action-btn success" :disabled="!renderedSvg">
                下载
              </button>
            </div>
          </div>
        </div>
        <div class="preview-content" ref="previewContainer">
          <div class="preview-content">
            <div v-if="renderingError" class="error-message">
              {{ renderingError }}
            </div>
            <div v-else-if="isRendering" class="rendering-message">
              正在渲染图表...
            </div>
            <div v-else-if="!renderedSvg" class="placeholder">
              请输入 Mermaid 代码生成图表
            </div>
            <div v-else v-html="renderedSvg" class="mermaid-output"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue'
import mermaid from 'mermaid'

// 图表类型定义
const chartTypes = [
  {value: 'flowchart', label: '流程图'},
  {value: 'sequence', label: '序列图'},
  {value: 'gantt', label: '甘特图'},
  {value: 'class', label: '类图'},
  {value: 'state', label: '状态图'},
  {value: 'er', label: 'ER图'},
  {value: 'journey', label: '用户旅程图'}
]

// 代码示例
const examples = {
  flowchart: `flowchart TD
    A[开始] --> B{条件判断}
    B -->|是| C[执行操作1]
    B -->|否| D[执行操作2]
    C --> E[结束]
    D --> E`,

  sequence: `sequenceDiagram
    participant 用户
    participant 系统
    participant 数据库
    
    用户->>系统: 发送请求
    系统->>数据库: 查询数据
    数据库-->>系统: 返回结果
    系统-->>用户: 显示结果`,

  gantt: `gantt
    title 项目开发计划
    dateFormat  YYYY-MM-DD
    section 设计阶段
    需求分析           :done,    des1, 2024-01-01,2024-01-07
    系统设计           :active,  des2, 2024-01-08, 3d
    section 开发阶段
    前端开发           :         dev1, after des2, 5d
    后端开发           :         dev2, after des2, 5d`,

  class: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +String breed
        +bark()
    }
    class Cat {
        +String color
        +meow()
    }
    Animal <|-- Dog
    Animal <|-- Cat`,

  state: `stateDiagram-v2
    [*] --> 空闲
    空闲 --> 运行: 开始
    运行 --> 暂停: 暂停
    暂停 --> 运行: 继续
    运行 --> [*]: 停止
    暂停 --> [*]: 停止`,

  er: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER {
        string name
        string email
        string phone
    }
    ORDER {
        int orderNumber
        date orderDate
        string status
    }`,

  journey: `journey
    title 用户购物体验
    section 浏览商品
      进入网站: 5: 用户
      搜索商品: 4: 用户
      查看详情: 5: 用户
    section 下单
      添加购物车: 5: 用户
      填写地址: 3: 用户
      支付: 2: 用户`
}

const currentChartType = ref('flowchart')
const mermaidCode = ref('')
const renderedSvg = ref('')
const renderingError = ref('')
const previewContainer = ref(null)
const isRendering = ref(false) // 渲染状态

let debounceTimer = null

// 防抖渲染
const debouncedRender = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    renderChart()
  }, 500)
}

// 加载示例
const loadExample = () => {
  mermaidCode.value = examples[currentChartType.value] || ''
  renderChart()
}

// 清空代码
const clearCode = () => {
  mermaidCode.value = ''
  renderedSvg.value = ''
  renderingError.value = ''
}

// 渲染图表
const renderChart = async () => {
  if (!mermaidCode.value.trim()) {
    renderedSvg.value = ''
    renderingError.value = ''
    return
  }

  try {
    renderingError.value = ''
    isRendering.value = true
    const {svg} = await mermaid.render('mermaid-chart', mermaidCode.value)
    renderedSvg.value = svg
    isRendering.value = false
  } catch (error) {
    renderingError.value = '渲染失败: ' + error.message
    renderedSvg.value = ''
    isRendering.value = false
  }
}

// 下载图片（仅支持 PNG）
const downloadImage = async (format = 'png') => {
  if (!renderedSvg.value) return

  try {
    // PNG 格式需要转换
    await downloadAsRaster(format)
  } catch (error) {
    console.error('下载失败:', error)
    alert('下载失败，请重试')
  }
}

// 将 SVG 转换为 PNG/JPG 下载
const downloadAsRaster = async (format) => {
  // 创建临时 canvas
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  // 处理 SVG 字符串，确保有正确的命名空间和尺寸
  let svgString = renderedSvg.value

  // 确保 SVG 有 xmlns 命名空间
  if (!svgString.includes('xmlns')) {
    svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
  }

  // 创建临时 DOM 元素来获取 SVG 的实际尺寸
  const parser = new DOMParser()
  const svgDoc = parser.parseFromString(svgString, 'image/svg+xml')
  const svgElement = svgDoc.documentElement

  // 获取 SVG 的实际尺寸
  let width = 800
  let height = 600

  const viewBox = svgElement.getAttribute('viewBox')
  if (viewBox) {
    const viewBoxParts = viewBox.split(/\s+/)
    if (viewBoxParts.length === 4) {
      width = parseFloat(viewBoxParts[2]) || 800
      height = parseFloat(viewBoxParts[3]) || 600
    }
  } else {
    // 尝试从 width 和 height 属性获取
    const svgWidth = svgElement.getAttribute('width')
    const svgHeight = svgElement.getAttribute('height')
    if (svgWidth && svgHeight) {
      width = parseFloat(svgWidth) || 800
      height = parseFloat(svgHeight) || 600
    }
  }

  // 确保尺寸不为 0
  width = Math.max(width, 100)
  height = Math.max(height, 100)

  // 设置 canvas 尺寸
  canvas.width = width
  canvas.height = height

  // 创建图片对象
  const img = new Image()
  img.crossOrigin = 'anonymous'

  // 将 SVG 转换为 Base64 URL
  const svgBase64 = btoa(unescape(encodeURIComponent(svgString)))
  const url = `data:image/svg+xml;base64,${svgBase64}`

  return new Promise((resolve, reject) => {
    img.onload = () => {
      try {
        // 白色背景（适用于所有格式，确保背景不透明）
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // 绘制图片
        ctx.drawImage(img, 0, 0)

        // 转换为 blob 并下载
        canvas.toBlob((blob) => {
          if (blob) {
            const downloadUrl = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = `mermaid-${currentChartType.value}-${Date.now()}.${format}`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            // 清理
            URL.revokeObjectURL(downloadUrl)
            resolve()
          } else {
            reject(new Error('无法转换图片格式'))
          }
        }, `image/${format}`, format === 'jpg' ? 0.9 : 1.0)
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = (error) => {
      reject(new Error('图片加载失败: ' + error))
    }

    img.src = url
  })
}

// 监听图表类型变化
watch(currentChartType, () => {
  if (mermaidCode.value.trim()) {
    renderChart()
  }
})

// 初始化 mermaid
onMounted(() => {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true
    },
    sequence: {
      useMaxWidth: true,
      wrap: true
    },
    gantt: {
      useMaxWidth: true
    }
  })

  // 加载默认示例
  loadExample()
})
</script>

<style scoped>
.tool-container {
  margin: 0 auto;
  padding: 2rem;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.75rem;
  font-weight: bold;
}

h3 {
  font-size: 1.25rem;
  color: #333;
  margin: 0;
}

.chart-type-selector {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}

.type-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #4299e1;
  background: white;
  color: #4299e1;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.type-btn:hover {
  background: #ebf8ff;
}

.type-btn.active {
  background: #4299e1;
  color: white;
}

.mermaid-container {
  display: flex;
  gap: 2rem;
  min-height: 600px;
  flex-wrap: wrap;
}

.code-section, .preview-section {
  flex: 1;
  min-width: 400px;
  min-height: 500px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.code-actions {
  display: flex;
  gap: 0.5rem;
}

.preview-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.download-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}


.code-input {
  flex: 1;
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9rem;
  resize: none;
  outline: none;
}

.code-input:focus {
  border-color: #4299e1;
}

.preview-content {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  overflow: auto;
  background: #f7fafc;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.mermaid-output {
  width: 100%;
  min-height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.mermaid-output :deep(svg) {
  max-width: 100%;
  max-height: 100%;
  height: auto;
}

.placeholder {
  color: #666;
  font-size: 1rem;
  text-align: center;
}

.error-message {
  color: #e53e3e;
  background: #fed7d7;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #e53e3e;
  text-align: center;
}

.rendering-message {
  color: #666;
  font-size: 1rem;
  text-align: center;
}

@media (max-width: 1024px) {
  .mermaid-container {
    flex-direction: column;
    height: auto;
  }

  .code-section, .preview-section {
    min-height: 400px;
  }
}

@media (max-width: 768px) {
  .tool-container {
    padding: 1rem;
  }

  .chart-type-selector {
    gap: 0.5rem;
  }

  .type-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }


  .download-controls {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>