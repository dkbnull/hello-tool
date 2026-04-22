<template>
  <div class="tool-container">
    <h2>HTTP状态码查询</h2>

    <div class="section-card">
      <div class="input-group">
        <label>搜索状态码或描述：</label>
        <input type="text" v-model="search" placeholder="输入状态码或关键词" @input="filterCodes"/>
      </div>
    </div>

    <div class="status-codes">
      <div v-for="group in filteredGroups" :key="group.category" class="status-group section-card">
        <h3 class="group-title" :class="group.categoryClass">{{ group.category }}</h3>
        <div class="status-list">
          <div v-for="code in group.codes" :key="code.code" class="status-item">
            <span class="status-code" :class="group.categoryClass">{{ code.code }}</span>
            <span class="status-name">{{ code.name }}</span>
            <span class="status-desc">{{ code.description }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'

const search = ref('')

const statusGroups = [
  {
    category: '1xx 信息响应',
    categoryClass: 'cat-info',
    codes: [
      {code: 100, name: 'Continue', description: '继续发送请求'},
      {code: 101, name: 'Switching Protocols', description: '切换协议'},
      {code: 102, name: 'Processing', description: '处理中'},
    ]
  },
  {
    category: '2xx 成功',
    categoryClass: 'cat-success',
    codes: [
      {code: 200, name: 'OK', description: '请求成功'},
      {code: 201, name: 'Created', description: '已创建'},
      {code: 202, name: 'Accepted', description: '已接受'},
      {code: 204, name: 'No Content', description: '无内容'},
      {code: 206, name: 'Partial Content', description: '部分内容'},
    ]
  },
  {
    category: '3xx 重定向',
    categoryClass: 'cat-redirect',
    codes: [
      {code: 301, name: 'Moved Permanently', description: '永久重定向'},
      {code: 302, name: 'Found', description: '临时重定向'},
      {code: 304, name: 'Not Modified', description: '未修改'},
      {code: 307, name: 'Temporary Redirect', description: '临时重定向'},
      {code: 308, name: 'Permanent Redirect', description: '永久重定向'},
    ]
  },
  {
    category: '4xx 客户端错误',
    categoryClass: 'cat-client-error',
    codes: [
      {code: 400, name: 'Bad Request', description: '错误请求'},
      {code: 401, name: 'Unauthorized', description: '未授权'},
      {code: 403, name: 'Forbidden', description: '禁止访问'},
      {code: 404, name: 'Not Found', description: '未找到'},
      {code: 405, name: 'Method Not Allowed', description: '方法不允许'},
      {code: 408, name: 'Request Timeout', description: '请求超时'},
      {code: 409, name: 'Conflict', description: '冲突'},
      {code: 410, name: 'Gone', description: '已删除'},
      {code: 413, name: 'Payload Too Large', description: '请求实体过大'},
      {code: 414, name: 'URI Too Long', description: 'URI过长'},
      {code: 415, name: 'Unsupported Media Type', description: '不支持的媒体类型'},
      {code: 429, name: 'Too Many Requests', description: '请求过多'},
    ]
  },
  {
    category: '5xx 服务端错误',
    categoryClass: 'cat-server-error',
    codes: [
      {code: 500, name: 'Internal Server Error', description: '服务器内部错误'},
      {code: 501, name: 'Not Implemented', description: '未实现'},
      {code: 502, name: 'Bad Gateway', description: '网关错误'},
      {code: 503, name: 'Service Unavailable', description: '服务不可用'},
      {code: 504, name: 'Gateway Timeout', description: '网关超时'},
      {code: 505, name: 'HTTP Version Not Supported', description: 'HTTP版本不支持'},
    ]
  }
]

const filteredGroups = computed(() => {
  if (!search.value) return statusGroups

  const keyword = search.value.toLowerCase()
  return statusGroups
      .map(group => ({
        ...group,
        codes: group.codes.filter(code =>
            String(code.code).includes(keyword) ||
            code.name.toLowerCase().includes(keyword) ||
            code.description.includes(keyword)
        )
      }))
      .filter(group => group.codes.length > 0)
})

const filterCodes = () => {
}
</script>

<style scoped>
.tool-container {
  max-width: 800px;
}

input {
  padding: 0.5rem;
  border: 1px solid var(--color-border-input);
  border-radius: var(--radius-sm);
  font-size: 1rem;
}

.status-codes {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
}

.group-title {
  margin-top: 0;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid;
  font-size: 1.2rem;
}

.cat-info {
  color: #3182ce;
  border-color: #3182ce;
}

.cat-success {
  color: #38a169;
  border-color: #38a169;
}

.cat-redirect {
  color: #d69e2e;
  border-color: #d69e2e;
}

.cat-client-error {
  color: #e53e3e;
  border-color: #e53e3e;
}

.cat-server-error {
  color: #805ad5;
  border-color: #805ad5;
}

.status-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: var(--color-bg-output);
  border-radius: var(--radius-sm);
  transition: background 0.2s;
}

.status-item:hover {
  background: #edf2f7;
}

.status-code {
  font-weight: bold;
  font-family: 'Consolas', 'Monaco', monospace;
  min-width: 50px;
  font-size: 1.1rem;
}

.status-code.cat-info {
  color: #3182ce;
}

.status-code.cat-success {
  color: #38a169;
}

.status-code.cat-redirect {
  color: #d69e2e;
}

.status-code.cat-client-error {
  color: #e53e3e;
}

.status-code.cat-server-error {
  color: #805ad5;
}

.status-name {
  min-width: 180px;
  font-weight: 500;
  color: var(--color-text);
}

.status-desc {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .status-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .status-name {
    min-width: auto;
  }
}
</style>
