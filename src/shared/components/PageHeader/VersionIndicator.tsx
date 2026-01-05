import { FC, useState } from 'react'

export interface VersionHistory {
  version: string
  date: string
  author: string
  changes?: string
}

export interface VersionIndicatorProps {
  current: string
  history?: VersionHistory[]
  showHistory?: boolean
  onVersionClick?: (version: string) => void
}

const VersionIndicator: FC<VersionIndicatorProps> = ({
  current,
  history = [],
  showHistory = false,
  onVersionClick
}) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const handleVersionClick = (version: string) => {
    if (onVersionClick) {
      onVersionClick(version)
    }
    setIsHistoryOpen(false)
  }

  return (
    <div className="relative">
      <div className="flex items-center space-x-1.5">
        <span className="text-xs font-medium text-gray-500">Version:</span>
        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-semibold">
          {current}
        </span>
        {showHistory && history.length > 0 && (
          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
            title="View version history"
          >
            <svg
              className="w-4 h-4"
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
          </button>
        )}
      </div>

      {/* Version History Dropdown */}
      {isHistoryOpen && history.length > 0 && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsHistoryOpen(false)}
          />
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg border border-gray-200 shadow-xl z-20 max-h-96 overflow-y-auto">
            <div className="px-4 py-3 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900">
                Version History
              </h4>
            </div>
            <div className="py-2">
              {history.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleVersionClick(item.version)}
                  className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors border-l-2 border-transparent hover:border-orange-500"
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-900">
                      Version {item.version}
                    </span>
                    {item.version === current && (
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded text-xs font-medium">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    {item.date} • {item.author}
                  </div>
                  {item.changes && (
                    <div className="text-xs text-gray-600 mt-1">
                      {item.changes}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default VersionIndicator
