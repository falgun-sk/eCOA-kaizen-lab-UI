import { Route } from 'react-router-dom'
import MainLayout from '../../layouts/MainLayout'
import ProtectedRoute from '../../shared/components/ProtectedRoute'
import { ROLES } from '../../features/access/constants/roles'

// Study pages
import Studies from '../../features/studies/pages/Studies'
import CreateStudy from '../../features/studies/pages/CreateStudy'
import StudyDetail from '../../features/studies/pages/StudyDetail'
import StudyBuild from '../../features/studies/pages/StudyBuild'
import FormPreview from '../../features/studies/pages/FormPreview'
import PendingActions from '../../features/studies/pages/PendingActions'
import Reports from '../../features/studies/pages/Reports'
import UAT from '../../features/studies/pages/UAT'
import Docs from '../../features/studies/pages/Docs'

/**
 * Study management routes
 */
export const studyRoutes = (
  <>
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
  </>
)
