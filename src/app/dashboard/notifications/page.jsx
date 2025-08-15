'use client';

import { useState } from 'react';
import { FaBell, FaCheck, FaTimes, FaTrash, FaEnvelope, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'success',
            title: 'Analysis Completed',
            message: 'Your analysis of "Mona Lisa" has been completed successfully.',
            timestamp: '2024-01-15T10:30:00Z',
            read: false,
            icon: FaCheck
        },
        {
            id: 2,
            type: 'warning',
            title: 'Usage Limit Warning',
            message: 'You have 2 analyses remaining this month. Consider upgrading your plan.',
            timestamp: '2024-01-14T15:45:00Z',
            read: false,
            icon: FaExclamationTriangle
        },
        {
            id: 3,
            type: 'info',
            title: 'New Feature Available',
            message: 'We\'ve added advanced art style detection to your Pro plan.',
            timestamp: '2024-01-13T09:15:00Z',
            read: true,
            icon: FaInfoCircle
        },
        {
            id: 4,
            type: 'success',
            title: 'Subscription Renewed',
            message: 'Your Pro subscription has been successfully renewed for another month.',
            timestamp: '2024-01-12T14:20:00Z',
            read: true,
            icon: FaCheck
        },
        {
            id: 5,
            type: 'info',
            title: 'Welcome to NydArt Advisor',
            message: 'Thank you for joining us! Start analyzing your first artwork.',
            timestamp: '2024-01-10T11:00:00Z',
            read: true,
            icon: FaEnvelope
        }
    ]);

    const [filter, setFilter] = useState('all'); // all, unread, read

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success':
                return 'text-green-500';
            case 'warning':
                return 'text-yellow-500';
            case 'error':
                return 'text-red-500';
            case 'info':
                return 'text-blue-500';
            default:
                return 'text-gray-500';
        }
    };

    const getNotificationBg = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-500/10';
            case 'warning':
                return 'bg-yellow-500/10';
            case 'error':
                return 'bg-red-500/10';
            case 'info':
                return 'bg-blue-500/10';
            default:
                return 'bg-gray-500/10';
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
        }
    };

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, read: true }))
        );
    };

    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    const filteredNotifications = notifications.filter(notification => {
        if (filter === 'unread') return !notification.read;
        if (filter === 'read') return notification.read;
        return true;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text mb-2">Notifications</h1>
                <p className="text-text/70">Stay updated with your account activity and important alerts</p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-background-alt rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-primary-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <FaBell className="text-2xl text-primary-coral" />
                    </div>
                    <h3 className="text-2xl font-bold text-text mb-2">{notifications.length}</h3>
                    <p className="text-text/60 text-sm">Total Notifications</p>
                </div>
                <div className="bg-background-alt rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <FaEnvelope className="text-2xl text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-text mb-2">{unreadCount}</h3>
                    <p className="text-text/60 text-sm">Unread</p>
                </div>
                <div className="bg-background-alt rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <FaCheck className="text-2xl text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-text mb-2">{notifications.length - unreadCount}</h3>
                    <p className="text-text/60 text-sm">Read</p>
                </div>
            </div>

            {/* Filters and Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                <div className="flex space-x-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                                ? 'bg-primary-coral text-white'
                                : 'bg-background-alt text-text hover:bg-background-alt/80'
                            }`}
                    >
                        All ({notifications.length})
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'unread'
                                ? 'bg-primary-coral text-white'
                                : 'bg-background-alt text-text hover:bg-background-alt/80'
                            }`}
                    >
                        Unread ({unreadCount})
                    </button>
                    <button
                        onClick={() => setFilter('read')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'read'
                                ? 'bg-primary-coral text-white'
                                : 'bg-background-alt text-text hover:bg-background-alt/80'
                            }`}
                    >
                        Read ({notifications.length - unreadCount})
                    </button>
                </div>
                <button
                    onClick={markAllAsRead}
                    className="px-4 py-2 bg-background-alt hover:bg-background-alt/80 text-text rounded-lg text-sm font-medium transition-colors"
                >
                    Mark All as Read
                </button>
            </div>

            {/* Notifications List */}
            <div className="bg-background-alt rounded-xl overflow-hidden">
                {filteredNotifications.length === 0 ? (
                    <div className="p-12 text-center">
                        <FaBell className="mx-auto h-12 w-12 text-text/40 mb-4" />
                        <h3 className="text-lg font-medium text-text mb-2">No notifications</h3>
                        <p className="text-text/60">
                            {filter === 'all'
                                ? 'You\'re all caught up! No notifications yet.'
                                : filter === 'unread'
                                    ? 'No unread notifications.'
                                    : 'No read notifications.'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-text/10">
                        {filteredNotifications.map((notification) => {
                            const IconComponent = notification.icon;
                            return (
                                <div
                                    key={notification.id}
                                    className={`p-6 hover:bg-background/50 transition-colors ${!notification.read ? 'bg-background/30' : ''
                                        }`}
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className={`w-10 h-10 ${getNotificationBg(notification.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                            <IconComponent className={`text-lg ${getNotificationIcon(notification.type)}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-medium text-text mb-1">
                                                        {notification.title}
                                                    </h3>
                                                    <p className="text-sm text-text/70 mb-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-text/50">
                                                        {formatTimestamp(notification.timestamp)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2 ml-4">
                                                    {!notification.read && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="p-1 text-text/40 hover:text-primary-coral transition-colors"
                                                            title="Mark as read"
                                                        >
                                                            <FaCheck className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="p-1 text-text/40 hover:text-red-500 transition-colors"
                                                        title="Delete notification"
                                                    >
                                                        <FaTrash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Notification Settings */}
            <div className="mt-8 bg-background-alt rounded-xl p-6">
                <h3 className="text-lg font-semibold text-text mb-4">Notification Settings</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-text">Analysis Completion</h4>
                            <p className="text-sm text-text/60">Get notified when your art analysis is complete</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-coral/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-coral"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-text">Usage Alerts</h4>
                            <p className="text-sm text-text/60">Receive warnings when approaching your usage limit</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-coral/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-coral"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-text">Feature Updates</h4>
                            <p className="text-sm text-text/60">Stay informed about new features and improvements</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-coral/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-coral"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
} 