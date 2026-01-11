import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { dialog } from '../../../shared/hooks/useDialog'

const DesignerNotes = () => {
  const { studyId } = useParams()
  const navigate = useNavigate()

  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Form Design Considerations',
      content: 'Consider adding skip logic for question 5 based on answer from question 3.',
      createdBy: 'Study Designer',
      createdAt: '2024-12-15 10:30',
      updatedAt: '2024-12-15 14:20'
    },
    {
      id: 2,
      title: 'Language Requirements',
      content: 'Spanish translation needed for all consent forms before UAT phase.',
      createdBy: 'Study Designer',
      createdAt: '2024-12-14 15:45',
      updatedAt: '2024-12-14 15:45'
    },
    {
      id: 3,
      title: 'Validation Rules Update',
      content: 'Updated validation for vital signs - temperature must be between 35-42°C.',
      createdBy: 'Study Designer',
      createdAt: '2024-12-13 09:15',
      updatedAt: '2024-12-14 11:30'
    }
  ])

  const [showAddNote, setShowAddNote] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [newNote, setNewNote] = useState({ title: '', content: '' })

  const addNote = () => {
    if (newNote.title && newNote.content) {
      const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ')
      setNotes([
        {
          id: notes.length + 1,
          ...newNote,
          createdBy: 'Study Designer',
          createdAt: timestamp,
          updatedAt: timestamp
        },
        ...notes
      ])
      setNewNote({ title: '', content: '' })
      setShowAddNote(false)
    }
  }

  const updateNote = () => {
    if (editingNote && editingNote.title && editingNote.content) {
      const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ')
      setNotes(notes.map(note =>
        note.id === editingNote.id
          ? { ...editingNote, updatedAt: timestamp }
          : note
      ))
      setEditingNote(null)
    }
  }

  const deleteNote = async (id) => {
    const confirmed = await dialog.confirm({
      title: 'Delete Note',
      message: 'Are you sure you want to delete this note? This action cannot be undone.',
      confirmText: 'Delete Note',
      cancelText: 'Cancel',
      variant: 'danger',
      icon: 'danger'
    })

    if (confirmed) {
      setNotes(notes.filter(note => note.id !== id))
    }
  }

  const startEdit = (note) => {
    setEditingNote({ ...note })
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <button
            onClick={() => navigate(`/designer/studies/${studyId}`)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Study
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Designer Notes</h1>
              <p className="text-sm text-gray-500 mt-1">Document design decisions and important information</p>
            </div>
            <button
              onClick={() => setShowAddNote(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-orange-500/30 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Note
            </button>
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="space-y-4 max-w-4xl">
          {notes.map((note) => (
            <div key={note.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{note.title}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(note)}
                      className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                      title="Edit note"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete note"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-4 whitespace-pre-wrap">{note.content}</p>

                <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {note.createdBy}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Created: {note.createdAt}
                  </span>
                  {note.updatedAt !== note.createdAt && (
                    <span className="flex items-center text-orange-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Updated: {note.updatedAt}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {notes.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No notes yet</h3>
              <p className="text-sm text-gray-500">Create your first note to document design decisions</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Note Modal */}
      {(showAddNote || editingNote) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingNote ? 'Edit Note' : 'Add New Note'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddNote(false)
                    setEditingNote(null)
                    setNewNote({ title: '', content: '' })
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={editingNote ? editingNote.title : newNote.title}
                  onChange={(e) => {
                    if (editingNote) {
                      setEditingNote({ ...editingNote, title: e.target.value })
                    } else {
                      setNewNote({ ...newNote, title: e.target.value })
                    }
                  }}
                  placeholder="Enter note title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={editingNote ? editingNote.content : newNote.content}
                  onChange={(e) => {
                    if (editingNote) {
                      setEditingNote({ ...editingNote, content: e.target.value })
                    } else {
                      setNewNote({ ...newNote, content: e.target.value })
                    }
                  }}
                  placeholder="Enter note content..."
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddNote(false)
                  setEditingNote(null)
                  setNewNote({ title: '', content: '' })
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingNote ? updateNote : addNote}
                disabled={editingNote ? (!editingNote.title || !editingNote.content) : (!newNote.title || !newNote.content)}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {editingNote ? 'Update Note' : 'Add Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DesignerNotes
