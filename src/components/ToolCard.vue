<template>
  <div class="tool-card-wrapper">
    <router-link :to="to" class="tool-card">
      <div class="tool-icon">{{ icon }}</div>
      <h3 class="tool-title">{{ title }}</h3>
      <p class="tool-desc">{{ description }}</p>
    </router-link>
    <button
        class="favorite-btn"
        :class="{ 'favorited': isFavorited }"
        @click="toggleFavorite"
        :title="isFavorited ? '取消收藏' : '收藏工具'"
    >
      <span class="favorite-icon">{{ isFavorited ? '★' : '☆' }}</span>
    </button>
  </div>
</template>

<script setup>
import {defineProps, onMounted, ref} from 'vue';
import {favoritesManager} from '../utils/favorites.js';

const props = defineProps({
  to: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const isFavorited = ref(false);

// 检查当前工具是否已收藏
const checkFavoriteStatus = () => {
  isFavorited.value = favoritesManager.isFavorite(props.to);
};

// 切换收藏状态
const toggleFavorite = (event) => {
  event.preventDefault();
  event.stopPropagation();

  if (isFavorited.value) {
    favoritesManager.removeFavorite(props.to);
  } else {
    favoritesManager.addFavorite({
      to: props.to,
      icon: props.icon,
      title: props.title,
      description: props.description
    });
  }

  checkFavoriteStatus();

  // 触发自定义事件，通知父组件收藏状态变化
  window.dispatchEvent(new CustomEvent('favoritesChanged'));
};

// 监听收藏状态变化
onMounted(() => {
  checkFavoriteStatus();

  // 监听全局收藏变化事件
  window.addEventListener('favoritesChanged', checkFavoriteStatus);
});
</script>

<style scoped>
.tool-card-wrapper {
  position: relative;
  height: 100%;
}

.tool-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.75rem;
  text-decoration: none;
  color: #333;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: 100%;
  box-sizing: border-box;
}

.tool-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: #42b883;
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
  color: #42b883;
}

.tool-title {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.tool-desc {
  margin-bottom: 0;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
}

.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid #e9ecef;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  opacity: 0;
  transform: scale(0.8) translateY(-5px);
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.tool-card-wrapper:hover .favorite-btn {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.favorite-btn:hover {
  background: linear-gradient(135deg, #fff9e6 0%, #fff3d6 100%);
  border-color: #ffd700;
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
  transform: scale(1.05);
}

.favorite-btn.favorited {
  opacity: 1;
  transform: scale(1) translateY(0);
  background: linear-gradient(135deg, #fff9e6 0%, #ffecb3 100%);
  border-color: #ffc107;
  box-shadow: 0 4px 16px rgba(255, 193, 7, 0.3);
}

.favorite-btn.favorited:hover {
  background: linear-gradient(135deg, #ffecb3 0%, #ffe082 100%);
  box-shadow: 0 6px 24px rgba(255, 193, 7, 0.5);
  transform: scale(1.08);
}

.favorite-icon {
  font-size: 18px;
  font-weight: bold;
  color: #adb5bd;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.favorite-btn:hover .favorite-icon {
  color: #ffb300;
  text-shadow: 0 2px 4px rgba(255, 179, 0, 0.3);
}

.favorite-btn.favorited .favorite-icon {
  color: #ffc107;
  text-shadow: 0 2px 6px rgba(255, 193, 7, 0.4);
}

.favorite-btn.favorited:hover .favorite-icon {
  color: #ff9800;
  text-shadow: 0 3px 8px rgba(255, 152, 0, 0.5);
}

/* 收藏动画效果 */
@keyframes favoritePulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.favorite-btn:active {
  animation: favoritePulse 0.3s ease;
}

/* 响应式设计 */
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