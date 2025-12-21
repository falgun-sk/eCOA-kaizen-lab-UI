import { ROLE_LABELS, ROLE_COLORS, ROLE_DESCRIPTIONS } from '../constants/roles'

/**
 * RoleBadge Component
 *
 * Displays a color-coded badge for user roles
 * Each role has a distinct color for easy visual identification
 *
 * @param {string} role - The role to display
 * @param {boolean} showTooltip - Show tooltip with role description (default: true)
 */
const RoleBadge = ({ role, showTooltip = true }) => {
  const label = ROLE_LABELS[role] || role
  const colors = ROLE_COLORS[role] || {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200'
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
      title={showTooltip ? ROLE_DESCRIPTIONS[role] : ''}
    >
      {label}
    </span>
  )
}

export default RoleBadge
