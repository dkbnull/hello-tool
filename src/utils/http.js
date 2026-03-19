/**
 * HTTP请求工具类
 */
export class HttpService {
    /**
     * 基础API路径
     * @private
     */
    static BASE_URL = '/api';

    /**
     * CSRF token 缓存
     * @private
     */
    static _csrfToken = null;

    /**
     * 获取CSRF token
     * @returns {Promise<string>} CSRF token
     */
    static async getCsrfToken() {
        // 如果已有缓存的token，直接返回
        if (this._csrfToken) {
            return this._csrfToken;
        }

        try {
            // 如果没有，尝试从服务端获取
            const response = await fetch(`${this.BASE_URL}/auth/csrf-token`);
            if (!response.ok) {
                throw new Error('获取CSRF token失败');
            }

            // 解析响应体获取token
            const responseData = await response.json();
            if (responseData.csrf_token) {
                this._csrfToken = responseData.csrf_token;
                return responseData.csrf_token;
            }

            throw new Error('未找到CSRF token');
        } catch (error) {
            console.error('获取CSRF token失败:', error);
            return '';
        }
    }

    /**
     * 通用请求方法
     * @param {string} url - 请求URL
     * @param {object} options - 请求选项
     * @returns {Promise<Response>} 响应对象
     * @private
     */
    static async request(url, options = {}) {
        const headers = {...options.headers} || {}

        // 如果不是FormData，添加Content-Type
        if (!(options.body instanceof FormData) && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }

        // 添加CSRF token
        const csrfToken = await this.getCsrfToken();
        if (csrfToken) {
            headers['X-CSRF-Token'] = csrfToken;
        }

        const response = await fetch(`${this.BASE_URL}${url}`, {
            ...options,
            headers
        });

        if (!response.ok) {
            throw new Error(`请求失败: ${response.statusText}`);
        }

        return response;
    }

    /**
     * 发送POST请求
     * @param {string} url - 请求URL
     * @param {FormData|object} data - 请求数据
     * @returns {Promise<any>} 响应数据
     */
    static async post(url, data) {
        const response = await this.request(url, {
            method: 'POST',
            body: data
        });

        return await response.json();
    }

    /**
     * 下载文件
     * @param {string} url - 文件URL
     * @returns {Promise<Blob>} 文件Blob
     */
    static async download(url) {
        const response = await this.request(url, {
            method: 'GET'
        });

        return await response.blob();
    }
}