import { ReactNode, SelectHTMLAttributes, forwardRef } from 'react'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /**
   * Label text for the select
   */
  label?: string

  /**
   * Error message to display
   */
  error?: string

  /**
   * Help text to display below the select
   */
  helpText?: string

  /**
   * Options for the select dropdown
   */
  options?: SelectOption[]

  /**
   * Placeholder option text
   */
  placeholder?: string

  /**
   * Make select take full width of container
   */
  fullWidth?: boolean

  /**
   * Additional CSS classes
   */
  className?: string

  /**
   * Children (alternative to options prop for custom option rendering)
   */
  children?: ReactNode
}

/**
 * Reusable Select component with consistent styling, labels, errors, and options
 *
 * @example
 * ```tsx
 * // Basic select with options array
 * <Select
 *   label="Study Phase"
 *   options={[
 *     { value: 'phase1', label: 'Phase 1' },
 *     { value: 'phase2', label: 'Phase 2' },
 *     { value: 'phase3', label: 'Phase 3' }
 *   ]}
 *   placeholder="Select phase..."
 *   required
 * />
 *
 * // Select with error
 * <Select
 *   label="Study Status"
 *   error="Please select a status"
 *   options={statusOptions}
 * />
 *
 * // Select with custom children
 * <Select label="Country">
 *   <option value="">Select country...</option>
 *   <option value="us">United States</option>
 *   <option value="uk">United Kingdom</option>
 * </Select>
 * ```
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helpText,
      options,
      placeholder,
      fullWidth = true,
      required = false,
      disabled = false,
      className = '',
      children,
      ...rest
    },
    ref
  ) => {
    // Select classes
    const selectClasses = `
      ${fullWidth ? 'w-full' : ''}
      px-4 py-2.5
      bg-white
      border
      ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500'}
      rounded-lg
      text-sm text-gray-900
      focus:outline-none focus:ring-2 focus:ring-offset-0
      transition-colors
      cursor-pointer
      disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500
      appearance-none
      pr-10
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

        {/* Select container (for chevron icon positioning) */}
        <div className="relative">
          {/* Select field */}
          <select
            ref={ref}
            className={selectClasses}
            disabled={disabled}
            required={required}
            {...rest}
          >
            {/* Placeholder option */}
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {/* Options from array */}
            {options && options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}

            {/* Custom children options */}
            {children}
          </select>

          {/* Chevron down icon */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
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

Select.displayName = 'Select'

export default Select
