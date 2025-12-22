import { COMPONENT_TYPES } from './constants'
import { hasLogic } from './utils'

const FormCanvas = ({
  components,
  selectedComponent,
  onSelectComponent,
  onRemoveComponent,
  onDrop,
  onDragOver
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="min-h-full bg-white rounded-xl border-2 border-dashed border-gray-300 p-8"
      >
        {components.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {components.map((component, index) => (
              <CanvasItem
                key={component.id}
                component={component}
                index={index}
                isSelected={selectedComponent?.id === component.id}
                onSelect={() => onSelectComponent(component)}
                onRemove={() => onRemoveComponent(component.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const EmptyState = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 className="text-lg font-medium text-gray-900 mb-1">Drag components here</h3>
      <p className="text-sm text-gray-500">Start building your form by dragging components from the left</p>
    </div>
  </div>
)

const CanvasItem = ({ component, index, isSelected, onSelect, onRemove }) => {
  const componentType = COMPONENT_TYPES.find(c => c.id === component.type)
  const componentHasLogic = hasLogic(component)

  return (
    <div
      onClick={onSelect}
      className={`p-4 border-2 rounded-lg cursor-pointer transition-all relative ${
        isSelected
          ? 'border-orange-500 bg-orange-50'
          : 'border-gray-200 hover:border-orange-300 bg-white'
      }`}
    >
      {/* Logic Indicators */}
      {componentHasLogic && (
        <div className="absolute top-2 right-12 flex items-center gap-1">
          {component.config?.showHide?.enabled && (
            <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full" title="Show/Hide Logic">👁️</span>
          )}
          {component.config?.skipLogic?.enabled && (
            <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full" title="Skip Logic">⏭️</span>
          )}
          {component.config?.branching?.enabled && (
            <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full" title="Branching Logic">🔀</span>
          )}
          {(component.config?.validation?.pattern || component.config?.validation?.minLength || component.config?.validation?.maxLength || component.config?.validation?.min || component.config?.validation?.max) && (
            <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full" title="Validation Rules">✓</span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{componentType?.icon}</span>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {index + 1}. {component.label}
              {component.config?.required && <span className="text-red-500 ml-1">*</span>}
            </div>
            <div className="text-xs text-gray-500">{component.type}</div>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default FormCanvas
