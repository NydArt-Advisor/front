'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import ChangePasswordModal from '@/components/settings/ChangePasswordModal';
import TwoFactorModal from '@/components/settings/TwoFactorModal';
import NotificationPreferences from '@/components/notifications/NotificationPreferences';

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState({
        theme: 'auto',
        language: 'en',
        showAnimations: true,
        compactLayout: false,
        highContrastMode: false
    });
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [isLoading2FA, setIsLoading2FA] = useState(true);

    // Load settings from localStorage on component mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('nydart-settings');
        if (savedSettings) {
            try {
                const parsedSettings = JSON.parse(savedSettings);
                setSettings(prev => ({
                    ...prev,
                    ...parsedSettings
                }));
            } catch (error) {
                console.error('Error parsing saved settings:', error);
            }
        }

        // Fetch 2FA status
        fetchTwoFactorStatus();
    }, []);

    // Fetch 2FA status from backend
    const fetchTwoFactorStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsLoading2FA(false);
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/two-factor/status`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTwoFactorEnabled(data.twoFactorEnabled || false);
            }
        } catch (error) {
            console.error('Error fetching 2FA status:', error);
        } finally {
            setIsLoading2FA(false);
        }
    };

    // Update settings when theme changes
    useEffect(() => {
        setSettings(prev => ({
            ...prev,
            theme: theme || 'auto'
        }));
    }, [theme]);

    const handleSettingChange = (setting, value) => {
        setSettings(prev => ({
            ...prev,
            [setting]: value
        }));
    };

    const handleSaveSettings = async () => {
        setIsSaving(true);
        setSaveMessage('');

        try {
            // Save settings to localStorage
            localStorage.setItem('nydart-settings', JSON.stringify(settings));

            // Update theme if changed
            if (settings.theme !== theme) {
                setTheme(settings.theme);
            }

            setSaveMessage('Settings saved successfully!');

            // Clear success message after 3 seconds
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (error) {
            setSaveMessage('Failed to save settings. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'general', label: 'General' },
        { id: 'notifications', label: 'Notifications' },
        { id: 'security', label: 'Security' },
        { id: 'appearance', label: 'Appearance' }
    ];

    const renderGeneralSettings = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-text mb-4">General Settings</h3>
                <p className="text-text/70 mb-6">Configure your basic account preferences.</p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-text mb-2">
                            Language
                        </label>
                        <select
                            value={settings.language}
                            onChange={(e) => handleSettingChange('language', e.target.value)}
                            className="w-full px-4 py-3 border border-text/20 rounded-lg bg-background text-text focus:ring-2 focus:ring-primary-coral focus:border-transparent"
                            disabled
                        >
                            <option value="en">English</option>
                            <option value="fr">Français</option>
                            <option value="es">Español</option>
                            <option value="de">Deutsch</option>
                        </select>
                        <p className="text-xs text-text/50 mt-1">Language support coming soon</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text mb-2">
                            Theme
                        </label>
                        <select
                            value={settings.theme}
                            onChange={(e) => handleSettingChange('theme', e.target.value)}
                            className="w-full px-4 py-3 border border-text/20 rounded-lg bg-background text-text focus:ring-2 focus:ring-primary-coral focus:border-transparent"
                        >
                            <option value="auto">Auto (System)</option>
                            <option value="light">Light Theme</option>
                            <option value="dark">Dark Theme</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderNotificationsSettings = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-text mb-4">Notification Settings</h3>
                <p className="text-text/70 mb-6">Manage how you receive notifications and updates.</p>

                <NotificationPreferences />
            </div>
        </div>
    );

    const renderSecuritySettings = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-text mb-4">Security Settings</h3>
                <p className="text-text/70 mb-6">Manage your account security and privacy.</p>

                <div className="space-y-4">
                    <div className="p-4 border border-text/10 rounded-lg">
                        <h4 className="font-medium text-text mb-2">Change Password</h4>
                        <p className="text-sm text-text/60 mb-3">Update your account password for better security</p>
                        <button
                            onClick={() => setShowChangePasswordModal(true)}
                            className="px-4 py-2 bg-primary-coral hover:bg-primary-salmon text-white rounded-lg transition-colors"
                        >
                            Change Password
                        </button>
                    </div>

                    <div className="p-4 border border-text/10 rounded-lg">
                        <h4 className="font-medium text-text mb-2">Two-Factor Authentication</h4>
                        <p className="text-sm text-text/60 mb-3">Add an extra layer of security to your account</p>
                        <button
                            onClick={() => setShowTwoFactorModal(true)}
                            disabled={isLoading2FA}
                            className="px-4 py-2 bg-background border border-text/20 hover:bg-background-alt text-text rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isLoading2FA ? 'Loading...' : twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                        </button>
                        {twoFactorEnabled && (
                            <p className="text-xs text-green-600 mt-2">✓ Two-factor authentication is enabled</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAppearanceSettings = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-text mb-4">Appearance Settings</h3>
                <p className="text-text/70 mb-6">Customize the look and feel of your NydArt Advisor experience.</p>

                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-semibold text-text mb-4">Theme Options</h4>
                        <div className="space-y-3">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="theme"
                                    value="light"
                                    checked={settings.theme === 'light'}
                                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                                    className="w-4 h-4 text-primary-coral bg-background border-text/20 focus:ring-primary-coral focus:ring-2"
                                />
                                <span className="text-text">Light Theme</span>
                            </label>

                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="theme"
                                    value="dark"
                                    checked={settings.theme === 'dark'}
                                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                                    className="w-4 h-4 text-primary-coral bg-background border-text/20 focus:ring-primary-coral focus:ring-2"
                                />
                                <span className="text-text">Dark Theme</span>
                            </label>

                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="theme"
                                    value="auto"
                                    checked={settings.theme === 'auto'}
                                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                                    className="w-4 h-4 text-primary-coral bg-background border-text/20 focus:ring-primary-coral focus:ring-2"
                                />
                                <span className="text-text">Auto (System)</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-text mb-4">Display Options</h4>
                        <div className="space-y-3">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.showAnimations}
                                    onChange={(e) => handleSettingChange('showAnimations', e.target.checked)}
                                    className="w-4 h-4 text-primary-coral bg-background border-text/20 rounded focus:ring-primary-coral focus:ring-2"
                                />
                                <span className="text-text">Show animations</span>
                            </label>

                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.compactLayout}
                                    onChange={(e) => handleSettingChange('compactLayout', e.target.checked)}
                                    className="w-4 h-4 text-primary-coral bg-background border-text/20 rounded focus:ring-primary-coral focus:ring-2"
                                />
                                <span className="text-text">Compact layout</span>
                            </label>

                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.highContrastMode}
                                    onChange={(e) => handleSettingChange('highContrastMode', e.target.checked)}
                                    className="w-4 h-4 text-primary-coral bg-background border-text/20 rounded focus:ring-primary-coral focus:ring-2"
                                />
                                <span className="text-text">High contrast mode</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'general':
                return renderGeneralSettings();
            case 'notifications':
                return renderNotificationsSettings();
            case 'security':
                return renderSecuritySettings();
            case 'appearance':
                return renderAppearanceSettings();
            default:
                return renderGeneralSettings();
        }
    };

    // Modal components
    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text mb-2">Settings</h1>
                <p className="text-text/70">Manage your account preferences and security settings</p>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="flex space-x-1 mb-8 bg-background-alt rounded-lg p-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${activeTab === tab.id
                                ? 'bg-primary-coral text-white'
                                : 'text-text hover:bg-background'
                                }`}
                        >
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="bg-background-alt rounded-xl p-6">
                    {renderContent()}

                    <div className="mt-8 pt-6 border-t border-text/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                {saveMessage && (
                                    <div className={`flex items-center space-x-2 ${saveMessage.includes('successfully')
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                        }`}>
                                        <span className="text-sm">{saveMessage}</span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleSaveSettings}
                                disabled={isSaving}
                                className="flex items-center space-x-2 px-6 py-3 bg-primary-coral hover:bg-primary-salmon text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                    <span>💾</span>
                                )}
                                <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ChangePasswordModal
                isOpen={showChangePasswordModal}
                onClose={() => setShowChangePasswordModal(false)}
                onSuccess={() => {
                    setSaveMessage('Password changed successfully!');
                    setTimeout(() => setSaveMessage(''), 3000);
                }}
            />

            <TwoFactorModal
                isOpen={showTwoFactorModal}
                onClose={() => setShowTwoFactorModal(false)}
                twoFactorEnabled={twoFactorEnabled}
                onSuccess={() => {
                    const message = twoFactorEnabled
                        ? 'Two-factor authentication disabled successfully!'
                        : 'Two-factor authentication enabled successfully!';
                    setSaveMessage(message);
                    setTimeout(() => setSaveMessage(''), 3000);
                    fetchTwoFactorStatus(); // Refresh status after enabling/disabling
                }}
            />
        </div>
    );
} 