<template>
  <div class="home-container">
    <!-- 左侧导航栏 -->
    <Sidebar/>

    <!-- 右侧内容区域 -->
    <div class="content">
      <h1 class="page-title">开发工具箱</h1>
      <p class="page-subtitle">集成多种常用开发工具，提高开发效率</p>

      <!-- 时间工具 -->
      <div id="time-tools" class="tool-section">
        <h2 class="section-title">
          <span class="icon">⏰</span>
          时间工具
        </h2>
        <div class="tool-grid">
          <ToolCard
              to="/timestamp"
              icon="⏰"
              title="时间戳转换"
              description="UNIX时间戳与日期格式互转"
          />
          <ToolCard
              to="/countdown"
              icon="⏲️"
              title="倒计时定时器"
              description="设置时间并开始倒计时"
          />
        </div>
      </div>

      <!-- JSON工具 -->
      <div id="json-tools" class="tool-section">
        <h2 class="section-title">
          <span class="icon">📋</span>
          JSON工具
        </h2>
        <div class="tool-grid">
          <ToolCard
              to="/json-all"
              icon="📋"
              title="JSON全能转换"
              description="JSON格式化/转XML/CSV/YAML"
          />
          <ToolCard
              to="/json-xml"
              icon="🔄"
              title="JSON XML互转"
              description="JSON与XML格式相互转换"
          />
          <ToolCard
              to="/json-quote"
              icon='""'
              title="JSON引号转换"
              description="单引号转双引号（标准JSON）"
          />
          <ToolCard
              to="/json-case"
              icon="Aa"
              title="JSON大小写转换"
              description="JSON字段大小写转换"
          />
        </div>
      </div>

      <!-- 安全工具 -->
      <div id="security-tools" class="tool-section">
        <h2 class="section-title">
          <span class="icon">🔒</span>
          安全工具
        </h2>
        <div class="tool-grid">
          <ToolCard
              to="/jwt"
              icon="🔑"
              title="JWT解密"
              description="解析JWT令牌字段"
          />
          <ToolCard
              to="/crypto"
              icon="🔓"
              title="加解密工具"
              description="Base64/AES/DES/3DES加解密"
          />
          <ToolCard
              to="/rsa"
              icon="🔐"
              title="RSA密钥生成"
              description="生成RSA公钥和私钥"
          />
        </div>
      </div>

      <!-- 文本工具 -->
      <div id="text-tools" class="tool-section">
        <h2 class="section-title">
          <span class="icon">📝</span>
          文本工具
        </h2>
        <div class="tool-grid">
          <ToolCard
              to="/encoding"
              icon="🔤"
              title="编码转换工具"
              description="Unicode/中文/ASCII/URL编码互转"
          />
          <ToolCard
              to="/naming"
              icon="📝"
              title="命名格式转换"
              description="驼峰、下划线互转"
          />
        </div>
      </div>

      <!-- 图形工具 -->
      <div id="image-tools" class="tool-section">
        <h2 class="section-title">
          <span class="icon">🖼️</span>
          图形工具
        </h2>
        <div class="tool-grid">
          <ToolCard
              to="/qrcode"
              icon="📱"
              title="二维码生成器"
              description="将文本转换为二维码"
          />
          <ToolCard
              to="/image"
              icon="🖼️"
              title="图片 Base64互转"
              description="图片转Base64和Base64转图片"
          />
          <ToolCard
              to="/image-compressor"
              icon="📷"
              title="图片压缩工具"
              description="压缩图片大小，调整质量和尺寸"
          />
          <ToolCard
              to="/mermaid"
              icon="📊"
              title="Mermaid UML图"
              description="基于Mermaid代码生成UML图表"
          />
        </div>
      </div>

      <!-- 文档工具 -->
      <div id="document-tools" class="tool-section">
        <h2 class="section-title">
          <span class="icon">📄</span>
          文档工具
        </h2>
        <div class="tool-grid">
          <ToolCard
              to="/pdf-converter"
              icon="📄"
              title="PDF转Word/Excel"
              description="将PDF文档转换为Word或Excel格式"
          />
        </div>
      </div>

      <!-- 生活工具 -->
      <div id="life-tools" class="tool-section">
        <h2 class="section-title">
          <span class="icon">🏠</span>
          生活工具
        </h2>
        <div class="tool-grid">
          <ToolCard
              to="/bmi"
              icon="⚖️"
              title="BMI计算器"
              description="计算您的身体质量指数"
          />
          <ToolCard
              to="/reaction"
              icon="⚡"
              title="闪电反应测试"
              description="测试您的反应速度"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue';
import ToolCard from '../components/ToolCard.vue';
</script>

<style scoped>
.home-container {
  display: flex;
  margin: 0 auto;
  padding: 2rem;
  gap: 2rem;
}

/* 右侧内容区域样式 */
.content {
  flex: 1;
}

.page-title {
  text-align: center;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 700;
}

.page-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 3rem;
  font-size: 1.1rem;
}

.tool-section {
  margin-bottom: 3.5rem;
  scroll-margin-top: 2rem;
}

.section-title {
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #42b883;
  font-size: 1.4rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title .icon {
  font-size: 1.2rem;
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .home-container {
    flex-direction: column;
    padding: 1rem;
    gap: 1.5rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .page-subtitle {
    font-size: 0.9rem;
    margin-bottom: 2rem;
  }

  .tool-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .tool-grid {
    grid-template-columns: 1fr;
  }
}
</style>