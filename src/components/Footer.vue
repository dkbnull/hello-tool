<template>
  <footer class="footer">
    <div class="footer-inner">
      <p>&copy; {{ new Date().getFullYear() }} null. All rights reserved.</p>
      <div class="records">
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" class="record-link">
          鲁ICP备2026010010号-1
        </a>
        <a href="https://beian.mps.gov.cn/#/query/webSearch" target="_blank" rel="noopener noreferrer"
           class="record-link">
          <img src="https://beian.mps.gov.cn/web/assets/logo01.6189a29f.png" class="record-icon" alt="公安备案图标">
          鲁公网安备37021402007219号
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  position: relative;
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-card-solid);
  padding: var(--spacing-md) 0;
  margin-top: auto;
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-xs);
  font-family: var(--font-mono);
  color: var(--color-text-secondary);
  margin: 0 auto;
  padding: 0 4rem;
  max-width: 1800px;
}

.records {
  display: flex;
  gap: var(--spacing-md);
}

.record-link {
  font-size: var(--font-size-xs);
  font-family: var(--font-mono);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: var(--transition-fast);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.record-link:hover {
  color: var(--color-primary);
  text-shadow: 0 0 8px var(--glow-cyan);
  text-decoration: none;
}

.record-icon {
  width: var(--font-size-xs);
  height: var(--font-size-xs);
}

@media (max-width: 768px) {
  .footer-inner {
    flex-direction: column;
    gap: var(--spacing-sm);
    text-align: center;
    padding: 0 1rem;
  }

  .records {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
}
</style>
