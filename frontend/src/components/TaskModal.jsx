import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { taskService } from '../services/taskService';
import { useAuth } from '../context/AuthContext';

const TaskModal = ({ isOpen, onClose, onSubmit, initialData, projectMembers }) => {
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'Admin';
  const isAssignee = initialData ? String(initialData.assignedTo?._id || initialData.assignedTo) === String(user?._id) : true;
  const isReadOnly = initialData && !isAdmin && !isAssignee;

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState(initialData?.status || 'Pending');
  
  // Format due date for date input
  const initialDueDate = initialData?.dueDate 
    ? new Date(initialData.dueDate).toISOString().split('T')[0] 
    : '';
  const [dueDate, setDueDate] = useState(initialDueDate);
  
  // Handle assignedTo which could be an object or string
  const getInitialAssignedTo = () => {
    if (!initialData?.assignedTo) return '';
    return typeof initialData.assignedTo === 'object' 
      ? initialData.assignedTo._id 
      : initialData.assignedTo;
  };
  const [assignedTo, setAssignedTo] = useState(getInitialAssignedTo());
  
  const [loading, setLoading] = useState(false);

  // Collaboration State
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(initialData?.comments || []);
  const [activityLog, setActivityLog] = useState(initialData?.activityLog || []);
  const [commentLoading, setCommentLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !dueDate || !assignedTo) {
      return toast.error('Please fill in all required fields');
    }

    setLoading(true);
    try {
      await onSubmit({ title, description, status, dueDate, assignedTo });
      // Reset form if creating new
      if (!initialData) {
        setTitle('');
        setDescription('');
        setStatus('Pending');
        setDueDate('');
        setAssignedTo('');
      }
      onClose();
    } catch (error) {
      // Error is handled in the parent component
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      const updatedTask = await taskService.addTaskComment(initialData._id, commentText);
      setComments(updatedTask.comments);
      setActivityLog(updatedTask.activityLog);
      setCommentText('');
      toast.success('Comment added');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl w-full ${initialData ? 'max-w-4xl' : 'max-w-md'} overflow-hidden flex flex-col max-h-[90vh] transition-all`}>
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">
            {initialData ? 'Task Details' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 flex flex-col md:flex-row">
          {/* Left Column: Form */}
          <div className={`p-6 space-y-4 ${initialData ? 'md:w-1/2 border-r border-gray-200' : 'w-full'}`}>
            <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Task Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="e.g. Design Login Page"
                  disabled={isReadOnly}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="Detailed task description..."
                  disabled={isReadOnly}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                    Status
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                    disabled={isReadOnly}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueDate">
                    Due Date *
                  </label>
                  <input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="assignedTo">
                  Assign To *
                </label>
                <select
                  id="assignedTo"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                  disabled={isReadOnly}
                >
                  <option value="" disabled>Select a team member</option>
                  {projectMembers?.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.email})
                    </option>
                  ))}
                </select>
                {!isReadOnly && projectMembers?.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    Add members to the project first before creating tasks.
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Right Column: Activity Timeline & Comments */}
          {initialData && (
            <div className="md:w-1/2 p-6 flex flex-col bg-gray-50 min-h-[300px]">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex-shrink-0">
                Activity & Comments
              </h3>
              
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {(() => {
                  const items = [
                    ...comments.map(c => ({ type: 'comment', data: c, date: new Date(c.createdAt) })),
                    ...activityLog.map(a => ({ type: 'activity', data: a, date: new Date(a.timestamp) }))
                  ].sort((a, b) => b.date - a.date); // Newest first

                  return items.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-500 italic">No activity recorded yet.</p>
                    </div>
                  ) : (
                    items.map((item, idx) => (
                      <div key={idx} className="flex gap-3 text-sm">
                        {item.type === 'activity' ? (
                          <>
                            <div className="mt-0.5 text-gray-400 flex-shrink-0">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-gray-600">
                                <span className="font-semibold text-gray-900">{item.data.user?.name || 'Unknown'}</span>{' '}
                                {item.data.action === 'Status Changed' 
                                  ? `changed status from ${item.data.fromStatus} to ${item.data.toStatus}` 
                                  : item.data.action.toLowerCase() === 'reassigned'
                                  ? 'reassigned the task'
                                  : item.data.action.toLowerCase()}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">{item.date.toLocaleString()}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs flex-shrink-0 ring-2 ring-white">
                              {item.data.user?.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-gray-900 text-xs">{item.data.user?.name || 'Unknown'}</span>
                                <span className="text-xs text-gray-400">{item.date.toLocaleString()}</span>
                              </div>
                              <p className="text-gray-700 whitespace-pre-wrap">{item.data.text}</p>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  );
                })()}
              </div>
              
              {!isReadOnly && (
                <form onSubmit={handleAddComment} className="flex-shrink-0 border-t border-gray-200 pt-4 mt-auto">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                      disabled={commentLoading}
                    />
                    <button
                      type="submit"
                      disabled={commentLoading || !commentText.trim()}
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none disabled:opacity-50 text-sm font-medium transition shadow-sm"
                    >
                      Post
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none font-medium transition"
          >
            {isReadOnly ? 'Close' : 'Cancel'}
          </button>
          {!isReadOnly && (
            <button
              type="submit"
              form="task-form"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none disabled:opacity-50 font-medium transition shadow-sm"
            >
              {loading ? 'Saving...' : initialData ? 'Save Changes' : 'Create Task'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
