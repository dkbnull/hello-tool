<template>
  <div class="home-container">
    <!-- 左侧导航栏 -->
    <Sidebar/>

    <!-- 右侧内容区域 -->
    <div class="content">
      <h1 class="page-title">开发工具箱</h1>
      <p class="page-subtitle">集成多种常用开发工具，提高开发效率</p>

      <!-- 收藏工具区域 -->
      <div v-if="favoriteTools.length > 0" id="favorite-tools" class="tool-section favorite-section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="icon">⭐</span>
            我的收藏
            <span class="favorite-count">({{ favoriteTools.length }})</span>
          </h2>
          <button
              @click="clearFavorites"
              class="clear-favorites-btn"
          >
            清空收藏
          </button>
        </div>
        <div class="tool-grid">
          <ToolCard
              v-for="tool in favoriteTools"
              :key="tool.to"
              :to="tool.to"
              :icon="tool.icon"
              :title="tool.title"
              :description="tool.description"
          />
        </div>
      </div>

      <div v-else class="no-favorites">
        <div class="no-favorites-content">
          <span class="no-favorites-icon">⭐</span>
          <h3>暂无收藏的工具</h3>
          <p>点击工具卡片上的星形按钮来收藏常用工具</p>
        </div>
      </div>

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

    <!-- 回到顶部按钮 -->
    <button
        v-if="showBackToTop"
        @click="backToTop"
        class="back-to-top"
        aria-label="回到顶部"
    >
      ↑
    </button>
  </div>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from 'vue';
import {ElMessageBox} from 'element-plus';
import Sidebar from '../components/Sidebar.vue';
import ToolCard from '../components/ToolCard.vue';
import {favoritesManager} from '../utils/favorites.js';

// 收藏工具列表
const favoriteTools = ref([]);

// 回到顶部按钮相关
const showBackToTop = ref(false);

// 加载收藏工具
const loadFavorites = () => {
  favoriteTools.value = favoritesManager.getFavorites();
};

// 清空收藏
const clearFavorites = async () => {
  await ElMessageBox.confirm('确定要清空所有收藏的工具吗？此操作不可撤销。', '清空收藏', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    favoritesManager.clearFavorites();
    loadFavorites();
    // 触发全局事件，更新所有ToolCard组件的收藏状态
    window.dispatchEvent(new CustomEvent('favoritesChanged'));
  });
};

// 监听收藏变化
const handleFavoritesChange = () => {
  loadFavorites();
};

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300;
};

const backToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

onMounted(() => {
  // 初始加载收藏
  loadFavorites();

  // 监听收藏变化事件
  window.addEventListener('favoritesChanged', handleFavoritesChange);
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('favoritesChanged', handleFavoritesChange);
  window.removeEventListener('scroll', handleScroll);
});
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

/* 收藏区域样式 */
.favorite-section {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  margin-bottom: 3rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.favorite-count {
  font-size: 0.9rem;
  color: #666;
  font-weight: normal;
  margin-left: 0.5rem;
}

.clear-favorites-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.clear-favorites-btn:hover {
  background: #ff5252;
  transform: translateY(-2px);
}

/* 无收藏提示样式 */
.no-favorites {
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  margin-bottom: 3rem;
}

.no-favorites-content {
  max-width: 400px;
  margin: 0 auto;
}

.no-favorites-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-favorites h3 {
  color: #666;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.no-favorites p {
  color: #999;
  font-size: 0.9rem;
  line-height: 1.5;
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

/* 回到顶部按钮样式 */
.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #42b883;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 1000;
}

.back-to-top:hover {
  background-color: #35495e;
  transform: translateY(-3px);
}

.back-to-top:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
}
</style>