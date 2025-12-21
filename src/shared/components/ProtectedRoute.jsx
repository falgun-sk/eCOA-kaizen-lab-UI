import { Navigate } from 'react-router-dom'
import usePermission from '../hooks/usePermission'

/**
 * ProtectedRoute Component
 *
 * Wrapper component for routes that require specific roles
 * Redirects to dashboard if user doesn't have required role
 *
 * @param {string[]} allowedRoles - Array of roles that can access this route
 * @param {ReactNode} children - Child components to render if authorized
 */
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, hasAnyRole, loading } = usePermission()

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Check if user has one of the allowed roles
  if (!hasAnyRole(allowedRoles)) {
    // User is logged in but doesn't have permission
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100 mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-sm text-gray-500 mb-6">
            You don't have permission to access this page. Please contact your administrator
            if you believe this is an error.
          </p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-orange-500/30 hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-200"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // User has permission, render children
  return <>{children}</>
}

export default ProtectedRoute
