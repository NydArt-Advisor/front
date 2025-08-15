'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { FaUser, FaEnvelope, FaCalendar, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

export default function ProfilePage() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        bio: user?.bio || ''
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            // TODO: Implement profile update API call
            console.log('Saving profile:', formData);
            setIsEditing(false);
            // Show success message
        } catch (error) {
            console.error('Error saving profile:', error);
            // Show error message
        }
    };

    const handleCancel = () => {
        setFormData({
            username: user?.username || '',
            email: user?.email || '',
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            bio: user?.bio || ''
        });
        setIsEditing(false);
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text mb-2">Profile</h1>
                <p className="text-text/70">Manage your account information and preferences</p>
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="bg-background-alt rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-primary-coral text-white rounded-full flex items-center justify-center text-2xl font-bold">
                                {user?.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-text">{user?.username}</h2>
                                <p className="text-text/60">Member since {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="flex items-center space-x-2 px-4 py-2 bg-primary-coral hover:bg-primary-salmon text-white rounded-lg transition-colors"
                        >
                            {isEditing ? <FaTimes /> : <FaEdit />}
                            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                        </button>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="bg-background-alt rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-text mb-6">Personal Information</h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/40" />
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full pl-10 pr-4 py-3 border border-text/20 rounded-lg bg-background text-text disabled:bg-background-alt disabled:text-text/60 focus:ring-2 focus:ring-primary-coral focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/40" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full pl-10 pr-4 py-3 border border-text/20 rounded-lg bg-background text-text disabled:bg-background-alt disabled:text-text/60 focus:ring-2 focus:ring-primary-coral focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">
                                First Name
                            </label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 border border-text/20 rounded-lg bg-background text-text disabled:bg-background-alt disabled:text-text/60 focus:ring-2 focus:ring-primary-coral focus:border-transparent"
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">
                                Last Name
                            </label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 border border-text/20 rounded-lg bg-background text-text disabled:bg-background-alt disabled:text-text/60 focus:ring-2 focus:ring-primary-coral focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-text mb-2">
                            Bio
                        </label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            disabled={!isEditing}
                            rows={4}
                            placeholder="Tell us about yourself..."
                            className="w-full px-4 py-3 border border-text/20 rounded-lg bg-background text-text disabled:bg-background-alt disabled:text-text/60 focus:ring-2 focus:ring-primary-coral focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Save Button */}
                    {isEditing && (
                        <div className="mt-6 flex space-x-4">
                            <button
                                onClick={handleSave}
                                className="flex items-center space-x-2 px-6 py-3 bg-primary-coral hover:bg-primary-salmon text-white rounded-lg transition-colors"
                            >
                                <FaSave />
                                <span>Save Changes</span>
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-6 py-3 bg-background border border-text/20 hover:bg-background-alt text-text rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                {/* Account Statistics */}
                <div className="mt-8 grid md:grid-cols-3 gap-6">
                    <div className="bg-background-alt rounded-xl p-6 text-center">
                        <div className="w-12 h-12 bg-primary-coral/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <FaCalendar className="text-2xl text-primary-coral" />
                        </div>
                        <h3 className="text-2xl font-bold text-text mb-2">30</h3>
                        <p className="text-text/60 text-sm">Days Active</p>
                    </div>
                    <div className="bg-background-alt rounded-xl p-6 text-center">
                        <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <FaUser className="text-2xl text-green-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-text mb-2">15</h3>
                        <p className="text-text/60 text-sm">Analyses Completed</p>
                    </div>
                    <div className="bg-background-alt rounded-xl p-6 text-center">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <FaEnvelope className="text-2xl text-blue-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-text mb-2">94%</h3>
                        <p className="text-text/60 text-sm">Average Accuracy</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 