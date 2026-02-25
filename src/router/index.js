import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import TimestampConverter from '../views/tools/TimestampConverter.vue'
import JwtDecoder from '../views/tools/JwtDecoder.vue'
import RsaGenerator from '../views/tools/RsaGenerator.vue'

const routes = [
    {path: '/', component: Home},
    {path: '/timestamp', component: TimestampConverter},
    {path: '/jwt', component: JwtDecoder},
    {path: '/rsa', component: RsaGenerator}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
