import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setOnUnauthorized } from '@/api/client'
import { useAuthStore } from '@/store/authStore'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    setOnUnauthorized(() => {
      logout()
      navigate('/login', { replace: true })
    })
  }, [navigate, logout])

  return <>{children}</>
}
