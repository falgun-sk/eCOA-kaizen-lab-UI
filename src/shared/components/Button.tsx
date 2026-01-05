import { ReactNode, ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant of the button
   * - primary: Orange gradient (main actions)
   * - secondary: White with border (secondary actions)
   * - danger: Red gradient (destructive actions)
   * - ghost: Transparent with hover (subtle actions)
   * - outline: Orange outline (tertiary actions)
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'

  /**
   * Size of the button
   * - sm: Small (px-3 py-1.5, text-xs)
   * - md: Medium (px-4 py-2, text-sm) - Default
   * - lg: Large (px-6 py-3, text-base)
   */
  size?: 'sm' | 'md' | 'lg'

  /**
   * Show loading spinner and disable button
   */
  loading?: boolean

  /**
   * Icon to display (usually an SVG element)
   */
  icon?: ReactNode

  /**
   * Position of the icon
   */
  iconPosition?: 'left' | 'right'

  /**
   * Make button take full width of container
   */
  fullWidth?: boolean

  /**
   * Button content
   */
  children: ReactNode
}

/**
 * Reusable Button component with consistent styling across the application
 *
 * @example
 * ```tsx
 * // Primary button
 * <Button variant="primary" size="md">Create Study</Button>
 *
 * // Secondary button with icon
 * <Button variant="secondary" icon={<EditIcon />}>Edit</Button>
 *
 * // Loading state
 * <Button variant="primary" loading>Saving...</Button>
 *
 * // Disabled button
 * <Button variant="primary" disabled>Submit</Button>
 * ```
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) => {
  // Variant styles
  const variantClasses = {
    primary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md shadow-orange-500/30 hover:shadow-lg hover:shadow-orange-500/40',
    secondary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-orange-300',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30',
    ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
    outline: 'border-2 border-orange-500 text-orange-600 hover:bg-orange-50',
  }

  // Size styles
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs font-medium',
    md: 'px-4 py-2 text-sm font-semibold',
    lg: 'px-6 py-3 text-base font-semibold',
  }

  // Icon size based on button size
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  // Loading spinner size based on button size
  const spinnerSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  // Combine classes
  const buttonClasses = `
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    inline-flex items-center justify-center
    rounded-lg
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
    ${className}
  `.trim().replace(/\s+/g, ' ')

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg
      className={`${spinnerSizeClasses[size]} animate-spin`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )

  // Render icon with appropriate spacing
  const renderIcon = () => {
    if (loading) {
      return <LoadingSpinner />
    }

    if (icon) {
      return (
        <span className={iconSizeClasses[size]}>
          {icon}
        </span>
      )
    }

    return null
  }

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      {...rest}
    >
      {/* Icon on left or loading spinner */}
      {(icon || loading) && iconPosition === 'left' && (
        <span className={children ? 'mr-2' : ''}>
          {renderIcon()}
        </span>
      )}

      {/* Button text/content */}
      {children}

      {/* Icon on right */}
      {icon && !loading && iconPosition === 'right' && (
        <span className={children ? 'ml-2' : ''}>
          {renderIcon()}
        </span>
      )}
    </button>
  )
}

export default Button
