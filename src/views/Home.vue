<script setup>
</script>

<template>
  <div class="home-container">
    <!-- 左侧导航栏 -->
    <nav class="sidebar">
      <h2>工具导航</h2>
      <ul>
        <li><a href="#time-tools">时间工具</a></li>
        <li><a href="#json-tools">JSON工具</a></li>
        <li><a href="#security-tools">安全工具</a></li>
        <li><a href="#other-tools">其他工具</a></li>
      </ul>
    </nav>

    <!-- 右侧内容区域 -->
    <div class="content">
      <h1>工具集合</h1>

      <!-- 时间工具 -->
      <div id="time-tools" class="tool-section">
        <h2>时间工具</h2>
        <div class="tool-grid">
          <router-link to="/timestamp" class="tool-card">
            <h3>时间戳转换</h3>
            <p>UNIX时间戳与日期格式互转</p>
          </router-link>
        </div>
      </div>

      <!-- JSON工具 -->
      <div id="json-tools" class="tool-section">
        <h2>JSON工具</h2>
        <div class="tool-grid">
          <router-link to="/json-all" class="tool-card">
            <h3>JSON全能转换</h3>
            <p>JSON格式化/转XML/YAML</p>
          </router-link>
          <router-link to="/json-xml" class="tool-card">
            <h3>JSON XML互转</h3>
            <p>JSON与XML格式相互转换</p>
          </router-link>
          <router-link to="/json-quote" class="tool-card">
            <h3>JSON引号转换</h3>
            <p>单引号转双引号（标准JSON）</p>
          </router-link>
          <router-link to="/json-case" class="tool-card">
            <h3>JSON大小写转换</h3>
            <p>JSON字段大小写转换</p>
          </router-link>
        </div>
      </div>

      <!-- 安全工具 -->
      <div id="security-tools" class="tool-section">
        <h2>安全工具</h2>
        <div class="tool-grid">
          <router-link to="/jwt" class="tool-card">
            <h3>JWT解密</h3>
            <p>解析JWT令牌字段</p>
          </router-link>
          <router-link to="/rsa" class="tool-card">
            <h3>RSA密钥生成</h3>
            <p>生成RSA公钥和私钥</p>
          </router-link>
        </div>
      </div>

      <!-- 其他工具 -->
      <div id="other-tools" class="tool-section">
        <h2>其他工具</h2>
        <div class="tool-grid">
          <router-link to="/naming" class="tool-card">
            <h3>命名格式转换</h3>
            <p>驼峰、下划线互转</p>
          </router-link>
          <router-link to="/bmi" class="tool-card">
            <h3>BMI计算器</h3>
            <p>计算您的身体质量指数</p>
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
  width: 200px;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  position: sticky;
  top: 2rem;
  align-self: flex-start;
  height: fit-content;
}

.sidebar h2 {
  color: #42b883;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  margin-bottom: 1rem;
}

.sidebar a {
  text-decoration: none;
  color: #333;
  transition: all 0.3s ease;
  display: block;
  padding: 0.5rem;
  border-radius: 4px;
}

.sidebar a:hover {
  background: #e8f5e8;
  color: #42b883;
  transform: translateX(5px);
}

/* 右侧内容区域样式 */
.content {
  flex: 1;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.tool-section {
  margin-bottom: 3rem;
  scroll-margin-top: 2rem;
}

.tool-section h2 {
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #42b883;
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.tool-card {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 1.5rem;
  text-decoration: none;
  color: #333;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border-color: #42b883;
}

.tool-card h3 {
  margin-top: 0;
  color: #42b883;
}

.tool-card p {
  margin-bottom: 0;
  font-size: 0.9rem;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .home-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    position: static;
  }

  .sidebar ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .sidebar li {
    margin-bottom: 0;
  }

  .sidebar a {
    padding: 0.5rem 1rem;
  }
}
</style>