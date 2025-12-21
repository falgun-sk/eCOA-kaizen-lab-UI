import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Feature imports - Auth
import Login from './features/auth/pages/Login'
import ForgotPassword from './features/auth/pages/ForgotPassword'

// Feature imports - Dashboard
import Dashboard from './features/dashboard/pages/Dashboard'
import DesignerDashboard from './features/designer/pages/DesignerDashboard'

// Feature imports - Studies
import Studies from './features/studies/pages/Studies'
import CreateStudy from './features/studies/pages/CreateStudy'
import StudyDetail from './features/studies/pages/StudyDetail'
import StudyBuild from './features/studies/pages/StudyBuild'
import FormPreview from './features/studies/pages/FormPreview'
import PendingActions from './features/studies/pages/PendingActions'
import Reports from './features/studies/pages/Reports'
import UAT from './features/studies/pages/UAT'
import Docs from './features/studies/pages/Docs'

// Feature imports - Designer
import DesignerStudyDetail from './features/designer/pages/DesignerStudyDetail'
import FormBuilder from './features/designer/pages/FormBuilder'
import LanguageManagement from './features/designer/pages/LanguageManagement'
import VisitSchedule from './features/designer/pages/VisitSchedule'
import DesignerNotes from './features/designer/pages/DesignerNotes'
import Translations from './features/designer/pages/Translations'
import Library from './features/designer/pages/Library'

// Feature imports - Access
import Access from './features/access/pages/Access'

// Layout imports
import MainLayout from './layouts/MainLayout'

// Shared components
import Placeholder from './shared/components/Placeholder'
import ProtectedRoute from './shared/components/ProtectedRoute'

// Constants
import { ROLES } from './features/access/constants/roles'

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes with MainLayout */}
        <Route path="/" element={<MainLayout><Navigate to="/dashboard" replace /></MainLayout>} />
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />

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

        {/* Studies routes - PM/Admin */}
        <Route path="/studies" element={<MainLayout><Studies /></MainLayout>} />
        <Route
          path="/studies/new"
          element={
            <MainLayout>
              <ProtectedRoute allowedRoles={[ROLES.STUDY_DESIGNER]}>
                <CreateStudy />
              </ProtectedRoute>
            </MainLayout>
          }
        />
        <Route path="/studies/:studyId" element={<MainLayout><StudyDetail /></MainLayout>} />
        <Route path="/studies/:studyId/build" element={<MainLayout><StudyBuild /></MainLayout>} />
        <Route path="/studies/:studyId/forms/:formId" element={<MainLayout><FormPreview /></MainLayout>} />
        <Route path="/studies/:studyId/actions" element={<MainLayout><PendingActions /></MainLayout>} />
        <Route path="/studies/:studyId/reports" element={<MainLayout><Reports /></MainLayout>} />
        <Route path="/studies/:studyId/uat" element={<MainLayout><UAT /></MainLayout>} />
        <Route path="/studies/:studyId/docs" element={<MainLayout><Docs /></MainLayout>} />

        {/* Designer routes */}
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

        {/* Other routes */}
        <Route path="/tasks" element={<MainLayout><Placeholder title="Tasks" description="Task management & assignments" /></MainLayout>} />
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
        <Route path="/settings" element={<MainLayout><Placeholder title="Settings" description="Configure your account settings" /></MainLayout>} />
        <Route path="/profile" element={<MainLayout><Placeholder title="My Profile" description="View and edit your profile" /></MainLayout>} />
        <Route path="/help" element={<MainLayout><Placeholder title="Help & Support" description="Get help with eCOA" /></MainLayout>} />
      </Routes>
    </Router>
  )
}

export default App
