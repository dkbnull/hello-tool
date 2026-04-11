<template>
  <div class="tool-container">
    <h2>Mermaid UML图生成器</h2>

    <div class="section-card mb-lg">
      <div class="chart-type-selector">
        <button
            v-for="type in chartTypes"
            :key="type.value"
            @click="currentChartType = type.value"
            :class="['mode-btn', {active: currentChartType === type.value}]"
        >
          {{ type.label }}
        </button>
      </div>
    </div>

    <div class="mermaid-container">
      <div class="section-card">
        <div class="section-header">
          <h3>Mermaid 代码</h3>
          <div class="flex-row">
            <button @click="loadExample" class="btn btn-secondary btn-sm">示例</button>
            <button @click="clearCode" class="btn btn-secondary btn-sm">清空</button>
          </div>
        </div>
        <textarea v-model="mermaidCode" placeholder="请输入 Mermaid 代码..." class="code-input"
                  @input="debouncedRender"></textarea>
      </div>

      <div class="section-card">
        <div class="section-header">
          <h3>预览</h3>
          <button @click="downloadImage" class="btn btn-success btn-sm" :disabled="!renderedSvg">下载PNG</button>
        </div>
        <div class="preview-content">
          <div v-if="renderingError" class="error-message">{{ renderingError }}</div>
          <div v-else-if="isRendering" class="placeholder">正在渲染图表...</div>
          <div v-else-if="!renderedSvg" class="placeholder">请输入 Mermaid 代码生成图表</div>
          <div v-else v-html="renderedSvg" class="mermaid-output"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue'
import mermaid from 'mermaid'

const chartTypes = [
  {value: 'flowchart', label: '流程图'},
  {value: 'sequence', label: '序列图'},
  {value: 'gantt', label: '甘特图'},
  {value: 'class', label: '类图'},
  {value: 'state', label: '状态图'},
  {value: 'er', label: 'ER图'},
  {value: 'journey', label: '用户旅程图'},
]

const examples = {
  flowchart: `flowchart TD\n    A[开始] --> B{条件判断}\n    B -->|是| C[执行操作1]\n    B -->|否| D[执行操作2]\n    C --> E[结束]\n    D --> E`,
  sequence: `sequenceDiagram\n    participant 用户\n    participant 系统\n    participant 数据库\n    用户->>系统: 发送请求\n    系统->>数据库: 查询数据\n    数据库-->>系统: 返回结果\n    系统-->>用户: 显示结果`,
  gantt: `gantt\n    title 项目开发计划\n    dateFormat  YYYY-MM-DD\n    section 设计阶段\n    需求分析 :done, des1, 2024-01-01,2024-01-07\n    系统设计 :active, des2, 2024-01-08, 3d\n    section 开发阶段\n    前端开发 : dev1, after des2, 5d\n    后端开发 : dev2, after des2, 5d`,
  class: `classDiagram\n    class Animal {\n        +String name\n        +int age\n        +makeSound()\n    }\n    class Dog {\n        +String breed\n        +bark()\n    }\n    Animal <|-- Dog`,
  state: `stateDiagram-v2\n    [*] --> 空闲\n    空闲 --> 运行: 开始\n    运行 --> 暂停: 暂停\n    暂停 --> 运行: 继续\n    运行 --> [*]: 停止`,
  er: `erDiagram\n    CUSTOMER ||--o{ ORDER : places\n    ORDER ||--|{ LINE-ITEM : contains\n    CUSTOMER {\n        string name\n        string email\n    }\n    ORDER {\n        int orderNumber\n        date orderDate\n    }`,
  journey: `journey\n    title 用户购物体验\n    section 浏览商品\n      进入网站: 5: 用户\n      搜索商品: 4: 用户\n    section 下单\n      添加购物车: 5: 用户\n      支付: 2: 用户`,
}

const currentChartType = ref('flowchart')
const mermaidCode = ref('')
const renderedSvg = ref('')
const renderingError = ref('')
const isRendering = ref(false)
let debounceTimer = null

const debouncedRender = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(renderChart, 500)
}

const loadExample = () => {
  mermaidCode.value = examples[currentChartType.value] || '';
  renderChart()
}
const clearCode = () => {
  mermaidCode.value = '';
  renderedSvg.value = '';
  renderingError.value = ''
}

const renderChart = async () => {
  if (!mermaidCode.value.trim()) {
    renderedSvg.value = '';
    renderingError.value = '';
    return
  }
  try {
    renderingError.value = ''
    isRendering.value = true
    const {svg} = await mermaid.render('mermaid-chart', mermaidCode.value)
    renderedSvg.value = svg
    isRendering.value = false
  } catch (e) {
    renderingError.value = '渲染失败: ' + e.message
    renderedSvg.value = ''
    isRendering.value = false
  }
}

const downloadImage = async () => {
  if (!renderedSvg.value) return
  try {
    let svgString = renderedSvg.value
    if (!svgString.includes('xmlns')) svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')

    const parser = new DOMParser()
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml')
    const svgEl = svgDoc.documentElement

    let width = 800, height = 600
    const viewBox = svgEl.getAttribute('viewBox')
    if (viewBox) {
      const parts = viewBox.split(/\s+/)
      if (parts.length === 4) {
        width = parseFloat(parts[2]) || 800;
        height = parseFloat(parts[3]) || 600
      }
    }

    const canvas = document.createElement('canvas')
    canvas.width = Math.max(width, 100)
    canvas.height = Math.max(height, 100)
    const ctx = canvas.getContext('2d')

    const img = new Image()
    img.crossOrigin = 'anonymous'
    const svgBase64 = btoa(unescape(encodeURIComponent(svgString)))

    await new Promise((resolve, reject) => {
      img.onload = () => {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `mermaid-${currentChartType.value}-${Date.now()}.png`
            link.click()
            URL.revokeObjectURL(url)
            resolve()
          } else reject(new Error('转换失败'))
        }, 'image/png')
      }
      img.onerror = reject
      img.src = `data:image/svg+xml;base64,${svgBase64}`
    })
  } catch (e) {
    console.error('下载失败:', e)
  }
}

watch(currentChartType, () => {
  if (mermaidCode.value.trim()) renderChart()
})

onMounted(() => {
  mermaid.initialize({startOnLoad: false, theme: 'default', securityLevel: 'loose'})
  loadExample()
})
</script>

<style scoped>
.chart-type-selector {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.mermaid-container {
  display: flex;
  gap: 1.5rem;
}

.mermaid-container .section-card {
  flex: 1;
  min-width: 300px;
}

.code-input {
  width: 100%;
  min-height: 400px;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9rem;
  resize: none;
  outline: none;
}

.code-input:focus {
  border-color: var(--color-primary);
}

.preview-content {
  min-height: 400px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 1rem;
  overflow: auto;
  background: #f7fafc;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.mermaid-output {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.mermaid-output :deep(svg) {
  max-width: 100%;
  height: auto;
}

.placeholder {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  text-align: center;
}

@media (max-width: 768px) {
  .mermaid-container {
    flex-direction: column;
  }
}
</style>
