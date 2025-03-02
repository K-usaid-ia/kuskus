"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { notificationsApi } from '@/utils/api';

// Types
interface Notification {
  id: number;
  message: string;
  type: string;
  read: boolean;
  action_url: string | null;
  created_at: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loadNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  wsConnected: boolean;
}

// Create context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider component
export const NotificationProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Load notifications from API
  const loadNotifications = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await notificationsApi.getAll();
      setNotifications(response.results);
      
      const countResponse = await notificationsApi.getUnreadCount();
      setUnreadCount(countResponse.count);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  // Mark notification as read
  const markAsRead = async (id: number) => {
    try {
      await notificationsApi.markAsRead(id);
      
      // Update local state
      setNotifications(notifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // If WebSocket is connected, also notify server through that channel
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'mark_read',
          notification_id: id
        }));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      
      // Update local state
      setNotifications(notifications.map(notif => ({ ...notif, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // Set up WebSocket connection for real-time notifications
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const connectWebSocket = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = process.env.NEXT_PUBLIC_WS_URL || window.location.host;
      const ws = new WebSocket(`${protocol}//${host}/ws/notifications/`);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setWsConnected(true);
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'notification') {
          // Add new notification to state
          const newNotification = data.notification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Show browser notification if supported
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('KUSAIDIA Notification', {
              body: newNotification.message
            });
          }
        } else if (data.type === 'unread_count') {
          setUnreadCount(data.count);
        }
      };
      
      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setWsConnected(false);
        // Try to reconnect after a delay
        setTimeout(connectWebSocket, 3000);
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        ws.close();
      };
      
      setSocket(ws);
    };
    
    connectWebSocket();
    loadNotifications();
    
    // Request browser notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    // Cleanup function
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [isAuthenticated]);

  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    wsConnected
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use notifications
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};