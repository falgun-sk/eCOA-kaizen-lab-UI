import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { authApi } from '../../../shared/services/api'
import { getAllRoles, getAllStatuses, ROLES } from '../constants/roles'
import UserTable from '../components/UserTable'
import Pagination from '../../../shared/components/Pagination'
import AddUserModal from '../components/AddUserModal'
import EditUserModal from '../components/EditUserModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import RolePermissionsView from '../components/RolePermissionsView'
import UserPermissionsModal from '../components/UserPermissionsModal'
import useAuth from '../../../shared/hooks/useAuth'

/**
 * Access Management Page
 *
 * Main page for managing users with:
 * - Search functionality
 * - Role and status filters
 * - Paginated user table
 * - Add/Edit/Delete operations
 */
const Access = () => {
  // Get current user
  const { user } = useAuth()
  // Check both single role and roles array for admin/super_admin
  const isAdmin = user?.role === ROLES.ADMIN
    || user?.roles?.includes(ROLES.ADMIN)
    || user?.roles?.includes('super_admin')
  // Only SUPER_ADMIN can call GET /v1/auth/users and POST /v1/auth/impersonate
  const isSuperAdmin = user?.roles?.includes('super_admin') || user?.role === 'super_admin'

  // Tab state
  const [activeTab, setActiveTab] = useState('users') // 'users', 'permissions', or 'approvals'

  // Data state
  const [users, setUsers] = useState([])
  const [approvals, setApprovals] = useState([])
  const [approvalsLoading, setApprovalsLoading] = useState(false)
  const [filteredUsers, setFilteredUsers] = useState([])

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // UI state
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showPermissionsModal, setShowPermissionsModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Role and status options
  const allRoles = getAllRoles()
  const allStatuses = getAllStatuses()

  // Fetch users and approvals once user data is loaded
  useEffect(() => {
    if (user) {
      fetchUsers()
      if (isAdmin) {
        fetchApprovals()
      }
    }
  }, [user])

  // Fetch users function — calls GET /v1/auth/users (SUPER_ADMIN only)
  const fetchUsers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      if (isSuperAdmin) {
        const data = await authApi.getAllUsers()
        setUsers(data)
      } else {
        // Non-SUPER_ADMIN can't list users — show empty state
        setUsers([])
        setError('User list is only available for Super Admins. You can still add users.')
      }
    } catch (err) {
      console.error('Error fetching users:', err)
      setError(typeof err?.message === 'string' ? err.message : 'Failed to load users')
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch pending approvals — calls GET /v1/auth/approvals (ADMIN / SUPER_ADMIN)
  const fetchApprovals = async () => {
    setApprovalsLoading(true)
    try {
      const data = await authApi.getPendingApprovals()
      setApprovals(data)
    } catch (err) {
      console.error('Error fetching approvals:', err)
      setApprovals([])
    } finally {
      setApprovalsLoading(false)
    }
  }

  // Handle approve/reject
  const handleApproval = async (approvalId, status) => {
    try {
      await authApi.updateApprovalStatus(approvalId, status)
      toast.success(`Request ${status.toLowerCase()} successfully!`)
      await fetchApprovals()
      // Refresh user list too since approved users now have roles
      if (isSuperAdmin) {
        await fetchUsers()
      }
    } catch (err) {
      toast.error(typeof err?.message === 'string' ? err.message : `Failed to ${status.toLowerCase()} request`)
    }
  }

  // Apply filters and search
  useEffect(() => {
    let result = [...users]

    // For non-admin users, only show users with the same role
    if (!isAdmin && user?.role) {
      result = result.filter((u) => u.role === user.role)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      )
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter((user) => user.role === roleFilter)
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter((user) => user.status === statusFilter)
    }

    setFilteredUsers(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [users, searchQuery, roleFilter, statusFilter, isAdmin, user])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      // Search is already applied in the effect above
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Handle add user — calls POST /v1/auth/signup
  const handleAddUser = async (userData) => {
    try {
      await authApi.createUser({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: userData.role,
      })
      toast.success(`User ${userData.firstName} ${userData.lastName} created successfully!`)
      // Refresh the list if SUPER_ADMIN (only they can see the list)
      if (isSuperAdmin) {
        await fetchUsers()
      }
      setShowAddModal(false)
    } catch (error) {
      console.error('Error adding user:', error)
      toast.error(typeof error?.message === 'string' ? error.message : 'Failed to add user')
      throw new Error(typeof error?.message === 'string' ? error.message : 'Failed to add user')
    }
  }

  // Handle edit user (backend API not available yet)
  const handleEditUser = async (userId, userData) => {
    toast.error('Edit user API is not available yet.')
    setShowEditModal(false)
    setSelectedUser(null)
  }

  // Handle delete user (backend API not available yet)
  const handleDeleteUser = async () => {
    toast.error('Delete user API is not available yet.')
    setShowDeleteModal(false)
    setSelectedUser(null)
  }

  // Handle impersonate — SUPER_ADMIN logs in as another user
  const handleImpersonate = async (targetUser) => {
    try {
      const response = await authApi.impersonate(targetUser.email)
      toast.success(`Switching to ${targetUser.name}...`)
      // Store new tokens
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('refresh_token', response.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.user))
      // Reload to reinitialize with new user's session
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Error impersonating user:', error)
      toast.error('Failed to impersonate: ' + (typeof error?.message === 'string' ? error.message : 'Unknown error'))
    }
  }

  // Open edit modal
  const openEditModal = (user) => {
    setSelectedUser(user)
    setShowEditModal(true)
  }

  // Open delete modal
  const openDeleteModal = (user) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  // Open permissions modal
  const openPermissionsModal = (user) => {
    setSelectedUser(user)
    setShowPermissionsModal(true)
  }

  // Pagination calculations
  const indexOfLastUser = currentPage * pageSize
  const indexOfFirstUser = indexOfLastUser - pageSize
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / pageSize)

  return (
    <div className="flex-1 flex flex-col p-8 bg-gray-50">
      {/* Header with Tabs */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isAdmin ? 'Access Management' : 'Team Directory'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isAdmin ? 'Manage user access and permissions' : 'View team members and their roles'}
            </p>
          </div>
          {activeTab === 'users' && isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-orange-500/30 hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-200"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add User
            </button>
          )}
        </div>

        {/* Tabs - Only show for Admin */}
        {isAdmin && (
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'users'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Users
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'permissions'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Roles & Permissions
            </button>
            <button
              onClick={() => setActiveTab('approvals')}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'approvals'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Approvals
              {approvals.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                  {approvals.length}
                </span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Conditional Content Based on Active Tab */}
      {activeTab === 'approvals' ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Pending Role Approvals</h3>
            <p className="text-sm text-gray-500 mt-1">Review and approve or reject role requests from new users</p>
          </div>
          {approvalsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <p className="ml-3 text-sm text-gray-500">Loading approvals...</p>
            </div>
          ) : approvals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium">No pending approvals</p>
              <p className="text-xs mt-1">All role requests have been processed</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested On</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {approvals.map((approval) => (
                  <tr key={approval.id} className="hover:bg-orange-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{approval.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{approval.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {approval.requestedRole}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(approval.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleApproval(approval.id, 'APPROVED')}
                          className="inline-flex items-center px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 font-medium rounded-lg transition-all duration-200 text-sm"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Approve
                        </button>
                        <button
                          onClick={() => handleApproval(approval.id, 'REJECTED')}
                          className="inline-flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-medium rounded-lg transition-all duration-200 text-sm"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : activeTab === 'permissions' ? (
        <RolePermissionsView />
      ) : (
        <>
          {/* Team Overview */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Team Members */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isAdmin ? 'Total Team Members' : 'Total Project Managers'}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {isAdmin ? users.length : users.filter(u => u.role === user?.role).length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Active Users */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {isAdmin
                      ? users.filter(u => u.status === 'active').length
                      : users.filter(u => u.role === user?.role && u.status === 'active').length
                    }
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Pending Invites */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Invites</p>
                  <p className="text-3xl font-bold text-amber-600 mt-2">
                    {isAdmin
                      ? users.filter(u => u.status === 'pending').length
                      : users.filter(u => u.role === user?.role && u.status === 'pending').length
                    }
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-4 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>

        {/* Role Filter */}
        <div className="w-full sm:w-48">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors cursor-pointer"
          >
            <option value="all">All Roles</option>
            {allRoles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors cursor-pointer"
          >
            <option value="all">All Statuses</option>
            {allStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={fetchUsers}
              className="ml-auto text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Retry
            </button>
          </div>
        </div>
          )}

          {/* User Table */}
          <div className="flex-1 mb-4">
            <UserTable
              users={currentUsers}
              onEdit={isAdmin ? openEditModal : null}
              onDelete={isAdmin ? openDeleteModal : null}
              onViewPermissions={openPermissionsModal}
              onImpersonate={isSuperAdmin ? handleImpersonate : null}
              isLoading={isLoading}
              isAdmin={isAdmin}
            />
          </div>

          {/* Pagination */}
          {!isLoading && filteredUsers.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredUsers.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize)
                setCurrentPage(1)
              }}
            />
          )}

          {/* Modals */}
          <AddUserModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddUser}
          />

          <EditUserModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false)
              setSelectedUser(null)
            }}
            onSubmit={handleEditUser}
            user={selectedUser}
          />

          <DeleteConfirmModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false)
              setSelectedUser(null)
            }}
            onConfirm={handleDeleteUser}
            userName={selectedUser?.name || ''}
          />

          <UserPermissionsModal
            isOpen={showPermissionsModal}
            onClose={() => {
              setShowPermissionsModal(false)
              setSelectedUser(null)
            }}
            user={selectedUser}
          />
        </>
      )}
    </div>
  )
}

export default Access
