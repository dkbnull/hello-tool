<h1 align="center">
  <img src="public/favicon.svg" alt="Hello Tool" width="80" height="80">
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

Hello Tool 是一个基于 Vue 3 + Vite 构建的在线开发工具箱，集成多种常用开发工具，旨在提高开发效率。

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

## 技术栈

| 技术                      | 版本      | 说明           |
|-------------------------|---------|--------------|
| Vue                     | 3.5.30  | 前端框架         |
| Vue Router              | 5.0.3   | 路由管理         |
| Pinia                   | 3.0.4   | 状态管理         |
| Vite                    | 8.0.8   | 构建工具         |
| Element Plus            | 2.13.6  | UI 组件库       |
| CryptoJS                | 4.2.0   | 加解密          |
| Mermaid                 | 11.14.0 | UML 图表       |
| QRCode                  | 1.5.4   | 二维码生成        |
| jsQR                    | 1.4.0   | 二维码解析        |
| sql-formatter           | 15.7.3  | SQL 格式化      |
| vkbeautify              | 0.99.3  | XML/JSON 格式化 |
| Axios                   | 1.15.2  | HTTP 请求      |
| unplugin-auto-import    | 21.0.0  | 自动导入         |
| unplugin-vue-components | 32.0.0  | 组件自动注册       |

## 项目结构

```
hello-tool/
├── plugins/                    # Vite 插件
│   └── vite-plugin-seo-analytics.js
├── public/                     # 静态资源
│   └── favicon.svg
├── src/
│   ├── assets/                 # 资源文件
│   ├── components/             # 公共组件
│   │   ├── Footer.vue
│   │   ├── Header.vue
│   │   ├── Sidebar.vue
│   │   └── ToolCard.vue
│   ├── composables/            # 组合式函数
│   │   ├── useCopy.js          # 复制功能
│   │   └── useToolPage.js      # 工具页面通用逻辑
│   ├── config/                 # 配置文件
│   │   ├── constants.js        # 常量配置
│   │   └── tools.js            # 工具注册表
│   ├── layouts/                # 布局组件
│   │   └── DefaultLayout.vue
│   ├── plugins/                # 应用插件
│   │   └── seoAnalytics.js     # SEO 分析插件
│   ├── router/                 # 路由配置
│   │   └── index.js
│   ├── stores/                 # Pinia 状态管理
│   │   └── favorites.js        # 收藏状态
│   ├── utils/                  # 工具函数
│   │   ├── clipboard.js
│   │   ├── download.js
│   │   ├── http.js
│   │   ├── image.js
│   │   ├── time.js
│   │   └── toast.js
│   ├── views/                  # 页面视图
│   │   ├── dev/                # 开发工具页面
│   │   ├── document/           # 文档工具页面
│   │   ├── encode/             # 编码转换页面
│   │   ├── image/              # 图形工具页面
│   │   ├── json/               # JSON 工具页面
│   │   ├── security/           # 安全工具页面
│   │   ├── text/               # 文本工具页面
│   │   ├── time/               # 时间工具页面
│   │   ├── About.vue
│   │   ├── Home.vue
│   │   └── NotFound.vue
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── .env                        # 环境变量
├── index.html                  # 入口 HTML
├── package.json
└── vite.config.js              # Vite 配置
```

## 架构设计

- **工具注册表**：所有工具配置集中在 `src/config/tools.js`，新增工具只需在此注册即可自动生成路由和导航
- **动态路由**：基于工具注册表自动生成路由，无需手动配置
- **Composables**：提取公共逻辑（复制、工具页面通用逻辑）为可复用的组合式函数
- **CSS 变量**：全局样式使用 CSS 变量管理主题色、间距、圆角等，确保视觉一致性
- **收藏功能**：支持工具收藏，数据持久化到 localStorage
- **SEO 优化**：自定义 Vite 插件自动注入 SEO 元信息（标题、描述、关键词、Open Graph）
- **代码分割**：Vite 构建时按依赖大小手动分包（element-plus、crypto-js、mermaid、qrcode），优化加载性能
- **自动导入**：通过 unplugin-auto-import 和 unplugin-vue-components 实现 Vue API 和 Element Plus 组件的自动导入

## 新增工具

在 `src/config/tools.js` 中添加工具配置，然后在 `src/views/` 对应分类目录下创建 Vue 组件即可：

路由和导航将自动生成，无需额外配置。

## 许可证

Apache License 2.0

---

<p align="center">
  <a href="https://github.com/dkbnull">
    <img src="https://img.shields.io/badge/Author-null-42b883?style=flat-square">
  </a>
</p>