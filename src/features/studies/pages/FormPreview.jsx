import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const FormPreview = () => {
  const { studyId, formId } = useParams()
  const navigate = useNavigate()

  // Mock form questions (one question per page)
  const questions = [
    {
      id: 1,
      type: 'text',
      label: 'First Name',
      required: true,
      placeholder: 'Enter first name',
      helpText: 'Please enter your legal first name'
    },
    {
      id: 2,
      type: 'text',
      label: 'Last Name',
      required: true,
      placeholder: 'Enter last name'
    },
    {
      id: 3,
      type: 'date',
      label: 'Date of Birth',
      required: true
    },
    {
      id: 4,
      type: 'radio',
      label: 'Gender',
      required: true,
      options: ['Male', 'Female', 'Other']
    },
    {
      id: 5,
      type: 'email',
      label: 'Email Address',
      required: false,
      placeholder: 'Enter email'
    }
  ]

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [formStatus, setFormStatus] = useState('Review')
  const [comments, setComments] = useState([
    {
      id: 1,
      user: 'John Doe',
      text: 'Please update the label for question 3',
      timestamp: '2 hours ago',
      questionId: 3
    },
    {
      id: 2,
      user: 'Mike Johnson',
      text: 'Validation rules look good for age field',
      timestamp: '5 hours ago',
      questionId: 1
    }
  ])
  const [newComment, setNewComment] = useState('')

  const statusOptions = ['Draft', 'Review', 'Finalized', 'Pending Sig', 'Approved']

  const getStatusColor = (status) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-700 border-gray-300',
      'Review': 'bg-blue-100 text-blue-700 border-blue-300',
      'Finalized': 'bg-green-100 text-green-700 border-green-300',
      'Pending Sig': 'bg-amber-100 text-amber-700 border-amber-300',
      'Approved': 'bg-emerald-100 text-emerald-700 border-emerald-300'
    }
    return colors[status] || colors['Draft']
  }

  const handleStatusChange = (newStatus) => {
    setFormStatus(newStatus)
  }

  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    })
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const addComment = () => {
    if (newComment.trim()) {
      setComments([
        {
          id: comments.length + 1,
          user: 'You',
          text: newComment,
          timestamp: 'Just now',
          questionId: questions[currentQuestion].id
        },
        ...comments
      ])
      setNewComment('')
    }
  }

  const currentQuestionData = questions[currentQuestion]
  const questionComments = comments.filter(c => c.questionId === currentQuestionData.id)
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const renderQuestionInput = () => {
    const currentAnswer = answers[currentQuestionData.id] || ''

    switch (currentQuestionData.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={currentQuestionData.type}
            placeholder={currentQuestionData.placeholder}
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(currentQuestionData.id, e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
          />
        )
      case 'date':
        return (
          <input
            type="date"
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(currentQuestionData.id, e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
          />
        )
      case 'radio':
        return (
          <div className="space-y-3">
            {currentQuestionData.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  currentAnswer === option
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestionData.id}`}
                  value={option}
                  checked={currentAnswer === option}
                  onChange={(e) => handleAnswerChange(currentQuestionData.id, e.target.value)}
                  className="w-5 h-5 text-orange-600 focus:ring-orange-500 focus:ring-2"
                />
                <span className={`text-lg ${currentAnswer === option ? 'text-orange-900 font-medium' : 'text-gray-700'}`}>
                  {option}
                </span>
              </label>
            ))}
          </div>
        )
      default:
        return null
    }
  }

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
              <h1 className="text-xl font-semibold text-gray-900">Form 1 - Patient Demographics</h1>
              <p className="text-sm text-gray-500">Interactive Mobile Preview</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Question {currentQuestion + 1} of {questions.length}</span>
              </div>

              {/* Status Dropdown */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <select
                  value={formStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`text-sm font-medium border-2 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all cursor-pointer ${getStatusColor(formStatus)}`}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Center - Mobile Preview */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-8 flex items-center justify-center">
          {/* Mobile Device Frame */}
          <div className="w-full max-w-md">
            {/* Phone Frame */}
            <div className="bg-white rounded-[3rem] shadow-2xl border-[14px] border-gray-900 overflow-hidden flex-shrink-0">
              {/* Phone Notch */}
              <div className="bg-gray-900 h-6 flex-shrink-0 flex items-center justify-center">
                <div className="w-32 h-4 bg-black rounded-b-2xl"></div>
              </div>

              {/* Phone Screen Content */}
              <div className="bg-gradient-to-b from-white to-gray-50 h-[580px] flex-shrink-0 flex flex-col">
                {/* Progress Bar */}
                <div className="px-5 pt-5 pb-3">
                  <div className="flex items-center justify-between mb-3 text-xs font-medium text-gray-600">
                    <span className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Question {currentQuestion + 1}/{questions.length}</span>
                    </span>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                      {Math.round(progress)}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 h-2.5 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Question Content */}
                <div className="flex-1 px-6 py-6 overflow-y-auto">
                  <div className="mb-6">
                    <div className="flex items-start space-x-2 mb-3">
                      {currentQuestionData.required && (
                        <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">
                          *
                        </span>
                      )}
                      <h2 className="text-xl font-bold text-gray-900 leading-tight">
                        {currentQuestionData.label}
                      </h2>
                    </div>
                    {currentQuestionData.helpText && (
                      <div className="flex items-start space-x-2 bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
                        <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-blue-800">{currentQuestionData.helpText}</p>
                      </div>
                    )}
                  </div>

                  {renderQuestionInput()}

                  {/* Answer Indicator */}
                  {answers[currentQuestionData.id] && (
                    <div className="mt-4 flex items-center space-x-2 text-sm text-green-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Answer recorded</span>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="px-6 py-4 border-t-2 border-gray-200 bg-white">
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={handlePrevious}
                      disabled={currentQuestion === 0}
                      className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${
                        currentQuestion === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-500 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span>Previous</span>
                    </button>
                    <button
                      onClick={handleNext}
                      className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 shadow-md hover:shadow-lg ${
                        currentQuestion === questions.length - 1
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                          : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                      }`}
                    >
                      <span>{currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}</span>
                      {currentQuestion === questions.length - 1 ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Progress Dots */}
                  <div className="flex items-center justify-center space-x-2 mt-4">
                    {questions.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentQuestion(index)}
                        className={`transition-all duration-300 rounded-full ${
                          index === currentQuestion
                            ? 'w-8 h-2.5 bg-orange-500'
                            : answers[questions[index].id]
                            ? 'w-2.5 h-2.5 bg-green-400'
                            : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                        }`}
                        title={`Question ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Phone Home Indicator */}
              <div className="bg-gray-900 h-6 flex-shrink-0 flex items-center justify-center">
                <div className="w-24 h-1 bg-gray-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Comments */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
            <p className="text-sm text-gray-500 mt-1">
              {questionComments.length} comment{questionComments.length !== 1 ? 's' : ''} on this question
            </p>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {questionComments.length > 0 ? (
              questionComments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900">{comment.user}</span>
                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">No comments on this question yet</p>
              </div>
            )}
          </div>

          {/* Add Comment */}
          <div className="border-t border-gray-200 p-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment... Use @ to mention team members"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows={3}
            />
            <button
              onClick={addComment}
              disabled={!newComment.trim()}
              className="mt-2 w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
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
