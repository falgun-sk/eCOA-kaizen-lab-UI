import { FC, ReactNode } from 'react'
import Breadcrumb, { BreadcrumbItem } from './Breadcrumb'
import MetadataDisplay, { MetadataItem } from './MetadataDisplay'
import VersionIndicator, { VersionHistory } from './VersionIndicator'
import ActionMenu, { ActionMenuItem } from './ActionMenu'
import Badge from '../Badge'
import Button from '../Button'

export interface PageHeaderAction {
  label: string
  onClick: () => void
  icon?: ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
  loading?: boolean
  disabled?: boolean
}

export interface PageHeaderProps {
  /** Main title of the page */
  title: string | ReactNode

  /** Optional subtitle/description */
  subtitle?: string

  /** Breadcrumb navigation items */
  breadcrumbs?: BreadcrumbItem[]

  /** Metadata items to display */
  metadata?: MetadataItem[]

  /** Metadata layout (inline or stacked) */
  metadataLayout?: 'inline' | 'stacked'

  /** Status badge */
  status?: {
    label: string
    variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'design' | 'review' | 'inactive'
    showDot?: boolean
    animateDot?: boolean
  }

  /** Version information */
  version?: {
    current: string
    history?: VersionHistory[]
    showHistory?: boolean
    onVersionClick?: (version: string) => void
  }

  /** Primary action button */
  primaryAction?: PageHeaderAction

  /** Secondary action buttons */
  secondaryActions?: PageHeaderAction[]

  /** Menu actions (3-dot menu) */
  menuActions?: ActionMenuItem[]

  /** Additional custom content in header */
  children?: ReactNode

  /** Background color variant */
  background?: 'white' | 'gray'

  /** Border bottom */
  bordered?: boolean
}

const PageHeader: FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  metadata,
  metadataLayout = 'inline',
  status,
  version,
  primaryAction,
  secondaryActions = [],
  menuActions = [],
  children,
  background = 'white',
  bordered = true
}) => {
  const bgClass = background === 'white' ? 'bg-white' : 'bg-gray-50'
  const borderClass = bordered ? 'border-b border-gray-200' : ''

  return (
    <div className={`${bgClass} ${borderClass}`}>
      <div className="px-8 py-6">
        {/* Breadcrumb Navigation */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-4">
            <Breadcrumb items={breadcrumbs} />
          </div>
        )}

        {/* Main Header Content */}
        <div className="flex items-start justify-between gap-6">
          {/* Left: Title, Subtitle, Status, Metadata */}
          <div className="flex-1 min-w-0">
            {/* Title Row */}
            <div className="flex items-center gap-3 mb-2">
              {typeof title === 'string' ? (
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  {title}
                </h1>
              ) : (
                title
              )}

              {/* Status Badge */}
              {status && (
                <Badge
                  variant={status.variant}
                  showDot={status.showDot}
                  animateDot={status.animateDot}
                >
                  {status.label}
                </Badge>
              )}

              {/* Version Indicator */}
              {version && (
                <VersionIndicator
                  current={version.current}
                  history={version.history}
                  showHistory={version.showHistory}
                  onVersionClick={version.onVersionClick}
                />
              )}
            </div>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-sm text-gray-500 mb-3">{subtitle}</p>
            )}

            {/* Metadata */}
            {metadata && metadata.length > 0 && (
              <div className="mt-3">
                <MetadataDisplay items={metadata} layout={metadataLayout} />
              </div>
            )}

            {/* Custom Content */}
            {children && <div className="mt-4">{children}</div>}
          </div>

          {/* Right: Actions */}
          {(primaryAction || secondaryActions.length > 0 || menuActions.length > 0) && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Secondary Actions */}
              {secondaryActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'secondary'}
                  onClick={action.onClick}
                  icon={action.icon}
                  loading={action.loading}
                  disabled={action.disabled}
                >
                  {action.label}
                </Button>
              ))}

              {/* Primary Action */}
              {primaryAction && (
                <Button
                  variant={primaryAction.variant || 'primary'}
                  onClick={primaryAction.onClick}
                  icon={primaryAction.icon}
                  loading={primaryAction.loading}
                  disabled={primaryAction.disabled}
                >
                  {primaryAction.label}
                </Button>
              )}

              {/* Menu Actions */}
              {menuActions.length > 0 && (
                <ActionMenu items={menuActions} variant="ghost" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PageHeader
