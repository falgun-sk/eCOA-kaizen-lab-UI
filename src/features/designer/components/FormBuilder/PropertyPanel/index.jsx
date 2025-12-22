import { useState } from 'react'
import BasicTab from './BasicTab'
import ValidationTab from './ValidationTab'
import LogicTab from './LogicTab'

const PropertyPanel = ({
  selectedComponent,
  allComponents,
  onUpdateComponent,
  onUpdateConfig
}) => {
  const [activeTab, setActiveTab] = useState('basic')

  if (!selectedComponent) {
    return <EmptyState />
  }

  const showValidationAndLogic = !['image', 'file'].includes(selectedComponent.type)

  return (
    <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Component Properties</h3>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          <TabButton
            label="Basic"
            isActive={activeTab === 'basic'}
            onClick={() => setActiveTab('basic')}
          />
          {showValidationAndLogic && (
            <>
              <TabButton
                label="Validation"
                isActive={activeTab === 'validation'}
                onClick={() => setActiveTab('validation')}
              />
              <TabButton
                label="Logic"
                isActive={activeTab === 'logic'}
                onClick={() => setActiveTab('logic')}
              />
            </>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'basic' && (
          <BasicTab
            component={selectedComponent}
            onUpdateComponent={onUpdateComponent}
            onUpdateConfig={onUpdateConfig}
          />
        )}

        {activeTab === 'validation' && showValidationAndLogic && (
          <ValidationTab
            component={selectedComponent}
            onUpdateConfig={onUpdateConfig}
          />
        )}

        {activeTab === 'logic' && showValidationAndLogic && (
          <LogicTab
            component={selectedComponent}
            allComponents={allComponents}
            onUpdateConfig={onUpdateConfig}
          />
        )}
      </div>
    </div>
  )
}

const TabButton = ({ label, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
      isActive
        ? 'border-orange-500 text-orange-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    {label}
  </button>
)

const EmptyState = () => (
  <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
    <div className="p-4">
      <div className="text-center py-12">
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        <p className="text-sm text-gray-500">Select a component to configure</p>
      </div>
    </div>
  </div>
)

export default PropertyPanel
