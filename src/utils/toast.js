/**
 * 显示toast提示
 * @param {Object} options - 配置选项
 * @param {string} options.message - 提示消息
 * @param {number} [options.duration=3000] - 显示时长（毫秒）
 * @returns {Object} - toast实例
 */
import { TOAST_DURATION } from '@/config/constants.js'

const FADE_DURATION = 300

export const showToast = (options) => {
  const { message, duration = TOAST_DURATION } = options

  const toast = document.createElement('div')
  toast.className = 'toast'
  toast.textContent = message
  document.body.appendChild(toast)

  const remove = () => {
    toast.classList.add('toast-leaving')
    setTimeout(() => {
      if (toast.parentNode) document.body.removeChild(toast)
    }, FADE_DURATION)
  }

  const timer = setTimeout(remove, duration)

  return {
    close: () => {
      clearTimeout(timer)
      remove()
    }
  }
}
