import { BrowserRouter as Router, Routes } from 'react-router-dom'

// Route configurations
import { authRoutes } from './app/routes/authRoutes'
import { studyRoutes } from './app/routes/studyRoutes'
import { designerRoutes } from './app/routes/designerRoutes'
import { commonRoutes } from './app/routes/commonRoutes'

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication routes (public) */}
        {authRoutes}

        {/* Common routes (dashboard, tasks, settings, etc.) */}
        {commonRoutes}

        {/* Study management routes */}
        {studyRoutes}

        {/* Designer routes (protected) */}
        {designerRoutes}
      </Routes>
    </Router>
  )
}

export default App
