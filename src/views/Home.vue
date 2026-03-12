<script setup>
import {onMounted, ref} from 'vue';

// 当前激活的分类
const activeCategory = ref('');

// 监听滚动，更新激活的分类
onMounted(() => {
  const handleScroll = () => {
    const sections = document.querySelectorAll('.tool-section');
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollY >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });

    activeCategory.value = current;
  };

  window.addEventListener('scroll', handleScroll);
  // 初始执行一次
  handleScroll();

  return () => window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="home-container">
    <!-- 左侧导航栏 -->
    <nav class="sidebar">
      <h2 class="sidebar-title">工具导航</h2>
      <ul class="sidebar-menu">
        <li>
          <a
              href="#time-tools"
              class="sidebar-link"
              :class="{ active: activeCategory === 'time-tools' }"
          >
            <span class="icon">⏰</span>
            <span>时间工具</span>
          </a>
        </li>
        <li>
          <a
              href="#json-tools"
              class="sidebar-link"
              :class="{ active: activeCategory === 'json-tools' }"
          >
            <span class="icon">📋</span>
            <span>JSON工具</span>
          </a>
        </li>
        <li>
          <a
              href="#security-tools"
              class="sidebar-link"
              :class="{ active: activeCategory === 'security-tools' }"
          >
            <span class="icon">🔒</span>
            <span>安全工具</span>
          </a>
        </li>
        <li>
          <a
              href="#text-tools"
              class="sidebar-link"
              :class="{ active: activeCategory === 'text-tools' }"
          >
            <span class="icon">📝</span>
            <span>文本工具</span>
          </a>
        </li>
        <li>
          <a
              href="#image-tools"
              class="sidebar-link"
              :class="{ active: activeCategory === 'image-tools' }"
          >
            <span class="icon">🖼️</span>
            <span>图形工具</span>
          </a>
        </li>
        <li>
          <a
              href="#life-tools"
              class="sidebar-link"
              :class="{ active: activeCategory === 'life-tools' }"
          >
            <span class="icon">🏠</span>
            <span>生活工具</span>
          </a>
        </li>
      </ul>
    </nav>

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
          <router-link to="/timestamp" class="tool-card">
            <div class="tool-icon">⏰</div>
            <h3 class="tool-title">时间戳转换</h3>
            <p class="tool-desc">UNIX时间戳与日期格式互转</p>
          </router-link>
        </div>
      </div>

      <!-- JSON工具 -->
      <div id="json-tools" class="tool-section">
        <h2 class="section-title">
          <span class="icon">📋</span>
          JSON工具
        </h2>
        <div class="tool-grid">
          <router-link to="/json-all" class="tool-card">
            <div class="tool-icon">📋</div>
            <h3 class="tool-title">JSON全能转换</h3>
            <p class="tool-desc">JSON格式化/转XML/YAML</p>
          </router-link>
          <router-link to="/json-xml" class="tool-card">
            <div class="tool-icon">🔄</div>
            <h3 class="tool-title">JSON XML互转</h3>
            <p class="tool-desc">JSON与XML格式相互转换</p>
          </router-link>
          <router-link to="/json-quote" class="tool-card">
            <div class="tool-icon">""</div>
            <h3 class="tool-title">JSON引号转换</h3>
            <p class="tool-desc">单引号转双引号（标准JSON）</p>
          </router-link>
          <router-link to="/json-case" class="tool-card">
            <div class="tool-icon">Aa</div>
            <h3 class="tool-title">JSON大小写转换</h3>
            <p class="tool-desc">JSON字段大小写转换</p>
          </router-link>
        </div>
      </div>

      <!-- 安全工具 -->
      <div id="security-tools" class="tool-section">
        <h2 class="section-title">
          <span class="icon">🔒</span>
          安全工具
        </h2>
        <div class="tool-grid">
          <router-link to="/jwt" class="tool-card">
            <div class="tool-icon">🔑</div>
            <h3 class="tool-title">JWT解密</h3>
            <p class="tool-desc">解析JWT令牌字段</p>
          </router-link>
          <router-link to="/rsa" class="tool-card">
            <div class="tool-icon">🔐</div>
            <h3 class="tool-title">RSA密钥生成</h3>
            <p class="tool-desc">生成RSA公钥和私钥</p>
          </router-link>
          <router-link to="/crypto" class="tool-card">
            <div class="tool-icon">🔓</div>
            <h3 class="tool-title">加解密工具</h3>
            <p class="tool-desc">Base64/AES/DES/3DES加解密</p>
          </router-link>
        </div>
      </div>

      <!-- 文本工具 -->
      <div id="text-tools" class="tool-section">
        <h2 class="section-title">
          <span class="icon">📝</span>
          文本工具
        </h2>
        <div class="tool-grid">
          <router-link to="/naming" class="tool-card">
            <div class="tool-icon">📝</div>
            <h3 class="tool-title">命名格式转换</h3>
            <p class="tool-desc">驼峰、下划线互转</p>
          </router-link>
        </div>
      </div>

      <!-- 图形工具 -->
      <div id="image-tools" class="tool-section">
        <h2 class="section-title">
          <span class="icon">🖼️</span>
          图形工具
        </h2>
        <div class="tool-grid">
          <router-link to="/qrcode" class="tool-card">
            <div class="tool-icon">📱</div>
            <h3 class="tool-title">二维码生成器</h3>
            <p class="tool-desc">将文本转换为二维码</p>
          </router-link>
          <router-link to="/image" class="tool-card">
            <div class="tool-icon">🖼️</div>
            <h3 class="tool-title">图片处理工具</h3>
            <p class="tool-desc">图片转Base64和Base64转图片</p>
          </router-link>
        </div>
      </div>

      <!-- 生活工具 -->
      <div id="life-tools" class="tool-section">
        <h2 class="section-title">
          <span class="icon">🏠</span>
          生活工具
        </h2>
        <div class="tool-grid">
          <router-link to="/bmi" class="tool-card">
            <div class="tool-icon">⚖️</div>
            <h3 class="tool-title">BMI计算器</h3>
            <p class="tool-desc">计算您的身体质量指数</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  margin: 0 auto;
  padding: 2rem;
  gap: 2rem;
}

/* 左侧导航栏样式 */
.sidebar {
  width: 220px;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  position: sticky;
  top: 2rem;
  align-self: flex-start;
  height: fit-content;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.sidebar-title {
  color: #42b883;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu li {
  margin-bottom: 0.5rem;
}

.sidebar-link {
  text-decoration: none;
  color: #333;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
}

.sidebar-link:hover {
  background: #e8f5e8;
  color: #42b883;
  transform: translateX(5px);
}

.sidebar-link.active {
  background: #42b883;
  color: white;
  font-weight: 500;
}

.sidebar-link .icon {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
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

.tool-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.75rem;
  text-decoration: none;
  color: #333;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.tool-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: #42b883;
}

.tool-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f9ff;
  border-radius: 50%;
  color: #42b883;
}

.tool-title {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.tool-desc {
  margin-bottom: 0;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .home-container {
    flex-direction: column;
    padding: 1rem;
    gap: 1.5rem;
  }

  .sidebar {
    width: 100%;
    position: static;
    padding: 1rem;
  }

  .sidebar-menu {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .sidebar-menu li {
    margin-bottom: 0;
    flex: 1 1 calc(50% - 0.5rem);
  }

  .sidebar-link {
    padding: 0.5rem;
    font-size: 0.85rem;
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

  .tool-card {
    padding: 1.25rem;
  }

  .tool-icon {
    font-size: 2rem;
    width: 50px;
    height: 50px;
  }

  .tool-title {
    font-size: 1rem;
  }

  .tool-desc {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .sidebar-menu li {
    flex: 1 1 100%;
  }

  .tool-grid {
    grid-template-columns: 1fr;
  }
}
</style>