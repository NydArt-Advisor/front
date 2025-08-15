'use client';

import React, { useState, useEffect } from 'react';
import { FaBell, FaEnvelope, FaSms, FaDesktop, FaTrash, FaCheck } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';

export default function NotificationsPage() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user, page]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found, skipping notifications fetch');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_DB_SERVICE_URL}/api/notifications?page=${page}&limit=20`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications || []);
                setTotalPages(data.totalPages || 1);
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
                setNotifications(prev =>
                    prev.map(notif =>
                        notif._id === notificationId
                            ? { ...notif, status: 'read' }
                            : notif
                    )
                );
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_DB_SERVICE_URL}/api/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
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
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
            case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'normal': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
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

    const getTypeIcon = (type) => {
        switch (type) {
            case 'email': return <FaEnvelope className="text-blue-600" />;
            case 'sms': return <FaSms className="text-green-600" />;
            case 'in_app': return <FaDesktop className="text-purple-600" />;
            default: return <FaBell className="text-gray-600" />;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)}h ago`;
        } else if (diffInHours < 168) {
            return `${Math.floor(diffInHours / 24)}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text">Notifications</h1>
                    <p className="text-text/60 mt-2">View and manage your notifications</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-text">Recent Notifications</h2>
                {notifications.some(n => n.status !== 'read') && (
                    <button
                        onClick={markAllAsRead}
                        className="text-sm text-primary-coral hover:text-primary-salmon"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Notifications List */}
            {loading ? (
                <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-coral"></div>
                </div>
            ) : notifications.length === 0 ? (
                <div className="text-center py-12">
                    <FaBell className="text-4xl text-text/20 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-text mb-2">No notifications yet</h3>
                    <p className="text-text/60">You'll see your notifications here when they arrive.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`p-4 rounded-lg border transition-all ${notification.status !== 'read'
                                ? 'bg-blue-50/50 border-blue-200'
                                : 'bg-background-alt border-text/20'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3 flex-1">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-lg">
                                            {getCategoryIcon(notification.category)}
                                        </span>
                                        {getTypeIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className={`text-sm font-medium ${getPriorityColor(notification.priority)}`}>
                                                {notification.title}
                                            </h4>
                                            <span className="text-xs text-text/40">
                                                {formatDate(notification.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-text/80 mb-2">
                                            {notification.message}
                                        </p>
                                        {notification.status !== 'read' && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 ml-4">
                                    {notification.status !== 'read' && (
                                        <button
                                            onClick={() => markAsRead(notification._id)}
                                            className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded"
                                            title="Mark as read"
                                        >
                                            <FaCheck className="text-sm" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotification(notification._id)}
                                        className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                                        title="Delete notification"
                                    >
                                        <FaTrash className="text-sm" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-6">
                    <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 text-sm border border-text/20 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background-alt"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-text/60">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1 text-sm border border-text/20 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background-alt"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
} 