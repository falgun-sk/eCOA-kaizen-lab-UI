import { COMPONENT_TYPES } from './constants'

const ComponentPalette = ({ onDragStart }) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Components</h3>
        <div className="space-y-2">
          {COMPONENT_TYPES.map((component) => (
            <div
              key={component.id}
              draggable
              onDragStart={(e) => onDragStart(e, component.id)}
              className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-move hover:bg-orange-50 hover:border-orange-300 transition-colors"
            >
              <span className="text-2xl">{component.icon}</span>
              <span className="text-sm font-medium text-gray-700">{component.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ComponentPalette
