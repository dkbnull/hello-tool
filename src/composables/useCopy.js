import {copyToClipboard} from '../utils/clipboard'
import {showToast} from '../utils/toast'

export function useCopy() {
    const handleCopy = async (text) => {
        if (!text) return
        const success = await copyToClipboard(text)
        showToast({message: success ? '已复制到剪贴板' : '复制失败'})
    }

    return {handleCopy}
}
