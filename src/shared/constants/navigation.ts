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
    roles: ['admin', 'project_manager', 'build_reviewer', 'uat_member']
  },
  {
    id: 'designer_studies',
    label: 'Designer Studio',
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
    roles: ['admin', 'project_manager']
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
  }
]

/**
 * Curated navigation for super_admin — clean, no duplicates
 */
const SUPER_ADMIN_NAVIGATION: NavigationItem[] = [
  { id: 'dashboard', label: 'Home', path: '/dashboard', icon: 'dashboard', roles: [] },
  { id: 'studies', label: 'Studies', path: '/studies', icon: 'studies', roles: [] },
  { id: 'designer_studies', label: 'Designer Studio', path: '/designer/dashboard', icon: 'forms', roles: [] },
  { id: 'tasks', label: 'Tasks', path: '/tasks', icon: 'tasks', roles: [] },
  { id: 'reviews', label: 'Reviews', path: '/reviews', icon: 'reviews', roles: [] },
  { id: 'uat', label: 'UAT Testing', path: '/uat', icon: 'testing', roles: [] },
  { id: 'sites', label: 'Sites', path: '/sites', icon: 'sites', roles: [] },
  { id: 'devices', label: 'Devices', path: '/devices', icon: 'devices', roles: [] },
  { id: 'access', label: 'Access', path: '/access', icon: 'access', roles: [] },
  { id: 'reports', label: 'Reports', path: '/reports', icon: 'reports', roles: [] },
]

/**
 * Get navigation items for a specific role.
 * Accepts a single role string OR an array of roles.
 * super_admin sees all navigation items.
 */
export const getNavigationForRole = (userRole: string | string[]): NavigationItem[] => {
  if (!userRole) return []

  const roles = Array.isArray(userRole) ? userRole : [userRole]

  // super_admin gets a curated nav — all pages, no duplicates
  if (roles.includes('super_admin')) {
    return SUPER_ADMIN_NAVIGATION
  }

  return NAVIGATION_ITEMS.filter(item => roles.some(r => item.roles.includes(r)))
}

/**
 * Check if user has access to a specific route
 */
export const hasAccessToRoute = (path: string, userRole: string | string[]): boolean => {
  if (!userRole) return false

  const roles = Array.isArray(userRole) ? userRole : [userRole]

  // super_admin has access to everything
  if (roles.includes('super_admin')) return true

  const item = NAVIGATION_ITEMS.find(navItem => navItem.path === path)
  if (!item) return true
  return roles.some(r => item.roles.includes(r))
}
