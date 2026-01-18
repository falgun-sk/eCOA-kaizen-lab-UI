import { Route, Navigate } from 'react-router-dom'
import MainLayout from '../../layouts/MainLayout'
import ProtectedRoute from '../../shared/components/ProtectedRoute'
import { ROLES } from '../../features/access/constants/roles'

// Pages
import DashboardWrapper from '../../features/dashboard/pages/DashboardWrapper'
import Access from '../../features/access/pages/Access'
import Reports from '../../features/studies/pages/Reports'
import Tasks from '../../features/dashboard/pages/Tasks'
import DeploymentVerificationSimple from '../../features/deployment/pages/DeploymentVerificationSimple'
import PMDeployment from '../../features/deployment/pages/PMDeployment'
import Placeholder from '../../shared/components/Placeholder'

/**
 * Common/shared routes
 */
export const commonRoutes = (
  <>
    {/* Root redirect */}
    <Route path="/" element={<MainLayout><Navigate to="/dashboard" replace /></MainLayout>} />

    {/* Dashboard - handles role-based redirects internally */}
    <Route
      path="/dashboard"
      element={
        <MainLayout>
          <DashboardWrapper />
        </MainLayout>
      }
    />

    {/* Tasks */}
    <Route
      path="/tasks"
      element={
        <MainLayout>
          <Tasks />
        </MainLayout>
      }
    />

    {/* Access Management (Admin and Project Manager) */}
    <Route
      path="/access"
      element={
        <MainLayout>
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.PROJECT_MANAGER]}>
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

    {/* Deployment Routes */}
    {/* PM Direct Deployment (Project Manager only) */}
    <Route
      path="/deployment/execute/:studyId"
      element={
        <ProtectedRoute allowedRoles={[ROLES.PROJECT_MANAGER]}>
          <PMDeployment />
        </ProtectedRoute>
      }
    />

    {/* Legacy Simple Deployment */}
    <Route
      path="/deployment"
      element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.PROJECT_MANAGER]}>
          <DeploymentVerificationSimple />
        </ProtectedRoute>
      }
    />
  </>
)
