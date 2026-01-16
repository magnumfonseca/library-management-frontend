export interface User {
  id: string
  email: string
  name: string
  role: 'member' | 'librarian'
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  email: string
  password: string
  password_confirmation: string
  name: string
}
