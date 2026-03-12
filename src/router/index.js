import {createRouter, createWebHistory} from 'vue-router'

// 导入工具页面
import Home from '../views/Home.vue'
import TimestampConverter from '../views/tools/TimestampConverter.vue'
import JwtDecoder from '../views/tools/JwtDecoder.vue'
import JsonAllConverter from "../views/tools/JsonAllConverter.vue";
import JsonXmlConverter from '../views/tools/JsonXmlConverter.vue'
import JsonQuoteConverter from '../views/tools/JsonQuoteConverter.vue'
import JsonCaseConverter from '../views/tools/JsonCaseConverter.vue'
import NamingConverter from '../views/tools/NamingConverter.vue'
import RsaKeyGenerator from '../views/tools/RsaKeyGenerator.vue'
import BmiCalculator from "../views/tools/BmiCalculator.vue";
import CryptoTool from '../views/tools/CryptoTool.vue';
import QrCodeGenerator from '../views/tools/QrCodeGenerator.vue';
import ImageTool from '../views/tools/ImageTool.vue';

// 创建路由
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/timestamp',
            name: 'TimestampConverter',
            component: TimestampConverter
        },
        {
            path: '/jwt',
            name: 'JwtDecoder',
            component: JwtDecoder
        },
        {
            path: '/json-all',
            name: 'JsonAllConverter',
            component: JsonAllConverter
        },
        {
            path: '/json-xml',
            name: 'JsonXmlConverter',
            component: JsonXmlConverter
        },
        {
            path: '/json-quote',
            name: 'JsonQuoteConverter',
            component: JsonQuoteConverter
        },
        {
            path: '/json-case',
            name: 'JsonCaseConverter',
            component: JsonCaseConverter
        },
        {
            path: '/naming',
            name: 'NamingConverter',
            component: NamingConverter
        },
        {
            path: '/rsa',
            name: 'RsaKeyGenerator',
            component: RsaKeyGenerator
        },
        {
            path: '/bmi',
            name: 'BmiCalculator',
            component: BmiCalculator
        },
        {
            path: '/crypto',
            name: 'CryptoTool',
            component: CryptoTool
        },
        {
            path: '/qrcode',
            name: 'QrCodeGenerator',
            component: QrCodeGenerator
        },
        {
            path: '/image',
            name: 'ImageTool',
            component: ImageTool
        }
    ]
})

export default router