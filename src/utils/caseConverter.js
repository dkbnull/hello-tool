/**
 * 命名格式转换工具
 * 提供驼峰、下划线、帕斯卡、短横线等命名格式互转
 */

/**
 * 转为驼峰命名 (camelCase)
 * @param {string} str - 输入字符串
 * @returns {string} 驼峰命名
 */
export const toCamelCase = (str) =>
  str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '').replace(/^./, s => s.toLowerCase())

/**
 * 转为下划线命名 (snake_case)
 * @param {string} str - 输入字符串
 * @returns {string} 下划线命名
 */
export const toSnakeCase = (str) =>
  str.replace(/([A-Z])/g, '_$1').replace(/[-\s]+/g, '_').toLowerCase().replace(/^_+|_+$/g, '')

/**
 * 转为帕斯卡命名 (PascalCase)
 * @param {string} str - 输入字符串
 * @returns {string} 帕斯卡命名
 */
export const toPascalCase = (str) => toCamelCase(str).replace(/^./, s => s.toUpperCase())

/**
 * 转为短横线命名 (kebab-case)
 * @param {string} str - 输入字符串
 * @returns {string} 短横线命名
 */
export const toKebabCase = (str) => toSnakeCase(str).replace(/_/g, '-')

/**
 * 按行批量转换
 * @param {string} text - 多行文本
 * @param {(str: string) => string} converter - 单行转换函数
 * @returns {string} 转换后的多行文本
 */
export const convertByLine = (text, converter) =>
  text.split('\n').map(converter).join('\n')

/**
 * 递归转换对象的所有 key
 * @param {*} obj - 输入对象
 * @param {(key: string) => string} converter - key 转换函数
 * @returns {*} 转换后的对象
 */
export const convertObjectKeys = (obj, converter) => {
  if (typeof obj !== 'object' || obj === null) return obj
  if (Array.isArray(obj)) return obj.map(item => convertObjectKeys(item, converter))
  const result = {}
  for (const key in obj) {
    result[converter(key)] = convertObjectKeys(obj[key], converter)
  }
  return result
}
