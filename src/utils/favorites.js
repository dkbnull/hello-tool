/**
 * 收藏管理工具类
 * 用于管理浏览器缓存中的收藏工具
 */

class FavoritesManager {
    constructor() {
        this.storageKey = 'tool_favorites';
        this.favorites = this.loadFavorites();
    }

    /**
     * 从localStorage加载收藏列表
     */
    loadFavorites() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('加载收藏列表失败:', error);
            return [];
        }
    }

    /**
     * 保存收藏列表到localStorage
     */
    saveFavorites() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
        } catch (error) {
            console.error('保存收藏列表失败:', error);
        }
    }

    /**
     * 添加工具到收藏
     * @param {Object} tool - 工具对象
     */
    addFavorite(tool) {
        if (!this.isFavorite(tool.to)) {
            this.favorites.push({
                ...tool,
                addedAt: new Date().toISOString()
            });
            this.saveFavorites();
            return true;
        }
        return false;
    }

    /**
     * 从收藏中移除工具
     * @param {string} toolPath - 工具路径
     */
    removeFavorite(toolPath) {
        const index = this.favorites.findIndex(fav => fav.to === toolPath);
        if (index !== -1) {
            this.favorites.splice(index, 1);
            this.saveFavorites();
            return true;
        }
        return false;
    }

    /**
     * 检查工具是否已收藏
     * @param {string} toolPath - 工具路径
     */
    isFavorite(toolPath) {
        return this.favorites.some(fav => fav.to === toolPath);
    }

    /**
     * 获取所有收藏的工具
     */
    getFavorites() {
        return [...this.favorites];
    }

    /**
     * 清空所有收藏
     */
    clearFavorites() {
        this.favorites = [];
        this.saveFavorites();
    }

    /**
     * 获取收藏数量
     */
    getFavoriteCount() {
        return this.favorites.length;
    }
}

// 创建单例实例
export const favoritesManager = new FavoritesManager();