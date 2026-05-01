/**
 * HTTP请求工具类
 * 基于Axios封装，统一管理请求拦截、响应拦截和错误处理
 */
import axios from 'axios'
import {HTTP_TIMEOUT} from '@/config/constants.js'

const BASE_URL = '/api'

const httpInstance = axios.create({
    baseURL: BASE_URL,
    timeout: HTTP_TIMEOUT,
    headers: {
        'Content-Type': 'application/json'
    }
})

let csrfToken = ''

httpInstance.interceptors.request.use(async (config) => {
    if (!csrfToken) {
        try {
            const response = await fetch(`${BASE_URL}/auth/csrf-token`)
            if (response.ok) {
                const data = await response.json()
                csrfToken = data.csrf_token || ''
            }
        } catch {
        }
    }

    if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken
    }

    return config
})

httpInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            csrfToken = ''
        }
        return Promise.reject(error)
    }
)

export const HttpService = {
    async post(url, data, customConfig = {}) {
        const isFormData = data instanceof FormData
        const config = {
            ...(isFormData ? {headers: {'Content-Type': 'multipart/form-data'}} : {}),
            ...customConfig
        }
        return httpInstance.post(url, data, config)
    },

    async download(url) {
        const response = await httpInstance.get(url, {responseType: 'blob'})
        return response
    }
}

export default httpInstance
