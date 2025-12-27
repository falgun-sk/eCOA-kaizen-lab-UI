import { FC, useState } from 'react'

export interface MetadataItem {
  key: string
  label: string
  value: string | number
  copyable?: boolean
  icon?: React.ReactNode
}

export interface MetadataDisplayProps {
  items: MetadataItem[]
  layout?: 'inline' | 'stacked'
  separator?: string
}

const MetadataDisplay: FC<MetadataDisplayProps> = ({
  items,
  layout = 'inline',
  separator = '•'
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleCopy = async (value: string | number, key: string) => {
    try {
      await navigator.clipboard.writeText(String(value))
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const CopyIcon = () => (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  )

  const CheckIcon = () => (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  )

  if (items.length === 0) {
    return null
  }

  if (layout === 'stacked') {
    return (
      <div className="flex flex-col space-y-3">
        {items.map((item) => (
          <div key={item.key} className="flex items-start">
            {item.icon && (
              <span className="mr-2 text-gray-400">{item.icon}</span>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">
                {item.label}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {item.value}
                </span>
                {item.copyable && (
                  <button
                    onClick={() => handleCopy(item.value, item.key)}
                    className="text-gray-400 hover:text-orange-600 transition-colors flex-shrink-0"
                    title={copiedKey === item.key ? 'Copied!' : `Copy ${item.label}`}
                  >
                    {copiedKey === item.key ? <CheckIcon /> : <CopyIcon />}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Inline layout
  return (
    <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5">
      {items.map((item, index) => (
        <div key={item.key} className="flex items-center">
          <div className="flex items-center space-x-1.5">
            {item.icon && (
              <span className="text-gray-400 flex-shrink-0">{item.icon}</span>
            )}
            <span className="text-xs font-medium text-gray-500">
              {item.label}:
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {item.value}
            </span>
            {item.copyable && (
              <button
                onClick={() => handleCopy(item.value, item.key)}
                className="ml-0.5 text-gray-400 hover:text-orange-600 transition-colors flex-shrink-0"
                title={copiedKey === item.key ? 'Copied!' : `Copy ${item.label}`}
              >
                {copiedKey === item.key ? <CheckIcon /> : <CopyIcon />}
              </button>
            )}
          </div>
          {index < items.length - 1 && (
            <span className="mx-3 text-gray-300" aria-hidden="true">
              {separator}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

export default MetadataDisplay
