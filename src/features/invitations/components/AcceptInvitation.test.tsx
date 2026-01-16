import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { server } from '@/test/mocks/server'
import { AcceptInvitation } from './AcceptInvitation'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function renderWithProviders() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/accept-invitation/:token" element={<AcceptInvitation />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('AcceptInvitation', () => {
  it('should render invitation acceptance form with valid token', async () => {
    window.history.pushState({}, '', '/accept-invitation/valid-token')
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('Accept Invitation')).toBeInTheDocument()
    })

    expect(screen.getByText(/librarian@example.com/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
  })

  it('should show error for invalid token', async () => {
    window.history.pushState({}, '', '/accept-invitation/invalid-token')
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('Invalid Invitation')).toBeInTheDocument()
    })

    expect(screen.getByText(/this invitation link is invalid or has expired/i)).toBeInTheDocument()
  })

  it('should validate form fields', async () => {
    const user = userEvent.setup()
    window.history.pushState({}, '', '/accept-invitation/valid-token')
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('Accept Invitation')).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    })
  })

  it('should validate password match', async () => {
    const user = userEvent.setup()
    window.history.pushState({}, '', '/accept-invitation/valid-token')
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('Accept Invitation')).toBeInTheDocument()
    })

    const nameInput = screen.getByLabelText(/full name/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmInput = screen.getByLabelText(/confirm password/i)

    await user.type(nameInput, 'Test User')
    await user.type(passwordInput, 'password123')
    await user.type(confirmInput, 'differentpassword')

    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)

    // Check for validation error - zod refine validation should trigger
    await waitFor(() => {
      const errorElements = screen.queryAllByText(/passwords don't match/i)
      expect(errorElements.length).toBeGreaterThan(0)
    }, { timeout: 2000 })
  }, 10000) // Increase timeout for this test

  it('should show loading state', () => {
    window.history.pushState({}, '', '/accept-invitation/valid-token')
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, enabled: false },
      },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/accept-invitation/:token" element={<AcceptInvitation />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    )

    expect(screen.getByText('Loading invitation...')).toBeInTheDocument()
  })
})
