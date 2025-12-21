import { useState } from 'react'
import { getAllRoles, ROLE_DESCRIPTIONS, ROLE_PHASES } from '../constants/roles'

/**
 * RolePermissionsView Component
 *
 * Shows what each role CAN do in a clear, easy-to-understand format
 */
const RolePermissionsView = () => {
  const [selectedRole, setSelectedRole] = useState(null)
  const roles = getAllRoles()

  // Define what each role CAN do
  const rolePermissions = {
    admin: {
      phase: 'All Phases',
      description: 'Account & System Governance',
      responsibilities: [
        'Create and manage users',
        'Assign roles and permissions',
        'Manage sponsor account settings',
        'Control license allocation',
        'Access full system audit logs',
        'Export audit logs',
        'Manage compliance and security settings',
        'View platform-level audit trails'
      ],
      restrictions: [
        'Cannot edit study content',
        'Cannot approve or deploy studies'
      ]
    },
    project_manager: {
      phase: 'Start-Up & Maintenance Phases',
      description: 'Orchestration & Governance',
      responsibilities: [
        'Oversee overall study progress and current phase status',
        'Transition studies across phases (Build → Review → UAT → Production)',
        'Assign Designers, Reviewers, and UAT members to the study',
        'Review and comment on study builds',
        'Ensure all required approvals are completed before deployment',
        'Deploy the study to production (only after mandatory approvals)',
        'Initiate Change Requests when the study is live',
        'Monitor amendment history and version lifecycle',
        'Access audit trails (study versions, user actions, phase transitions)',
        'Upload and manage study-level documents',
        'View deployment readiness',
        'Trigger deployment',
        'Push study to UAT',
        'View and comment in issue logs',
        'Close issues and finalize issue logs',
        'View study status',
        'Trigger change requests',
        'Track device shipments (read-only)'
      ],
      restrictions: [
        'Cannot build or edit forms directly',
        'Cannot create or modify study templates',
        'Cannot add users globally',
        'Cannot manage sites directly',
        'Cannot bypass required approvals'
      ]
    },
    study_designer: {
      phase: 'Start-Up Phase (Read-only post-deployment)',
      description: 'Study Configuration',
      responsibilities: [
        'Build study forms using drag-and-drop components',
        'Create forms from scratch or from approved templates',
        'Create and manage reusable templates',
        'Configure visit schedules and form mappings',
        'Configure logic (skip, show/hide, validation rules)',
        'Preview the study as a deployed mobile application',
        'Submit study builds for review',
        'View reviewer comments and respond inline',
        'Create new study versions when Change Requests are approved',
        'Create studies',
        'Edit study metadata',
        'Configure study settings',
        'Save draft versions',
        'Comment on screens',
        'Respond to comments',
        'View build',
        'Edit/comment in issue logs'
      ],
      restrictions: [
        'Cannot approve builds',
        'Cannot deploy studies',
        'Cannot access users, sites, audit trails, or study-level reports',
        'Cannot modify live study versions directly'
      ]
    },
    build_reviewer: {
      phase: 'Start-Up Phase and Change Requests Only',
      description: 'Review & Feedback',
      responsibilities: [
        'Review study builds during the review phase',
        'Comment on screens, questions, logic, and user experience',
        'Provide structured feedback to Designers',
        'Participate in review cycles before UAT',
        'View build (read-only)',
        'View version history'
      ],
      restrictions: [
        'Read-only access to the builder',
        'Cannot edit forms',
        'Cannot approve final builds',
        'Cannot deploy studies',
        'Cannot access UAT or production data',
        'Cannot respond to comments (can only add comments)'
      ]
    },
    uat_member: {
      phase: 'UAT Phase Only',
      description: 'Validation & Testing',
      responsibilities: [
        'Test the application as a real-world deployed app',
        'Download the app from Play Store / TestFlight',
        'Onboard dummy patients',
        'Validate forms, visits, notifications, alarms, and data capture behavior',
        'Execute UAT test cases',
        'Create issue logs, test scripts, UAT reports, and validation evidence',
        'Verify fixes after changes are applied',
        'Onboard dummy subjects',
        'Execute test scenarios',
        'Edit/comment in issue logs',
        'Close issues and finalize issue log'
      ],
      restrictions: [
        'Cannot modify study configuration',
        'Cannot deploy studies',
        'Cannot access live production data',
        'All findings must be raised as issues or Change Requests'
      ]
    },
    site_manager: {
      phase: 'Maintenance Phase',
      description: 'Site Operations',
      responsibilities: [
        'Grant access to site users (investigators, coordinators)',
        'Manage site onboarding and activation',
        'Respond to site queries',
        'Track and manage device shipments',
        'Monitor site-level compliance and engagement',
        'Access site-level reports and dashboards',
        'Upload and manage site-facing documents (patient guides, site manuals, training materials)',
        'Assign sites',
        'Assign site users',
        'Manage site access',
        'View study status (read-only)'
      ],
      restrictions: [
        'Cannot modify study configuration',
        'Cannot deploy studies',
        'Default: aggregated or blinded patient data only',
        'No access to study design or logic'
      ]
    },
    data_manager: {
      phase: 'Phase 2 (Future)',
      description: 'Data Oversight',
      responsibilities: [
        'Monitor incoming study data',
        'Run data quality checks',
        'Review edit checks',
        'Manage data queries',
        'Export datasets',
        'Lock datasets at study milestones'
      ],
      restrictions: [
        'This role is planned for Phase 2 and not yet available'
      ]
    }
  }

  const handleRoleClick = (roleValue) => {
    setSelectedRole(selectedRole === roleValue ? null : roleValue)
  }

  return (
    <div className="flex-1 flex flex-col p-8 bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
        <p className="text-sm text-gray-500 mt-1">
          See what each role can do in the system
        </p>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roles.map((role) => {
          const permissions = rolePermissions[role.value]
          const isExpanded = selectedRole === role.value
          const isPhase2 = role.value === 'data_manager'

          return (
            <div
              key={role.value}
              className={`bg-white rounded-xl border-2 transition-all duration-200 ${
                isExpanded
                  ? 'border-orange-500 shadow-lg'
                  : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
              } ${isPhase2 ? 'opacity-60' : ''}`}
            >
              {/* Role Header - Clickable */}
              <button
                onClick={() => handleRoleClick(role.value)}
                className="w-full text-left p-6 focus:outline-none"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {role.label}
                        {isPhase2 && (
                          <span className="ml-2 text-xs font-normal text-gray-500">
                            (Phase 2 - Coming Soon)
                          </span>
                        )}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{permissions.description}</p>
                    <div className="inline-block px-3 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-full">
                      {permissions.phase}
                    </div>
                  </div>
                  <svg
                    className={`w-6 h-6 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-4 ${
                      isExpanded ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-gray-200 pt-6">
                  {/* What They CAN Do */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center">
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
                      What This Role Can Do
                    </h4>
                    <ul className="space-y-2">
                      {permissions.responsibilities.map((item, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-700">
                          <span className="text-green-500 mr-2 mt-0.5 flex-shrink-0">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Restrictions */}
                  <div>
                    <h4 className="text-sm font-semibold text-red-700 mb-3 flex items-center">
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
                          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                        />
                      </svg>
                      Restrictions
                    </h4>
                    <ul className="space-y-2">
                      {permissions.restrictions.map((item, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-700">
                          <span className="text-red-500 mr-2 mt-0.5 flex-shrink-0">✗</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Info Note */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
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
            <p className="text-sm text-blue-800 font-medium">
              Click on any role to see detailed permissions
            </p>
            <p className="text-xs text-blue-700 mt-1">
              This platform follows a phase-based role activation model for clear separation
              of duties and audit readiness.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RolePermissionsView
