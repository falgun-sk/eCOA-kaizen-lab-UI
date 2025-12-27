import { TextareaHTMLAttributes, forwardRef } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Label text for the textarea
   */
  label?: string

  /**
   * Error message to display
   */
  error?: string

  /**
   * Help text to display below the textarea
   */
  helpText?: string

  /**
   * Number of visible text rows
   */
  rows?: number

  /**
   * Maximum length of text (shows character counter)
   */
  maxLength?: number

  /**
   * Show character counter
   */
  showCounter?: boolean

  /**
   * Make textarea take full width of container
   */
  fullWidth?: boolean

  /**
   * Allow textarea to be resized by user
   * - none: Not resizable
   * - vertical: Resizable vertically only
   * - horizontal: Resizable horizontally only
   * - both: Resizable in both directions
   */
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'

  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Reusable Textarea component with consistent styling, labels, errors, and character counter
 *
 * @example
 * ```tsx
 * // Basic textarea with label
 * <Textarea
 *   label="Description"
 *   placeholder="Enter study description"
 *   rows={4}
 *   required
 * />
 *
 * // Textarea with error
 * <Textarea
 *   label="Notes"
 *   error="Notes must be at least 10 characters"
 *   value={notes}
 *   onChange={(e) => setNotes(e.target.value)}
 * />
 *
 * // Textarea with character counter
 * <Textarea
 *   label="Comments"
 *   maxLength={500}
 *   showCounter
 *   placeholder="Add your comments..."
 * />
 *
 * // Resizable textarea
 * <Textarea
 *   label="Feedback"
 *   resize="vertical"
 *   rows={6}
 * />
 * ```
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helpText,
      rows = 4,
      maxLength,
      showCounter = false,
      fullWidth = true,
      resize = 'none',
      required = false,
      disabled = false,
      className = '',
      value,
      ...rest
    },
    ref
  ) => {
    // Calculate character count
    const currentLength = typeof value === 'string' ? value.length : 0
    const showCharCounter = showCounter || maxLength !== undefined

    // Resize classes
    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    }

    // Textarea classes
    const textareaClasses = `
      ${fullWidth ? 'w-full' : ''}
      px-4 py-2.5
      bg-white
      border
      ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500'}
      rounded-lg
      text-sm text-gray-900
      placeholder-gray-400
      focus:outline-none focus:ring-2 focus:ring-offset-0
      transition-colors
      disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500
      ${resizeClasses[resize]}
      ${className}
    `.trim().replace(/\s+/g, ' ')

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {/* Label */}
        {label && (
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-gray-700">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {/* Character counter (in label) */}
            {showCharCounter && (
              <span className="text-xs text-gray-500">
                {maxLength ? `${currentLength}/${maxLength}` : currentLength}
              </span>
            )}
          </div>
        )}

        {/* Textarea field */}
        <textarea
          ref={ref}
          rows={rows}
          maxLength={maxLength}
          className={textareaClasses}
          disabled={disabled}
          required={required}
          value={value}
          {...rest}
        />

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

Textarea.displayName = 'Textarea'

export default Textarea
