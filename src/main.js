import {createApp} from 'vue'
import {createPinia} from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import seoAnalytics from './plugins/seoAnalytics.js'
import {SITE_URL} from './config/constants.js'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(seoAnalytics, {router, siteUrl: SITE_URL})
app.use(ElementPlus)
app.mount('#app')
