import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const FormPreview = () => {
  const { studyId, formId } = useParams()
  const navigate = useNavigate()

  // Mock form data
  const form = {
    id: formId,
    name: 'Form 1 - Patient Demographics',
    version: 'V1.2',
    status: 'Review',
    screens: [
      { id: 1, name: 'Screen 1', active: true },
      { id: 2, name: 'Screen 2', active: false },
      { id: 3, name: 'Screen 3', active: false }
    ]
  }

  const [activeScreen, setActiveScreen] = useState(1)
  const [comments, setComments] = useState([
    {
      id: 1,
      user: 'M1',
      text: 'Please update the label for question 3',
      timestamp: '2 hours ago',
      screen: 1
    },
    {
      id: 2,
      user: 'M3',
      text: 'Validation rules look good for age field',
      timestamp: '5 hours ago',
      screen: 1
    }
  ])
  const [newComment, setNewComment] = useState('')

  const addComment = () => {
    if (newComment.trim()) {
      setComments([
        {
          id: comments.length + 1,
          user: 'You',
          text: newComment,
          timestamp: 'Just now',
          screen: activeScreen
        },
        ...comments
      ])
      setNewComment('')
    }
  }

  const screenComments = comments.filter(c => c.screen === activeScreen)

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-4">
          <button
            onClick={() => navigate(`/studies/${studyId}/build`)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-3 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Study Build
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{form.name}</h1>
              <p className="text-sm text-gray-500">Version {form.version}</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium border bg-blue-100 text-blue-700 border-blue-300`}>
                {form.status}
              </span>
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                Export PDF
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-lg transition-colors">
                Approve Form
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Three-Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Screen Navigation */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Screens</h3>
            <div className="space-y-1">
              {form.screens.map((screen) => (
                <button
                  key={screen.id}
                  onClick={() => setActiveScreen(screen.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeScreen === screen.id
                      ? 'bg-orange-50 text-orange-600 border border-orange-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{screen.name}</span>
                    {comments.filter(c => c.screen === screen.id).length > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-orange-500 text-white rounded-full">
                        {comments.filter(c => c.screen === screen.id).length}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Form Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Screens:</span>
                <span className="font-medium text-gray-900">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Questions:</span>
                <span className="font-medium text-gray-900">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Comments:</span>
                <span className="font-medium text-gray-900">{comments.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Screen Preview */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-8">
              <div className="mb-6">
                <div className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full mb-4">
                  Screen {activeScreen} of {form.screens.length}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Screen {activeScreen}</h2>
                <p className="text-sm text-gray-500">Preview of form content</p>
              </div>

              {/* Mock Form Content */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter last name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="gender" className="mr-2" disabled />
                      <span className="text-sm text-gray-700">Male</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="gender" className="mr-2" disabled />
                      <span className="text-sm text-gray-700">Female</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="gender" className="mr-2" disabled />
                      <span className="text-sm text-gray-700">Other</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => activeScreen > 1 && setActiveScreen(activeScreen - 1)}
                  disabled={activeScreen === 1}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  Screen {activeScreen} of {form.screens.length}
                </span>
                <button
                  onClick={() => activeScreen < form.screens.length && setActiveScreen(activeScreen + 1)}
                  disabled={activeScreen === form.screens.length}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Comments */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="px-4 py-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Comments</h3>
            <p className="text-xs text-gray-500 mt-1">{screenComments.length} comments on this screen</p>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {screenComments.length > 0 ? (
              screenComments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-900">{comment.user}</span>
                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm text-gray-500">No comments yet</p>
              </div>
            )}
          </div>

          {/* Add Comment */}
          <div className="border-t border-gray-200 p-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment... Use @M1, @M2, @M3 to mention team members"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows={3}
            />
            <button
              onClick={addComment}
              disabled={!newComment.trim()}
              className="w-full mt-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormPreview
