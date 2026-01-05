import { ReactNode } from 'react'

type ColorType = 'orange' | 'blue' | 'green' | 'purple' | 'yellow'

interface QuickActionProps {
  icon: ReactNode
  title: string
  description: string
  color?: ColorType
  onClick?: () => void
}

const QuickAction = ({ icon, title, description, color = 'orange', onClick }: QuickActionProps) => {
  const getColorClasses = (): string => {
    const colors: Record<ColorType, string> = {
      orange: 'from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border-orange-200',
      blue: 'from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-blue-200',
      green: 'from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-green-200',
      purple: 'from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-200',
      yellow: 'from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 border-yellow-200'
    }
    return colors[color] || colors.orange
  }

  const getIconColorClass = (): string => {
    const colors: Record<ColorType, string> = {
      orange: 'text-orange-600',
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      yellow: 'text-yellow-600'
    }
    return colors[color] || colors.orange
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 p-4 bg-gradient-to-r rounded-lg transition-all duration-200 text-left border w-full ${getColorClasses()}`}
    >
      <span className={`text-2xl ${getIconColorClass()}`}>{icon}</span>
      <div className="flex-1">
        <p className="font-semibold text-gray-900 text-sm">{title}</p>
        <p className="text-xs text-gray-600 mt-0.5">{description}</p>
      </div>
      <svg
        className="w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  )
}

export default QuickAction
