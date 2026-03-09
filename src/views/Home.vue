<script setup></script>

<template>
  <div class="home">
    <h1>工具集合</h1>
    <div class="tool-grid">
      <router-link to="/timestamp" class="tool-card">
        <h3>时间戳转换</h3>
        <p>UNIX时间戳与日期格式互转</p>
      </router-link>
      <router-link to="/jwt" class="tool-card">
        <h3>JWT解密</h3>
        <p>解析JWT令牌字段</p>
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
      <router-link to="/naming" class="tool-card">
        <h3>命名格式转换</h3>
        <p>驼峰、下划线互转</p>
      </router-link>
      <router-link to="/rsa" class="tool-card">
        <h3>RSA密钥生成</h3>
        <p>生成RSA公钥和私钥</p>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
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
</style>