import { ReactNode, HTMLAttributes } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Optional header content (can be a string or custom JSX)
   */
  header?: ReactNode

  /**
   * Optional footer content (can be a string or custom JSX)
   */
  footer?: ReactNode

  /**
   * Padding size for the card body
   * - none: No padding (p-0)
   * - sm: Small padding (p-4)
   * - md: Medium padding (p-6) - Default
   * - lg: Large padding (p-8)
   */
  padding?: 'none' | 'sm' | 'md' | 'lg'

  /**
   * Enable hover effect (shadow and border color change)
   */
  hover?: boolean

  /**
   * Make the card clickable with cursor pointer
   */
  clickable?: boolean

  /**
   * Card content
   */
  children: ReactNode

  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Reusable Card component with consistent styling, optional header/footer
 *
 * @example
 * ```tsx
 * // Basic card
 * <Card>
 *   <h3>Card Title</h3>
 *   <p>Card content goes here</p>
 * </Card>
 *
 * // Card with header and footer
 * <Card
 *   header={<h3 className="text-lg font-semibold">Study Details</h3>}
 *   footer={<Button>View Details</Button>}
 * >
 *   <p>Study information...</p>
 * </Card>
 *
 * // Clickable card with hover effect
 * <Card hover clickable onClick={() => handleCardClick()}>
 *   <h3>Clickable Card</h3>
 *   <p>This card has hover effects</p>
 * </Card>
 *
 * // Card with custom padding
 * <Card padding="lg">
 *   <p>Card with large padding</p>
 * </Card>
 *
 * // Card with no padding (for custom layouts)
 * <Card padding="none">
 *   <img src="/image.jpg" alt="Header" />
 *   <div className="p-6">
 *     <p>Content with custom padding</p>
 *   </div>
 * </Card>
 * ```
 */
const Card = ({
  header,
  footer,
  padding = 'md',
  hover = false,
  clickable = false,
  children,
  className = '',
  ...rest
}: CardProps) => {
  // Padding classes
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  // Base card classes
  const baseClasses = 'bg-white rounded-xl border border-gray-200'

  // Hover classes
  const hoverClasses = hover
    ? 'hover:shadow-lg hover:border-orange-200 transition-all duration-200'
    : ''

  // Clickable classes
  const clickableClasses = clickable ? 'cursor-pointer' : ''

  // Card body padding (only if no header/footer, otherwise header/footer handle their own padding)
  const bodyPadding = header || footer ? '' : paddingClasses[padding]

  // Combine classes
  const cardClasses = `
    ${baseClasses}
    ${hoverClasses}
    ${clickableClasses}
    ${!header && !footer ? bodyPadding : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <div className={cardClasses} {...rest}>
      {/* Header */}
      {header && (
        <div className={`${paddingClasses[padding]} border-b border-gray-200`}>
          {typeof header === 'string' ? (
            <h3 className="text-base font-semibold text-gray-900">{header}</h3>
          ) : (
            header
          )}
        </div>
      )}

      {/* Body */}
      <div className={header || footer ? paddingClasses[padding] : ''}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className={`${paddingClasses[padding]} border-t border-gray-200`}>
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card
