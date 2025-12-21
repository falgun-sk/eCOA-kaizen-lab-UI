import { ROLE_LABELS } from '../constants/roles'

/**
 * UserPermissionsModal Component
 *
 * Displays what a specific user can do based on their role
 */
const UserPermissionsModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null

  // Define what each role CAN do
  const rolePermissions = {
    admin: {
      phase: 'All Phases',
      description: 'Account & System Governance',
      permissions: [
        'Create and manage users',
        'Assign roles and permissions',
        'Manage sponsor account settings',
        'Control license allocation',
        'Access full system audit logs',
        'Export audit logs',
        'Manage compliance and security settings',
        'View platform-level audit trails'
      ]
    },
    project_manager: {
      phase: 'Start-Up & Maintenance Phases',
      description: 'Orchestration & Governance',
      permissions: [
        'Oversee overall study progress',
        'Transition studies across phases',
        'Assign team members to studies',
        'Review and comment on study builds',
        'Deploy studies to production',
        'Initiate Change Requests',
        'Monitor amendment history',
        'Access audit trails',
        'Upload study documents',
        'View deployment readiness',
        'Push study to UAT',
        'Manage issue logs',
        'Trigger change requests'
      ]
    },
    study_designer: {
      phase: 'Start-Up Phase',
      description: 'Study Configuration',
      permissions: [
        'Build study forms',
        'Create and manage templates',
        'Configure visit schedules',
        'Configure logic and validation rules',
        'Preview study app',
        'Submit builds for review',
        'Respond to reviewer comments',
        'Create new study versions',
        'Create studies',
        'Edit study metadata',
        'Save draft versions'
      ]
    },
    build_reviewer: {
      phase: 'Start-Up & Change Requests',
      description: 'Review & Feedback',
      permissions: [
        'Review study builds',
        'Comment on screens and logic',
        'Provide feedback to designers',
        'Participate in review cycles',
        'View build history'
      ]
    },
    uat_member: {
      phase: 'UAT Phase Only',
      description: 'Validation & Testing',
      permissions: [
        'Test application',
        'Download UAT app',
        'Onboard dummy patients',
        'Validate forms and visits',
        'Execute test cases',
        'Create issue logs and reports',
        'Verify fixes',
        'Create validation evidence'
      ]
    },
    site_manager: {
      phase: 'Maintenance Phase',
      description: 'Site Operations',
      permissions: [
        'Grant access to site users',
        'Manage site onboarding',
        'Respond to site queries',
        'Track device shipments',
        'Monitor site compliance',
        'Access site reports',
        'Upload site documents',
        'Assign sites and users'
      ]
    },
    data_manager: {
      phase: 'Phase 2 (Future)',
      description: 'Data Oversight',
      permissions: [
        'Monitor study data',
        'Run data quality checks',
        'Manage data queries',
        'Export datasets',
        'Lock datasets'
      ]
    }
  }

  const permissions = rolePermissions[user.role] || {
    phase: 'Unknown',
    description: 'No permissions defined',
    permissions: []
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                <p className="text-sm text-orange-100">{user.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
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
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Role Info */}
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900">
                  {ROLE_LABELS[user.role]}
                </h3>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                  {permissions.phase}
                </span>
              </div>
              <p className="text-sm text-gray-600">{permissions.description}</p>
            </div>

            {/* Permissions List */}
            <div>
              <h4 className="text-sm font-semibold text-green-700 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                What {user.name.split(' ')[0]} Can Do
              </h4>

              {permissions.permissions.length > 0 ? (
                <div className="space-y-2">
                  {permissions.permissions.map((permission, index) => (
                    <div
                      key={index}
                      className="flex items-start p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <span className="text-green-600 mr-3 mt-0.5 flex-shrink-0">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                      <span className="text-sm text-gray-700 flex-1">{permission}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No permissions defined for this role
                </p>
              )}
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
                  <p className="text-xs text-blue-700">
                    Permissions are based on the assigned role and may vary depending on the
                    study phase. User status: <span className="font-semibold">{user.status}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserPermissionsModal
