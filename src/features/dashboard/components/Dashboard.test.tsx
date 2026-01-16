import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { server } from '@/test/mocks/server'
import { Dashboard } from './Dashboard'
import type { User } from '@/types'

// Mock the auth store
vi.mock('@/store/authStore', () => ({
  useAuthStore: vi.fn(),
}))

import { useAuthStore } from '@/store/authStore'

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  vi.clearAllMocks()
})
afterAll(() => server.close())

function renderWithProviders(component: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('Dashboard', () => {
  it('should render member dashboard', async () => {
    const mockUser: User = { 
      id: '1', 
      name: 'Test Member', 
      email: 'member@test.com', 
      role: 'member' 
    }
    
    // Mock useAuthStore to return user when selector is called
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(useAuthStore).mockImplementation((selector?: any) => {
      const state = {
        user: mockUser,
        setUser: vi.fn(),
        clearUser: vi.fn(),
      }
      return selector ? selector(state) : state
    })

    renderWithProviders(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText(/welcome back, test member/i)).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText('Currently Borrowed')).toBeInTheDocument()
    })

    expect(screen.getByText('Overdue Books')).toBeInTheDocument()
    expect(screen.getByText('My Borrowed Books')).toBeInTheDocument()
  })
})
