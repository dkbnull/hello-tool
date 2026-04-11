<template>
  <footer class="footer">
    <div class="footer-inner">
      <p>&copy; {{ new Date().getFullYear() }} null. 版权所有.</p>
      <div class="footer-records">
        <a href="https://beian.miit.gov.cn/" target="_blank" class="record-link">鲁ICP备2026010010号-1</a>
        <a href="https://beian.mps.gov.cn/#/query/webSearch" target="_blank" class="record-link">
          <img src="https://beian.mps.gov.cn/web/assets/logo01.6189a29f.png" class="record-icon" alt="">
          鲁公网安备37021402007219号
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #f5f5f5;
  color: var(--color-text);
  font-size: 0.85rem;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
  border-top: 1px solid var(--color-border);
}

.footer-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.footer-records {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.record-link {
  color: var(--color-text);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.2s;
}

.record-link:hover {
  color: var(--color-primary);
}

.record-icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
}

@media (max-width: 768px) {
  .footer-records {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>
