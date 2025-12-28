import { useState, useEffect } from 'react'
import useAuth from '../../../shared/hooks/useAuth'

const ReviewPanel = ({ studyId, study, onStatusChange }) => {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [approvalAction, setApprovalAction] = useState(null)
  const [approvalNotes, setApprovalNotes] = useState('')

  // Load comments from localStorage
  useEffect(() => {
    const loadComments = () => {
      try {
        const savedComments = localStorage.getItem(`study-${studyId}-comments`)
        if (savedComments) {
          setComments(JSON.parse(savedComments))
        }
      } catch (error) {
        console.error('Error loading comments:', error)
      }
    }

    if (studyId) {
      loadComments()
    }
  }, [studyId])

  // Save comments to localStorage
  const saveComments = (updatedComments) => {
    try {
      localStorage.setItem(`study-${studyId}-comments`, JSON.stringify(updatedComments))
      setComments(updatedComments)
    } catch (error) {
      console.error('Error saving comments:', error)
    }
  }

  // Add a new comment
  const handleAddComment = () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)

    const comment = {
      id: Date.now(),
      text: newComment,
      author: user?.name || 'Unknown User',
      role: user?.role || 'unknown',
      timestamp: new Date().toISOString(),
      status: study?.status || 'Review'
    }

    const updatedComments = [...comments, comment]
    saveComments(updatedComments)
    setNewComment('')
    setIsSubmitting(false)
  }

  // Handle approval/rejection
  const handleApproval = (action) => {
    setApprovalAction(action)
    setShowApprovalModal(true)
  }

  const confirmApproval = () => {
    if (approvalAction === 'approve') {
      // Add approval comment
      const approvalComment = {
        id: Date.now(),
        text: approvalNotes || 'Study approved',
        author: user?.name || 'Unknown User',
        role: user?.role || 'unknown',
        timestamp: new Date().toISOString(),
        status: 'Approved',
        isSystemAction: true,
        actionType: 'approved'
      }

      const updatedComments = [...comments, approvalComment]
      saveComments(updatedComments)

      // Change status based on current state
      if (study.status === 'Review') {
        onStatusChange('UAT')
      } else if (study.status === 'UAT') {
        onStatusChange('Approved')
      }
    } else if (approvalAction === 'reject') {
      // Add rejection comment
      const rejectionComment = {
        id: Date.now(),
        text: approvalNotes || 'Changes requested',
        author: user?.name || 'Unknown User',
        role: user?.role || 'unknown',
        timestamp: new Date().toISOString(),
        status: 'Design',
        isSystemAction: true,
        actionType: 'rejected'
      }

      const updatedComments = [...comments, rejectionComment]
      saveComments(updatedComments)

      // Revert to Design status
      onStatusChange('Design')
    }

    setShowApprovalModal(false)
    setApprovalAction(null)
    setApprovalNotes('')
  }

  // Check if user can review (build_reviewer for Review status, uat_member for UAT status)
  const canReview = () => {
    if (user?.role === 'admin' || user?.role === 'project_manager') return true
    if (study?.status === 'Review' && user?.role === 'build_reviewer') return true
    if (study?.status === 'UAT' && user?.role === 'uat_member') return true
    return false
  }

  // Get role label
  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Administrator',
      project_manager: 'Project Manager',
      study_designer: 'Study Designer',
      build_reviewer: 'Build Reviewer',
      uat_member: 'UAT Member',
      site_manager: 'Site Manager',
      data_manager: 'Data Manager'
    }
    return labels[role] || role
  }

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Review & Feedback</h2>
            <p className="text-sm text-blue-100 mt-0.5">
              {study?.status === 'Review' && 'Build review in progress'}
              {study?.status === 'UAT' && 'User acceptance testing in progress'}
              {study?.status === 'Approved' && 'Study has been approved'}
              {study?.status === 'Design' && 'Study in design phase'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center">
              <svg className="w-4 h-4 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span className="text-sm font-medium text-white">{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="p-6">
        {comments.length > 0 ? (
          <div className="space-y-4 mb-6">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className={`p-4 rounded-lg border ${
                  comment.isSystemAction
                    ? comment.actionType === 'approved'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                      comment.isSystemAction
                        ? comment.actionType === 'approved'
                          ? 'bg-green-500'
                          : 'bg-red-500'
                        : 'bg-orange-500'
                    }`}>
                      {comment.author.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-semibold text-gray-900">{comment.author}</p>
                      <p className="text-xs text-gray-500">{getRoleLabel(comment.role)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {comment.isSystemAction && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        comment.actionType === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {comment.actionType === 'approved' ? (
                          <>
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Approved
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Changes Requested
                          </>
                        )}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">{formatTimestamp(comment.timestamp)}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 ml-11">{comment.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 mb-6">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <p className="text-sm text-gray-500">No comments yet. Be the first to add feedback.</p>
          </div>
        )}

        {/* Add Comment Section */}
        {(study?.status === 'Review' || study?.status === 'UAT') && (
          <div className="border-t border-gray-200 pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Add Comment</label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your feedback or suggestions..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-gray-500">
                {canReview() ? 'You can add comments and approve/request changes' : 'You can add comments to this review'}
              </p>
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim() || isSubmitting}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Comment
              </button>
            </div>
          </div>
        )}

        {/* Approval Actions */}
        {canReview() && (study?.status === 'Review' || study?.status === 'UAT') && (
          <div className="border-t border-gray-200 pt-6 mt-6">
            <p className="text-sm font-medium text-gray-700 mb-4">Review Actions</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleApproval('approve')}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-green-500/30 transition-all"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {study?.status === 'Review' ? 'Approve for UAT' : 'Approve Study'}
              </button>
              <button
                onClick={() => handleApproval('reject')}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-red-500/30 transition-all"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Request Changes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className={`px-6 py-4 border-b border-gray-200 bg-gradient-to-r ${
              approvalAction === 'approve'
                ? 'from-green-500 to-green-600'
                : 'from-red-500 to-red-600'
            }`}>
              <h2 className="text-xl font-semibold text-white">
                {approvalAction === 'approve' ? 'Approve Study' : 'Request Changes'}
              </h2>
              <p className="text-sm text-white/90 mt-1">
                {approvalAction === 'approve'
                  ? `Approve this study for ${study?.status === 'Review' ? 'UAT' : 'production'}`
                  : 'Send this study back to design with your feedback'
                }
              </p>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {approvalAction === 'approve' ? 'Approval Notes (Optional)' : 'Change Request Details'}
              </label>
              <textarea
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder={
                  approvalAction === 'approve'
                    ? 'Add any notes about this approval...'
                    : 'Describe what changes are needed...'
                }
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowApprovalModal(false)
                  setApprovalAction(null)
                  setApprovalNotes('')
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmApproval}
                className={`px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md transition-all ${
                  approvalAction === 'approve'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-500/30'
                    : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/30'
                }`}
              >
                {approvalAction === 'approve' ? 'Confirm Approval' : 'Request Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReviewPanel
