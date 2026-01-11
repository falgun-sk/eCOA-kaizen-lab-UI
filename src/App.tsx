import { BrowserRouter as Router, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Route configurations
import { authRoutes } from './app/routes/authRoutes'
import { studyRoutes } from './app/routes/studyRoutes'
import { designerRoutes } from './app/routes/designerRoutes'
import { commonRoutes } from './app/routes/commonRoutes'

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: '14px',
            borderRadius: '8px',
            padding: '12px 16px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
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
