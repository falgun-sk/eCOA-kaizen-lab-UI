import { ROLES, USER_STATUS, RoleValue, StatusValue } from '../constants/roles'

export interface MockUser {
  id: number
  name: string
  email: string
  role: RoleValue
  status: StatusValue
  lastActive: string
  createdAt: string
}

interface GetUsersParams {
  search?: string
  role?: string
  status?: string
}

interface CreateUserData {
  name: string
  email: string
  role: RoleValue
  status: StatusValue
}

export const mockUsers: MockUser[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@ecoa.com',
    role: ROLES.ADMIN,
    status: USER_STATUS.ACTIVE,
    lastActive: '2025-01-15T10:30:00Z',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.chen@ecoa.com',
    role: ROLES.PROJECT_MANAGER,
    status: USER_STATUS.ACTIVE,
    lastActive: '2025-01-15T09:15:00Z',
    createdAt: '2025-01-02T00:00:00Z'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@ecoa.com',
    role: ROLES.STUDY_DESIGNER,
    status: USER_STATUS.ACTIVE,
    lastActive: '2025-01-14T16:45:00Z',
    createdAt: '2025-01-03T00:00:00Z'
  },
  {
    id: 4,
    name: 'David Kim',
    email: 'david.kim@ecoa.com',
    role: ROLES.BUILD_REVIEWER,
    status: USER_STATUS.INACTIVE,
    lastActive: '2025-01-10T14:20:00Z',
    createdAt: '2025-01-04T00:00:00Z'
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    email: 'lisa.anderson@ecoa.com',
    role: ROLES.UAT_MEMBER,
    status: USER_STATUS.ACTIVE,
    lastActive: '2025-01-15T11:00:00Z',
    createdAt: '2025-01-05T00:00:00Z'
  },
  {
    id: 6,
    name: 'James Williams',
    email: 'james.williams@ecoa.com',
    role: ROLES.SITE_MANAGER,
    status: USER_STATUS.ACTIVE,
    lastActive: '2025-01-15T08:30:00Z',
    createdAt: '2025-01-06T00:00:00Z'
  },
  {
    id: 7,
    name: 'Maria Garcia',
    email: 'maria.garcia@ecoa.com',
    role: ROLES.PROJECT_MANAGER,
    status: USER_STATUS.ACTIVE,
    lastActive: '2025-01-15T10:00:00Z',
    createdAt: '2025-01-07T00:00:00Z'
  },
  {
    id: 8,
    name: 'Robert Taylor',
    email: 'robert.taylor@ecoa.com',
    role: ROLES.STUDY_DESIGNER,
    status: USER_STATUS.ACTIVE,
    lastActive: '2025-01-14T17:30:00Z',
    createdAt: '2025-01-08T00:00:00Z'
  },
  {
    id: 9,
    name: 'Jennifer Martinez',
    email: 'jennifer.martinez@ecoa.com',
    role: ROLES.BUILD_REVIEWER,
    status: USER_STATUS.ACTIVE,
    lastActive: '2025-01-15T09:45:00Z',
    createdAt: '2025-01-09T00:00:00Z'
  },
  {
    id: 10,
    name: 'William Brown',
    email: 'william.brown@ecoa.com',
    role: ROLES.UAT_MEMBER,
    status: USER_STATUS.ACTIVE,
    lastActive: '2025-01-15T11:30:00Z',
    createdAt: '2025-01-10T00:00:00Z'
  },
  {
    id: 11,
    name: 'Patricia Wilson',
    email: 'patricia.wilson@ecoa.com',
    role: ROLES.SITE_MANAGER,
    status: USER_STATUS.INACTIVE,
    lastActive: '2025-01-12T13:00:00Z',
    createdAt: '2025-01-11T00:00:00Z'
  },
  {
    id: 12,
    name: 'Christopher Moore',
    email: 'christopher.moore@ecoa.com',
    role: ROLES.PROJECT_MANAGER,
    status: USER_STATUS.ACTIVE,
    lastActive: '2025-01-15T10:15:00Z',
    createdAt: '2025-01-12T00:00:00Z'
  },
  {
    id: 13,
    name: 'Linda Davis',
    email: 'linda.davis@ecoa.com',
    role: ROLES.STUDY_DESIGNER,
    status: USER_STATUS.INACTIVE,
    lastActive: '2025-01-11T15:00:00Z',
    createdAt: '2025-01-13T00:00:00Z'
  },
  {
    id: 14,
    name: 'Daniel Jackson',
    email: 'daniel.jackson@ecoa.com',
    role: ROLES.BUILD_REVIEWER,
    status: USER_STATUS.ACTIVE,
    lastActive: '2025-01-15T09:00:00Z',
    createdAt: '2025-01-14T00:00:00Z'
  },
  {
    id: 15,
    name: 'Nancy White',
    email: 'nancy.white@ecoa.com',
    role: ROLES.UAT_MEMBER,
    status: USER_STATUS.ACTIVE,
    lastActive: '2025-01-15T12:00:00Z',
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 16,
    name: 'Thomas Harris',
    email: 'thomas.harris@ecoa.com',
    role: ROLES.SITE_MANAGER,
    status: USER_STATUS.ACTIVE,
    lastActive: '2025-01-15T08:45:00Z',
    createdAt: '2025-01-16T00:00:00Z'
  },
  {
    id: 17,
    name: 'Karen Thompson',
    email: 'karen.thompson@ecoa.com',
    role: ROLES.ADMIN,
    status: USER_STATUS.ACTIVE,
    lastActive: '2025-01-15T10:45:00Z',
    createdAt: '2025-01-17T00:00:00Z'
  },
  {
    id: 18,
    name: 'Charles Martin',
    email: 'charles.martin@ecoa.com',
    role: ROLES.STUDY_DESIGNER,
    status: USER_STATUS.ACTIVE,
    lastActive: '2025-01-14T18:00:00Z',
    createdAt: '2025-01-18T00:00:00Z'
  },
  {
    id: 19,
    name: 'Jessica Thompson',
    email: 'jessica.thompson@ecoa.com',
    role: ROLES.PROJECT_MANAGER,
    status: USER_STATUS.ACTIVE,
    lastActive: '2025-01-15T09:30:00Z',
    createdAt: '2025-01-19T00:00:00Z'
  },
  {
    id: 20,
    name: 'Andrew Mitchell',
    email: 'andrew.mitchell@ecoa.com',
    role: ROLES.PROJECT_MANAGER,
    status: USER_STATUS.ACTIVE,
    lastActive: '2025-01-15T11:15:00Z',
    createdAt: '2025-01-20T00:00:00Z'
  },
  {
    id: 21,
    name: 'Rachel Foster',
    email: 'rachel.foster@ecoa.com',
    role: ROLES.PROJECT_MANAGER,
    status: USER_STATUS.ACTIVE,
    lastActive: '2025-01-15T10:45:00Z',
    createdAt: '2025-01-21T00:00:00Z'
  },
  {
    id: 22,
    name: 'Kevin Sanders',
    email: 'kevin.sanders@ecoa.com',
    role: ROLES.PROJECT_MANAGER,
    status: USER_STATUS.INACTIVE,
    lastActive: '2025-01-13T14:20:00Z',
    createdAt: '2025-01-22T00:00:00Z'
  },
  {
    id: 23,
    name: 'Michelle Brooks',
    email: 'michelle.brooks@ecoa.com',
    role: ROLES.PROJECT_MANAGER,
    status: USER_STATUS.ACTIVE,
    lastActive: '2025-01-15T08:50:00Z',
    createdAt: '2025-01-23T00:00:00Z'
  },
  {
    id: 24,
    name: 'Steven Phillips',
    email: 'steven.phillips@ecoa.com',
    role: ROLES.PROJECT_MANAGER,
    status: USER_STATUS.ACTIVE,
    lastActive: '2025-01-15T12:30:00Z',
    createdAt: '2025-01-24T00:00:00Z'
  },
  {
    id: 25,
    name: 'Angela Bennett',
    email: 'angela.bennett@ecoa.com',
    role: ROLES.PROJECT_MANAGER,
    status: USER_STATUS.ACTIVE,
    lastActive: '2025-01-15T09:00:00Z',
    createdAt: '2025-01-25T00:00:00Z'
  },
  {
    id: 26,
    name: 'Brian Coleman',
    email: 'brian.coleman@ecoa.com',
    role: ROLES.PROJECT_MANAGER,
    status: USER_STATUS.PENDING,
    lastActive: '2025-01-10T00:00:00Z',
    createdAt: '2025-01-26T00:00:00Z'
  }
]

export const getMockUsers = (params: GetUsersParams = {}): MockUser[] => {
  let filteredUsers = [...mockUsers]

  if (params.search) {
    const searchLower = params.search.toLowerCase()
    filteredUsers = filteredUsers.filter(user =>
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    )
  }

  if (params.role && params.role !== 'all') {
    filteredUsers = filteredUsers.filter(user => user.role === params.role)
  }

  if (params.status && params.status !== 'all') {
    filteredUsers = filteredUsers.filter(user => user.status === params.status)
  }

  return filteredUsers
}

export const getMockUserById = (id: number): MockUser | null => {
  return mockUsers.find(user => user.id === id) || null
}

export const createMockUser = (userData: CreateUserData): MockUser => {
  const newUser: MockUser = {
    id: Math.max(...mockUsers.map(u => u.id)) + 1,
    ...userData,
    lastActive: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
  mockUsers.push(newUser)
  return newUser
}

export const updateMockUser = (id: number, updates: Partial<CreateUserData>): MockUser | null => {
  const index = mockUsers.findIndex(user => user.id === id)
  if (index === -1) return null

  mockUsers[index] = {
    ...mockUsers[index],
    ...updates,
    lastActive: new Date().toISOString()
  }
  return mockUsers[index]
}

export const deleteMockUser = (id: number): boolean => {
  const index = mockUsers.findIndex(user => user.id === id)
  if (index === -1) return false

  mockUsers.splice(index, 1)
  return true
}
