'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { FaCog, FaShieldAlt, FaBell, FaPalette, FaUser, FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function SettingsPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('general');
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [generalSettings, setGeneralSettings] = useState({
        language: 'en',
        timezone: 'UTC',
        dateFormat: 'MM/DD/YYYY',
        theme: 'auto'
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        pushNotifications: true,
        analysisComplete: true,
        usageAlerts: true,
        featureUpdates: true,
        marketingEmails: false
    });

    const [securitySettings, setSecuritySettings] = useState({
        twoFactorAuth: false,
        loginAlerts: true,
        sessionTimeout: 30
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const tabs = [
        { id: 'general', label: 'General', icon: FaCog },
        { id: 'notifications', label: 'Notifications', icon: FaBell },
        { id: 'security', label: 'Security', icon: FaShieldAlt },
        { id: 'appearance', label: 'Appearance', icon: FaPalette }
    ];

    const handleGeneralSettingChange = (setting, value) => {
        setGeneralSettings(prev => ({
            ...prev,
            [setting]: value
        }));
    };

    const handleNotificationSettingChange = (setting, value) => {
        setNotificationSettings(prev => ({
            ...prev,
            [setting]: value
        }));
    };

    const handleSecuritySettingChange = (setting, value) => {
        setSecuritySettings(prev => ({
            ...prev,
            [setting]: value
        }));
    };

    const handlePasswordChange = (field, value) => {
        setPasswordForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveGeneral = async () => {
        try {
            // TODO: Implement API call to save general settings
            console.log('Saving general settings:', generalSettings);
            // Show success message
        } catch (error) {
            console.error('Error saving general settings:', error);
            // Show error message
        }
    };

    const handleSaveNotifications = async () => {
        try {
            // TODO: Implement API call to save notification settings
            console.log('Saving notification settings:', notificationSettings);
            // Show success message
        } catch (error) {
            console.error('Error saving notification settings:', error);
            // Show error message
        }
    };

    const handleSaveSecurity = async () => {
        try {
            // TODO: Implement API call to save security settings
            console.log('Saving security settings:', securitySettings);
            // Show success message
        } catch (error) {
            console.error('Error saving security settings:', error);
            // Show error message
        }
    };

    const handleChangePassword = async () => {
        try {
            if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                throw new Error('New passwords do not match');
            }
            // TODO: Implement API call to change password
            console.log('Changing password');
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            // Show success message
        } catch (error) {
            console.error('Error changing password:', error);
            // Show error message
        }
    };

    const renderGeneralTab = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-text mb-4">General Settings</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-text mb-2">Language</label>
                        <select
                            value={generalSettings.language}
                            onChange={(e) => handleGeneralSettingChange('language', e.target.value)}
                            className="w-full px-4 py-3 border border-text/20 rounded-lg bg-background text-text focus:ring-2 focus:ring-primary-coral focus:border-transparent"
                        >
                            <option value="en">English</option>
                            <option value="fr">Français</option>
                            <option value="es">Español</option>
                            <option value="de">Deutsch</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text mb-2">Timezone</label>
                        <select
                            value={generalSettings.timezone}
                            onChange={(e) => handleGeneralSettingChange('timezone', e.target.value)}
                            className="w-full px-4 py-3 border border-text/20 rounded-lg bg-background text-text focus:ring-2 focus:ring-primary-coral focus:border-transparent"
                        >
                            <option value="UTC">UTC</option>
                            <option value="EST">Eastern Time</option>
                            <option value="PST">Pacific Time</option>
                            <option value="CET">Central European Time</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text mb-2">Date Format</label>
                        <select
                            value={generalSettings.dateFormat}
                            onChange={(e) => handleGeneralSettingChange('dateFormat', e.target.value)}
                            className="w-full px-4 py-3 border border-text/20 rounded-lg bg-background text-text focus:ring-2 focus:ring-primary-coral focus:border-transparent"
                        >
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text mb-2">Theme</label>
                        <select
                            value={generalSettings.theme}
                            onChange={(e) => handleGeneralSettingChange('theme', e.target.value)}
                            className="w-full px-4 py-3 border border-text/20 rounded-lg bg-background text-text focus:ring-2 focus:ring-primary-coral focus:border-transparent"
                        >
                            <option value="auto">Auto</option>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </div>
                </div>
                <div className="mt-6">
                    <button
                        onClick={handleSaveGeneral}
                        className="flex items-center space-x-2 px-6 py-3 bg-primary-coral hover:bg-primary-salmon text-white rounded-lg transition-colors"
                    >
                        <FaSave />
                        <span>Save General Settings</span>
                    </button>
                </div>
            </div>
        </div>
    );

    const renderNotificationsTab = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-text mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                    {Object.entries(notificationSettings).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-background-alt rounded-lg">
                            <div>
                                <h4 className="font-medium text-text capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </h4>
                                <p className="text-sm text-text/60">
                                    {key === 'emailNotifications' && 'Receive notifications via email'}
                                    {key === 'pushNotifications' && 'Receive push notifications in browser'}
                                    {key === 'analysisComplete' && 'Get notified when analysis is complete'}
                                    {key === 'usageAlerts' && 'Receive warnings about usage limits'}
                                    {key === 'featureUpdates' && 'Stay informed about new features'}
                                    {key === 'marketingEmails' && 'Receive promotional emails and offers'}
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={value}
                                    onChange={(e) => handleNotificationSettingChange(key, e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-coral/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-coral"></div>
                            </label>
                        </div>
                    ))}
                </div>
                <div className="mt-6">
                    <button
                        onClick={handleSaveNotifications}
                        className="flex items-center space-x-2 px-6 py-3 bg-primary-coral hover:bg-primary-salmon text-white rounded-lg transition-colors"
                    >
                        <FaSave />
                        <span>Save Notification Settings</span>
                    </button>
                </div>
            </div>
        </div>
    );

    const renderSecurityTab = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-text mb-4">Security Settings</h3>
                <div className="space-y-4">
                    {Object.entries(securitySettings).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-background-alt rounded-lg">
                            <div>
                                <h4 className="font-medium text-text capitalize">
                                    {key === 'twoFactorAuth' ? 'Two-Factor Authentication' :
                                        key === 'loginAlerts' ? 'Login Alerts' :
                                            key === 'sessionTimeout' ? 'Session Timeout' : key}
                                </h4>
                                <p className="text-sm text-text/60">
                                    {key === 'twoFactorAuth' && 'Add an extra layer of security to your account'}
                                    {key === 'loginAlerts' && 'Get notified of new login attempts'}
                                    {key === 'sessionTimeout' && 'Automatically log out after inactivity'}
                                </p>
                            </div>
                            {key === 'sessionTimeout' ? (
                                <select
                                    value={value}
                                    onChange={(e) => handleSecuritySettingChange(key, e.target.value)}
                                    className="px-4 py-2 border border-text/20 rounded-lg bg-background text-text focus:ring-2 focus:ring-primary-coral focus:border-transparent"
                                >
                                    <option value={15}>15 minutes</option>
                                    <option value={30}>30 minutes</option>
                                    <option value={60}>1 hour</option>
                                    <option value={120}>2 hours</option>
                                </select>
                            ) : (
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={value}
                                        onChange={(e) => handleSecuritySettingChange(key, e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-coral/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-coral"></div>
                                </label>
                            )}
                        </div>
                    ))}
                </div>
                <div className="mt-6">
                    <button
                        onClick={handleSaveSecurity}
                        className="flex items-center space-x-2 px-6 py-3 bg-primary-coral hover:bg-primary-salmon text-white rounded-lg transition-colors"
                    >
                        <FaSave />
                        <span>Save Security Settings</span>
                    </button>
                </div>
            </div>

            {/* Change Password Section */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold text-text mb-4">Change Password</h3>
                <div className="bg-background-alt rounded-lg p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text mb-2">Current Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={passwordForm.currentPassword}
                                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                className="w-full px-4 py-3 pr-12 border border-text/20 rounded-lg bg-background text-text focus:ring-2 focus:ring-primary-coral focus:border-transparent"
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text/40 hover:text-text"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text mb-2">New Password</label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                value={passwordForm.newPassword}
                                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                className="w-full px-4 py-3 pr-12 border border-text/20 rounded-lg bg-background text-text focus:ring-2 focus:ring-primary-coral focus:border-transparent"
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text/40 hover:text-text"
                            >
                                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text mb-2">Confirm New Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={passwordForm.confirmPassword}
                                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                className="w-full px-4 py-3 pr-12 border border-text/20 rounded-lg bg-background text-text focus:ring-2 focus:ring-primary-coral focus:border-transparent"
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text/40 hover:text-text"
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={handleChangePassword}
                        className="px-6 py-3 bg-primary-coral hover:bg-primary-salmon text-white rounded-lg transition-colors"
                    >
                        Change Password
                    </button>
                </div>
            </div>
        </div>
    );

    const renderAppearanceTab = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-text mb-4">Appearance Settings</h3>
                <p className="text-text/60 mb-6">
                    Customize the look and feel of your NydArt Advisor experience.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-background-alt rounded-lg p-6">
                        <h4 className="font-medium text-text mb-4">Theme Options</h4>
                        <div className="space-y-3">
                            <label className="flex items-center space-x-3">
                                <input type="radio" name="theme" value="light" className="text-primary-coral" />
                                <span className="text-text">Light Theme</span>
                            </label>
                            <label className="flex items-center space-x-3">
                                <input type="radio" name="theme" value="dark" className="text-primary-coral" />
                                <span className="text-text">Dark Theme</span>
                            </label>
                            <label className="flex items-center space-x-3">
                                <input type="radio" name="theme" value="auto" defaultChecked className="text-primary-coral" />
                                <span className="text-text">Auto (System)</span>
                            </label>
                        </div>
                    </div>
                    <div className="bg-background-alt rounded-lg p-6">
                        <h4 className="font-medium text-text mb-4">Display Options</h4>
                        <div className="space-y-3">
                            <label className="flex items-center space-x-3">
                                <input type="checkbox" defaultChecked className="text-primary-coral" />
                                <span className="text-text">Show animations</span>
                            </label>
                            <label className="flex items-center space-x-3">
                                <input type="checkbox" defaultChecked className="text-primary-coral" />
                                <span className="text-text">Compact layout</span>
                            </label>
                            <label className="flex items-center space-x-3">
                                <input type="checkbox" className="text-primary-coral" />
                                <span className="text-text">High contrast mode</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text mb-2">Settings</h1>
                <p className="text-text/70">Manage your account preferences and security settings</p>
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Tabs */}
                <div className="flex space-x-1 bg-background-alt rounded-lg p-1 mb-8">
                    {tabs.map((tab) => {
                        const IconComponent = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                                        ? 'bg-primary-coral text-white'
                                        : 'text-text hover:text-primary-coral'
                                    }`}
                            >
                                <IconComponent className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="bg-background-alt rounded-xl p-6">
                    {activeTab === 'general' && renderGeneralTab()}
                    {activeTab === 'notifications' && renderNotificationsTab()}
                    {activeTab === 'security' && renderSecurityTab()}
                    {activeTab === 'appearance' && renderAppearanceTab()}
                </div>
            </div>
        </div>
    );
} 