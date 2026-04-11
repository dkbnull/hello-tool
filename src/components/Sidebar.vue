<template>
  <nav class="sidebar">
    <h2 class="sidebar-title">工具导航</h2>
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
import {onMounted, onUnmounted, ref} from 'vue'
import {getCategories} from '../config/tools'

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
  background: #f8f9fa;
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  position: sticky;
  top: 5rem;
  align-self: flex-start;
  height: fit-content;
  box-shadow: var(--shadow-sm);
}

.sidebar-title {
  color: var(--color-primary);
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu li {
  margin-bottom: 0.5rem;
}

.sidebar-link {
  text-decoration: none;
  color: var(--color-text);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.95rem;
}

.sidebar-link:hover {
  background: var(--color-bg-hover);
  color: var(--color-primary);
  transform: translateX(4px);
}

.sidebar-link.active {
  background: var(--color-primary);
  color: white;
  font-weight: 500;
}

.sidebar-link .icon {
  font-size: 1.1rem;
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
