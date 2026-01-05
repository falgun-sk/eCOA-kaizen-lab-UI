import { Route, Navigate } from 'react-router-dom'
import MainLayout from '../../layouts/MainLayout'
import ProtectedRoute from '../../shared/components/ProtectedRoute'
import { ROLES } from '../../features/access/constants/roles'

// Pages
import Dashboard from '../../features/dashboard/pages/Dashboard'
import Access from '../../features/access/pages/Access'
import Reports from '../../features/studies/pages/Reports'
import Placeholder from '../../shared/components/Placeholder'

/**
 * Common/shared routes
 */
export const commonRoutes = (
  <>
    {/* Root redirect */}
    <Route path="/" element={<MainLayout><Navigate to="/dashboard" replace /></MainLayout>} />

    {/* Dashboard */}
    <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />

    {/* Tasks */}
    <Route
      path="/tasks"
      element={
        <MainLayout>
          <Placeholder title="Tasks" description="Task management & assignments" />
        </MainLayout>
      }
    />

    {/* Access Management (Admin only) */}
    <Route
      path="/access"
      element={
        <MainLayout>
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <Access />
          </ProtectedRoute>
        </MainLayout>
      }
    />

    {/* Reports */}
    <Route
      path="/reports"
      element={
        <MainLayout>
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.DATA_MANAGER]}>
            <Reports />
          </ProtectedRoute>
        </MainLayout>
      }
    />

    {/* Settings */}
    <Route
      path="/settings"
      element={
        <MainLayout>
          <Placeholder title="Settings" description="Configure your account settings" />
        </MainLayout>
      }
    />

    {/* Profile */}
    <Route
      path="/profile"
      element={
        <MainLayout>
          <Placeholder title="My Profile" description="View and edit your profile" />
        </MainLayout>
      }
    />

    {/* Help */}
    <Route
      path="/help"
      element={
        <MainLayout>
          <Placeholder title="Help & Support" description="Get help with eCOA" />
        </MainLayout>
      }
    />
  </>
)
