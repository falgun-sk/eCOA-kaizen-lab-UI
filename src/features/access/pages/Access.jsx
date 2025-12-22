import { useState, useEffect, useCallback } from 'react'
import { usersApi } from '../../../shared/services/api'
import { getMockUsers, createMockUser, updateMockUser, deleteMockUser } from '../data/mockUsers'
import { getAllRoles, getAllStatuses } from '../constants/roles'
import UserTable from '../components/UserTable'
import Pagination from '../../../shared/components/Pagination'
import AddUserModal from '../components/AddUserModal'
import EditUserModal from '../components/EditUserModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import RolePermissionsView from '../components/RolePermissionsView'
import UserPermissionsModal from '../components/UserPermissionsModal'

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
  // Tab state
  const [activeTab, setActiveTab] = useState('users') // 'users' or 'permissions'

  // Data state
  const [users, setUsers] = useState([])
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

  // Fetch users on mount
  useEffect(() => {
    fetchUsers()
  }, [])

  // Fetch users function
  const fetchUsers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Try to fetch from API (will use mock data fallback)
      const response = await usersApi.getUsers()
      // API returns { data: [...], total, page, pageSize }
      setUsers(response.data || [])
    } catch (err) {
      console.error('Error fetching users:', err)
      // Fallback to mock data
      const mockData = getMockUsers()
      setUsers(mockData)
    } finally {
      setIsLoading(false)
    }
  }

  // Apply filters and search
  useEffect(() => {
    let result = [...users]

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
  }, [users, searchQuery, roleFilter, statusFilter])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      // Search is already applied in the effect above
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Handle add user
  const handleAddUser = async (userData) => {
    try {
      // Try API first
      try {
        const newUser = await usersApi.createUser(userData)
        setUsers([newUser, ...users])
      } catch (apiError) {
        // Fallback to mock data
        const newUser = createMockUser(userData)
        setUsers([newUser, ...users])
      }
      setShowAddModal(false)
    } catch (error) {
      console.error('Error adding user:', error)
      throw error
    }
  }

  // Handle edit user
  const handleEditUser = async (userId, userData) => {
    try {
      // Try API first
      try {
        const updatedUser = await usersApi.updateUser(userId, userData)
        // Merge updated data with existing user to preserve all fields
        setUsers(users.map((u) => (u.id === userId ? { ...u, ...updatedUser, ...userData } : u)))
      } catch (apiError) {
        // Fallback to mock data
        const updatedUser = updateMockUser(userId, userData)
        if (updatedUser) {
          setUsers(users.map((u) => (u.id === userId ? { ...u, ...updatedUser, ...userData } : u)))
        } else {
          // If updateMockUser returns null, just update with the form data
          setUsers(users.map((u) => (u.id === userId ? { ...u, ...userData } : u)))
        }
      }
      setShowEditModal(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      // Try API first
      try {
        await usersApi.deleteUser(selectedUser.id)
        setUsers(users.filter((u) => u.id !== selectedUser.id))
      } catch (apiError) {
        // Fallback to mock data
        deleteMockUser(selectedUser.id)
        setUsers(users.filter((u) => u.id !== selectedUser.id))
      }
      setShowDeleteModal(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
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
            <h1 className="text-2xl font-bold text-gray-900">Access Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage user access and permissions
            </p>
          </div>
          {activeTab === 'users' && (
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

        {/* Tabs */}
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
        </div>
      </div>

      {/* Conditional Content Based on Active Tab */}
      {activeTab === 'permissions' ? (
        <RolePermissionsView />
      ) : (
        <>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
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
      <div className="flex-1 mb-6">
        <UserTable
          users={currentUsers}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onViewPermissions={openPermissionsModal}
          isLoading={isLoading}
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
