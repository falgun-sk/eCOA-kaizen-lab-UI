import { useState } from 'react'
import Modal from '../../../shared/components/Modal'
import { getAvailableRoles, USER_STATUS, getAllStatuses } from '../constants/roles'

/**
 * AddUserModal Component
 *
 * Modal form for adding a new user
 * Includes validation for name, email, and role
 *
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback to close modal
 * @param {function} onSubmit - Callback with form data when submitted
 */
const AddUserModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    status: USER_STATUS.ACTIVE
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Available roles (excluding Phase 2 roles)
  const availableRoles = getAvailableRoles()
  const availableStatuses = getAllStatuses()

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

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
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
        await onSubmit(formData)
        // Reset form on success
        setFormData({
          name: '',
          email: '',
          password: '',
          role: '',
          status: USER_STATUS.ACTIVE
        })
        onClose()
      } catch (error) {
        setErrors({
          general: error.message || 'Failed to add user. Please try again.'
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
      // Reset form
      setFormData({
        name: '',
        email: '',
        role: '',
        status: USER_STATUS.ACTIVE
      })
      setErrors({})
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New User" size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* General error message */}
        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        {/* Name field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
            Name *
          </label>
          <input
            id="name"
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
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email *
          </label>
          <input
            id="email"
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

        {/* Password field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
            Password *
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 bg-white border ${
              errors.password
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500'
            } rounded-xl text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0`}
            placeholder="Minimum 8 characters"
            disabled={isSubmitting}
          />
          {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
        </div>

        {/* Role field */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1.5">
            Role *
          </label>
          <select
            id="role"
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
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1.5">
            Status
          </label>
          <select
            id="status"
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
            {isSubmitting ? 'Adding User...' : 'Add User'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AddUserModal
