import {ref} from 'vue'

export function useToolPage() {
    const error = ref('')

    const clearError = () => {
        error.value = ''
    }

    return {error, clearError}
}
