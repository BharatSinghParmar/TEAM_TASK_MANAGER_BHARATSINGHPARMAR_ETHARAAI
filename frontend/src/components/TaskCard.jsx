import React from 'react';
import { useAuth } from '../context/AuthContext';

const TaskCard = ({ task, onStatusChange, onEdit, onDelete, hideActions = false }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  
  // Members can only edit their own tasks' status
  const isAssignee = String(task.assignedTo?._id || task.assignedTo) === String(user?._id);
  
  const canChangeStatus = isAdmin || isAssignee;

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Completed';

  const getStatusColor = (status, isOverdue) => {
    if (isOverdue) return 'bg-red-100 text-red-800 border-red-200';
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${isOverdue ? 'border-red-300' : 'border-gray-200'} p-5 flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden`}>
      {isOverdue && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg shadow-sm">
          ⚠ Overdue
        </div>
      )}
      <div className="flex justify-between items-start mb-3 mt-1">
        <h3 
          className="text-lg font-semibold text-gray-900 line-clamp-2 pr-12 hover:text-blue-600 hover:underline cursor-pointer transition-colors"
          onClick={() => onEdit && onEdit(task)}
        >
          {task.title}
        </h3>
        {!hideActions && isAdmin && (
          <div className="flex gap-1 flex-shrink-0 ml-2">
            <button 
              onClick={() => onEdit(task)}
              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
              title="Edit Task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button 
              onClick={() => onDelete(task._id)}
              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
              title="Delete Task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1 whitespace-pre-wrap">
        {task.description}
      </p>

      <div className="mt-auto space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs" title={task.assignedTo?.name}>
              {task.assignedTo?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <span className="truncate max-w-[120px]">{task.assignedTo?.name || 'Unassigned'}</span>
          </div>
          
          <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100">
          {canChangeStatus ? (
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task._id, e.target.value)}
              className={`w-full text-sm font-medium border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 ${getStatusColor(task.status, isOverdue)} transition-colors`}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          ) : (
            <div className={`text-center text-sm font-medium border rounded px-2 py-1.5 ${getStatusColor(task.status, isOverdue)}`}>
              {task.status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
