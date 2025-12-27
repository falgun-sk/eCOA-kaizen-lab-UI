import { ReactNode } from 'react'

export interface BadgeProps {
  /**
   * Visual variant of the badge
   * - default: Gray (neutral status)
   * - success: Green (completed, active, production)
   * - error: Red (failed, error, high priority)
   * - warning: Amber (pending, UAT, review)
   * - info: Blue (draft, information)
   * - purple: Purple (admin role)
   * - pink: Pink (UAT member role)
   * - cyan: Cyan (site manager role)
   * - design: Orange (design phase - clinical specific)
   * - review: Indigo (review phase - clinical specific)
   * - inactive: Slate (inactive status - clinical specific)
   */
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'purple' | 'pink' | 'cyan' | 'design' | 'review' | 'inactive'

  /**
   * Custom color scheme for the badge
   * Overrides the variant colors if provided
   */
  colorScheme?: {
    bg: string
    text: string
    border: string
    dot?: string
  }

  /**
   * Size of the badge
   * - sm: Small (px-2 py-0.5)
   * - md: Medium (px-2.5 py-0.5) - Default, standardized
   */
  size?: 'sm' | 'md'

  /**
   * Border radius style
   * - md: Rounded medium (status badges)
   * - full: Fully rounded pill (count badges)
   */
  rounded?: 'md' | 'full'

  /**
   * Show a dot indicator before the text
   */
  showDot?: boolean

  /**
   * Animate the dot (pulse effect for active states)
   */
  animateDot?: boolean

  /**
   * Badge content
   */
  children: ReactNode

  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Reusable Badge component for status indicators, roles, and labels
 * Replaces RoleBadge and StatusBadge with a unified component
 *
 * @example
 * ```tsx
 * // Status badge
 * <Badge variant="success">Active</Badge>
 *
 * // Status badge with animated dot
 * <Badge variant="success" showDot animateDot>Production</Badge>
 *
 * // Role badge
 * <Badge variant="purple">Admin</Badge>
 *
 * // Custom color badge
 * <Badge colorScheme={{ bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' }}>
 *   Custom
 * </Badge>
 *
 * // Pill badge
 * <Badge variant="info" rounded="full">5 new</Badge>
 * ```
 */
const Badge = ({
  variant = 'default',
  colorScheme,
  size = 'md',
  rounded = 'md',
  showDot = false,
  animateDot = false,
  children,
  className = '',
}: BadgeProps) => {
  // Variant color schemes
  const variantColors = {
    default: {
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      border: 'border-gray-200',
      dot: 'bg-gray-500',
    },
    success: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      dot: 'bg-green-500',
    },
    error: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-200',
      dot: 'bg-red-500',
    },
    warning: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
    },
    info: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      dot: 'bg-blue-500',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      dot: 'bg-purple-500',
    },
    pink: {
      bg: 'bg-pink-50',
      text: 'text-pink-700',
      border: 'border-pink-200',
      dot: 'bg-pink-500',
    },
    cyan: {
      bg: 'bg-cyan-50',
      text: 'text-cyan-700',
      border: 'border-cyan-200',
      dot: 'bg-cyan-500',
    },
    design: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      dot: 'bg-orange-500',
    },
    review: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      dot: 'bg-indigo-500',
    },
    inactive: {
      bg: 'bg-slate-50',
      text: 'text-slate-600',
      border: 'border-slate-200',
      dot: 'bg-slate-400',
    },
  }

  // Use custom color scheme if provided, otherwise use variant
  const colors = colorScheme || variantColors[variant]

  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5',
    md: 'px-2.5 py-0.5',  // Standardized padding
  }

  // Rounded classes
  const roundedClasses = {
    md: 'rounded-md',
    full: 'rounded-full',
  }

  // Combine classes
  const badgeClasses = `
    inline-flex items-center
    ${sizeClasses[size]}
    ${roundedClasses[rounded]}
    text-xs font-medium
    border
    ${colors.bg}
    ${colors.text}
    ${colors.border}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <span className={badgeClasses}>
      {/* Dot indicator */}
      {showDot && (
        <span
          className={`
            w-1.5 h-1.5 rounded-full mr-1.5
            ${colors.dot || 'bg-current'}
            ${animateDot ? 'animate-pulse' : ''}
          `.trim().replace(/\s+/g, ' ')}
        />
      )}

      {/* Badge content */}
      {children}
    </span>
  )
}

export default Badge
