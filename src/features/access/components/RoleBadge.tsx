import { ROLE_LABELS, ROLE_COLORS, ROLE_DESCRIPTIONS, RoleValue } from '../constants/roles'

interface RoleBadgeProps {
  role: RoleValue
  showTooltip?: boolean
}

const RoleBadge = ({ role, showTooltip = true }: RoleBadgeProps) => {
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
