import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../shared/hooks/useAuth'
import { ROLES } from '../../access/constants/roles'
import Dashboard from './Dashboard'

/**
 * DashboardWrapper Component
 *
 * Handles role-based redirects before rendering the Dashboard
 * - Admin users: redirect to /access
 * - Study Designer: redirect to /designer/dashboard
 * - Others: show Dashboard
 */
const DashboardWrapper = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.role === ROLES.ADMIN) {
      navigate('/access', { replace: true })
    } else if (user?.role === ROLES.STUDY_DESIGNER) {
      navigate('/designer/dashboard', { replace: true })
    }
  }, [user, navigate])

  // Only render Dashboard if not redirecting
  if (user?.role === ROLES.ADMIN || user?.role === ROLES.STUDY_DESIGNER) {
    return null
  }

  return <Dashboard />
}

export default DashboardWrapper
