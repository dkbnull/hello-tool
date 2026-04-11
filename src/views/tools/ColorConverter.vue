<template>
  <div class="tool-container">
    <h2>颜色转换器</h2>

    <div class="converter">
      <div class="input-group">
        <h3>HEX颜色</h3>
        <div class="color-input-row">
          <input type="text" v-model="hex" placeholder="#42b883" @input="hexToRgb"/>
          <input type="color" v-model="colorPicker" @input="pickerToHex" class="color-picker"/>
        </div>
      </div>
      <div class="arrow">⇄</div>
      <div class="input-group">
        <h3>RGB颜色</h3>
        <div class="rgb-inputs">
          <div class="rgb-input-group">
            <label class="rgb-label">R</label>
            <input type="number" v-model.number="r" min="0" max="255" @input="rgbToHex"/>
          </div>
          <div class="rgb-input-group">
            <label class="rgb-label">G</label>
            <input type="number" v-model.number="g" min="0" max="255" @input="rgbToHex"/>
          </div>
          <div class="rgb-input-group">
            <label class="rgb-label">B</label>
            <input type="number" v-model.number="b" min="0" max="255" @input="rgbToHex"/>
          </div>
        </div>
      </div>
    </div>

    <div class="preview section-card">
      <h3>颜色预览</h3>
      <div class="color-preview" :style="{backgroundColor: validHex}"></div>
      <div class="color-values">
        <div class="color-value-item">
          <span>HEX:</span>
          <span class="mono">{{ validHex }}</span>
          <button @click="handleCopy(validHex)" class="btn btn-copy btn-sm">复制</button>
        </div>
        <div class="color-value-item">
          <span>RGB:</span>
          <span class="mono">rgb({{ r }}, {{ g }}, {{ b }})</span>
          <button @click="handleCopy(`rgb(${r}, ${g}, ${b})`)" class="btn btn-copy btn-sm">复制</button>
        </div>
        <div class="color-value-item">
          <span>HSL:</span>
          <span class="mono">{{ hslValue }}</span>
          <button @click="handleCopy(hslValue)" class="btn btn-copy btn-sm">复制</button>
        </div>
      </div>
    </div>

    <div class="presets section-card">
      <h3>常用颜色</h3>
      <div class="preset-colors">
        <div
            v-for="color in presetColors"
            :key="color.hex"
            class="preset-color"
            :style="{backgroundColor: color.hex}"
            :title="color.name + ' ' + color.hex"
            @click="applyPreset(color.hex)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import {useCopy} from '../../composables/useCopy'

const {handleCopy} = useCopy()

const hex = ref('#42b883')
const r = ref(66)
const g = ref(184)
const b = ref(131)
const colorPicker = ref('#42b883')

const presetColors = [
  {name: '红色', hex: '#e53e3e'},
  {name: '橙色', hex: '#ed8936'},
  {name: '黄色', hex: '#ecc94b'},
  {name: '绿色', hex: '#48bb78'},
  {name: '青色', hex: '#38b2ac'},
  {name: '蓝色', hex: '#4299e1'},
  {name: '紫色', hex: '#9f7aea'},
  {name: '粉色', hex: '#ed64a6'},
  {name: '黑色', hex: '#1a202c'},
  {name: '灰色', hex: '#a0aec0'},
  {name: '白色', hex: '#ffffff'},
]

const validHex = computed(() => {
  const h = hex.value
  if (/^#[0-9a-fA-F]{6}$/.test(h)) return h
  if (/^#[0-9a-fA-F]{3}$/.test(h)) {
    return '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3]
  }
  return '#000000'
})

const hslValue = computed(() => {
  const rNorm = r.value / 255
  const gNorm = g.value / 255
  const bNorm = b.value / 255
  const max = Math.max(rNorm, gNorm, bNorm)
  const min = Math.min(rNorm, gNorm, bNorm)
  const l = (max + min) / 2
  let h = 0, s = 0

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6;
        break
      case gNorm:
        h = ((bNorm - rNorm) / d + 2) / 6;
        break
      case bNorm:
        h = ((rNorm - gNorm) / d + 4) / 6;
        break
    }
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
})

const hexToRgb = () => {
  let h = hex.value.replace('#', '')
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  if (h.length === 6) {
    r.value = parseInt(h.substring(0, 2), 16)
    g.value = parseInt(h.substring(2, 4), 16)
    b.value = parseInt(h.substring(4, 6), 16)
    colorPicker.value = '#' + h
  }
}

const rgbToHex = () => {
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)))
  const toHex = (v) => clamp(v).toString(16).padStart(2, '0')
  hex.value = '#' + toHex(r.value) + toHex(g.value) + toHex(b.value)
  colorPicker.value = hex.value
}

const pickerToHex = () => {
  hex.value = colorPicker.value
  hexToRgb()
}

const applyPreset = (colorHex) => {
  hex.value = colorHex
  colorPicker.value = colorHex
  hexToRgb()
}
</script>

<style scoped>
.tool-container {
  max-width: 800px;
}

.color-input-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.color-input-row input[type="text"] {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 1rem;
}

.color-input-row input[type="text"]:focus {
  border-color: var(--color-info);
  outline: none;
}

.color-picker {
  width: 50px;
  height: 42px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  padding: 2px;
}

.rgb-inputs {
  display: flex;
  gap: 1rem;
}

.rgb-input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rgb-label {
  color: var(--color-text-secondary);
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.rgb-input-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 1rem;
  text-align: center;
}

.rgb-input-group input:focus {
  border-color: var(--color-info);
  outline: none;
}

.preview h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--color-primary);
}

.color-preview {
  width: 100%;
  height: 120px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  margin-bottom: 1.5rem;
}

.color-values {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.color-value-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
}

.color-value-item > span:first-child {
  font-weight: bold;
  min-width: 40px;
  color: var(--color-text-secondary);
}

.mono {
  font-family: 'Consolas', 'Monaco', monospace;
  flex: 1;
}

.presets h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--color-primary);
}

.preset-colors {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.preset-color {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  border: 2px solid var(--color-border);
  transition: transform 0.2s, border-color 0.2s;
}

.preset-color:hover {
  transform: scale(1.15);
  border-color: var(--color-primary);
}

@media (max-width: 480px) {
  .rgb-inputs {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
