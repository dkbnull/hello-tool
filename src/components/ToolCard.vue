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
import {computed} from 'vue'
import {useFavoritesStore} from '@/stores/favorites.js'

const props = defineProps({
  to: {type: String, required: true},
  icon: {type: String, required: true},
  title: {type: String, required: true},
  description: {type: String, required: true}
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
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: 1.75rem;
  text-decoration: none;
  color: var(--color-text);
  transition: all 0.2s ease;
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: var(--shadow-sm);
  height: 100%;
  box-sizing: border-box;
}

.tool-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary);
}

.tool-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f9ff;
  border-radius: 50%;
  color: var(--color-primary);
}

.tool-title {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: var(--color-text);
  font-size: 1.1rem;
  font-weight: 600;
}

.tool-desc {
  margin-bottom: 0;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
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
  background: #fff9e6;
  border-color: #ffd700;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

.favorite-btn.favorited {
  opacity: 1;
  transform: scale(1);
  background: #fff9e6;
  border-color: #ffc107;
}

.favorite-icon {
  font-size: 16px;
  font-weight: bold;
  color: #adb5bd;
  transition: color 0.2s;
}

.favorite-btn:hover .favorite-icon {
  color: #ffb300;
}

.favorite-btn.favorited .favorite-icon {
  color: #ffc107;
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
    font-size: 14px;
  }
}
</style>
