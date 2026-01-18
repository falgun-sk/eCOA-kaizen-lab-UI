import { useEffect, useRef } from 'react'
import { LogEntry } from '../types'

interface LiveLogPanelProps {
  logs: LogEntry[]
}

const LiveLogPanel = ({ logs }: LiveLogPanelProps) => {
  const logEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-600'
      case 'warning':
        return 'text-yellow-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-700'
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 border-b border-gray-300 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">Real-Time Log</h2>
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-900 font-mono text-sm">
        <div className="p-4 space-y-1">
          {logs.map((log, index) => (
            <div key={index} className="flex gap-3">
              <span className="text-gray-400 flex-shrink-0">{log.timestamp}</span>
              <span className={getLogColor(log.type)}>{log.message}</span>
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  )
}

export default LiveLogPanel
