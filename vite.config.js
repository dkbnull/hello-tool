import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginSeoAnalytics from './plugins/vite-plugin-seo-analytics'

export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd())

    return {
        plugins: [
            vue(),
            vitePluginSeoAnalytics({
                siteName: 'Hello Tool',
                siteUrl: 'https://tool.wbnull.cn',
                siteDesc: '开发工具箱，集成时间戳转换、JSON处理、加解密、编码转换、正则测试等多种常用开发工具，提高开发效率',
                keywords: '开发工具,在线工具,工具箱,JSON格式化,时间戳转换,Base64,加密解密,正则表达式,UUID生成,二维码',
                ogImage: 'https://tool.wbnull.cn/favicon.svg',
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
        }
    }
})
