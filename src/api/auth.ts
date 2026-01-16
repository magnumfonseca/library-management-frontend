import api from './client'
import type { User, LoginCredentials, SignupCredentials, JsonApiResponse } from '@/types'

type UserAttributes = Omit<User, 'id'>

export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await api.post<JsonApiResponse<UserAttributes>>('/api/v1/login', {
    user: credentials,
  })
  const { data } = response.data
  if (Array.isArray(data)) {
    throw new Error('Unexpected array response')
  }
  return { id: data.id, ...data.attributes }
}

export async function signup(credentials: SignupCredentials): Promise<User> {
  const response = await api.post<JsonApiResponse<UserAttributes>>('/api/v1/signup', {
    user: credentials,
  })
  const { data } = response.data
  if (Array.isArray(data)) {
    throw new Error('Unexpected array response')
  }
  return { id: data.id, ...data.attributes }
}

export async function logout(): Promise<void> {
  await api.delete('/api/v1/logout')
  // Token cleanup is handled by authStore.logout()
}
