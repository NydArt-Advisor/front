'use client';

import React, { useState, useEffect } from 'react';
import { FaBell, FaBellSlash } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';

const NotificationBell = () => {
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchNotificationCount();
            fetchNotifications();
        }
    }, [user]);

    const fetchNotificationCount = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found, skipping notification count fetch');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_DB_SERVICE_URL}/api/notifications/count`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUnreadCount(data.unread);
            } else if (response.status === 401) {
                console.log('Token expired or invalid, clearing token');
                localStorage.removeItem('token');
                // You might want to redirect to login here
            } else {
                console.error('Error fetching notification count:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error fetching notification count:', error);
        }
    };

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found, skipping notifications fetch');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_DB_SERVICE_URL}/api/notifications?limit=10`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications || []);
            } else if (response.status === 401) {
                console.log('Token expired or invalid, clearing token');
                localStorage.removeItem('token');
                // You might want to redirect to login here
            } else {
                console.error('Error fetching notifications:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_DB_SERVICE_URL}/api/notifications/${notificationId}/read`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Update local state
                setNotifications(prev =>
                    prev.map(notif =>
                        notif._id === notificationId
                            ? { ...notif, status: 'read' }
                            : notif
                    )
                );
                fetchNotificationCount();
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_DB_SERVICE_URL}/api/notifications/mark-all-read`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setNotifications(prev =>
                    prev.map(notif => ({ ...notif, status: 'read' }))
                );
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent': return 'text-red-600';
            case 'high': return 'text-orange-600';
            case 'normal': return 'text-blue-600';
            case 'low': return 'text-gray-600';
            default: return 'text-gray-600';
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'security_alert': return '🔒';
            case 'analysis_complete': return '✅';
            case 'analysis_failed': return '❌';
            case 'welcome': return '👋';
            case 'artwork_added': return '🎨';
            case 'artwork_updated': return '🖼️';
            case 'account_update': return '⚙️';
            case 'subscription': return '💳';
            default: return '📢';
        }
    };

    if (!user) return null;

    return (
        <div className="relative">
            {/* Notification Bell */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-text hover:text-primary-coral transition-colors"
            >
                {unreadCount > 0 ? (
                    <FaBell className="text-xl" />
                ) : (
                    <FaBellSlash className="text-xl text-text/60" />
                )}

                {/* Badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-background border border-text/20 rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-text/10">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-text">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-sm text-primary-coral hover:text-primary-salmon"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-text/60">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-coral mx-auto"></div>
                                <p className="mt-2">Loading notifications...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-4 text-center text-text/60">
                                <FaBellSlash className="text-2xl mx-auto mb-2" />
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-text/10">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        className={`p-4 hover:bg-background-alt transition-colors cursor-pointer ${notification.status !== 'read' ? 'bg-blue-50/50' : ''
                                            }`}
                                        onClick={() => markAsRead(notification._id)}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <span className="text-lg">
                                                {getCategoryIcon(notification.category)}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h4 className={`text-sm font-medium ${getPriorityColor(notification.priority)}`}>
                                                        {notification.title}
                                                    </h4>
                                                    <span className="text-xs text-text/40">
                                                        {new Date(notification.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-text/80 mt-1 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                {notification.status !== 'read' && (
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="p-4 border-t border-text/10">
                            <button
                                onClick={() => {/* Navigate to full notifications page */ }}
                                className="w-full text-sm text-primary-coral hover:text-primary-salmon"
                            >
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default NotificationBell; 