import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import {fileURLToPath, URL} from 'node:url'
import VueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import vitePluginSeoAnalytics from './plugins/vite-plugin-seo-analytics'

const SITE_URL = 'https://tool.wbnull.cn'
const SITE_NAME = 'Hello Tool'

export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd())

    return {
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        plugins: [
            vue(),
            VueDevTools(),
            AutoImport({
                imports: ['vue', 'vue-router', 'pinia'],
                resolvers: [ElementPlusResolver()],
                dts: 'src/auto-imports.d.ts'
            }),
            Components({
                resolvers: [ElementPlusResolver()],
                dts: 'src/components.d.ts'
            }),
            vitePluginSeoAnalytics({
                siteName: SITE_NAME,
                siteUrl: SITE_URL,
                siteDesc: '开发工具箱，集成时间戳转换、JSON处理、加解密、编码转换、正则测试等多种常用开发工具，提高开发效率',
                keywords: '开发工具,在线工具,工具箱,JSON格式化,时间戳转换,Base64,加密解密,正则表达式,UUID生成,二维码',
                ogImage: `${SITE_URL}/favicon.svg`,
                baId: env.VITE_BA_ID || ''
            })
        ],
        server: {
            proxy: {
                '/api': {
                    target: 'http://127.0.0.1:8000',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, '')
                }
            }
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes('element-plus') || id.includes('@element-plus/icons-vue')) {
                            return 'element-plus'
                        }
                        if (id.includes('crypto-js')) {
                            return 'crypto'
                        }
                        if (id.includes('mermaid')) {
                            return 'mermaid'
                        }
                        if (id.includes('qrcode') || id.includes('jsqr')) {
                            return 'qrcode'
                        }
                    }
                }
            }
        }
    }
})
