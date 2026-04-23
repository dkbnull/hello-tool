const categories = [
    {id: 'time', name: '时间工具', icon: '⏰'},
    {id: 'json', name: 'JSON工具', icon: '📋'},
    {id: 'security', name: '安全工具', icon: '🔒'},
    {id: 'text', name: '文本工具', icon: '📝'},
    {id: 'encode', name: '编码转换', icon: '🔤'},
    {id: 'image', name: '图形工具', icon: '🖼️'},
    {id: 'dev', name: '开发工具', icon: '💻'},
    {id: 'document', name: '文档工具', icon: '📄'},
]

const tools = [
    {
        path: '/timestamp',
        name: 'TimestampConverter',
        component: () => import('../views/tools/TimestampConverter.vue'),
        icon: '⏰',
        title: '时间戳转换',
        description: 'UNIX时间戳与日期格式互转',
        category: 'time',
        keywords: '时间戳,UNIX时间戳,时间戳转换,timestamp,日期转换,epoch',
    },
    {
        path: '/countdown',
        name: 'CountdownTimer',
        component: () => import('../views/tools/CountdownTimer.vue'),
        icon: '⏲️',
        title: '倒计时定时器',
        description: '设置时间并开始倒计时',
        category: 'time',
        keywords: '倒计时,定时器,countdown,timer,在线倒计时',
    },
    {
        path: '/json-all',
        name: 'JsonAllConverter',
        component: () => import('../views/tools/JsonAllConverter.vue'),
        icon: '📋',
        title: 'JSON全能转换',
        description: 'JSON格式化/转XML/CSV/YAML',
        category: 'json',
        keywords: 'JSON转换,JSON格式化,JSON转XML,JSON转CSV,JSON转YAML',
    },
    {
        path: '/json-xml',
        name: 'JsonXmlConverter',
        component: () => import('../views/tools/JsonXmlConverter.vue'),
        icon: '🔄',
        title: 'JSON XML互转',
        description: 'JSON与XML格式相互转换',
        category: 'json',
        keywords: 'JSON转XML,XML转JSON,JSON XML互转,格式转换',
    },
    {
        path: '/json-quote',
        name: 'JsonQuoteConverter',
        component: () => import('../views/tools/JsonQuoteConverter.vue'),
        icon: '""',
        title: 'JSON引号转换',
        description: '单引号转双引号（标准JSON）',
        category: 'json',
        keywords: 'JSON引号,单引号转双引号,JSON标准化,引号转换',
    },
    {
        path: '/json-case',
        name: 'JsonCaseConverter',
        component: () => import('../views/tools/JsonCaseConverter.vue'),
        icon: 'Aa',
        title: 'JSON大小写转换',
        description: 'JSON字段大小写转换',
        category: 'json',
        keywords: 'JSON大小写,字段名转换,大写转小写,小写转大写',
    },
    {
        path: '/jwt',
        name: 'JwtDecoder',
        component: () => import('../views/tools/JwtDecoder.vue'),
        icon: '🔑',
        title: 'JWT解密',
        description: '解析JWT令牌字段',
        category: 'security',
        keywords: 'JWT,JWT解密,JWT解析,令牌,token解码,JWT decoder',
    },
    {
        path: '/crypto',
        name: 'CryptoTool',
        component: () => import('../views/tools/CryptoTool.vue'),
        icon: '🔓',
        title: '加解密工具',
        description: 'Base64/AES/DES/3DES加解密',
        category: 'security',
        keywords: '加密,解密,AES,DES,3DES,Base64,在线加密,在线解密',
    },
    {
        path: '/rsa',
        name: 'RsaKeyGenerator',
        component: () => import('../views/tools/RsaKeyGenerator.vue'),
        icon: '🔐',
        title: 'RSA密钥生成',
        description: '生成RSA公钥和私钥',
        category: 'security',
        keywords: 'RSA,密钥生成,公钥,私钥,RSA key,RSA生成',
    },
    {
        path: '/uuid',
        name: 'UuidGenerator',
        component: () => import('../views/tools/UuidGenerator.vue'),
        icon: '🆔',
        title: 'UUID生成器',
        description: '批量生成UUID/GUID',
        category: 'security',
        keywords: 'UUID,GUID,UUID生成器,批量生成UUID,唯一标识符',
    },
    {
        path: '/text-diff',
        name: 'TextDiff',
        component: () => import('../views/tools/TextDiff.vue'),
        icon: '🔍',
        title: '文本差异对比',
        description: '对比两段文本的差异',
        category: 'text',
        keywords: '文本对比,差异对比,diff,文本比较,代码对比',
    },
    {
        path: '/text-counter',
        name: 'TextCounter',
        component: () => import('../views/tools/TextCounter.vue'),
        icon: '🔢',
        title: '文本字数统计',
        description: '统计字数、字符数、行数',
        category: 'text',
        keywords: '字数统计,字符统计,行数统计,文本计数,word count',
    },
    {
        path: '/encoding',
        name: 'EncodingConverter',
        component: () => import('../views/tools/EncodingConverter.vue'),
        icon: '🔤',
        title: '编码转换工具',
        description: 'Unicode/中文/ASCII/URL编码互转',
        category: 'encode',
        keywords: '编码转换,Unicode,ASCII,URL编码,中文编码,编码解码',
    },
    {
        path: '/naming',
        name: 'NamingConverter',
        component: () => import('../views/tools/NamingConverter.vue'),
        icon: '📝',
        title: '命名格式转换',
        description: '驼峰/下划线/帕斯卡/短横线互转',
        category: 'encode',
        keywords: '命名转换,驼峰命名,下划线命名,帕斯卡命名,kebab-case,camelCase,snake_case',
    },
    {
        path: '/number-base',
        name: 'NumberBaseConverter',
        component: () => import('../views/tools/NumberBaseConverter.vue'),
        icon: '🔢',
        title: '进制转换',
        description: '二进制/八进制/十进制/十六进制互转',
        category: 'encode',
        keywords: '进制转换,二进制,八进制,十进制,十六进制,进制计算',
    },
    {
        path: '/color',
        name: 'ColorConverter',
        component: () => import('../views/tools/ColorConverter.vue'),
        icon: '🎨',
        title: '颜色转换',
        description: 'HEX/RGB/HSL颜色格式互转',
        category: 'encode',
        keywords: '颜色转换,HEX,RGB,HSL,颜色代码,取色器',
    },
    {
        path: '/qrcode',
        name: 'QrCodeGenerator',
        component: () => import('../views/tools/QrCodeGenerator.vue'),
        icon: '📱',
        title: '二维码生成器',
        description: '将文本转换为二维码',
        category: 'image',
        keywords: '二维码,QR码,二维码生成,QR code,在线二维码',
    },
    {
        path: '/image',
        name: 'ImageTool',
        component: () => import('../views/tools/ImageTool.vue'),
        icon: '🖼️',
        title: '图片Base64互转',
        description: '图片转Base64和Base64转图片',
        category: 'image',
        keywords: '图片Base64,Base64转图片,图片编码,Base64编码解码',
    },
    {
        path: '/image-compressor',
        name: 'ImageCompressor',
        component: () => import('../views/tools/ImageCompressor.vue'),
        icon: '📷',
        title: '图片压缩工具',
        description: '压缩图片大小，调整质量和尺寸',
        category: 'image',
        keywords: '图片压缩,压缩图片,图片缩小,在线压缩,image compress',
    },
    {
        path: '/mermaid',
        name: 'MermaidGenerator',
        component: () => import('../views/tools/MermaidGenerator.vue'),
        icon: '📊',
        title: 'Mermaid UML图',
        description: '基于Mermaid代码生成UML图表',
        category: 'image',
        keywords: 'Mermaid,UML,流程图,时序图,图表生成,diagram',
    },
    {
        path: '/regex',
        name: 'RegexTester',
        component: () => import('../views/tools/RegexTester.vue'),
        icon: '🧪',
        title: '正则表达式测试',
        description: '在线测试正则表达式匹配',
        category: 'dev',
        keywords: '正则表达式,正则测试,regex,regular expression,正则匹配',
    },
    {
        path: '/code-formatter',
        name: 'CodeFormatter',
        component: () => import('../views/tools/CodeFormatter.vue'),
        icon: '💻',
        title: '代码格式化',
        description: '格式化HTML/CSS/JS/SQL代码',
        category: 'dev',
        keywords: '代码格式化,HTML格式化,CSS格式化,JS格式化,SQL格式化,代码美化',
    },
    {
        path: '/http-status',
        name: 'HttpStatusCode',
        component: () => import('../views/tools/HttpStatusCode.vue'),
        icon: '🌐',
        title: 'HTTP状态码',
        description: '查询HTTP状态码含义',
        category: 'dev',
        keywords: 'HTTP状态码,HTTP status,状态码查询,404,500,200',
    },
    {
        path: '/ip',
        name: 'IpQuery',
        component: () => import('../views/tools/IpQuery.vue'),
        icon: '🌍',
        title: 'IP地址查询',
        description: '查询IP地址归属地信息',
        category: 'dev',
        keywords: 'IP查询,IP归属地,IP地址,IP location,IP定位',
    },
    {
        path: '/pdf-converter',
        name: 'PdfConverter',
        component: () => import('../views/tools/PdfConverter.vue'),
        icon: '📄',
        title: 'PDF转Word/Excel',
        description: '将PDF文档转换为Word或Excel格式',
        category: 'document',
        keywords: 'PDF转换,PDF转Word,PDF转Excel,PDF converter,文档转换',
    },
]

export function getCategories() {
    return categories
}

export function getTools() {
    return tools
}

export function getToolsByCategory(categoryId) {
    return tools.filter(t => t.category === categoryId)
}

export function searchTools(query) {
    if (!query || !query.trim()) return []
    const q = query.trim().toLowerCase()
    return tools.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.keywords && t.keywords.toLowerCase().includes(q))
    )
}

export function getToolByPath(path) {
    return tools.find(t => t.path === path)
}

export function getToolRoutes() {
    return tools.map(tool => ({
        path: tool.path,
        name: tool.name,
        component: tool.component,
        meta: {
            title: tool.title,
            description: tool.description,
            keywords: tool.keywords,
        },
    }))
}
