import axios from 'axios'

export const TOKEN_KEY = 'authToken'

let onUnauthorizedCallback: (() => void) | null = null

export function setOnUnauthorized(callback: () => void) {
  onUnauthorizedCallback = callback
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor - attach token with Bearer prefix
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - extract token & handle 401
api.interceptors.response.use(
  (response) => {
    const authHeader = response.headers['authorization']
    if (authHeader) {
      // Strip 'Bearer ' prefix if present, store raw token
      const token = authHeader.replace(/^Bearer\s+/i, '')
      localStorage.setItem(TOKEN_KEY, token)
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token cleanup is handled by onUnauthorizedCallback -> authStore.logout()
      onUnauthorizedCallback?.()
    }
    return Promise.reject(error)
  }
)

export default api
