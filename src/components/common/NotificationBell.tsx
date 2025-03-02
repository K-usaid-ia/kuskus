"use client";
import { useState, useRef, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '@/features/notifications/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get notification icon color based on type
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'new_donation':
        return 'bg-green-500';
      case 'donation_confirmed':
        return 'bg-blue-500';
      case 'payment_confirmed':
        return 'bg-indigo-500';
      case 'new_purchase_order':
        return 'bg-yellow-500';
      case 'project_funded':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
            <span className="text-xs text-white">{unreadCount}</span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 overflow-hidden">
          <div className="border-b border-gray-200 px-4 py-2 flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => {
                  markAllAsRead();
                  setIsOpen(false);
                }}
                className="text-xs text-indigo-600 hover:text-indigo-500"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No notifications yet
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <li 
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 ${notification.read ? 'opacity-75' : ''}`}
                  >
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 h-3 w-3 rounded-full ${getNotificationColor(notification.type)} mt-1`}></div>
                      <div className="ml-3 flex-1">
                        <div 
                          className="text-sm text-gray-800 cursor-pointer"
                          onClick={() => {
                            if (!notification.read) {
                              markAsRead(notification.id);
                            }
                            if (notification.action_url) {
                              window.location.href = notification.action_url;
                            }
                            setIsOpen(false);
                          }}
                        >
                          {notification.message}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;