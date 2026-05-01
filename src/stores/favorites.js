import {defineStore} from 'pinia'
import {ref, computed} from 'vue'
import {STORAGE_KEYS} from '@/config/constants.js'

const STORAGE_KEY = STORAGE_KEYS.FAVORITES

function loadFavorites() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : []
    } catch {
        return []
    }
}

function saveFavorites(list) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    } catch {
    }
}

export const useFavoritesStore = defineStore('favorites', () => {
    const favorites = ref(loadFavorites())

    const favoriteCount = computed(() => favorites.value.length)

    function isFavorite(toolPath) {
        return favorites.value.some(fav => fav.to === toolPath)
    }

    function addFavorite(tool) {
        if (!isFavorite(tool.to)) {
            favorites.value.push({
                ...tool,
                addedAt: new Date().toISOString()
            })
            saveFavorites(favorites.value)
        }
    }

    function removeFavorite(toolPath) {
        const index = favorites.value.findIndex(fav => fav.to === toolPath)
        if (index !== -1) {
            favorites.value.splice(index, 1)
            saveFavorites(favorites.value)
        }
    }

    function clearFavorites() {
        favorites.value = []
        saveFavorites(favorites.value)
    }

    return {
        favorites,
        favoriteCount,
        isFavorite,
        addFavorite,
        removeFavorite,
        clearFavorites
    }
})
