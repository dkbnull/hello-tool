/**
 * HTTP请求工具类
 */
export class HttpService {
    /**
     * 发送POST请求
     * @param {string} url - 请求URL
     * @param {FormData|object} data - 请求数据
     * @returns {Promise<any>} 响应数据
     */
    static async post(url, data) {
        const response = await fetch('/api' + url, {
            method: 'POST',
            body: data
        });

        if (!response.ok) {
            throw new Error(`请求失败: ${response.statusText}`);
        }

        return await response.json();
    }

    /**
     * 下载文件
     * @param {string} url - 文件URL
     * @returns {Promise<Blob>} 文件Blob
     */
    static async download(url) {
        const response = await fetch('/api' + url);

        if (!response.ok) {
            throw new Error('下载失败');
        }

        return await response.blob();
    }
}