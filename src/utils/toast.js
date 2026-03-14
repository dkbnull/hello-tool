/**
 * 显示toast提示
 * @param {Object} options - 配置选项
 * @param {string} options.message - 提示消息
 * @param {number} [options.duration=3000] - 显示时长（毫秒）
 * @returns {Object} - toast实例
 */
export const showToast = (options) => {
    const {
        message,
        duration = 3000
    } = options;

    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    // 添加样式
    Object.assign(toast.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#35495e',
        color: 'white',
        padding: '1rem 2rem',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        zIndex: '1000',
        animation: 'fadeIn 0.3s ease-out'
    });

    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
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
  `;
    document.head.appendChild(style);

    // 添加到文档
    document.body.appendChild(toast);

    // 定时移除
    const timer = setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(toast);
            document.head.removeChild(style);
        }, 300);
    }, duration);

    return {
        close: () => {
            clearTimeout(timer);
            toast.style.animation = 'fadeOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(toast);
                document.head.removeChild(style);
            }, 300);
        }
    };
};