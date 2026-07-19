<template>
  <div class="home-container">
    <Sidebar />

    <div class="content">
      <div class="header-row">
        <div class="header-text">
          <h1 class="page-title">开发工具箱</h1>
          <p class="page-subtitle">集成多种常用开发工具，提高开发效率</p>
        </div>
        <div class="search-bar">
          <el-input
            ref="searchInputRef"
            v-model="searchQuery"
            placeholder="搜索工具名称或描述..."
            size="large"
            clearable
            :prefix-icon="Search"
            @keydown.esc="exitSearch"
            @focus="searchFocused = true"
            @blur="searchFocused = false"
          >
            <template #suffix>
              <kbd v-show="!searchFocused && !searchQuery" class="search-kbd">Ctrl+F</kbd>
            </template>
          </el-input>
        </div>
      </div>

      <div v-if="searchQuery.trim()" class="tool-section search-results-section">
        <h2 class="section-title">
          <span class="icon">🔍</span>
          搜索结果
          <span class="search-count" v-if="searchResults.length > 0">({{ searchResults.length }})</span>
        </h2>
        <div v-if="searchResults.length > 0" class="tool-grid">
          <ToolCard
            v-for="tool in searchResults"
            :key="tool.path"
            :to="tool.path"
            :icon="tool.icon"
            :title="tool.title"
            :description="tool.description"
          />
        </div>
        <div v-else class="empty-state">
          <span class="empty-icon">🔍</span>
          <h3>未找到匹配的工具</h3>
          <p>请尝试其他关键词</p>
        </div>
      </div>

      <template v-else>
        <div v-if="favoriteTools.length > 0" id="favorite-tools" class="tool-section favorite-section">
          <div class="section-header-row">
            <h2 class="section-title">
              <span class="icon">⭐</span>
              我的收藏
              <span class="favorite-count">({{ favoriteTools.length }})</span>
            </h2>
            <button @click="clearFavorites" class="btn btn-danger btn-sm">清空收藏</button>
          </div>
          <div class="tool-grid">
            <ToolCard
              v-for="tool in favoriteTools"
              :key="tool.to"
              :to="tool.to"
              :icon="tool.icon"
              :title="tool.title"
              :description="tool.description"
            />
          </div>
        </div>

        <div v-else class="empty-state">
          <span class="empty-icon">⭐</span>
          <h3>暂无收藏的工具</h3>
          <p>点击工具卡片上的星形按钮来收藏常用工具</p>
        </div>

        <div
          v-for="category in categories"
          :key="category.id"
          :id="`${category.id}-tools`"
          class="tool-section"
        >
          <h2 class="section-title">
            <span class="icon">{{ category.icon }}</span>
            {{ category.name }}
          </h2>
          <div class="tool-grid">
            <ToolCard
              v-for="tool in getToolsByCategory(category.id)"
              :key="tool.path"
              :to="tool.path"
              :icon="tool.icon"
              :title="tool.title"
              :description="tool.description"
            />
          </div>
        </div>
      </template>
    </div>

    <button
      v-if="showBackToTop"
      @click="backToTop"
      class="back-to-top"
      aria-label="回到顶部"
    >
      <ArrowUp class="back-to-top-icon" />
    </button>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { ArrowUp, Search } from '@element-plus/icons-vue'
import Sidebar from '@/components/Sidebar.vue'
import ToolCard from '@/components/ToolCard.vue'
import { useFavoritesStore } from '@/stores/favorites.js'
import { BACK_TO_TOP_THRESHOLD } from '@/config/constants.js'
import { getCategories, getToolsByCategory, searchTools } from '@/config/tools'

const favoritesStore = useFavoritesStore()
const categories = getCategories()
const showBackToTop = ref(false)
const searchQuery = ref('')
const searchInputRef = ref(null)
const searchFocused = ref(false)

const focusSearch = () => {
  searchInputRef.value?.focus()
}

const exitSearch = () => {
  if (searchQuery.value) {
    searchQuery.value = ''
  }
  searchInputRef.value?.blur()
}

const handleKeydown = (e) => {
  // Ctrl+F / Cmd+F 聚焦搜索框
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
    e.preventDefault()
    focusSearch()
  }
}

const searchResults = computed(() => {
  return searchTools(searchQuery.value)
})

const favoriteTools = computed(() => favoritesStore.favorites)

const clearFavorites = async () => {
  try {
    await ElMessageBox.confirm('确定要清空所有收藏的工具吗？此操作不可撤销。', '清空收藏', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    favoritesStore.clearFavorites()
  } catch {
    // 用户取消，无需处理
  }
}

const handleScroll = () => {
  showBackToTop.value = window.scrollY > BACK_TO_TOP_THRESHOLD
}

const backToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.home-container {
  display: flex;
  margin: 0 auto;
  padding: 0.5rem 2rem 2rem;
  gap: 2rem;
}

.content {
  flex: 1;
  min-width: 0;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.header-text {
  flex: 1;
  min-width: 200px;
}

.page-title {
  text-align: left;
  font-size: 1.75rem;
  margin-bottom: 0.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.page-subtitle {
  text-align: left;
  font-size: 0.95rem;
  margin-bottom: 0;
  color: var(--color-text-secondary);
}

.search-bar {
  flex: 1;
  max-width: 560px;
  margin: 0;
  position: relative;
}

.search-kbd {
  padding: 2px 8px;
  border: 1px solid var(--color-border);
  border-radius: 5px;
  background: var(--color-bg-card-soft);
  color: var(--color-text-muted);
  font-size: 11px;
  font-family: var(--font-mono);
  line-height: 1.4;
  pointer-events: none;
  user-select: none;
}

.search-bar :deep(.el-input__wrapper) {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 0.3rem 1rem;
  border: 1px solid transparent;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.search-bar :deep(.el-input__wrapper:hover) {
  box-shadow: var(--shadow-lg);
}

.search-bar :deep(.el-input__wrapper.is-focus) {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light), var(--shadow-md);
}

.search-bar :deep(.el-input__wrapper.is-filled) {
  border-color: var(--color-primary);
}

.search-bar :deep(.el-input__inner) {
  font-size: 1rem;
}

.search-results-section {
  scroll-margin-top: 5rem;
}

.search-count {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  font-weight: normal;
  margin-left: 0.5rem;
}

.empty-state {
  background: var(--color-bg-card-soft);
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-lg);
  padding: 3rem 2rem;
  text-align: center;
  margin-bottom: 3rem;
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.empty-state p {
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.tool-section {
  margin-bottom: 3rem;
  scroll-margin-top: 5rem;
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
}

.favorite-section {
  margin-bottom: 2.5rem;
}

.favorite-section::before {
  content: none;
}

.section-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.favorite-count {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  font-weight: normal;
  margin-left: 0.5rem;
}

.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(66, 184, 131, 0.4);
  transition: all var(--transition-fast);
  z-index: 1000;
}

.back-to-top-icon {
  width: 22px;
  height: 22px;
}

.back-to-top:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgba(66, 184, 131, 0.5);
}

@media (max-width: 768px) {
  .home-container {
    flex-direction: column;
    padding: 0.5rem 1rem 1rem;
    gap: 1rem;
  }

  .header-row {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .search-bar {
    max-width: 100%;
  }

  .search-kbd {
    display: none;
  }

  .page-title {
    font-size: 1.3rem;
  }

  .tool-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
  }

  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .tool-grid {
    grid-template-columns: 1fr;
  }
}
</style>
