<template>
  <!-- 移动端悬浮按钮 -->
  <button
    class="sidebar-toggle"
    :class="{ expanded: isExpanded }"
    @click="isExpanded = !isExpanded"
    aria-label="工具导航"
  >
    <span class="toggle-icon">☰</span>
  </button>

  <!-- 移动端遮罩 -->
  <div
    v-if="isExpanded"
    class="sidebar-overlay"
    @click="isExpanded = false"
  ></div>

  <nav :class="['sidebar', { 'sidebar-expanded': isExpanded }]">
    <div class="sidebar-header">
      <h2 class="sidebar-title">
        <span class="title-indicator"></span>
        工具导航
      </h2>
      <button class="sidebar-close" @click="isExpanded = false" aria-label="收起导航">✕</button>
    </div>
    <ul class="sidebar-menu">
      <li>
        <a
          href="#favorite-tools"
          class="sidebar-link"
          :class="{active: activeCategory === 'favorite-tools'}"
          @click="handleLinkClick"
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
          @click="handleLinkClick"
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
const isExpanded = ref(false)

// 点击导航链接后收起侧边栏
const handleLinkClick = () => {
  if (window.innerWidth <= 768) {
    isExpanded.value = false
  }
}

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

.sidebar-header {
  display: none;
}

.sidebar-close {
  display: none;
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

/* 移动端悬浮切换按钮 - 默认隐藏 */
.sidebar-toggle {
  display: none;
}

/* 遮罩 - 默认隐藏 */
.sidebar-overlay {
  display: none;
}

@media (max-width: 768px) {
  /* 悬浮切换按钮 */
  .sidebar-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 200;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--color-bg-card-solid);
    border: 1px solid var(--color-border);
    box-shadow: var(--shadow-lg);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .sidebar-toggle:hover {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: white;
  }

  .sidebar-toggle:hover .toggle-icon {
    color: white;
  }

  .toggle-icon {
    font-size: 1.2rem;
    color: var(--color-text);
    line-height: 1;
  }

  .sidebar-toggle.expanded {
    opacity: 0;
    pointer-events: none;
  }

  /* 遮罩 */
  .sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 250;
  }

  /* 侧边栏 - 悬浮左侧，可展开/收起 */
  .sidebar {
    position: fixed;
    left: 0;
    top: 64px;
    bottom: 0;
    width: 220px;
    z-index: 300;
    background: var(--color-bg-card-solid);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border-radius: 0;
    border-right: 1px solid var(--color-border);
    border-left: none;
    border-top: none;
    border-bottom: none;
    padding: 1rem;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    overflow-y: auto;
    box-shadow: none;
    align-self: auto;
  }

  .sidebar-expanded {
    transform: translateX(0);
    box-shadow: var(--shadow-lg);
  }

  /* 移动端显示关闭按钮和头部 */
  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .sidebar-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: var(--radius-md);
    border: none;
    background: var(--color-bg-hover);
    color: var(--color-text-secondary);
    cursor: pointer;
    font-size: 0.9rem;
    transition: all var(--transition-fast);
  }

  .sidebar-close:hover {
    background: var(--color-primary);
    color: white;
  }

  .sidebar-title {
    margin-bottom: 0;
    font-size: 1rem;
  }

  .sidebar-menu {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .sidebar-menu li {
    margin-bottom: 0.35rem;
    flex: none;
  }

  .sidebar-link {
    padding: 0.6rem 0.85rem;
    font-size: 0.9rem;
  }

  .sidebar-link:hover {
    transform: none;
  }
}
</style>
