// components/AccountSwitcher.tsx
import React, { useState } from 'react';
import { useAuth } from '@/features/auth/AuthContext';

export default function AccountSwitcher() {
  const { user, availableRoles, switchRole, addRole, isRoleSwitching } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  
  // If user is not authenticated or has only one role, don't show the switcher
  if (!user || availableRoles.length <= 1) {
    return null;
  }
  
  const handleRoleSwitch = async (roleType: string) => {
    // Don't switch if already this role or currently switching
    if (user.user_type === roleType || isRoleSwitching) {
      setIsOpen(false);
      return;
    }
    
    try {
      await switchRole(roleType);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to switch role:", error);
      alert("Failed to switch roles. Please try again.");
    }
  };
  
  const handleAddRole = async () => {
    if (!selectedRole) return;
    
    try {
      await addRole(selectedRole);
      setShowAddRoleModal(false);
      setSelectedRole('');
    } catch (error) {
      console.error("Failed to add role:", error);
      alert("Failed to add role. Please try again.");
    }
  };
  
  // Get available role types that the user doesn't already have
  const availableRoleTypes = ['donor', 'organization', 'vendor'].filter(
    role => !availableRoles.includes(role)
  );
  
  return (
    <div className="relative">
      {/* Role switcher button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={isRoleSwitching}
        className={`flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isRoleSwitching ? 'opacity-75 cursor-not-allowed' : ''}`}
      >
        <span className="flex items-center">
          <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-green-400"></span>
          <span className="capitalize">{user.user_type}</span>
        </span>
        {isRoleSwitching ? (
          <svg className="animate-spin ml-2 -mr-0.5 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1">
            {availableRoles.map((role) => (
              <button
                key={role}
                onClick={() => handleRoleSwitch(role)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  user.user_type === role 
                    ? 'bg-gray-100 text-gray-900 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="capitalize">{role}</span>
                {user.user_type === role && (
                  <span className="ml-2 text-indigo-600">✓</span>
                )}
              </button>
            ))}
            
            {/* Option to add new roles if available */}
            {availableRoleTypes.length > 0 && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowAddRoleModal(true);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-gray-50 border-t border-gray-100"
              >
                + Add new role
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Add Role Modal */}
      {showAddRoleModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              aria-hidden="true"
              onClick={() => setShowAddRoleModal(false)}
            ></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Add a New Role
                    </h3>
                    <div className="mt-4">
                      <label htmlFor="role-select" className="block text-sm font-medium text-gray-700">
                        Select Role Type
                      </label>
                      <select
                        id="role-select"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="">-- Select role --</option>
                        {availableRoleTypes.map(role => (
                          <option key={role} value={role} className="capitalize">
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleAddRole}
                  disabled={!selectedRole}
                >
                  Add Role
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowAddRoleModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}