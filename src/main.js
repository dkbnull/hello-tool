import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import seoAnalytics from './plugins/seoAnalytics.js'

createApp(App)
    .use(router)
    .use(seoAnalytics, {router, siteUrl: 'https://tool.wbnull.cn'})
    .use(ElementPlus)
    .mount('#app')
