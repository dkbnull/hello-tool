<template>
  <router-link :to="to" class="tool-card">
    <div class="tool-icon">{{ icon }}</div>
    <h3 class="tool-title">{{ title }}</h3>
    <p class="tool-desc">{{ description }}</p>
  </router-link>
</template>

<script setup>
import {defineProps} from 'vue';

defineProps({
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
</script>

<style scoped>
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
}
</style>