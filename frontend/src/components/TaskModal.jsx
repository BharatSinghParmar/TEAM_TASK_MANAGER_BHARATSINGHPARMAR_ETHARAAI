import React, { useState } from 'react';
import toast from 'react-hot-toast';

const TaskModal = ({ isOpen, onClose, onSubmit, initialData, projectMembers }) => {
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">
            {initialData ? 'Edit Task' : 'Create New Task'}
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
        
        <div className="overflow-y-auto flex-1">
          <form id="task-form" onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                Task Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Design Login Page"
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
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                placeholder="Detailed task description..."
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
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="" disabled>Select a team member</option>
                {projectMembers?.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} ({member.email})
                  </option>
                ))}
              </select>
              {projectMembers?.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  Add members to the project first before creating tasks.
                </p>
              )}
            </div>
          </form>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="task-form"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none disabled:opacity-50 font-medium transition shadow-sm"
          >
            {loading ? 'Saving...' : initialData ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
