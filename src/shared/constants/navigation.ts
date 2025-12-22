/**
 * Navigation Configuration
 * Defines menu items visible to each role
 */

export interface NavigationItem {
  id: string
  label: string
  path: string
  icon: string
  roles: string[]
  badge?: string
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Home',
    path: '/dashboard',
    icon: 'dashboard',
    roles: ['admin', 'project_manager', 'build_reviewer', 'uat_member', 'site_manager', 'data_manager']
  },
  {
    id: 'studies',
    label: 'Studies',
    path: '/studies',
    icon: 'studies',
    roles: ['project_manager', 'build_reviewer', 'uat_member']
  },
  {
    id: 'designer_studies',
    label: 'Studies',
    path: '/designer/dashboard',
    icon: 'studies',
    roles: ['study_designer']
  },
  {
    id: 'translations',
    label: 'Translations',
    path: '/designer/translations',
    icon: 'translations',
    roles: ['study_designer']
  },
  {
    id: 'library',
    label: 'Library',
    path: '/designer/library',
    icon: 'library',
    roles: ['study_designer']
  },
  {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'tasks',
    roles: ['project_manager']
  },
  {
    id: 'reviews',
    label: 'Reviews',
    path: '/reviews',
    icon: 'reviews',
    roles: ['build_reviewer']
  },
  {
    id: 'uat',
    label: 'UAT Testing',
    path: '/uat',
    icon: 'testing',
    roles: ['uat_member']
  },
  {
    id: 'sites',
    label: 'Sites',
    path: '/sites',
    icon: 'sites',
    roles: ['site_manager']
  },
  {
    id: 'devices',
    label: 'Devices',
    path: '/devices',
    icon: 'devices',
    roles: ['site_manager']
  },
  {
    id: 'access',
    label: 'Access',
    path: '/access',
    icon: 'access',
    roles: ['admin', 'project_manager']
  },
  {
    id: 'audit',
    label: 'Audit Logs',
    path: '/audit',
    icon: 'audit',
    roles: ['admin']
  },
  {
    id: 'data',
    label: 'Data Management',
    path: '/data',
    icon: 'data',
    roles: ['data_manager'],
    badge: 'Phase 2'
  },
  {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'reports',
    roles: ['admin', 'data_manager']
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'settings',
    roles: ['admin', 'project_manager', 'build_reviewer', 'uat_member', 'site_manager', 'data_manager', 'study_designer']
  }
]

/**
 * Get navigation items for a specific role
 */
export const getNavigationForRole = (userRole: string): NavigationItem[] => {
  if (!userRole) return []
  return NAVIGATION_ITEMS.filter(item => item.roles.includes(userRole))
}

/**
 * Check if user has access to a specific route
 */
export const hasAccessToRoute = (path: string, userRole: string): boolean => {
  const item = NAVIGATION_ITEMS.find(navItem => navItem.path === path)
  if (!item) return true
  return item.roles.includes(userRole)
}
