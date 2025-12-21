const Translations = () => {
  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Translations</h1>
              <p className="text-sm text-gray-500 mt-1">
                Multi-language support for clinical forms
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-12 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 mb-6">
            <svg
              className="w-10 h-10 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Coming in Next Phase
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-8">
            Multi-language translation management will be available in the next version
          </p>

          {/* Features List */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 mb-8">
            <h3 className="text-sm font-semibold text-orange-900 uppercase tracking-wider mb-4">
              Planned Features
            </h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900">Multi-Language Support</p>
                  <p className="text-xs text-gray-600">Translate forms into multiple languages</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900">Translation Progress Tracking</p>
                  <p className="text-xs text-gray-600">Monitor translation completion status</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900">Language Management</p>
                  <p className="text-xs text-gray-600">Add and manage supported languages</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900">Translation Workflow</p>
                  <p className="text-xs text-gray-600">Collaborate with translators and reviewers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Version Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 border border-orange-300 text-orange-700 text-sm font-semibold rounded-full">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Planned for Version 2.0
          </div>
        </div>
      </div>
    </div>
  )
}

export default Translations
