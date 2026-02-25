<template>
  <div class="home">
    <h1>工具箱导航</h1>
    <div class="tool-grid">
      <div class="tool-card" @click="goTo('/timestamp')">
        <h3>时间戳转换器</h3>
        <p>UNIX时间戳与日期格式互转</p>
      </div>
      <div class="tool-card" @click="goTo('/jwt')">
        <h3>JWT解密工具</h3>
        <p>解析JWT令牌内容</p>
      </div>
      <div class="tool-card" @click="goTo('/rsa')">
        <h3>RSA密钥生成器</h3>
        <p>生成RSA公钥私钥对</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.home {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.tool-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.tool-card h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.tool-card p {
  margin: 0;
  color: #666;
}
</style>
