/**
 * Base64 编解码工具
 * 支持 UTF-8 字符串与 Base64 互转
 */

/**
 * 将 UTF-8 字符串编码为 Base64
 * @param {string} text - 原始字符串
 * @returns {string} Base64 字符串
 */
export const encodeBase64 = (text) => {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

/**
 * 将 Base64 字符串解码为 UTF-8
 * @param {string} base64 - Base64 字符串
 * @returns {string} 原始字符串
 */
export const decodeBase64 = (base64) => {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new TextDecoder().decode(bytes)
}
