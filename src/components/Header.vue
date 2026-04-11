<template>
  <header class="header">
    <div class="container header-inner">
      <router-link to="/" class="brand">
        <img src="/favicon.svg" class="logo" alt="logo"/>
        <span class="brand-text">Hello Tool</span>
      </router-link>

      <nav :class="['nav', { 'nav-open': menuOpen }]">
        <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="nav-link"
            @click="menuOpen = false"
        >
          {{ link.name }}
        </router-link>
      </nav>

      <button
          class="menu-toggle"
          :aria-label="menuOpen ? '关闭菜单' : '打开菜单'"
          @click="menuOpen = !menuOpen"
      >
        <span :class="['hamburger', { active: menuOpen }]">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
    </div>
  </header>
</template>

<script setup>
import {ref} from 'vue'

const menuOpen = ref(false)

const navLinks = [
  {name: '首页', path: '/'},
  {name: '页于', path: '/about'}
]
</script>

<style scoped>
.header {
  background-color: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  margin: 0 auto;
  padding: 0 4rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-decoration: none;
}

.logo {
  width: 32px;
  height: 32px;
}

.brand-text {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.02em;
}

.brand-text:hover {
  color: var(--color-primary);
}

.nav {
  display: flex;
  gap: var(--spacing-xs);
  align-items: center;
}

.nav-link {
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: var(--transition-fast);
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-primary);
  background-color: var(--color-primary-light);
}

.menu-toggle {
  display: none;
  padding: var(--spacing-sm);
  background: none;
  border: none;
  cursor: pointer;
}

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 22px;
}

.hamburger span {
  display: block;
  height: 2px;
  background-color: var(--color-text);
  border-radius: 1px;
  transition: var(--transition-fast);
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  .nav {
    display: none;
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: var(--color-bg-card);
    border-bottom: 1px solid var(--color-border);
    padding: var(--spacing-md);
    gap: var(--spacing-xs);
    box-shadow: var(--shadow);
  }

  .nav-open {
    display: flex;
  }

  .nav-link {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    text-align: left;
  }
}
</style>
