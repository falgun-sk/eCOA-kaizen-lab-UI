import { ReactNode } from 'react'
import Modal from './Modal'

type AlertVariant = 'success' | 'error' | 'warning' | 'info'

interface AlertDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string | ReactNode
  variant?: AlertVariant
  buttonText?: string
}

const AlertDialog = ({
  isOpen,
  onClose,
  title,
  message,
  variant = 'info',
  buttonText = 'OK'
}: AlertDialogProps) => {
  const variantConfig = {
    success: {
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      buttonColor: 'bg-green-500 hover:bg-green-600 text-white',
      path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    error: {
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      buttonColor: 'bg-red-500 hover:bg-red-600 text-white',
      path: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    warning: {
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600',
      buttonColor: 'bg-amber-500 hover:bg-amber-600 text-white',
      path: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
    },
    info: {
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      buttonColor: 'bg-blue-500 hover:bg-blue-600 text-white',
      path: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  }

  const config = variantConfig[variant]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="space-y-4">
        {/* Icon */}
        <div className="flex items-center justify-center">
          <div className={`flex items-center justify-center w-16 h-16 rounded-full ${config.bgColor}`}>
            <svg
              className={`w-8 h-8 ${config.iconColor}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={config.path}
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

        {/* Action button */}
        <div className="flex items-center justify-center pt-2">
          <button
            type="button"
            onClick={onClose}
            className={`px-6 py-2 ${config.buttonColor} text-sm font-semibold rounded-lg transition-colors`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default AlertDialog
