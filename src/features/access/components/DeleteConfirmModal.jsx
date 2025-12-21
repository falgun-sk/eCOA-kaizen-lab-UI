import { useState } from 'react'
import Modal from '../../../shared/components/Modal'

/**
 * DeleteConfirmModal Component
 *
 * Confirmation dialog before deleting a user
 * Shows warning with user name
 *
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback to close modal
 * @param {function} onConfirm - Callback when delete is confirmed
 * @param {string} userName - Name of user to be deleted
 */
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, userName }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  // Handle delete confirmation
  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      console.error('Error deleting user:', error)
      // Error is handled in parent component
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete User" size="sm">
      <div className="space-y-4">
        {/* Warning icon */}
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Warning message */}
        <div className="text-center">
          <p className="text-sm text-gray-700">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-gray-900">{userName}</span>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This action cannot be undone. The user will no longer have access to the system.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Delete User'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteConfirmModal
