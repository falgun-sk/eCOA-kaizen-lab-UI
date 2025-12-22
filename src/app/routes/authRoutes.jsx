import { Route } from 'react-router-dom'
import Login from '../../features/auth/pages/Login'
import ForgotPassword from '../../features/auth/pages/ForgotPassword'

/**
 * Authentication routes (public)
 */
export const authRoutes = (
  <>
    <Route path="/login" element={<Login />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
  </>
)
