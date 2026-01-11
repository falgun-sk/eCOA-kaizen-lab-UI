import { Route } from 'react-router-dom'
import MainLayout from '../../layouts/MainLayout'
import ProtectedRoute from '../../shared/components/ProtectedRoute'
import { ROLES } from '../../features/access/constants/roles'

// Designer pages
import DesignerDashboard from '../../features/designer/pages/DesignerDashboard'
import DesignerStudyDetail from '../../features/designer/pages/DesignerStudyDetail'
import EditFormSelection from '../../features/designer/pages/EditFormSelection'
import FormBuilder from '../../features/designer/pages/FormBuilder'
import LanguageManagement from '../../features/designer/pages/LanguageManagement'
import VisitSchedule from '../../features/designer/pages/VisitSchedule'
import DesignerNotes from '../../features/designer/pages/DesignerNotes'
import Translations from '../../features/designer/pages/Translations'
import Library from '../../features/designer/pages/Library'

/**
 * Designer routes (protected for Study Designer role)
 */
export const designerRoutes = (
  <>
    {/* Designer Dashboard */}
    <Route
      path="/designer/dashboard"
      element={
        <MainLayout>
          <ProtectedRoute allowedRoles={[ROLES.STUDY_DESIGNER]}>
            <DesignerDashboard />
          </ProtectedRoute>
        </MainLayout>
      }
    />

    {/* Designer Translations */}
    <Route
      path="/designer/translations"
      element={
        <MainLayout>
          <ProtectedRoute allowedRoles={[ROLES.STUDY_DESIGNER]}>
            <Translations />
          </ProtectedRoute>
        </MainLayout>
      }
    />

    {/* Designer Library */}
    <Route
      path="/designer/library"
      element={
        <MainLayout>
          <ProtectedRoute allowedRoles={[ROLES.STUDY_DESIGNER]}>
            <Library />
          </ProtectedRoute>
        </MainLayout>
      }
    />

    {/* Designer Study Detail */}
    <Route
      path="/designer/studies/:studyId"
      element={
        <MainLayout>
          <ProtectedRoute allowedRoles={[ROLES.STUDY_DESIGNER]}>
            <DesignerStudyDetail />
          </ProtectedRoute>
        </MainLayout>
      }
    />

    {/* Edit Form Selection */}
    <Route
      path="/designer/studies/:studyId/edit-forms"
      element={
        <MainLayout>
          <ProtectedRoute allowedRoles={[ROLES.STUDY_DESIGNER]}>
            <EditFormSelection />
          </ProtectedRoute>
        </MainLayout>
      }
    />

    {/* Form Builder - New */}
    <Route
      path="/designer/studies/:studyId/forms/new"
      element={
        <MainLayout>
          <ProtectedRoute allowedRoles={[ROLES.STUDY_DESIGNER]}>
            <FormBuilder />
          </ProtectedRoute>
        </MainLayout>
      }
    />

    {/* Form Builder - Edit */}
    <Route
      path="/designer/studies/:studyId/forms/:formId"
      element={
        <MainLayout>
          <ProtectedRoute allowedRoles={[ROLES.STUDY_DESIGNER]}>
            <FormBuilder />
          </ProtectedRoute>
        </MainLayout>
      }
    />

    {/* Language Management */}
    <Route
      path="/designer/studies/:studyId/languages"
      element={
        <MainLayout>
          <ProtectedRoute allowedRoles={[ROLES.STUDY_DESIGNER]}>
            <LanguageManagement />
          </ProtectedRoute>
        </MainLayout>
      }
    />

    {/* Visit Schedule */}
    <Route
      path="/designer/studies/:studyId/visit-schedule"
      element={
        <MainLayout>
          <ProtectedRoute allowedRoles={[ROLES.STUDY_DESIGNER]}>
            <VisitSchedule />
          </ProtectedRoute>
        </MainLayout>
      }
    />

    {/* Designer Notes */}
    <Route
      path="/designer/studies/:studyId/notes"
      element={
        <MainLayout>
          <ProtectedRoute allowedRoles={[ROLES.STUDY_DESIGNER]}>
            <DesignerNotes />
          </ProtectedRoute>
        </MainLayout>
      }
    />
  </>
)
