import { ReactNode, InputHTMLAttributes, forwardRef } from 'react'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Input type
   */
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'time' | 'url' | 'tel' | 'search'

  /**
   * Label text for the input
   */
  label?: string

  /**
   * Error message to display
   */
  error?: string

  /**
   * Help text to display below the input
   */
  helpText?: string

  /**
   * Icon to display (usually an SVG element)
   */
  icon?: ReactNode

  /**
   * Position of the icon
   */
  iconPosition?: 'left' | 'right'

  /**
   * Make input take full width of container
   */
  fullWidth?: boolean

  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Reusable Input component with consistent styling, labels, errors, and icons
 *
 * @example
 * ```tsx
 * // Basic input with label
 * <Input
 *   label="Study Name"
 *   placeholder="Enter study name"
 *   required
 * />
 *
 * // Input with error
 * <Input
 *   label="Email"
 *   type="email"
 *   error="Please enter a valid email address"
 * />
 *
 * // Input with icon
 * <Input
 *   label="Search"
 *   icon={<SearchIcon />}
 *   iconPosition="left"
 *   placeholder="Search studies..."
 * />
 *
 * // Input with help text
 * <Input
 *   label="Protocol Number"
 *   helpText="Enter a unique protocol identifier"
 * />
 * ```
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      label,
      error,
      helpText,
      icon,
      iconPosition = 'left',
      fullWidth = true,
      required = false,
      disabled = false,
      className = '',
      ...rest
    },
    ref
  ) => {
    // Determine if input has an icon
    const hasIcon = Boolean(icon)
    const hasLeftIcon = hasIcon && iconPosition === 'left'
    const hasRightIcon = hasIcon && iconPosition === 'right'

    // Input classes
    const inputClasses = `
      ${fullWidth ? 'w-full' : ''}
      px-4 py-2.5
      ${hasLeftIcon ? 'pl-10' : ''}
      ${hasRightIcon ? 'pr-10' : ''}
      bg-white
      border
      ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500'}
      rounded-lg
      text-sm text-gray-900
      placeholder-gray-400
      focus:outline-none focus:ring-2 focus:ring-offset-0
      transition-colors
      disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500
      ${className}
    `.trim().replace(/\s+/g, ' ')

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input container (for icon positioning) */}
        <div className="relative">
          {/* Left icon */}
          {hasLeftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="w-5 h-5 text-gray-400">
                {icon}
              </span>
            </div>
          )}

          {/* Input field */}
          <input
            ref={ref}
            type={type}
            className={inputClasses}
            disabled={disabled}
            required={required}
            {...rest}
          />

          {/* Right icon */}
          {hasRightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="w-5 h-5 text-gray-400">
                {icon}
              </span>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-1.5 text-xs text-red-600">
            {error}
          </p>
        )}

        {/* Help text */}
        {!error && helpText && (
          <p className="mt-1.5 text-xs text-gray-500">
            {helpText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
