<template>
  <div class="app-container">
    <!-- 主要内容区域 -->
    <div class="about-container">
      <!-- 右侧内容区域 -->
      <div class="content">
        <h1 class="page-title">Hello Tool</h1>
        <p class="page-subtitle">开发工具箱 - 集成多种常用开发工具，提高开发效率</p>

        <!-- 仓库链接 -->
        <div class="about-section">
          <h2 class="section-title">
            <span class="icon">🔗</span>
            仓库地址
          </h2>
          <div class="repo-links">
            <a href="https://github.com/dkbnull/hello-tool" target="_blank" class="repo-link">
              <span class="icon">🐙</span>
              <span>GitHub</span>
            </a>
            <a href="https://gitee.com/dkbnull/hello-tool" target="_blank" class="repo-link">
              <span class="icon">🎯</span>
              <span>Gitee</span>
            </a>
          </div>
        </div>

        <!-- 友链 -->
        <div class="about-section">
          <h2 class="section-title">
            <span class="icon">🤝</span>
            友链
          </h2>
          <div class="friend-links">
            <a href="https://www.wbnull.cn" target="_blank" class="friend-link">
              <span class="icon">🏠</span>
              <span>主站</span>
            </a>
            <a href="https://blog.wbnull.cn" target="_blank" class="friend-link">
              <span class="icon">📝</span>
              <span>博客</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 主要内容区域 */
.about-container {
  display: flex;
  margin: 0 auto;
  padding: 2rem;
  flex: 1;
  max-width: 1200px;
  width: 100%;
}

/* 右侧内容区域样式 */
.content {
  flex: 1;
}

.page-title {
  text-align: center;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 700;
}

.page-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 3rem;
  font-size: 1.1rem;
}

.about-section {
  margin-bottom: 3.5rem;
  scroll-margin-top: 2rem;
}

.section-title {
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #42b883;
  font-size: 1.4rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title .icon {
  font-size: 1.2rem;
}

/* 仓库链接样式 */
.repo-links {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.repo-link {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  text-decoration: none;
  color: #333;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  min-width: 150px;
}

.repo-link:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border-color: #42b883;
}

.repo-link .icon {
  font-size: 1.5rem;
  color: #42b883;
}

/* 友链样式 */
.friend-links {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.friend-link {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  text-decoration: none;
  color: #333;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  min-width: 150px;
}

.friend-link:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border-color: #42b883;
}

.friend-link .icon {
  font-size: 1.5rem;
  color: #42b883;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .about-container {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .page-subtitle {
    font-size: 0.9rem;
    margin-bottom: 2rem;
  }

  .repo-link,
  .friend-link {
    padding: 1.25rem;
    min-width: 120px;
  }
}

@media (max-width: 480px) {
  .repo-links,
  .friend-links {
    flex-direction: column;
  }

  .repo-link,
  .friend-link {
    width: 100%;
    justify-content: center;
  }
}
</style>