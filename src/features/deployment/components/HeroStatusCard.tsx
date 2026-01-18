import { DeploymentStats } from '../types'

interface HeroStatusCardProps {
  stats: DeploymentStats
  progress: number
}

const HeroStatusCard = ({ stats, progress }: HeroStatusCardProps) => {
  return (
    <div className="border border-gray-300 rounded-lg bg-white mx-8 my-6">
      <div className="px-6 py-4 border-b border-gray-300">
        <h2 className="text-lg font-semibold text-gray-900">HERO STATUS CARD</h2>
      </div>
      <div className="px-6 py-6">
        <div className="flex items-center gap-8 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">PASS:</span>
            <span className="text-2xl font-bold text-green-600">{stats.passed}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">WARN:</span>
            <span className="text-2xl font-bold text-yellow-600">{stats.warnings}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">FAIL:</span>
            <span className="text-2xl font-bold text-red-600">{stats.failed}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">RUNNING:</span>
            <span className="text-2xl font-bold text-blue-600">{stats.running}</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-8 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-lg font-semibold text-gray-700 min-w-[4rem] text-right">
              {progress}% Complete
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroStatusCard
