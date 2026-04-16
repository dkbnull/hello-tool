<template>
  <div class="home-container">
    <Sidebar/>

    <div class="content">
      <h1 class="page-title">开发工具箱</h1>
      <p class="page-subtitle">集成多种常用开发工具，提高开发效率</p>

      <div class="search-bar">
        <el-input
            v-model="searchQuery"
            placeholder="搜索工具名称或描述..."
            size="large"
            clearable
            :prefix-icon="Search"
        />
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
        <div v-else class="no-results">
          <span class="no-results-icon">🔍</span>
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

        <div v-else class="no-favorites">
          <span class="no-favorites-icon">⭐</span>
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
      <Top class="back-to-top-icon"/>
    </button>
  </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from 'vue'
import {ElMessageBox} from 'element-plus'
import {Search, Top} from '@element-plus/icons-vue'
import Sidebar from '../components/Sidebar.vue'
import ToolCard from '../components/ToolCard.vue'
import {favoritesManager} from '../utils/favorites.js'
import {getCategories, getToolsByCategory, searchTools} from '../config/tools'

const categories = getCategories()
const favoriteTools = ref([])
const showBackToTop = ref(false)
const searchQuery = ref('')

const searchResults = computed(() => {
  return searchTools(searchQuery.value)
})

const loadFavorites = () => {
  favoriteTools.value = favoritesManager.getFavorites()
}

const clearFavorites = async () => {
  await ElMessageBox.confirm('确定要清空所有收藏的工具吗？此操作不可撤销。', '清空收藏', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    favoritesManager.clearFavorites()
    loadFavorites()
    window.dispatchEvent(new CustomEvent('favoritesChanged'))
  })
}

const handleFavoritesChange = () => loadFavorites()

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

const backToTop = () => {
  window.scrollTo({top: 0, behavior: 'smooth'})
}

onMounted(() => {
  loadFavorites()
  window.addEventListener('favoritesChanged', handleFavoritesChange)
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('favoritesChanged', handleFavoritesChange)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.home-container {
  display: flex;
  margin: 0 auto;
  padding: 2rem;
  gap: 2rem;
}

.content {
  flex: 1;
}

.page-title {
  text-align: center;
  color: var(--color-text);
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 700;
}

.page-subtitle {
  text-align: center;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.search-bar {
  max-width: 560px;
  margin: 0 auto 2.5rem;
}

.search-bar :deep(.el-input__wrapper) {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 0.25rem 1rem;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.search-bar :deep(.el-input__wrapper:hover) {
  box-shadow: var(--shadow-lg);
}

.search-bar :deep(.el-input__wrapper.is-focus) {
  border: 1px solid var(--color-border);
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
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

.no-results {
  background: #f8f9fa;
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  padding: 3rem 2rem;
  text-align: center;
}

.no-results-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-results h3 {
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.no-results p {
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.tool-section {
  margin-bottom: 3.5rem;
  scroll-margin-top: 5rem;
}

.section-title {
  color: var(--color-text);
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--color-primary);
  font-size: 1.4rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title .icon {
  font-size: 1.2rem;
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}

.favorite-section {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  margin-bottom: 3rem;
  box-shadow: var(--shadow-sm);
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

.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
}

.no-favorites {
  background: #f8f9fa;
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  padding: 3rem 2rem;
  text-align: center;
  margin-bottom: 3rem;
}

.no-favorites-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-favorites h3 {
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.no-favorites p {
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  transition: all 0.2s ease;
  z-index: 1000;
}

.back-to-top-icon {
  width: 22px;
  height: 22px;
}

.back-to-top:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .home-container {
    flex-direction: column;
    padding: 1rem;
    gap: 1.5rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .page-subtitle {
    font-size: 0.9rem;
    margin-bottom: 2rem;
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
