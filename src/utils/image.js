/**
 * 图片处理工具类
 * 提供图片压缩、尺寸调整等功能
 */

/**
 * 压缩图片
 * @param {string} imageUrl - 图片的Base64或URL
 * @param {object} options - 压缩选项
 * @param {number} options.quality - 压缩质量 (0-100)
 * @param {string|object} options.size - 尺寸调整选项 'original'|'50'|'75'|{width, height}
 * @returns {Promise<object>} 压缩后的图片信息
 */
export const compressImage = (imageUrl, options = {}) => {
    return new Promise((resolve, reject) => {
        const {quality = 80, size = 'original'} = options;

        const img = new Image();
        img.onload = () => {
            // 计算压缩后的尺寸
            let width, height;
            if (size === 'original') {
                width = img.width;
                height = img.height;
            } else if (size === '50') {
                width = img.width * 0.5;
                height = img.height * 0.5;
            } else if (size === '75') {
                width = img.width * 0.75;
                height = img.height * 0.75;
            } else if (typeof size === 'object' && size.width && size.height) {
                width = size.width;
                height = size.height;
            } else {
                width = img.width;
                height = img.height;
            }

            // 创建画布并绘制压缩后的图片
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // 将画布转换为Base64
            canvas.toBlob((blob) => {
                if (blob) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        resolve({
                            url: e.target.result,
                            width: width,
                            height: height,
                            size: blob.size
                        });
                    };
                    reader.onerror = () => {
                        reject(new Error('文件读取失败'));
                    };
                    reader.readAsDataURL(blob);
                } else {
                    reject(new Error('图片压缩失败'));
                }
            }, 'image/jpeg', quality / 100);
        };
        img.onerror = () => {
            reject(new Error('图片加载失败'));
        };
        img.src = imageUrl;
    });
};

/**
 * 格式化文件大小
 * @param {number} bytes - 文件大小（字节）
 * @returns {string} 格式化后的文件大小
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 计算压缩率
 * @param {number} originalSize - 原始文件大小（字节）
 * @param {number} compressedSize - 压缩后文件大小（字节）
 * @returns {number} 压缩率（百分比）
 */
export const calculateCompressionRatio = (originalSize, compressedSize) => {
    if (!originalSize || originalSize <= 0) return 0;
    return ((1 - compressedSize / originalSize) * 100);
};

/**
 * 将Base64转换为Blob
 * @param {string} base64 - Base64字符串
 * @returns {Blob} Blob对象
 */
export const base64ToBlob = (base64) => {
    const parts = base64.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; i++) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
};

/**
 * 下载图片
 * @param {string} imageUrl - 图片的Base64或URL
 * @param {string} filename - 文件名
 */
export const downloadImage = (imageUrl, filename = 'image.jpg') => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    link.click();
};