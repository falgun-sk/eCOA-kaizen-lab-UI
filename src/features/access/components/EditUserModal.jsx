import { useState, useEffect } from 'react'
import Modal from '../../../shared/components/Modal'
import { getAvailableRoles, getAllStatuses } from '../constants/roles'

/**
 * EditUserModal Component
 *
 * Modal form for editing an existing user
 * Pre-populates fields with current user data
 *
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback to close modal
 * @param {function} onSubmit - Callback with updated data when submitted
 * @param {Object} user - User object to edit
 */
const EditUserModal = ({ isOpen, onClose, onSubmit, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: 'active'
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Available roles and statuses
  const availableRoles = getAvailableRoles()
  const availableStatuses = getAllStatuses()

  // Populate form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        status: user.status || 'active'
      })
    }
  }, [user])

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = 'Role is required'
    }

    return newErrors
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = validateForm()

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true)
      setErrors({})

      try {
        await onSubmit(user.id, formData)
        onClose()
      } catch (error) {
        setErrors({
          general: error.message || 'Failed to update user. Please try again.'
        })
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setErrors(newErrors)
    }
  }

  // Handle modal close
  const handleClose = () => {
    if (!isSubmitting) {
      setErrors({})
      onClose()
    }
  }

  if (!user) return null

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit User" size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* General error message */}
        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        {/* Name field */}
        <div>
          <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1.5">
            Name *
          </label>
          <input
            id="edit-name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 bg-white border ${
              errors.name
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500'
            } rounded-xl text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0`}
            placeholder="Enter full name"
            disabled={isSubmitting}
          />
          {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
        </div>

        {/* Email field */}
        <div>
          <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email *
          </label>
          <input
            id="edit-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 bg-white border ${
              errors.email
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500'
            } rounded-xl text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0`}
            placeholder="user@example.com"
            disabled={isSubmitting}
          />
          {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
        </div>

        {/* Role field */}
        <div>
          <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700 mb-1.5">
            Role *
          </label>
          <select
            id="edit-role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 bg-white border ${
              errors.role
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500'
            } rounded-xl text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 cursor-pointer`}
            disabled={isSubmitting}
          >
            <option value="">Select a role</option>
            {availableRoles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          {errors.role && <p className="mt-1.5 text-xs text-red-600">{errors.role}</p>}
        </div>

        {/* Status field */}
        <div>
          <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-1.5">
            Status
          </label>
          <select
            id="edit-status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 cursor-pointer"
            disabled={isSubmitting}
          >
            {availableStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-orange-500/30 hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default EditUserModal
