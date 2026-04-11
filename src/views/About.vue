<template>
  <div class="about">
    <div class="content">
      <h1 class="page-title">Hello Tool</h1>
      <p class="page-subtitle">开发工具箱 - 集成多种常用开发工具，提高开发效率</p>

      <div class="about-section">
        <h2 class="section-title">
          <span class="icon">🔗</span>
          仓库地址
        </h2>
        <div class="link-grid">
          <a href="https://github.com/dkbnull/hello-tool" target="_blank" class="link-card section-card">
            <span class="icon">🐙</span>
            <span>GitHub</span>
          </a>
          <a href="https://gitee.com/dkbnull/hello-tool" target="_blank" class="link-card section-card">
            <span class="icon">🎯</span>
            <span>Gitee</span>
          </a>
        </div>
      </div>

      <div class="about-section">
        <h2 class="section-title">
          <span class="icon">🤝</span>
          友链
        </h2>
        <div class="link-grid">
          <a href="https://www.wbnull.cn" target="_blank" class="link-card section-card">
            <span class="icon">🏠</span>
            <span>主站</span>
          </a>
          <a href="https://blog.wbnull.cn" target="_blank" class="link-card section-card">
            <span class="icon">📝</span>
            <span>博客</span>
          </a>
        </div>
      </div>

      <div class="about-section">
        <h2 class="section-title">
          <span class="icon">💬</span>
          微信公众号
        </h2>
        <div class="qrcode-wrapper">
          <div class="section-card qrcode-card">
            <img src="../assets/weixin.jpg" alt="微信二维码" class="qrcode-image">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about {
  padding: 2rem 0;
}

.content {
  max-width: 800px;
  margin: 0 auto;
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
  margin-bottom: 3rem;
  font-size: 1.1rem;
}

.about-section {
  margin-bottom: 3.5rem;
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

.link-grid {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.link-card {
  text-decoration: none;
  color: var(--color-text);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 150px;
}

.link-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-primary);
}

.link-card .icon {
  font-size: 1.5rem;
  color: var(--color-primary);
}

.qrcode-wrapper {
  display: flex;
  justify-content: center;
}

.qrcode-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.2s ease;
}

.qrcode-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-primary);
}

.qrcode-image {
  width: 200px;
  height: 200px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

@media (max-width: 768px) {
  .content {
    padding: 0 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .page-subtitle {
    font-size: 0.9rem;
    margin-bottom: 2rem;
  }

  .link-card {
    padding: 1.25rem;
    min-width: 120px;
  }

  .qrcode-image {
    width: 150px;
    height: 150px;
  }
}

@media (max-width: 480px) {
  .link-grid {
    flex-direction: column;
  }

  .link-card {
    width: 100%;
    justify-content: center;
  }
}
</style>
