import { FC, useState, useRef, useEffect } from 'react'

export interface ActionMenuItem {
  key: string
  label: string
  icon?: React.ReactNode
  onClick: () => void
  variant?: 'default' | 'danger'
  disabled?: boolean
  divider?: boolean
}

export interface ActionMenuProps {
  items: ActionMenuItem[]
  label?: string
  icon?: React.ReactNode
  variant?: 'default' | 'ghost'
}

const ActionMenu: FC<ActionMenuProps> = ({
  items,
  label,
  icon,
  variant = 'default'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleItemClick = (item: ActionMenuItem) => {
    if (!item.disabled) {
      item.onClick()
      setIsOpen(false)
    }
  }

  const DefaultIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
      />
    </svg>
  )

  const buttonClasses =
    variant === 'ghost'
      ? 'p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'
      : 'px-3 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium flex items-center space-x-2'

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClasses}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {icon || <DefaultIcon />}
        {label && variant === 'default' && <span>{label}</span>}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg border border-gray-200 shadow-xl z-20 py-1">
          {items.map((item, index) => (
            <div key={item.key}>
              {item.divider && index > 0 && (
                <div className="my-1 border-t border-gray-200" />
              )}
              <button
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 transition-colors ${
                  item.disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : item.variant === 'danger'
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-gray-700 hover:bg-orange-50'
                }`}
              >
                {item.icon && (
                  <span className="flex-shrink-0 w-4 h-4">{item.icon}</span>
                )}
                <span className="flex-1">{item.label}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ActionMenu
