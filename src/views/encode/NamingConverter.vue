<template>
  <div class="tool-container">
    <h2>命名格式转换</h2>

    <div class="section-card">
      <div class="input-group">
        <h3>输入文本</h3>
        <textarea v-model="inputText" placeholder="输入属性名，多个属性名请换行" rows="4"></textarea>
      </div>
    </div>

    <div class="results-grid">
      <div class="section-card">
        <div class="section-header">
          <h3>驼峰命名 (camelCase)</h3>
          <button @click="handleCopy(camelCaseOutput)" class="btn btn-copy btn-sm" :disabled="!camelCaseOutput">复制
          </button>
        </div>
        <textarea v-model="camelCaseOutput" readonly rows="4" class="output-area"></textarea>
      </div>

      <div class="section-card">
        <div class="section-header">
          <h3>下划线命名 (snake_case)</h3>
          <button @click="handleCopy(snakeCaseOutput)" class="btn btn-copy btn-sm" :disabled="!snakeCaseOutput">复制
          </button>
        </div>
        <textarea v-model="snakeCaseOutput" readonly rows="4" class="output-area"></textarea>
      </div>

      <div class="section-card">
        <div class="section-header">
          <h3>帕斯卡命名 (PascalCase)</h3>
          <button @click="handleCopy(pascalCaseOutput)" class="btn btn-copy btn-sm" :disabled="!pascalCaseOutput">复制
          </button>
        </div>
        <textarea v-model="pascalCaseOutput" readonly rows="4" class="output-area"></textarea>
      </div>

      <div class="section-card">
        <div class="section-header">
          <h3>短横线命名 (kebab-case)</h3>
          <button @click="handleCopy(kebabCaseOutput)" class="btn btn-copy btn-sm" :disabled="!kebabCaseOutput">复制
          </button>
        </div>
        <textarea v-model="kebabCaseOutput" readonly rows="4" class="output-area"></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useCopy } from '@/composables/useCopy'
import { convertByLine, toCamelCase, toKebabCase, toPascalCase, toSnakeCase } from '@/utils/caseConverter.js'

const { handleCopy } = useCopy()

const inputText = ref('')

const camelCaseOutput = computed(() => inputText.value ? convertByLine(inputText.value, toCamelCase) : '')
const snakeCaseOutput = computed(() => inputText.value ? convertByLine(inputText.value, toSnakeCase) : '')
const pascalCaseOutput = computed(() => inputText.value ? convertByLine(inputText.value, toPascalCase) : '')
const kebabCaseOutput = computed(() => inputText.value ? convertByLine(inputText.value, toKebabCase) : '')
</script>

<style scoped>
.results-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
}

.output-area {
  background: #f8f9fa;
}

@media (max-width: 768px) {
  .results-grid {
    grid-template-columns: 1fr;
  }
}
</style>
