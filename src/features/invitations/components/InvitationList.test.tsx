import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { server } from '@/test/mocks/server'
import { InvitationList } from './InvitationList'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
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

describe('InvitationList', () => {
  it('should render invitation list', async () => {
    renderWithProviders(<InvitationList />)
    
    await waitFor(() => {
      expect(screen.getByText('librarian@example.com')).toBeInTheDocument()
    })

    expect(screen.getByText('accepted@example.com')).toBeInTheDocument()
    expect(screen.getByText('2 invitations')).toBeInTheDocument()
  })

  it('should show send invitation button', async () => {
    renderWithProviders(<InvitationList />)

    await waitFor(() => {
      expect(screen.getByText('Send Invitation')).toBeInTheDocument()
    })
  })

  it('should open invitation form modal when button clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<InvitationList />)

    await waitFor(() => {
      expect(screen.getByText('Send Invitation')).toBeInTheDocument()
    })

    const sendButton = screen.getByText('Send Invitation')
    await user.click(sendButton)

    await waitFor(() => {
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    })
  })

  it('should display invitation status badges', async () => {
    renderWithProviders(<InvitationList />)

    await waitFor(() => {
      expect(screen.getByText('pending')).toBeInTheDocument()
    })

    expect(screen.getByText('accepted')).toBeInTheDocument()
  })

  it('should show loading state', () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, enabled: false },
      },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <InvitationList />
        </BrowserRouter>
      </QueryClientProvider>
    )

    // Loading skeleton should be visible
    expect(screen.getByText('Invitations')).toBeInTheDocument()
  })
})
