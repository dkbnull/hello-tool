<template>
  <div class="tool-card-wrapper">
    <router-link :to="to" class="tool-card" v-track="{ category: '工具', action: '点击', label: title }">
      <div class="tool-icon">{{ icon }}</div>
      <h3 class="tool-title">{{ title }}</h3>
      <p class="tool-desc">{{ description }}</p>
    </router-link>
    <button
      class="favorite-btn"
      :class="{favorited: isFavorited}"
      @click="toggleFavorite"
      :title="isFavorited ? '取消收藏' : '收藏工具'"
    >
      <span class="favorite-icon">{{ isFavorited ? '★' : '☆' }}</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFavoritesStore } from '@/stores/favorites.js'

const props = defineProps({
  to: { type: String, required: true },
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
})

const favoritesStore = useFavoritesStore()

const isFavorited = computed(() => favoritesStore.isFavorite(props.to))

const toggleFavorite = (event) => {
  event.preventDefault()
  event.stopPropagation()

  if (isFavorited.value) {
    favoritesStore.removeFavorite(props.to)
  } else {
    favoritesStore.addFavorite({
      to: props.to,
      icon: props.icon,
      title: props.title,
      description: props.description
    })
  }
}
</script>

<style scoped>
.tool-card-wrapper {
  position: relative;
  height: 100%;
}

.tool-card {
  position: relative;
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: var(--radius-xl);
  padding: 1.6rem 1.5rem 1.5rem;
  text-decoration: none;
  color: var(--color-text);
  transition: all var(--transition-normal);
  border: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: var(--shadow-sm);
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.tool-card::before {
  content: '';
  position: absolute;
  background: var(--color-primary);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.tool-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-primary-light);
  opacity: 0;
  transition: opacity var(--transition-normal);
  pointer-events: none;
}

.tool-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-glow), var(--shadow-lg);
  border-color: var(--color-primary);
}

.tool-card:hover::before {
  opacity: 1;
}

.tool-card:hover::after {
  opacity: 1;
}

.tool-icon {
  position: relative;
  z-index: 1;
  font-size: 2.2rem;
  margin-bottom: 0.85rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-light);
  border-radius: var(--radius-lg);
  color: var(--color-primary);
  border: 1px solid var(--color-primary-light);
  transition: all var(--transition-normal);
}

.tool-card:hover .tool-icon {
  background: var(--color-primary);
  color: white;
  transform: scale(1.05);
  box-shadow: 0 4px 14px rgba(66, 184, 131, 0.35);
}

.tool-title {
  position: relative;
  z-index: 1;
  margin-top: 0;
  margin-bottom: 0.4rem;
  color: var(--color-text);
  font-size: 1.05rem;
  font-weight: 600;
}

.tool-desc {
  position: relative;
  z-index: 1;
  margin-bottom: 0;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  line-height: 1.45;
}

.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--color-bg-card-solid);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  opacity: 0;
  transform: scale(0.8);
  z-index: 10;
  box-shadow: var(--shadow-sm);
}

.tool-card-wrapper:hover .favorite-btn {
  opacity: 1;
  transform: scale(1);
}

.favorite-btn:hover {
  background: var(--color-warning-light);
  border-color: var(--color-warning);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.favorite-btn.favorited {
  opacity: 1;
  transform: scale(1);
  background: var(--color-warning-light);
  border-color: var(--color-warning);
}

.favorite-icon {
  font-size: 15px;
  font-weight: bold;
  color: var(--color-text-muted);
  transition: color var(--transition-fast);
}

.favorite-btn:hover .favorite-icon {
  color: var(--color-warning);
}

.favorite-btn.favorited .favorite-icon {
  color: var(--color-warning);
}

@media (max-width: 768px) {
  .tool-card {
    padding: 1.25rem;
  }

  .tool-icon {
    font-size: 2rem;
    width: 50px;
    height: 50px;
  }

  .tool-title {
    font-size: 1rem;
  }

  .tool-desc {
    font-size: 0.8rem;
  }

  .favorite-btn {
    width: 28px;
    height: 28px;
    top: 8px;
    right: 8px;
  }

  .favorite-icon {
    font-size: 13px;
  }
}
</style>
