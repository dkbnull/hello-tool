<template>
  <nav class="sidebar">
    <h2 class="sidebar-title">
      <span class="title-indicator"></span>
      工具导航
    </h2>
    <ul class="sidebar-menu">
      <li>
        <a
          href="#favorite-tools"
          class="sidebar-link"
          :class="{active: activeCategory === 'favorite-tools'}"
        >
          <span class="icon">⭐</span>
          <span>我的收藏</span>
        </a>
      </li>
      <li v-for="category in categories" :key="category.id">
        <a
          :href="`#${category.id}-tools`"
          class="sidebar-link"
          :class="{active: activeCategory === `${category.id}-tools`}"
        >
          <span class="icon">{{ category.icon }}</span>
          <span>{{ category.name }}</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { getCategories } from '../config/tools'

const categories = getCategories()
const activeCategory = ref('')

let scrollHandler = null

onMounted(() => {
  scrollHandler = () => {
    const sections = document.querySelectorAll('.tool-section')
    let current = ''
    sections.forEach(section => {
      if (scrollY >= section.offsetTop - 100) {
        current = section.getAttribute('id')
      }
    })
    activeCategory.value = current
  }
  window.addEventListener('scroll', scrollHandler)
  scrollHandler()
})

onUnmounted(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
  }
})
</script>

<style scoped>
.sidebar {
  width: 220px;
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  border: 1px solid var(--glass-border);
  position: sticky;
  top: 5rem;
  align-self: flex-start;
  height: fit-content;
  box-shadow: var(--shadow-sm);
}

.sidebar-title {
  color: var(--color-text);
  margin-top: 0;
  margin-bottom: 1.25rem;
  font-size: 1.05rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title-indicator {
  width: 4px;
  height: 16px;
  background: var(--color-primary);
  border-radius: 2px;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu li {
  margin-bottom: 0.35rem;
}

.sidebar-link {
  text-decoration: none;
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.85rem;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  position: relative;
}

.sidebar-link:hover {
  background: var(--color-bg-hover);
  color: var(--color-primary);
  transform: translateX(3px);
}

.sidebar-link.active {
  background: var(--color-primary);
  color: white;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(66, 184, 131, 0.3);
}

.sidebar-link .icon {
  font-size: 1.05rem;
  width: 20px;
  text-align: center;
}

@media (max-width: 768px) {
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
}

@media (max-width: 480px) {
  .sidebar-menu li {
    flex: 1 1 100%;
  }
}
</style>
