import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginForm, SignupForm } from '@/features/auth'
import { Dashboard } from '@/features/dashboard'
import { BookList } from '@/features/books'
import { BorrowingList } from '@/features/borrowings'
import { InvitationList, AcceptInvitation } from '@/features/invitations'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { AuthProvider } from '@/components/common/AuthProvider'
import { MainLayout } from '@/components/layout'

export function Router() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/accept-invitation/:token" element={<AcceptInvitation />} />

          {/* Protected routes with layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/books" element={<BookList />} />
              <Route path="/borrowings" element={<BorrowingList />} />
              <Route path="/invitations" element={<InvitationList />} />
            </Route>
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
