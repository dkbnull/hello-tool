<script setup>
import {RouterView} from 'vue-router'
</script>

<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-brand">
        <h2>HELLO TOOL</h2>
      </div>
      <div class="nav-links">
        <router-link to="/">首页</router-link>
        <router-link to="/timestamp">时间戳转换</router-link>
        <router-link to="/jwt">JWT解密</router-link>
        <router-link to="/rsa">RSA生成</router-link>
      </div>
    </nav>
    <main>
      <RouterView/>
    </main>
  </div>
</template>

<style scoped>
.navbar {
  background: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand h2 {
  margin: 0;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  background: #34495e;
}

main {
  min-height: calc(100vh - 80px);
}
</style>
