import { FC, Fragment } from 'react'
import { Link } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
  onClick?: () => void
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: 'chevron' | 'slash'
  showHomeIcon?: boolean
}

const Breadcrumb: FC<BreadcrumbProps> = ({
  items,
  separator = 'chevron',
  showHomeIcon = true
}) => {
  const SeparatorIcon = () => {
    if (separator === 'slash') {
      return (
        <span className="mx-2 text-gray-400" aria-hidden="true">
          /
        </span>
      )
    }
    return (
      <svg
        className="w-4 h-4 mx-2 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    )
  }

  const HomeIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-label="Home"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  )

  if (items.length === 0) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center">
      <ol className="flex items-center flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const isFirst = index === 0

          return (
            <Fragment key={index}>
              <li className="flex items-center">
                {item.href && !isLast ? (
                  <Link
                    to={item.href}
                    className="flex items-center text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
                    onClick={item.onClick}
                  >
                    {isFirst && showHomeIcon && item.icon ? (
                      <span className="mr-1.5">{item.icon}</span>
                    ) : isFirst && showHomeIcon ? (
                      <span className="mr-1.5">
                        <HomeIcon />
                      </span>
                    ) : item.icon ? (
                      <span className="mr-1.5">{item.icon}</span>
                    ) : null}
                    <span>{item.label}</span>
                  </Link>
                ) : item.onClick && !isLast ? (
                  <button
                    onClick={item.onClick}
                    className="flex items-center text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    {isFirst && showHomeIcon && item.icon ? (
                      <span className="mr-1.5">{item.icon}</span>
                    ) : isFirst && showHomeIcon ? (
                      <span className="mr-1.5">
                        <HomeIcon />
                      </span>
                    ) : item.icon ? (
                      <span className="mr-1.5">{item.icon}</span>
                    ) : null}
                    <span>{item.label}</span>
                  </button>
                ) : (
                  <span
                    className="flex items-center text-sm font-medium text-gray-900"
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {isFirst && showHomeIcon && item.icon ? (
                      <span className="mr-1.5">{item.icon}</span>
                    ) : isFirst && showHomeIcon ? (
                      <span className="mr-1.5">
                        <HomeIcon />
                      </span>
                    ) : item.icon ? (
                      <span className="mr-1.5">{item.icon}</span>
                    ) : null}
                    <span>{item.label}</span>
                  </span>
                )}
              </li>
              {!isLast && (
                <li aria-hidden="true">
                  <SeparatorIcon />
                </li>
              )}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
