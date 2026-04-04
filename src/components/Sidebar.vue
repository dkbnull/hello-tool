<template>
  <nav class="sidebar">
    <h2 class="sidebar-title">工具导航</h2>
    <ul class="sidebar-menu">
      <li>
        <a
            href="#favorite-tools"
            class="sidebar-link"
            :class="{ active: activeCategory === 'favorite-tools' }"
        >
          <span class="icon">⭐</span>
          <span>我的收藏</span>
        </a>
      </li>
      <li>
        <a
            href="#time-tools"
            class="sidebar-link"
            :class="{ active: activeCategory === 'time-tools' }"
        >
          <span class="icon">⏰</span>
          <span>时间工具</span>
        </a>
      </li>
      <li>
        <a
            href="#json-tools"
            class="sidebar-link"
            :class="{ active: activeCategory === 'json-tools' }"
        >
          <span class="icon">📋</span>
          <span>JSON工具</span>
        </a>
      </li>
      <li>
        <a
            href="#security-tools"
            class="sidebar-link"
            :class="{ active: activeCategory === 'security-tools' }"
        >
          <span class="icon">🔒</span>
          <span>安全工具</span>
        </a>
      </li>
      <li>
        <a
            href="#text-tools"
            class="sidebar-link"
            :class="{ active: activeCategory === 'text-tools' }"
        >
          <span class="icon">📝</span>
          <span>文本工具</span>
        </a>
      </li>
      <li>
        <a
            href="#image-tools"
            class="sidebar-link"
            :class="{ active: activeCategory === 'image-tools' }"
        >
          <span class="icon">🖼️</span>
          <span>图形工具</span>
        </a>
      </li>
      <li>
        <a
            href="#document-tools"
            class="sidebar-link"
            :class="{ active: activeCategory === 'document-tools' }"
        >
          <span class="icon">📄</span>
          <span>文档工具</span>
        </a>
      </li>
      <li>
        <a
            href="#life-tools"
            class="sidebar-link"
            :class="{ active: activeCategory === 'life-tools' }"
        >
          <span class="icon">🏠</span>
          <span>生活工具</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import {onMounted, ref} from 'vue';

// 当前激活的分类
const activeCategory = ref('');

// 监听滚动，更新激活的分类
onMounted(() => {
  const handleScroll = () => {
    const sections = document.querySelectorAll('.tool-section');
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollY >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });

    activeCategory.value = current;
  };

  window.addEventListener('scroll', handleScroll);
  // 初始执行一次
  handleScroll();

  return () => window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.sidebar {
  width: 220px;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  position: sticky;
  top: 2rem;
  align-self: flex-start;
  height: fit-content;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.sidebar-title {
  color: #42b883;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  color: #333;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
}

.sidebar-link:hover {
  background: #e8f5e8;
  color: #42b883;
  transform: translateX(5px);
}

.sidebar-link.active {
  background: #42b883;
  color: white;
  font-weight: 500;
}

.sidebar-link .icon {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

/* 响应式设计 */
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