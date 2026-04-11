<template>
  <header class="header">
    <div class="header-inner">
      <h1 class="logo">
        <router-link to="/">
          <img src="/favicon.svg" alt="Logo" class="logo-img"/>
          <span>Hello Tool</span>
        </router-link>
      </h1>
      <nav class="nav">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/about" class="nav-link">关于</router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: var(--color-bg-card);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
}

.header-inner {
  margin: 0 auto;
  padding: 0 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  margin: 0;
  font-size: 1.5rem;
}

.logo a {
  color: var(--color-text);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s;
}

.logo a:hover {
  color: var(--color-primary);
}

.logo-img {
  width: 28px;
  height: 28px;
}

.nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link {
  color: var(--color-text);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  transition: background 0.2s ease, color 0.2s;
  font-size: 0.95rem;
}

.nav-link:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .header-inner {
    padding: 0 1.5rem;
  }

  .logo {
    font-size: 1.2rem;
  }
}
</style>
