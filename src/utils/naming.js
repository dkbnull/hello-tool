/**
 * 转换为驼峰命名
 * @param {string} str - 输入字符串
 * @returns {string} - 驼峰命名的字符串
 */
export const toCamelCase = (str) => {
  return str
      .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
      .replace(/^./, str => str.toLowerCase())
};

/**
 * 转换为下划线命名
 * @param {string} str - 输入字符串
 * @returns {string} - 下划线命名的字符串
 */
export const toSnakeCase = (str) => {
  return str
      .replace(/([A-Z])/g, '_$1')
      .replace(/[-\s]+/g, '_')
      .toLowerCase()
      .replace(/^_+|_+$/g, '')
};

/**
 * 转换为帕斯卡命名（大驼峰）
 * @param {string} str - 输入字符串
 * @returns {string} - 帕斯卡命名的字符串
 */
export const toPascalCase = (str) => {
  const camelCase = toCamelCase(str);
  return camelCase.replace(/^./, str => str.toUpperCase());
};

/**
 * 转换为短横线命名
 * @param {string} str - 输入字符串
 * @returns {string} - 短横线命名的字符串
 */
export const toKebabCase = (str) => {
  return str
      .replace(/([A-Z])/g, '-$1')
      .replace(/[-_\s]+/g, '-')
      .toLowerCase()
      .replace(/^-+|-+$/g, '')
};