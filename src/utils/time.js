/**
 * 获取当前时间信息（北京时间，UTC+8）
 * @returns {Object} - 包含当前时间、时间戳（秒）、时间戳（毫秒）的对象
 */
export const getCurrentTimeInfo = () => {
    const now = new Date();
    // 转换为北京时间（UTC+8）
    const beijingTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    return {
        currentTime: beijingTime.toISOString().replace('T', ' ').replace('Z', ''),
        currentTimestamp: Math.floor(now.getTime() / 1000).toString(),
        currentTimestampMs: now.getTime().toString()
    };
};

/**
 * 时间戳转日期时间（北京时间，UTC+8）
 * @param {string} timestamp - 时间戳（秒或毫秒）
 * @returns {Object} - 包含转换结果和错误信息的对象
 */
export const timestampToDateTime = (timestamp) => {
    if (!timestamp) {
        return {dateTime: '', error: ''};
    }

    const ts = timestamp.trim();
    // 检查是否为数字
    if (!/^\d+$/.test(ts)) {
        return {dateTime: '', error: '无效的时间戳格式'};
    }

    let timestampNum = parseInt(ts);
    // 判断是秒还是毫秒
    if (ts.length === 10) {
        // 秒
        timestampNum *= 1000;
    } else if (ts.length !== 13) {
        return {dateTime: '', error: '时间戳格式错误（应为10位秒或13位毫秒）'};
    }

    // 转换为北京时间（UTC+8）
    const date = new Date(timestampNum + 8 * 60 * 60 * 1000);
    if (!isNaN(date.getTime())) {
        return {dateTime: date.toISOString().replace('T', ' ').replace('Z', ''), error: ''};
    } else {
        return {dateTime: '', error: '无效的时间戳'};
    }
};

/**
 * 日期时间转时间戳（北京时间，UTC+8）
 * @param {string} dateTime - 日期时间字符串
 * @returns {Object} - 包含转换结果和错误信息的对象
 */
export const dateTimeToTimestamp = (dateTime) => {
    if (!dateTime) {
        return {timestamp: '', error: ''};
    }

    // 解析为本地时间
    const date = new Date(dateTime);
    if (!isNaN(date.getTime())) {
        // 转换为时间戳（秒）
        const timestamp = Math.floor(date.getTime() / 1000);
        return {timestamp: timestamp.toString(), error: ''};
    } else {
        return {timestamp: '', error: '无效的日期格式'};
    }
};