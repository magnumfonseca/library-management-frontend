import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginForm, SignupForm } from '@/features/auth'
import { Dashboard } from '@/features/dashboard'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
