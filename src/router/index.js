import { createRouter, createWebHistory } from 'vue-router'
import { getToolRoutes } from '@/config/tools'

// 保存首页滚动位置，用于返回首页时恢复
let homeScrollPosition = 0

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
  scrollBehavior(to, from, savedPosition) {
    // 返回首页时，恢复之前的滚动位置
    if (to.name === 'Home' && from.name) {
      // 浏览器前进/后退时使用浏览器保存的位置
      if (savedPosition) {
        return savedPosition
      }
      // 点击logo等导航回首页时，使用手动保存的位置
      if (homeScrollPosition > 0) {
        return { top: homeScrollPosition }
      }
    }
    return { top: 0 }
  }
})

const DEFAULT_TITLE = 'Hello Tool - 开发工具箱'

router.beforeEach((to, from) => {
  // 离开首页时保存滚动位置
  if (from.name === 'Home') {
    homeScrollPosition = window.scrollY
  }

  const title = to.meta?.title
  document.title = title ? (title.includes('Hello Tool') ? title : `${title} - Hello Tool`) : DEFAULT_TITLE
})

export default router
