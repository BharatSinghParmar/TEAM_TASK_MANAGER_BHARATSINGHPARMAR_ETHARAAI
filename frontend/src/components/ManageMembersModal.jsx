import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { userService } from '../services/userService';
import ConfirmModal from './ConfirmModal';

const ManageMembersModal = ({ isOpen, onClose, projectMembers, onAddMember, onRemoveMember }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    member: null,
  });

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const users = await userService.getUsers();
      setAllUsers(users);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Filter out users who are already members
  const memberIds = projectMembers.map(m => m._id);
  const availableUsers = allUsers.filter(user => !memberIds.includes(user._id));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Manage Members</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Current Members */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Current Members ({projectMembers.length})
                </h3>
                {projectMembers.length > 0 ? (
                  <ul className="divide-y divide-gray-200 border rounded-md">
                    {projectMembers.map(member => (
                      <li key={member._id} className="flex justify-between items-center py-3 px-4 hover:bg-gray-50">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.email}</p>
                        </div>
                        <button
                          onClick={() => setConfirmModal({ isOpen: true, member })}
                          className="text-sm text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">No members assigned.</p>
                )}
              </div>

              {/* Add New Members */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Add Members
                </h3>
                {availableUsers.length > 0 ? (
                  <ul className="divide-y divide-gray-200 border rounded-md max-h-48 overflow-y-auto">
                    {availableUsers.map(user => (
                      <li key={user._id} className="flex justify-between items-center py-3 px-4 hover:bg-gray-50">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email} &middot; {user.role}</p>
                        </div>
                        <button
                          onClick={() => onAddMember(user._id)}
                          className="text-sm text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded transition"
                        >
                          Add
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic border rounded p-4 text-center bg-gray-50">
                    All users are already members of this project.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none font-medium"
          >
            Done
          </button>
        </div>
      </div>
      
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Remove Member"
        message={`Are you sure you want to remove ${confirmModal.member?.name} from this project?`}
        onConfirm={() => {
          onRemoveMember(confirmModal.member._id);
          setConfirmModal({ isOpen: false, member: null });
        }}
        onCancel={() => setConfirmModal({ isOpen: false, member: null })}
        confirmText="Remove"
        type="danger"
      />
    </div>
  );
};

export default ManageMembersModal;
