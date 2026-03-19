/**
 * 下载工具类
 */
export class DownloadService {
    /**
     * 格式到扩展名的映射
     * @private
     */
    static FORMAT_EXTENSIONS = {
        word: 'docx',
        excel: 'xlsx'
    };

    /**
     * 下载文件
     * @param {Blob} blob - 文件Blob对象
     * @param {string} filename - 文件名
     */
    static downloadFile(blob, filename) {
        // 创建Blob URL
        const url = URL.createObjectURL(blob);

        // 创建a标签进行下载
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 释放Blob URL
        URL.revokeObjectURL(url);
    }

    /**
     * 生成下载文件名
     * @param {File} originalFile - 原始文件
     * @param {string} format - 目标格式
     * @returns {string} 下载文件名
     */
    static generateFilename(originalFile, format) {
        const extension = this.FORMAT_EXTENSIONS[format] || 'pdf';

        if (!originalFile) {
            return `converted.${extension}`;
        }

        // 获取原始文件名（不包含扩展名）
        const originalFilename = originalFile.name.replace(/\.pdf$/i, '');
        // 添加新的扩展名
        return `${originalFilename}.${extension}`;
    }
}