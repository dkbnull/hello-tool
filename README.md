<h1 align="center">
  <img src="public/favicon.svg" alt="Hello Blog" width="80" height="80">
  <br>
  Hello Tool
</h1>

<p align="center">
    <a href="https://github.com/dkbnull/hello-tool" target="_blank">
       <img src="https://img.shields.io/badge/GitHub-访问地址-blue?logo=github">
    </a>
    <a href="https://gitee.com/dkbnull/hello-tool" target="_blank">
       <img src="https://img.shields.io/badge/Gitee-访问地址-red?logo=gitee">
    </a>
    <img src="https://img.shields.io/badge/Vue-3.5.30-42b883?logo=vue.js">
    <img src="https://img.shields.io/badge/Vite-8.0.8-646cff?logo=vite">
    <img src="https://img.shields.io/badge/License-Apache%202.0-blue">
</p>

## 项目简介

Hello Tool 是一个基于 Vue 3 + Vite 构建的开发工具箱，集成多种常用开发工具，旨在提高开发效率。

## 技术栈

| 技术           | 版本      | 说明     |
|--------------|---------|--------|
| Vue          | 3.5.30  | 前端框架   |
| Vue Router   | 5.0.3   | 路由管理   |
| Vite         | 8.0.8   | 构建工具   |
| Element Plus | 2.13.6  | UI 组件库 |
| CryptoJS     | 4.2.0   | 加解密    |
| Mermaid      | 11.14.0 | UML 图表 |
| QRCode       | 1.5.4   | 二维码生成  |

## 功能特性

### ⏰ 时间工具

| 工具     | 说明                       |
|--------|--------------------------|
| 时间戳转换  | UNIX 时间戳与日期格式互转，支持秒/毫秒单位 |
| 倒计时定时器 | 自定义倒计时，支持暂停/重置           |

### 📋 JSON 工具

| 工具          | 说明                            |
|-------------|-------------------------------|
| JSON 全能转换   | 格式化/压缩/验证，JSON 转 XML/CSV/YAML |
| JSON XML 互转 | JSON 与 XML 格式相互转换             |
| JSON 引号转换   | 单引号转双引号（标准 JSON）              |
| JSON 大小写转换  | JSON 字段大小写转换                  |

### 🔒 安全工具

| 工具       | 说明                          |
|----------|-----------------------------|
| JWT 解密   | 解析 JWT 令牌，Header/Payload 展示 |
| 加解密工具    | Base64/AES/DES/3DES 加解密     |
| RSA 密钥生成 | 生成 RSA 公钥和私钥对               |
| UUID 生成器 | 批量生成 UUID/GUID              |

### 📝 文本工具

| 工具     | 说明          |
|--------|-------------|
| 文本差异对比 | 对比两段文本的差异   |
| 文本字数统计 | 统计字数、字符数、行数 |

### 🔤 编码转换

| 工具     | 说明                        |
|--------|---------------------------|
| 编码转换工具 | Unicode/中文/ASCII/URL 编码互转 |
| 命名格式转换 | 驼峰/下划线/帕斯卡/短横线互转          |
| 进制转换   | 二进制/八进制/十进制/十六进制互转        |
| 颜色转换   | HEX/RGB/HSL 颜色格式互转        |

### 🖼️ 图形工具

| 工具            | 说明                     |
|---------------|------------------------|
| 二维码生成器        | 文本转二维码，支持多种尺寸和纠错级别     |
| 图片 Base64 互转  | 图片与 Base64 编码互转        |
| 图片压缩工具        | 压缩图片，调整质量和尺寸           |
| Mermaid UML 图 | 基于 Mermaid 代码生成 UML 图表 |

### 💻 开发工具

| 工具       | 说明                     |
|----------|------------------------|
| 正则表达式测试  | 在线测试正则表达式匹配            |
| 代码格式化    | 格式化 HTML/CSS/JS/SQL 代码 |
| HTTP 状态码 | 查询 HTTP 状态码含义          |
| IP 地址查询  | 查询 IP 地址归属地信息          |

### 📄 文档工具

| 工具               | 说明                        |
|------------------|---------------------------|
| PDF 转 Word/Excel | PDF 文档转换为 Word 或 Excel 格式 |

## 架构设计

- **工具注册表**：所有工具配置集中在 `src/config/tools.js`，新增工具只需在此注册即可自动生成路由和导航
- **动态路由**：基于工具注册表自动生成路由，无需手动配置
- **Composables**：提取公共逻辑（复制、工具页面通用逻辑）为可复用的组合式函数
- **CSS 变量**：全局样式使用 CSS 变量管理主题色、间距、圆角等，确保视觉一致性
- **收藏功能**：支持工具收藏，数据持久化到 localStorage

## 许可证

Apache License 2.0

---

<p align="center">
  <a href="https://github.com/dkbnull">
    <img src="https://img.shields.io/badge/Author-null-42b883?style=flat-square">
  </a>
</p>