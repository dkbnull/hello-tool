import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import {getToolRoutes} from '../config/tools'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            title: 'Hello Tool - 开发工具箱',
            description: 'Hello Tool - 开发工具箱，集成时间戳转换、JSON处理、加解密、编码转换、正则测试等多种常用开发工具，提高开发效率',
            keywords: '开发工具,在线工具,工具箱,JSON格式化,时间戳转换,Base64,加密解密,正则表达式',
        },
    },
    {
        path: '/about',
        name: 'About',
        component: About,
        meta: {
            title: '关于 - Hello Tool',
            description: '关于 Hello Tool - 开发工具箱，集成多种常用开发工具，提高开发效率',
            keywords: '关于,Hello Tool,开发工具箱,友链',
        },
    },
    ...getToolRoutes()
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return {top: 0}
    }
})

export default router
