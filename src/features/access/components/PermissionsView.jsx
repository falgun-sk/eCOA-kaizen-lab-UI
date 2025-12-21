import { useState } from 'react'
import { getAllRoles } from '../constants/roles'
import { PERMISSIONS_MATRIX, PERMISSION_CATEGORIES, getPermissionDisplay } from '../data/permissions'

/**
 * PermissionsView Component
 *
 * Displays a comprehensive permissions matrix showing what each role can do
 */
const PermissionsView = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const roles = getAllRoles()

  const categories = Object.keys(PERMISSION_CATEGORIES)
  const filteredMatrix =
    selectedCategory === 'all'
      ? PERMISSIONS_MATRIX
      : { [PERMISSION_CATEGORIES[selectedCategory]]: PERMISSIONS_MATRIX[PERMISSION_CATEGORIES[selectedCategory]] }

  return (
    <div className="flex-1 flex flex-col p-8 bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
        <p className="text-sm text-gray-500 mt-1">
          Comprehensive permission matrix for all user roles
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {PERMISSION_CATEGORIES[cat]}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getPermissionDisplay('allowed').icon}</span>
            <span className="text-sm text-gray-600">Allowed</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getPermissionDisplay('read_only').icon}</span>
            <span className="text-sm text-gray-600">Read Only</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getPermissionDisplay('approval_required').icon}</span>
            <span className="text-sm text-gray-600">Approval Required</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getPermissionDisplay('not_allowed').icon}</span>
            <span className="text-sm text-gray-600">Not Allowed</span>
          </div>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="flex-1 overflow-auto bg-white rounded-xl border border-gray-200">
        {Object.entries(filteredMatrix).map(([category, capabilities]) => (
          <div key={category} className="border-b border-gray-200 last:border-b-0">
            {/* Category Header */}
            <div className="sticky top-0 bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-200 z-10">
              <h2 className="text-lg font-semibold text-orange-900">{category}</h2>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[250px]">
                      Capability
                    </th>
                    {roles.map((role) => (
                      <th
                        key={role.value}
                        className="text-center px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]"
                      >
                        {role.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {capabilities.map((item, index) => (
                    <tr
                      key={index}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.capability}
                      </td>
                      {roles.map((role) => {
                        const permission = item.permissions[role.value]
                        const display = getPermissionDisplay(permission)
                        return (
                          <td key={role.value} className="px-4 py-4 text-center">
                            <div className="inline-flex items-center justify-center">
                              <span className="text-xl" title={display.label}>
                                {display.icon}
                              </span>
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Info Note */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <svg
            className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <p className="text-sm text-blue-800 font-medium">Phase-Based Role Activation</p>
            <p className="text-xs text-blue-700 mt-1">
              This platform follows a phase-based role activation model, ensuring clear
              separation of duties, audit readiness, and real-world clinical alignment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PermissionsView
