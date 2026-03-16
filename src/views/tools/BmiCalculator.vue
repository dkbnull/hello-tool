<template>
  <div class="tool-container">
    <h2>BMI计算器</h2>
    <p class="tool-description">计算您的身体质量指数</p>

    <div class="calculator-container">
      <div class="input-section">
        <div class="input-header">
          <h3>输入信息</h3>
          <div class="input-actions">
            <button @click="clearInput" class="action-btn secondary">
              <i class="fas fa-trash-alt mr-1"></i>清空
            </button>
          </div>
        </div>

        <div class="input-fields">
          <div class="input-field">
            <label for="height" class="field-label">身高 (cm)</label>
            <div class="input-wrapper">
              <input
                  type="number"
                  id="height"
                  v-model="height"
                  class="input-field"
                  placeholder="请输入身高"
                  min="100"
                  max="250"
              >
              <span class="input-suffix">cm</span>
            </div>
          </div>

          <div class="input-field">
            <label for="weight" class="field-label">体重 (kg)</label>
            <div class="input-wrapper">
              <input
                  type="number"
                  id="weight"
                  v-model="weight"
                  class="input-field"
                  placeholder="请输入体重"
                  min="30"
                  max="200"
              >
              <span class="input-suffix">kg</span>
            </div>
          </div>

          <button @click="calculateBMI" class="action-btn primary calculate-btn">
            <i class="fas fa-calculator mr-1"></i>计算BMI
          </button>
        </div>

        <div v-if="error" class="error-area">{{ error }}</div>
      </div>

      <div v-if="showResult" class="result-section">
        <div class="result-header">
          <h3>计算结果</h3>
        </div>

        <div class="result-content">
          <div class="bmi-value">
            <span class="value-label">您的BMI指数</span>
            <span class="value-number">{{ bmiValue }}</span>
          </div>

          <div class="bmi-scale-container">
            <div class="bmi-scale-bg">
              <div class="bmi-scale" :style="{ width: scaleWidth }"></div>
            </div>
            <div class="scale-labels">
              <span>偏瘦 (<18.5)</span>
              <span>正常 (18.5-24)</span>
              <span>偏胖 (24-28)</span>
              <span>肥胖 (>28)</span>
            </div>
          </div>

          <div class="bmi-category" :class="bmiColor">
            您的体型属于: {{ bmiCategory }}
          </div>
        </div>

        <div class="formula-section">
          <p>BMI = 体重(kg) / (身高(m) × 身高(m))</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {showToast} from '../../utils/toast'

const height = ref('')
const weight = ref('')
const bmiValue = ref('0.0')
const bmiCategory = ref('')
const bmiColor = ref('')
const scaleWidth = ref('0%')
const showResult = ref(false)
const error = ref('')

// 计算BMI
const calculateBMI = () => {
  const heightValue = parseFloat(height.value)
  const weightValue = parseFloat(weight.value)

  if (isNaN(heightValue) || isNaN(weightValue) || heightValue <= 0 || weightValue <= 0) {
    error.value = '请输入有效的身高和体重数值'
    return
  }

  error.value = ''
  const heightInMeter = heightValue / 100
  const bmi = (weightValue / (heightInMeter * heightInMeter)).toFixed(1)

  bmiValue.value = bmi

  // 计算BMI进度条位置
  let width
  if (bmi < 18.5) width = (bmi / 18.5) * 25
  else if (bmi < 24) width = 25 + ((bmi - 18.5) / (24 - 18.5)) * 25
  else if (bmi < 28) width = 50 + ((bmi - 24) / (28 - 24)) * 25
  else width = 75 + (Math.min(parseFloat(bmi) - 28, 12) / 12) * 25

  scaleWidth.value = `${Math.min(width, 100)}%`

  // 设置BMI分类和颜色
  if (bmi < 18.5) {
    bmiCategory.value = '偏瘦'
    bmiColor.value = 'bg-blue-100 text-blue-800'
  } else if (bmi < 24) {
    bmiCategory.value = '正常'
    bmiColor.value = 'bg-green-100 text-green-800'
  } else if (bmi < 28) {
    bmiCategory.value = '偏胖'
    bmiColor.value = 'bg-yellow-100 text-yellow-800'
  } else {
    bmiCategory.value = '肥胖'
    bmiColor.value = 'bg-red-100 text-red-800'
  }

  // 显示结果区域
  showResult.value = true
  showToast({
    message: '计算完成'
  })
}

// 清空输入
const clearInput = () => {
  height.value = ''
  weight.value = ''
  bmiValue.value = '0.0'
  bmiCategory.value = ''
  bmiColor.value = ''
  scaleWidth.value = '0%'
  showResult.value = false
  error.value = ''
}
</script>

<style scoped>
.tool-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.75rem;
  font-weight: bold;
}

.tool-description {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

.calculator-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-section,
.result-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.input-header,
.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

h3 {
  font-size: 1.25rem;
  color: #333;
  margin: 0;
}

.input-actions {
  display: flex;
  gap: 0.5rem;
}

.input-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-size: 0.875rem;
  color: #666;
}

.input-wrapper {
  position: relative;
}



.calculate-btn {
  margin-top: 0.5rem;
  padding: 0.75rem;
  font-size: 1rem;
}



.error-area {
  margin-top: 0.75rem;
  color: #e53e3e;
  font-size: 0.875rem;
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.bmi-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.value-label {
  font-size: 1rem;
  color: #666;
}

.value-number {
  font-size: 1.75rem;
  font-weight: bold;
  color: #4299e1;
}

.bmi-scale-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.bmi-scale-bg {
  height: 0.75rem;
  background: #e2e8f0;
  border-radius: 0.375rem;
  overflow: hidden;
}

.bmi-scale {
  height: 100%;
  background: linear-gradient(90deg, #4ade80 0%, #fbbf24 50%, #f87171 100%);
  border-radius: 0.375rem;
  transition: width 0.3s ease-in-out;
}

.scale-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #666;
}

.bmi-category {
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
  transition: all 0.3s ease-in-out;
}

/* BMI分类背景色 */
.bg-blue-100 {
  background-color: #dbeafe;
}

.text-blue-800 {
  color: #1e40af;
}

.bg-green-100 {
  background-color: #dcfce7;
}

.text-green-800 {
  color: #166534;
}

.bg-yellow-100 {
  background-color: #fef9c3;
}

.text-yellow-800 {
  color: #78350f;
}

.bg-red-100 {
  background-color: #fee2e2;
}

.text-red-800 {
  color: #991b1b;
}

.formula-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  font-size: 0.875rem;
  color: #666;
  text-align: center;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@media (min-width: 768px) {
  .input-fields {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .input-field {
    flex: 1;
    min-width: 200px;
  }

  .calculate-btn {
    flex: 1;
    min-width: 100%;
  }
}
</style>