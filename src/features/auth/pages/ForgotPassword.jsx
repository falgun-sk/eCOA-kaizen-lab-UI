import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authAPI } from '../../../shared/services/api'
import { mockForgotPassword } from '../data/mockAuth'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = () => {
    if (!email) {
      return 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      return 'Please enter a valid email address'
    }
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validateEmail()

    if (!validationError) {
      setIsLoading(true)
      setError('')

      try {
        try {
          // Try backend API first
          await authAPI.forgotPassword(email)
          console.log('Password reset email sent (API):', email)
        } catch (apiError) {
          console.warn('API unavailable, using mock forgot password:', apiError.message)
          // Fallback to mock
          await mockForgotPassword(email)
          console.log('Password reset email sent (Mock):', email)
        }
        setIsSubmitted(true)
      } catch (err) {
        console.error('Forgot password error:', err)
        setError(err.message || 'Failed to send reset email. Please try again.')
      } finally {
        setIsLoading(false)
      }
    } else {
      setError(validationError)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 mb-4">
              <svg
                className="w-8 h-8 text-white"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 32H18L24 20L32 44L40 20L46 32H62"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-50 mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Check your email</h2>
              <p className="text-sm text-gray-600 mb-1">
                We've sent a password reset link to
              </p>
              <p className="text-sm font-medium text-gray-900 mb-6">
                {email}
              </p>
              <p className="text-xs text-gray-500 mb-8 leading-relaxed">
                Click the link in the email to reset your password. If you don't see the email, check your spam folder.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full py-2.5 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 mb-4">
            <svg
              className="w-8 h-8 text-white"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 32H18L24 20L32 44L40 20L46 32H62"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Reset password
          </h1>
          <p className="text-sm text-gray-500">
            Enter your email to receive a reset link
          </p>
        </div>

        {/* Reset Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError('')
                }}
                className={`w-full px-4 py-2.5 bg-white border ${
                  error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500'
                } rounded-xl text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0`}
                placeholder="you@example.com"
              />
              {error && (
                <p className="mt-1.5 text-xs text-red-600">{error}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send reset link'}
            </button>

            {/* Back to Login */}
            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to login
              </Link>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Need help?{' '}
            <a href="mailto:support@ecoa.com" className="text-orange-600 hover:text-orange-700 font-medium transition-colors">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
