import {createRouter, createWebHistory} from 'vue-router'
import {getToolRoutes} from '@/config/tools'

const routes = [
    {
        path: '/',
        component: () => import('@/layouts/DefaultLayout.vue'),
        children: [
            {
                path: '',
                name: 'Home',
                component: () => import('@/views/Home.vue'),
                meta: {
                    title: 'Hello Tool - 开发工具箱',
                    description: 'Hello Tool - 开发工具箱，集成时间戳转换、JSON处理、加解密、编码转换、正则测试等多种常用开发工具，提高开发效率',
                    keywords: '开发工具,在线工具,工具箱,JSON格式化,时间戳转换,Base64,加密解密,正则表达式',
                },
            },
            {
                path: 'about',
                name: 'About',
                component: () => import('@/views/About.vue'),
                meta: {
                    title: '关于 - Hello Tool',
                    description: '关于 Hello Tool - 开发工具箱，集成多种常用开发工具，提高开发效率',
                    keywords: '关于,Hello Tool,开发工具箱,友链',
                },
            },
            ...getToolRoutes(),
            {
                path: '/:pathMatch(.*)*',
                name: 'NotFound',
                component: () => import('@/views/NotFound.vue'),
                meta: {
                    title: '页面未找到 - Hello Tool',
                },
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return {top: 0}
    }
})

const DEFAULT_TITLE = 'Hello Tool - 开发工具箱'

router.beforeEach((to) => {
    const title = to.meta?.title
    document.title = title ? (title.includes('Hello Tool') ? title : `${title} - Hello Tool`) : DEFAULT_TITLE
})

export default router
