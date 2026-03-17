import {createRouter, createWebHistory} from 'vue-router'

// 导入工具页面
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import TimestampConverter from '../views/tools/TimestampConverter.vue'
import CountdownTimer from "../views/tools/CountdownTimer.vue";
import JsonAllConverter from "../views/tools/JsonAllConverter.vue";
import JsonXmlConverter from '../views/tools/JsonXmlConverter.vue'
import JsonQuoteConverter from '../views/tools/JsonQuoteConverter.vue'
import JsonCaseConverter from '../views/tools/JsonCaseConverter.vue'
import JwtDecoder from '../views/tools/JwtDecoder.vue'
import CryptoTool from '../views/tools/CryptoTool.vue';
import RsaKeyGenerator from '../views/tools/RsaKeyGenerator.vue'
import EncodingConverter from '../views/tools/EncodingConverter.vue';
import NamingConverter from '../views/tools/NamingConverter.vue'
import QrCodeGenerator from '../views/tools/QrCodeGenerator.vue';
import ImageTool from '../views/tools/ImageTool.vue';
import MermaidGenerator from "../views/tools/MermaidGenerator.vue";
import PdfConverter from "../views/tools/PdfConverter.vue";
import BmiCalculator from "../views/tools/BmiCalculator.vue";
import ReactionTest from "../views/tools/ReactionTest.vue";

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
            path: '/about',
            name: 'About',
            component: About
        },
        {
            path: '/timestamp',
            name: 'TimestampConverter',
            component: TimestampConverter
        },
        {
            path: '/countdown',
            name: 'CountdownTimer',
            component: CountdownTimer
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
            path: '/jwt',
            name: 'JwtDecoder',
            component: JwtDecoder
        },
        {
            path: '/crypto',
            name: 'CryptoTool',
            component: CryptoTool
        },
        {
            path: '/rsa',
            name: 'RsaKeyGenerator',
            component: RsaKeyGenerator
        },
        {
            path: '/encoding',
            name: 'EncodingConverter',
            component: EncodingConverter
        },
        {
            path: '/naming',
            name: 'NamingConverter',
            component: NamingConverter
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
        },
        {
            path: '/mermaid',
            name: 'MermaidGenerator',
            component: MermaidGenerator
        },
        {
            path: '/pdf-converter',
            name: 'PdfConverter',
            component: PdfConverter
        },
        {
            path: '/bmi',
            name: 'BmiCalculator',
            component: BmiCalculator
        },
        {
            path: '/reaction',
            name: 'ReactionTest',
            component: ReactionTest
        }
    ]
})

export default router