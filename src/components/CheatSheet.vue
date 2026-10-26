<template>
  <div class="cheat-sheet">
    <!-- 分类切换 + 搜索 -->
    <div class="section-card cheat-toolbar">
      <div class="category-tabs">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="mode-btn"
          :class="{active: activeId === cat.id}"
          @click="activeId = cat.id"
        >
          {{ cat.icon }} {{ cat.name }}
        </button>
      </div>
      <input
        v-model.trim="search"
        class="input-field search-input"
        type="text"
        :placeholder="`搜索${keyLabel}或说明`"
      />
    </div>

    <!-- 当前分类说明（搜索时隐藏） -->
    <p v-if="activeCategory && activeCategory.note && !search" class="category-note">
      {{ activeCategory.note }}
    </p>

    <!-- 分组：每行两个，命令与说明同行显示，点击卡片复制 -->
    <div v-for="group in filteredGroups" :key="group.key" class="section-card group-card">
      <h3 class="group-title">
        <span v-if="group.categoryName" class="group-category">{{ group.categoryName }} ·</span>
        {{ group.name }}
        <span class="group-count">{{ group.items.length }} 条</span>
      </h3>
      <div class="item-rows">
        <div
          v-for="row in group.rows"
          :key="group.key + '-' + getItemText(row[0])"
          class="item-row"
        >
          <div
            v-for="item in row"
            :key="group.key + '-' + getItemText(item)"
            class="grid-item"
            title="点击复制"
            @click="handleCopy(getItemText(item))"
          >
            <div class="grid-main">
              <!-- 命令区固定宽度，保证说明文字上下对齐 -->
              <div class="key-box">
                <template v-if="Array.isArray(item.value)">
                  <span v-for="(k, i) in item.value" :key="k" class="key-pair">
                    <span v-if="i > 0" class="key-or">或</span>
                    <code class="key-value">{{ k }}</code>
                  </span>
                </template>
                <code v-else class="key-value">{{ item.value }}</code>
                <span v-if="item.custom" class="custom-badge">自定义</span>
              </div>
              <span class="grid-desc">{{ item.description }}</span>
            </div>
            <div v-if="item.note" class="grid-note">{{ item.note }}</div>
            <div v-if="item.menuPath" class="grid-path">路径：{{ item.menuPath }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空结果提示 -->
    <div v-if="filteredGroups.length === 0" class="section-card empty-tip">
      没有匹配的{{ keyLabel }}，换个关键词试试
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useCopy } from '@/composables/useCopy'

const props = defineProps({
  /** 速查数据：[{id, name, icon, note?, groups: [{name, items: [{value, description, note?, menuPath?, custom?}]}]}] */
  categories: { type: Array, required: true },
  /** 条目名称，如“命令”/“快捷键”（用于搜索占位与空提示） */
  keyLabel: { type: String, default: '命令' },
})

const { handleCopy } = useCopy()

// 当前激活的分类与搜索关键词
const activeId = ref(props.categories[0]?.id || '')
const search = ref('')

const activeCategory = computed(() =>
  props.categories.find(cat => cat.id === activeId.value)
)

/** 获取条目的文本（数组键位用“或”连接），用于搜索与复制 */
const getItemText = (item) =>
  Array.isArray(item.value) ? item.value.join(' 或 ') : item.value

/**
 * 将分组条目整理为行结构（每行最多两个，双列展示）：
 * - 标记 pair 的条目与其紧随其后的搭档条目固定在同一行（如 ↑/↓ 成对快捷键）
 * - 其余条目按顺序两两一行，末尾不足两个时占左侧格
 */
const buildRows = (items) => {
  const rows = []
  let current = []
  let waitingPair = false // 当前行已放入成对条目，等待搭档并入
  items.forEach(item => {
    if (waitingPair) {
      current.push(item)
      rows.push(current)
      current = []
      waitingPair = false
      return
    }
    if (item.pair) {
      // 成对条目：先闭合未满行，再开启新行等待搭档
      if (current.length) {
        rows.push(current)
        current = []
      }
      current.push(item)
      waitingPair = true
      return
    }
    current.push(item)
    if (current.length === 2) {
      rows.push(current)
      current = []
    }
  })
  if (current.length) rows.push(current)
  return rows
}

/**
 * 计算展示的分组：
 * - 无搜索：仅展示当前激活分类的分组
 * - 有搜索：跨所有分类检索，分组标题前附加分类名
 */
const filteredGroups = computed(() => {
  const keyword = search.value.toLowerCase()
  if (!keyword) {
    const cat = activeCategory.value
    if (!cat) return []
    return cat.groups.map(group => ({
      ...group,
      categoryName: '',
      key: `${cat.id}-${group.name}`,
      rows: buildRows(group.items),
    }))
  }
  return props.categories.flatMap(cat =>
    cat.groups
      .map(group => {
        const filtered = group.items.filter(item => {
          const valueText = getItemText(item).toLowerCase()
          return valueText.includes(keyword) ||
            item.description.toLowerCase().includes(keyword) ||
            (item.note && item.note.toLowerCase().includes(keyword)) ||
            (item.menuPath && item.menuPath.toLowerCase().includes(keyword)) ||
            group.name.toLowerCase().includes(keyword)
        })
        return {
          ...group,
          categoryName: cat.name,
          key: `${cat.id}-${group.name}`,
          items: filtered,
          rows: buildRows(filtered),
        }
      })
      .filter(group => group.items.length > 0)
  )
})
</script>

<style scoped>
.cheat-sheet {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: left;
}

.cheat-toolbar {
  padding: 1.25rem;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.category-tabs:last-child {
  margin-bottom: 0;
}

.search-input {
  max-width: 400px;
}

/* 分类说明提示条 */
.category-note {
  margin: 0;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
  background: var(--color-primary-light);
  border-left: 3px solid var(--color-primary);
  border-radius: var(--radius-sm);
}

.group-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-primary);
  font-size: 1.1rem;
  font-weight: 600;
}

.group-category {
  color: var(--color-primary);
}

.group-count {
  margin-left: auto;
  font-size: 0.8rem;
  font-weight: 400;
  color: var(--color-text-muted);
}

/* 行式布局：每行两个，成对（pair）条目固定同一行左右展示 */
.item-rows {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.item-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.grid-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.7rem 0.9rem;
  background: var(--color-bg-output);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: border-color var(--transition-fast), background var(--transition-fast);
}

.grid-item:hover {
  border-color: var(--color-primary);
  background: var(--color-bg-hover);
}

/* 命令与说明同一行：命令区固定宽度，说明从统一位置起排，上下对齐 */
.grid-main {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.key-box {
  flex: 0 0 220px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.key-pair {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.key-or {
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

.grid-desc {
  flex: 1;
  min-width: 0;
  font-size: 0.9rem;
  color: var(--color-text);
}

.grid-note {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.grid-path {
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

.key-value {
  padding: 0.15rem 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--color-text);
  background: var(--color-bg-tag);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  transition: border-color var(--transition-fast), color var(--transition-fast);
}

.grid-item:hover .key-value {
  border-color: var(--color-primary);
  color: var(--color-primary-dark);
}

.custom-badge {
  padding: 0.1rem 0.45rem;
  font-size: 0.72rem;
  color: var(--color-warning);
  background: var(--color-warning-light);
  border-radius: var(--radius-pill);
  white-space: nowrap;
  cursor: help;
}

.empty-tip {
  text-align: center;
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .item-row {
    grid-template-columns: 1fr;
  }

  .key-box {
    flex: 0 0 100%;
  }
}
</style>
