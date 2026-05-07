import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
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
  const [attachment, setAttachment] = useState(null);
  const [comments, setComments] = useState(initialData?.comments || []);
  const [activityLog, setActivityLog] = useState(initialData?.activityLog || []);
  const [commentLoading, setCommentLoading] = useState(false);
  const fileInputRef = useRef(null);

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
    if (!commentText.trim() && !attachment) return;
    setCommentLoading(true);
    try {
      let payload;
      if (attachment) {
        payload = new FormData();
        payload.append('text', commentText);
        payload.append('attachment', attachment);
      } else {
        payload = commentText;
      }
      
      const updatedTask = await taskService.addTaskComment(initialData._id, payload);
      setComments(updatedTask.comments);
      setActivityLog(updatedTask.activityLog);
      setCommentText('');
      setAttachment(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
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
                  disabled={!isAdmin}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 h-24"
                  placeholder="Describe the task details..."
                  disabled={!isAdmin}
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
                    disabled={!isAdmin}
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
                  disabled={!isAdmin}
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
                              <p className="text-xs text-gray-400 mt-0.5" title={item.date.toLocaleString()}>
                                {formatDistanceToNow(item.date, { addSuffix: true })}
                              </p>
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
                                <span className="text-xs text-gray-400" title={item.date.toLocaleString()}>
                                  {formatDistanceToNow(item.date, { addSuffix: true })}
                                </span>
                              </div>
                              {item.data.text && (
                                <p className="text-gray-700 whitespace-pre-wrap">{item.data.text}</p>
                              )}
                              {item.data.attachment && (
                                <div className="mt-2 pt-2 border-t border-gray-100">
                                  <a
                                    href={`http://localhost:8000${item.data.attachment.path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                  >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                    {item.data.attachment.filename}
                                  </a>
                                </div>
                              )}
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
                  <div className="flex flex-col gap-2">
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
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={commentLoading}
                        className="px-3 py-2 text-gray-500 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none disabled:opacity-50 transition shadow-sm"
                        title="Attach file"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </button>
                      <button
                        type="submit"
                        disabled={commentLoading || (!commentText.trim() && !attachment)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none disabled:opacity-50 text-sm font-medium transition shadow-sm"
                      >
                        {commentLoading ? 'Posting...' : 'Post'}
                      </button>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => setAttachment(e.target.files[0])}
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    />
                    {attachment && (
                      <div className="text-xs text-gray-600 flex items-center gap-1 bg-gray-100 p-1.5 rounded w-max">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="truncate max-w-[200px]">{attachment.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setAttachment(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="ml-2 text-red-500 hover:text-red-700 font-bold"
                        >
                          ×
                        </button>
                      </div>
                    )}
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
