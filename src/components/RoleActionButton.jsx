"use client"
import { useState } from 'react';
import { useAuth } from '@/features/auth/AuthContext';

export default function RoleActionButton({ 
  requiredRole, 
  onClick, 
  className, 
  children,
  actionDescription = "do this"
}) {
  const { isAuthenticated, user, availableRoles, switchRole, addRole, connectWallet } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const hasRequiredRole = isAuthenticated && 
                          availableRoles.includes(requiredRole);
  const isUsingRequiredRole = isAuthenticated && 
                             user?.user_type === requiredRole;
  
  const handleClick = async () => {
    // If not authenticated, connect wallet first
    if (!isAuthenticated) {
      setIsLoading(true);
      try {
        await connectWallet();
      } catch (error) {
        console.error("Connection error:", error);
        alert("Failed to connect wallet. Please try again.");
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    // If not using the right role but has it, switch to it
    if (hasRequiredRole && !isUsingRequiredRole) {
      setIsLoading(true);
      try {
        await switchRole(requiredRole);
        onClick(); // After successful role switch, call the onClick handler
      } catch (error) {
        console.error("Role switch error:", error);
        alert("Failed to switch roles. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } 
    // If already using the right role, just call the handler
    else if (isUsingRequiredRole) {
      onClick();
    }
    // If does not have the role, show confirmation dialog
    else {
      setShowConfirmation(true);
    }
  };
  
  const handleAddRole = async () => {
    setIsLoading(true);
    try {
      await addRole(requiredRole);
      await switchRole(requiredRole);
      setShowConfirmation(false);
      onClick();
    } catch (error) {
      console.error("Role addition error:", error);
      alert("Failed to add role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`${className} ${isLoading ? 'opacity-75 cursor-wait' : ''}`}
      >
        {isLoading ? 'Please wait...' : children}
      </button>
      
      {/* Role confirmation dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900">New Role Required</h3>
            <p className="mt-2 text-sm text-gray-500">
              To {actionDescription}, you need to register as a {requiredRole}. Would you like to add this role to your account?
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRole}
                disabled={isLoading}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                Add {requiredRole} Role
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}