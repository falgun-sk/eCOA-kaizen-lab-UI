import { useState, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import ConfirmDialog from '../components/ConfirmDialog'
import AlertDialog from '../components/AlertDialog'

interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info' | 'primary'
  icon?: 'warning' | 'danger' | 'info' | 'question'
}

interface AlertOptions {
  title?: string
  message: string
  variant?: 'success' | 'error' | 'warning' | 'info'
  buttonText?: string
}

/**
 * Custom hook for programmatically showing confirm and alert dialogs
 *
 * @example
 * const dialog = useDialog()
 *
 * // Show confirmation dialog
 * const confirmed = await dialog.confirm({
 *   message: 'Are you sure you want to delete this item?',
 *   variant: 'danger'
 * })
 *
 * if (confirmed) {
 *   // User clicked confirm
 * }
 *
 * // Show alert dialog
 * await dialog.alert({
 *   message: 'Operation completed successfully!',
 *   variant: 'success'
 * })
 */
export const useDialog = () => {
  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const root = createRoot(container)

      const cleanup = () => {
        root.unmount()
        document.body.removeChild(container)
      }

      const handleConfirm = () => {
        cleanup()
        resolve(true)
      }

      const handleClose = () => {
        cleanup()
        resolve(false)
      }

      root.render(
        <ConfirmDialog
          isOpen={true}
          onClose={handleClose}
          onConfirm={handleConfirm}
          title={options.title || 'Confirm Action'}
          message={options.message}
          confirmText={options.confirmText}
          cancelText={options.cancelText}
          variant={options.variant || 'danger'}
          icon={options.icon}
        />
      )
    })
  }, [])

  const alert = useCallback((options: AlertOptions): Promise<void> => {
    return new Promise((resolve) => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const root = createRoot(container)

      const cleanup = () => {
        root.unmount()
        document.body.removeChild(container)
        resolve()
      }

      root.render(
        <AlertDialog
          isOpen={true}
          onClose={cleanup}
          title={options.title || 'Alert'}
          message={options.message}
          variant={options.variant || 'info'}
          buttonText={options.buttonText}
        />
      )
    })
  }, [])

  return { confirm, alert }
}

/**
 * Standalone dialog utilities that can be used without a hook
 * Useful for non-component contexts or utility functions
 */
export const dialog = {
  confirm: (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const root = createRoot(container)

      const cleanup = () => {
        root.unmount()
        document.body.removeChild(container)
      }

      const handleConfirm = () => {
        cleanup()
        resolve(true)
      }

      const handleClose = () => {
        cleanup()
        resolve(false)
      }

      root.render(
        <ConfirmDialog
          isOpen={true}
          onClose={handleClose}
          onConfirm={handleConfirm}
          title={options.title || 'Confirm Action'}
          message={options.message}
          confirmText={options.confirmText}
          cancelText={options.cancelText}
          variant={options.variant || 'danger'}
          icon={options.icon}
        />
      )
    })
  },

  alert: (options: AlertOptions): Promise<void> => {
    return new Promise((resolve) => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const root = createRoot(container)

      const cleanup = () => {
        root.unmount()
        document.body.removeChild(container)
        resolve()
      }

      root.render(
        <AlertDialog
          isOpen={true}
          onClose={cleanup}
          title={options.title || 'Alert'}
          message={options.message}
          variant={options.variant || 'info'}
          buttonText={options.buttonText}
        />
      )
    })
  }
}

export default useDialog
