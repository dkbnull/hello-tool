<template>
  <div class="about">
    <div class="content">
      <h1 class="page-title">Hello Tool</h1>
      <p class="page-subtitle">开发工具箱 - 集成多种常用开发工具，提高开发效率</p>

      <div class="about-section">
        <h2 class="section-title">仓库地址</h2>
        <div class="link-grid">
          <a href="https://github.com/dkbnull/hello-tool" target="_blank" class="link-card section-card">
            <img src="https://github.com/favicon.ico" alt="GitHub" class="link-icon">
            <span>GitHub</span>
          </a>
          <a href="https://gitee.com/dkbnull/hello-tool" target="_blank" class="link-card section-card">
            <img src="https://gitee.com/favicon.ico" alt="Gitee" class="link-icon">
            <span>Gitee</span>
          </a>
        </div>
      </div>

      <div class="about-section">
        <h2 class="section-title">友链</h2>
        <div class="link-grid">
          <a href="https://www.wbnull.cn" target="_blank" class="link-card section-card">
            <img src="https://www.wbnull.cn/favicon.svg" alt="主站" class="link-icon">
            <span>主站</span>
          </a>
          <a href="https://blog.wbnull.cn" target="_blank" class="link-card section-card">
            <img src="https://blog.wbnull.cn/favicon.svg" alt="博客" class="link-icon">
            <span>博客</span>
          </a>
          <a href="https://game.wbnull.cn" target="_blank" class="link-card section-card">
            <img src="https://game.wbnull.cn/favicon.svg" alt="游戏" class="link-icon">
            <span>游戏</span>
          </a>
        </div>
      </div>

      <div class="about-section">
        <h2 class="section-title">微信公众号</h2>
        <div class="qrcode-wrapper">
          <div class="section-card qrcode-card">
            <img src="../assets/weixin.jpg" alt="微信二维码" class="qrcode-image">
          </div>
        </div>
      </div>

      <div class="about-section">
        <h2 class="section-title">反馈建议</h2>
        <div class="link-grid">
          <a href="https://github.com/dkbnull/hello-tool/issues" target="_blank" class="link-card section-card">
            <img src="https://github.com/favicon.ico" alt="GitHub Issues" class="link-icon">
            <span>GitHub Issues</span>
          </a>
          <a href="https://gitee.com/dkbnull/hello-tool/issues" target="_blank" class="link-card section-card">
            <img src="https://gitee.com/favicon.ico" alt="Gitee Issues" class="link-icon">
            <span>Gitee Issues</span>
          </a>
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

.page-subtitle {
  margin-bottom: 3rem;
}

.about-section {
  margin-bottom: 3.5rem;
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

.link-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  flex-shrink: 0;
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

  .page-subtitle {
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
