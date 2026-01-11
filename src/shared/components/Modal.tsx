import { useEffect, ReactNode, MouseEvent } from 'react'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'
type HeaderVariant = 'default' | 'gradient'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: ModalSize
  footer?: ReactNode
  headerVariant?: HeaderVariant
  subtitle?: string
  showCloseButton?: boolean
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer,
  headerVariant = 'default',
  subtitle,
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    if (!closeOnEscape) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose, closeOnEscape])

  if (!isOpen) return null

  const sizeClasses: Record<ModalSize, string> = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  }

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  const headerClasses = headerVariant === 'gradient'
    ? 'bg-gradient-to-r from-orange-500 to-orange-600'
    : 'bg-white border-b border-gray-200'

  const titleClasses = headerVariant === 'gradient'
    ? 'text-xl font-semibold text-white'
    : 'text-xl font-semibold text-gray-900'

  const subtitleClasses = headerVariant === 'gradient'
    ? 'text-sm text-orange-100 mt-0.5'
    : 'text-sm text-gray-500 mt-0.5'

  const closeButtonClasses = headerVariant === 'gradient'
    ? 'text-white hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-600 rounded-lg p-1'
    : 'text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg p-1'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} transform transition-all animate-slideUp max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex items-center justify-between p-6 ${headerClasses}`}>
          <div>
            <h2
              id="modal-title"
              className={titleClasses}
            >
              {title}
            </h2>
            {subtitle && (
              <p className={subtitleClasses}>{subtitle}</p>
            )}
          </div>
          {showCloseButton && (
            <button
              onClick={onClose}
              className={closeButtonClasses}
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>

        {footer && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
