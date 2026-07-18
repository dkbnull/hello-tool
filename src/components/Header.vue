<template>
  <header class="header">
    <div class="header-inner">
      <a href="/" class="brand" @click.prevent="handleBrandClick">
        <img src="/favicon.svg" class="logo" alt="logo" />
        <span class="brand-text">Hello Tool</span>
      </a>

      <nav :class="['nav', { 'nav-open': menuOpen }]">
        <router-link
          v-for="link in NAV_LINKS"
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
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const menuOpen = ref(false)

// 点击品牌logo：已在首页时滚动到顶部，否则导航到首页
const handleBrandClick = () => {
  if (route.name === 'Home') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    router.push('/')
  }
}

const NAV_LINKS = [
  { name: '首页', path: '/' },
  { name: '关于', path: '/about' }
]
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 64px;
  background: var(--color-bg-card-solid);
  border-bottom: 1px solid var(--color-border);
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  margin: 0 auto;
  padding: 0 4rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-decoration: none;
  color: var(--color-text);
}

.brand:hover {
  text-decoration: none;
  color: var(--color-text);
  text-shadow: none;
}

.logo {
  width: 32px;
  height: 32px;
}

.brand-text {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.01em;
}

.brand:hover .brand-text {
  color: var(--color-text);
  text-shadow: none;
}

.nav {
  display: flex;
  gap: var(--spacing-lg);
  align-items: center;
}

.nav-link {
  position: relative;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text);
  opacity: 0.65;
  text-decoration: none;
  transition: var(--transition-fast);
}

.nav-link:hover,
.nav-link.router-link-exact-active {
  color: var(--color-primary);
  opacity: 1;
  text-decoration: none;
}

.nav-link.router-link-exact-active {
  font-weight: 600;
  background: var(--color-primary-light);
  border-radius: var(--radius-md);
  padding: var(--spacing-xs) var(--spacing-sm);
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
  background: var(--color-text);
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
  .header-inner {
    padding: 0 1rem;
  }

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
    background: var(--glass-bg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--glass-border);
    padding: var(--spacing-md);
    gap: var(--spacing-xs);
    box-shadow: var(--shadow-lg);
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
