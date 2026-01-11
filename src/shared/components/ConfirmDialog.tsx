import { ReactNode } from 'react'
import Modal from './Modal'

type ConfirmVariant = 'danger' | 'warning' | 'info' | 'primary'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  message: string | ReactNode
  confirmText?: string
  cancelText?: string
  variant?: ConfirmVariant
  isLoading?: boolean
  icon?: 'warning' | 'danger' | 'info' | 'question'
}

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
  icon = 'warning'
}: ConfirmDialogProps) => {
  const handleConfirm = async () => {
    await onConfirm()
  }

  const iconConfig = {
    warning: {
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600',
      path: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
    },
    danger: {
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      path: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
    },
    info: {
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      path: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    question: {
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      path: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  }

  const buttonConfig = {
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white',
    info: 'bg-blue-500 hover:bg-blue-600 text-white',
    primary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md shadow-orange-500/30 hover:shadow-lg hover:shadow-orange-500/40'
  }

  const currentIcon = iconConfig[icon]
  const buttonStyle = buttonConfig[variant]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      closeOnBackdropClick={!isLoading}
      closeOnEscape={!isLoading}
    >
      <div className="space-y-4">
        {/* Icon */}
        <div className="flex items-center justify-center">
          <div className={`flex items-center justify-center w-16 h-16 rounded-full ${currentIcon.bgColor}`}>
            <svg
              className={`w-8 h-8 ${currentIcon.iconColor}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={currentIcon.path}
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <div className="text-center">
          {typeof message === 'string' ? (
            <p className="text-sm text-gray-700">{message}</p>
          ) : (
            message
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-4 py-2 ${buttonStyle} text-sm font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
