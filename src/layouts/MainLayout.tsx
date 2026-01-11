import { useState, useEffect, ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

interface MainLayoutProps {
  children: ReactNode
}

/**
 * MainLayout Component
 *
 * Main application layout with:
 * - Sidebar navigation (left)
 * - Header (top)
 * - Content area (main)
 *
 * Wraps all authenticated pages
 */
const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation()

  // Keep sidebar collapsed by default on all pages
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar isCollapsed={isSidebarCollapsed} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout
