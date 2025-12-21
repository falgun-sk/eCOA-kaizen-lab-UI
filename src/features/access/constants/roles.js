/**
 * Role definitions and constants for the eCOA Access Management system
 * Based on the Roles and Access PDF specification
 */

// Role constants
export const ROLES = {
  ADMIN: 'admin',
  PROJECT_MANAGER: 'project_manager',
  STUDY_DESIGNER: 'study_designer',
  BUILD_REVIEWER: 'build_reviewer',
  UAT_MEMBER: 'uat_member',
  SITE_MANAGER: 'site_manager',
  DATA_MANAGER: 'data_manager'
}

// Human-readable role labels
export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.PROJECT_MANAGER]: 'Project Manager',
  [ROLES.STUDY_DESIGNER]: 'Study Designer / Builder',
  [ROLES.BUILD_REVIEWER]: 'Build Reviewer',
  [ROLES.UAT_MEMBER]: 'UAT Member',
  [ROLES.SITE_MANAGER]: 'Site Manager',
  [ROLES.DATA_MANAGER]: 'Data Manager'
}

// Detailed role descriptions based on PDF specification
export const ROLE_DESCRIPTIONS = {
  [ROLES.ADMIN]: 'Account & System Governance - Manage users, roles, permissions, and system settings across all phases',
  [ROLES.PROJECT_MANAGER]: 'Orchestration & Governance - Oversee study progress, transition phases, assign team members, and deploy studies',
  [ROLES.STUDY_DESIGNER]: 'Study Configuration - Build forms, configure logic, create templates, and submit builds for review',
  [ROLES.BUILD_REVIEWER]: 'Review & Feedback - Review study builds, provide feedback on screens, questions, logic, and user experience',
  [ROLES.UAT_MEMBER]: 'Validation & Testing - Test application, validate forms and visits, create issue logs and test scripts',
  [ROLES.SITE_MANAGER]: 'Site Operations - Manage site users, onboarding, device shipments, and site-level compliance',
  [ROLES.DATA_MANAGER]: 'Data Oversight - Monitor study data, run quality checks, manage queries, and export datasets (Phase 2)'
}

// Active phases for each role
export const ROLE_PHASES = {
  [ROLES.ADMIN]: 'All Phases',
  [ROLES.PROJECT_MANAGER]: 'Start-Up & Maintenance',
  [ROLES.STUDY_DESIGNER]: 'Start-Up Phase',
  [ROLES.BUILD_REVIEWER]: 'Start-Up & Change Requests',
  [ROLES.UAT_MEMBER]: 'UAT Phase',
  [ROLES.SITE_MANAGER]: 'Maintenance Phase',
  [ROLES.DATA_MANAGER]: 'Phase 2 (Future)'
}

// Color mappings for role badges (TailwindCSS classes)
export const ROLE_COLORS = {
  [ROLES.ADMIN]: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    dot: 'bg-purple-500'
  },
  [ROLES.PROJECT_MANAGER]: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500'
  },
  [ROLES.STUDY_DESIGNER]: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-500'
  },
  [ROLES.BUILD_REVIEWER]: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500'
  },
  [ROLES.UAT_MEMBER]: {
    bg: 'bg-pink-50',
    text: 'text-pink-700',
    border: 'border-pink-200',
    dot: 'bg-pink-500'
  },
  [ROLES.SITE_MANAGER]: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    dot: 'bg-cyan-500'
  },
  [ROLES.DATA_MANAGER]: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    dot: 'bg-gray-500'
  }
}

// User status constants
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
}

// Status labels
export const STATUS_LABELS = {
  [USER_STATUS.ACTIVE]: 'Active',
  [USER_STATUS.INACTIVE]: 'Inactive'
}

// Status colors
export const STATUS_COLORS = {
  [USER_STATUS.ACTIVE]: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-500'
  },
  [USER_STATUS.INACTIVE]: {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
    dot: 'bg-gray-400'
  }
}

// Helper function to get all roles as array of objects (for dropdowns)
export const getAllRoles = () => {
  return Object.values(ROLES).map(role => ({
    value: role,
    label: ROLE_LABELS[role],
    description: ROLE_DESCRIPTIONS[role],
    phase: ROLE_PHASES[role]
  }))
}

// Helper function to get all statuses as array (for dropdowns)
export const getAllStatuses = () => {
  return Object.values(USER_STATUS).map(status => ({
    value: status,
    label: STATUS_LABELS[status]
  }))
}

// Helper function to check if role is available (Data Manager is Phase 2)
export const isRoleAvailable = (role) => {
  return role !== ROLES.DATA_MANAGER // DATA_MANAGER not available in Phase 1
}

// Get available roles (excluding Phase 2 roles)
export const getAvailableRoles = () => {
  return getAllRoles().filter(role => isRoleAvailable(role.value))
}
