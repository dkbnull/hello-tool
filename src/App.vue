<script setup>
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>Hello Tool</h1>
      <nav>
        <router-link to="/" class="nav-link">首页</router-link>
      </nav>
    </header>
    <main class="main">
      <router-view></router-view>
    </main>
    <footer class="footer">
      <p>© 2026 null. 保留所有权利.</p>
      <a href="https://beian.miit.gov.cn/" target="_blank" class="record-link">鲁ICP备2026010010号-1</a>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: #35495e;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
  color: white;
  font-size: 1.5rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.main {
  flex: 1;
  padding: 2rem;
}

.footer {
  background: #35495e;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}

.record-link {
  color: #ffffff;
  text-decoration: none;
  transition: color 0.3s ease;
}
</style>