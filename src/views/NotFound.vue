<!-- 404页面：页面未找到提示 -->
<template>
  <div class="not-found">
    <div class="not-found-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">PAGE_NOT_FOUND</h2>
      <p class="error-desc">抱歉，您访问的页面不存在</p>
      <router-link to="/" class="btn btn-primary">返回首页</router-link>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem;
}

.not-found-content {
  text-align: center;
}

.error-code {
  font-size: 7rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  line-height: 1;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: var(--font-mono);
  letter-spacing: -0.04em;
}

.error-title {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.75rem;
  font-family: var(--font-mono);
  letter-spacing: 0.1em;
}

.error-desc {
  font-size: 1rem;
  color: var(--color-text-muted);
  margin-bottom: 2rem;
}
</style>
