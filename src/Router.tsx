import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginForm, SignupForm } from '@/features/auth'
import { Dashboard } from '@/features/dashboard'
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

          {/* Protected routes with layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/books" element={<PlaceholderPage title="Books" />} />
              <Route path="/borrowings" element={<PlaceholderPage title="My Borrowings" />} />
              <Route path="/invitations" element={<PlaceholderPage title="Invitations" />} />
            </Route>
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500">Coming soon...</p>
      </div>
    </div>
  )
}
