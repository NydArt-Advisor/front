'use client';

import React, { useState, useEffect } from 'react';
import { FaBell, FaEnvelope, FaSms, FaDesktop, FaSave, FaTimes } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';

const NotificationPreferences = () => {
    const { user } = useAuth();
    const [preferences, setPreferences] = useState({
        email: {
            enabled: true,
            categories: {
                welcome: true,
                password_reset: true,
                security_alert: true,
                analysis_complete: true,
                analysis_failed: true,
                account_update: true,
                subscription: true,
                system_alert: true,
                artwork_added: true,
                artwork_updated: true
            }
        },
        sms: {
            enabled: false,
            phoneNumber: '',
            categories: {
                security_alert: true,
                analysis_complete: false,
                account_update: false
            }
        },
        inApp: {
            enabled: true,
            categories: {
                welcome: true,
                analysis_complete: true,
                analysis_failed: true,
                account_update: true,
                subscription: true,
                artwork_added: true,
                artwork_updated: true
            }
        }
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            fetchPreferences();
        }
    }, [user]);

    const fetchPreferences = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_DB_SERVICE_URL}/api/notifications/preferences`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setPreferences(data.notificationPreferences);
            }
        } catch (error) {
            console.error('Error fetching notification preferences:', error);
        } finally {
            setLoading(false);
        }
    };

    const savePreferences = async () => {
        try {
            setSaving(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_DB_SERVICE_URL}/api/notifications/preferences`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ notificationPreferences: preferences })
            });

            if (response.ok) {
                setMessage('Preferences saved successfully!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Error saving preferences');
            }
        } catch (error) {
            console.error('Error saving notification preferences:', error);
            setMessage('Error saving preferences');
        } finally {
            setSaving(false);
        }
    };

    const updatePreference = (type, field, value) => {
        setPreferences(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [field]: value
            }
        }));
    };

    const updateCategory = (type, category, value) => {
        setPreferences(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                categories: {
                    ...prev[type].categories,
                    [category]: value
                }
            }
        }));
    };

    const getCategoryLabel = (category) => {
        const labels = {
            welcome: 'Welcome Messages',
            password_reset: 'Password Reset',
            security_alert: 'Security Alerts',
            analysis_complete: 'Analysis Complete',
            analysis_failed: 'Analysis Failed',
            account_update: 'Account Updates',
            subscription: 'Subscription Updates',
            system_alert: 'System Alerts',
            artwork_added: 'Artwork Added',
            artwork_updated: 'Artwork Updated'
        };
        return labels[category] || category;
    };

    const getCategoryDescription = (category) => {
        const descriptions = {
            welcome: 'Welcome messages when you join',
            password_reset: 'Password reset confirmations',
            security_alert: 'Suspicious login attempts',
            analysis_complete: 'When your artwork analysis is ready',
            analysis_failed: 'When artwork analysis fails',
            account_update: 'Profile and account changes',
            subscription: 'Subscription and billing updates',
            system_alert: 'Important system announcements',
            artwork_added: 'When you add new artworks',
            artwork_updated: 'When you update artworks'
        };
        return descriptions[category] || '';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-coral"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text">Notification Preferences</h2>
                <button
                    onClick={savePreferences}
                    disabled={saving}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-coral hover:bg-primary-salmon text-white rounded-lg transition-colors disabled:opacity-50"
                >
                    <FaSave className="text-sm" />
                    <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
                </button>
            </div>

            {message && (
                <div className={`p-3 rounded-lg ${message.includes('Error')
                        ? 'bg-red-50 border border-red-200 text-red-600'
                        : 'bg-green-50 border border-green-200 text-green-600'
                    }`}>
                    {message}
                </div>
            )}

            {/* Email Notifications */}
            <div className="bg-background-alt rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                    <FaEnvelope className="text-xl text-blue-600" />
                    <div>
                        <h3 className="text-lg font-semibold text-text">Email Notifications</h3>
                        <p className="text-sm text-text/60">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-auto">
                        <input
                            type="checkbox"
                            checked={preferences.email.enabled}
                            onChange={(e) => updatePreference('email', 'enabled', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-coral/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-coral"></div>
                    </label>
                </div>

                {preferences.email.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(preferences.email.categories).map(([category, enabled]) => (
                            <div key={category} className="flex items-center space-x-3">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={enabled}
                                        onChange={(e) => updateCategory('email', category, e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-coral/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-coral"></div>
                                </label>
                                <div>
                                    <p className="text-sm font-medium text-text">{getCategoryLabel(category)}</p>
                                    <p className="text-xs text-text/60">{getCategoryDescription(category)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* SMS Notifications */}
            <div className="bg-background-alt rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                    <FaSms className="text-xl text-green-600" />
                    <div>
                        <h3 className="text-lg font-semibold text-text">SMS Notifications</h3>
                        <p className="text-sm text-text/60">Receive notifications via text message</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-auto">
                        <input
                            type="checkbox"
                            checked={preferences.sms.enabled}
                            onChange={(e) => updatePreference('sms', 'enabled', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-coral/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-coral"></div>
                    </label>
                </div>

                {preferences.sms.enabled && (
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-text mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={preferences.sms.phoneNumber}
                                onChange={(e) => updatePreference('sms', 'phoneNumber', e.target.value)}
                                placeholder="+1 (555) 123-4567"
                                className="w-full px-3 py-2 border border-text/20 rounded-lg bg-background text-text focus:ring-2 focus:ring-primary-coral focus:border-transparent"
                            />
                        </div>

                        <div className="space-y-3">
                            {Object.entries(preferences.sms.categories).map(([category, enabled]) => (
                                <div key={category} className="flex items-center space-x-3">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={enabled}
                                            onChange={(e) => updateCategory('sms', category, e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-coral/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-coral"></div>
                                    </label>
                                    <div>
                                        <p className="text-sm font-medium text-text">{getCategoryLabel(category)}</p>
                                        <p className="text-xs text-text/60">{getCategoryDescription(category)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* In-App Notifications */}
            <div className="bg-background-alt rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                    <FaDesktop className="text-xl text-purple-600" />
                    <div>
                        <h3 className="text-lg font-semibold text-text">In-App Notifications</h3>
                        <p className="text-sm text-text/60">Receive notifications within the app</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-auto">
                        <input
                            type="checkbox"
                            checked={preferences.inApp.enabled}
                            onChange={(e) => updatePreference('inApp', 'enabled', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-coral/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-coral"></div>
                    </label>
                </div>

                {preferences.inApp.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(preferences.inApp.categories).map(([category, enabled]) => (
                            <div key={category} className="flex items-center space-x-3">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={enabled}
                                        onChange={(e) => updateCategory('inApp', category, e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-coral/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-coral"></div>
                                </label>
                                <div>
                                    <p className="text-sm font-medium text-text">{getCategoryLabel(category)}</p>
                                    <p className="text-xs text-text/60">{getCategoryDescription(category)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationPreferences; 