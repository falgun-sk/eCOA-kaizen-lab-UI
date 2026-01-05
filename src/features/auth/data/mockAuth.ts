/**
 * Mock Authentication Data
 * Used as fallback when backend is unavailable
 */

interface MockUser {
  id: number
  username: string
  password: string
  name: string
  email: string
  role: string
  status: string
}

interface LoginCredentials {
  username: string
  password: string
}

interface LoginResponse {
  token: string
  user: Omit<MockUser, 'password'>
}

interface ForgotPasswordResponse {
  message: string
}

// Mock users for authentication
const mockUsers: MockUser[] = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    name: 'Admin User',
    email: 'admin@ecoa.com',
    role: 'admin',
    status: 'active'
  },
  {
    id: 2,
    username: 'pm_user',
    password: 'pm1234',
    name: 'Project Manager',
    email: 'pm@ecoa.com',
    role: 'project_manager',
    status: 'active'
  },
  {
    id: 3,
    username: 'designer_user',
    password: 'designer123',
    name: 'Study Designer',
    email: 'designer@ecoa.com',
    role: 'study_designer',
    status: 'active'
  },
  {
    id: 4,
    username: 'reviewer_user',
    password: 'reviewer123',
    name: 'Build Reviewer',
    email: 'reviewer@ecoa.com',
    role: 'build_reviewer',
    status: 'active'
  },
  {
    id: 5,
    username: 'uat_user',
    password: 'uat1234',
    name: 'UAT Member',
    email: 'uat@ecoa.com',
    role: 'uat_member',
    status: 'active'
  },
  {
    id: 6,
    username: 'site_user',
    password: 'site1234',
    name: 'Site Manager',
    email: 'site@ecoa.com',
    role: 'site_manager',
    status: 'active'
  },
  {
    id: 7,
    username: 'data_user',
    password: 'data1234',
    name: 'Data Manager',
    email: 'data@ecoa.com',
    role: 'data_manager',
    status: 'active'
  }
]

/**
 * Mock login function
 */
export const mockLogin = ({ username, password }: LoginCredentials): Promise<LoginResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.username === username && u.password === password
      )

      if (user) {
        const token = `mock_token_${user.id}_${Date.now()}`
        const { password: _, ...userWithoutPassword } = user

        resolve({
          token,
          user: userWithoutPassword
        })
      } else {
        reject(new Error('Invalid username or password'))
      }
    }, 500)
  })
}

/**
 * Mock forgot password function
 */
export const mockForgotPassword = (email: string): Promise<ForgotPasswordResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => u.email === email)

      if (user) {
        resolve({
          message: 'Password reset link sent to your email'
        })
      } else {
        reject(new Error('Email not found'))
      }
    }, 500)
  })
}

/**
 * Get all mock users for testing
 */
export const getMockAuthUsers = (): Omit<MockUser, 'password'>[] => {
  return mockUsers.map(({ password, ...user }) => user)
}
