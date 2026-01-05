import { ReactNode } from 'react'

type ColorType = 'blue' | 'green' | 'orange' | 'purple' | 'yellow' | 'red'

interface Trend {
  direction: 'up' | 'down'
  value: string
}

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string | number
  color?: ColorType
  trend?: Trend
  onClick?: () => void
}

interface ColorClasses {
  bg: string
  border: string
  icon: string
  text: string
}

const StatCard = ({ icon, label, value, color = 'blue', trend, onClick }: StatCardProps) => {
  const getColorClasses = (): ColorClasses => {
    const colors: Record<ColorType, ColorClasses> = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        text: 'text-blue-900'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'text-green-600',
        text: 'text-green-900'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        icon: 'text-orange-600',
        text: 'text-orange-900'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'text-purple-600',
        text: 'text-purple-900'
      },
      yellow: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: 'text-yellow-600',
        text: 'text-yellow-900'
      },
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'text-red-600',
        text: 'text-red-900'
      }
    }
    return colors[color] || colors.blue
  }

  const colorClasses = getColorClasses()

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-orange-300' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center border ${colorClasses.bg} ${colorClasses.border}`}
        >
          <span className={colorClasses.icon}>{icon}</span>
        </div>
        {trend && (
          <div
            className={`flex items-center space-x-1 text-xs font-medium ${
              trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend.direction === 'up' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

export default StatCard
