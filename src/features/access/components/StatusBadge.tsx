import { STATUS_LABELS, STATUS_COLORS, StatusValue, USER_STATUS } from '../constants/roles'

interface StatusBadgeProps {
  status: StatusValue
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const label = STATUS_LABELS[status] || status
  const colors = STATUS_COLORS[status] || STATUS_COLORS[USER_STATUS.INACTIVE]

  const isActive = status === 'active'

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${colors.dot} ${
          isActive ? 'animate-pulse' : ''
        }`}
      ></span>
      {label}
    </span>
  )
}

export default StatusBadge
