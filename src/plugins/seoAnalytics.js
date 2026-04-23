const SITE_NAME = 'Hello Tool'
const SITE_URL = 'https://tool.wbnull.cn'
const SITE_DESCRIPTION = 'Hello Tool - 开发工具箱，集成时间戳转换、JSON处理、加解密、编码转换、正则测试等多种常用开发工具，提高开发效率'
const SITE_KEYWORDS = '开发工具,在线工具,工具箱,JSON格式化,时间戳转换,Base64,加密解密,正则表达式,UUID生成,二维码'
const DEFAULT_TITLE = `${SITE_NAME} - 开发工具箱`

function reportPageView(url) {
    if (!window._hmt) return
    window._hmt.push(['_trackPageview', url])
}

function reportEvent(category, action, label, value) {
    if (!window._hmt) return
    window._hmt.push(['_trackEvent', category, action, label, value])
}

function getOrCreateMeta(name, isProperty) {
    const attr = isProperty ? 'property' : 'name'
    let el = document.querySelector(`meta[${attr}="${name}"]`)
    if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
    }
    return el
}

function setMeta(name, content, isProperty = false) {
    getOrCreateMeta(name, isProperty).setAttribute('content', content)
}

function setCanonical(url) {
    let el = document.querySelector('link[rel="canonical"]')
    if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', 'canonical')
        document.head.appendChild(el)
    }
    el.setAttribute('href', url)
}

function updateSeo(meta = {}) {
    const {
        title = DEFAULT_TITLE,
        description = SITE_DESCRIPTION,
        keywords = SITE_KEYWORDS,
        url = SITE_URL,
        ogType = 'website',
        ogImage = `${SITE_URL}/favicon.svg`
    } = meta

    document.title = title

    setMeta('description', description)
    setMeta('keywords', keywords)

    setMeta('og:title', title, true)
    setMeta('og:description', description, true)
    setMeta('og:type', ogType, true)
    setMeta('og:url', url, true)
    setMeta('og:image', ogImage, true)
    setMeta('og:site_name', SITE_NAME, true)
    setMeta('og:locale', 'zh_CN', true)

    setMeta('twitter:card', 'summary')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    setMeta('twitter:image', ogImage)

    if (url) setCanonical(url)
}

export default {
    install(app, {router, siteUrl = SITE_URL} = {}) {
        if (router) {
            router.afterEach((to) => {
                const meta = to.meta || {}
                const title = meta.title ? (meta.title.includes(SITE_NAME) ? meta.title : `${meta.title} - ${SITE_NAME}`) : DEFAULT_TITLE

                updateSeo({
                    title,
                    description: meta.description,
                    keywords: meta.keywords,
                    url: siteUrl + to.fullPath
                })

                reportPageView(to.fullPath)
            })
        }

        app.config.globalProperties.$track = reportEvent

        app.provide('$track', reportEvent)

        app.directive('track', {
            beforeMount(el, binding) {
                const {category = 'click', action = 'click', label = '', value} = binding.value || {}
                el._trackHandler = () => reportEvent(category, action, label, value)
                el.addEventListener('click', el._trackHandler)
            },
            unmounted(el) {
                if (el._trackHandler) {
                    el.removeEventListener('click', el._trackHandler)
                    delete el._trackHandler
                }
            }
        })
    }
}
