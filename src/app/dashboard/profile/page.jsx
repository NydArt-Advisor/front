'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { FaUser, FaEnvelope, FaCalendar, FaEdit, FaSave, FaTimes, FaBrain, FaChartLine, FaPhone } from 'react-icons/fa';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import AuthService from '@/services/auth.service';

export default function ProfilePage() {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [stats, setStats] = useState({
        daysActive: 0,
        analysesCompleted: 0,
        averageAccuracy: 0
    });
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        bio: '',
        phoneNumber: ''
    });

    // Function to detect country from phone number
    const detectCountryFromPhone = (phoneNumber) => {
        if (!phoneNumber) return 'fr'; // Default to France

        // Common country codes
        const countryCodes = {
            '1': 'us',    // US/Canada
            '33': 'fr',   // France
            '44': 'gb',   // UK
            '49': 'de',   // Germany
            '34': 'es',   // Spain
            '39': 'it',   // Italy
            '32': 'be',   // Belgium
            '31': 'nl',   // Netherlands
            '46': 'se',   // Sweden
            '47': 'no',   // Norway
            '45': 'dk',   // Denmark
            '358': 'fi',  // Finland
            '48': 'pl',   // Poland
            '420': 'cz',  // Czech Republic
            '36': 'hu',   // Hungary
            '40': 'ro',   // Romania
            '421': 'sk',  // Slovakia
            '386': 'si',  // Slovenia
            '385': 'hr',  // Croatia
            '387': 'ba',  // Bosnia
            '389': 'mk',  // North Macedonia
            '382': 'me',  // Montenegro
            '381': 'rs',  // Serbia
            '43': 'at',   // Austria
            '41': 'ch',   // Switzerland
            '352': 'lu',  // Luxembourg
            '377': 'mc',  // Monaco
            '378': 'sm',  // San Marino
            '39': 'va',   // Vatican
            '356': 'mt',  // Malta
            '357': 'cy',  // Cyprus
            '30': 'gr',   // Greece
            '351': 'pt',  // Portugal
            '353': 'ie',  // Ireland
            '354': 'is',  // Iceland
            '47': 'no',   // Norway
            '46': 'se',   // Sweden
            '45': 'dk',   // Denmark
            '358': 'fi',  // Finland
            '372': 'ee',  // Estonia
            '371': 'lv',  // Latvia
            '370': 'lt',  // Lithuania
            '48': 'pl',   // Poland
            '420': 'cz',  // Czech Republic
            '421': 'sk',  // Slovakia
            '36': 'hu',   // Hungary
            '40': 'ro',   // Romania
            '43': 'at',   // Austria
            '41': 'ch',   // Switzerland
            '49': 'de',   // Germany
            '31': 'nl',   // Netherlands
            '32': 'be',   // Belgium
            '33': 'fr',   // France
            '34': 'es',   // Spain
            '351': 'pt',  // Portugal
            '39': 'it',   // Italy
            '30': 'gr',   // Greece
            '357': 'cy',  // Cyprus
            '356': 'mt',  // Malta
            '352': 'lu',  // Luxembourg
            '377': 'mc',  // Monaco
            '378': 'sm',  // San Marino
            '39': 'va',   // Vatican
            '43': 'at',   // Austria
            '41': 'ch',   // Switzerland
            '49': 'de',   // Germany
            '31': 'nl',   // Netherlands
            '32': 'be',   // Belgium
            '33': 'fr',   // France
            '34': 'es',   // Spain
            '351': 'pt',  // Portugal
            '39': 'it',   // Italy
            '30': 'gr',   // Greece
            '357': 'cy',  // Cyprus
            '356': 'mt',  // Malta
            '352': 'lu',  // Luxembourg
            '377': 'mc',  // Monaco
            '378': 'sm',  // San Marino
            '39': 'va',   // Vatican
        };

        // Remove the + and get the country code
        const cleanNumber = phoneNumber.replace('+', '');

        // Try to match country codes of different lengths
        for (let i = 3; i >= 1; i--) {
            const code = cleanNumber.substring(0, i);
            if (countryCodes[code]) {
                return countryCodes[code];
            }
        }

        return 'fr'; // Default to France if no match found
    };

    // Initialize form data when user data is available
    useEffect(() => {
        if (user) {
            const nameParts = user.profile?.name?.split(' ') || [];
            setFormData({
                username: user.username || '',
                email: user.email || '',
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                bio: user.profile?.bio || '',
                phoneNumber: user.phone?.number || ''
            });
        }
    }, [user]);

    // Calculate user statistics
    useEffect(() => {
        if (user) {
            // Calculate days active with proper validation
            let daysActive = 1; // Default to 1 day
            if (user.createdAt) {
                try {
                    const createdAt = new Date(user.createdAt);
                    const now = new Date();
                    const calculatedDays = Math.ceil((now - createdAt) / (1000 * 60 * 60 * 24));
                    daysActive = isNaN(calculatedDays) || calculatedDays < 1 ? 1 : calculatedDays;
                } catch (error) {
                    console.error('Error calculating days active:', error);
                    daysActive = 1;
                }
            }

            // Fetch analyses count from API
            const fetchStats = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`${process.env.NEXT_PUBLIC_DB_SERVICE_URL}/api/analyses/user`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const analysesCount = data.analyses?.length || 0;
                        const accuracy = analysesCount > 0 ? Math.floor(Math.random() * 20) + 80 : 0; // Mock accuracy for now

                        setStats({
                            daysActive: daysActive,
                            analysesCompleted: analysesCount,
                            averageAccuracy: accuracy
                        });
                    } else {
                        // Fallback if API call fails
                        setStats({
                            daysActive: daysActive,
                            analysesCompleted: 0,
                            averageAccuracy: 0
                        });
                    }
                } catch (error) {
                    console.error('Error fetching stats:', error);
                    setStats({
                        daysActive: daysActive,
                        analysesCompleted: 0,
                        averageAccuracy: 0
                    });
                }
            };

            fetchStats();
        }
    }, [user]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Detect country code from phone number
            const detectedCountry = detectCountryFromPhone(formData.phoneNumber);

            // Prepare the update data including phone number
            const updateData = {
                ...formData,
                phone: {
                    number: formData.phoneNumber,
                    countryCode: detectedCountry.toUpperCase()
                }
            };

            const result = await AuthService.updateProfile(updateData);

            // Update the user context with new data
            if (result.user) {
                updateUser(result.user);
            }

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (user) {
            const nameParts = user.profile?.name?.split(' ') || [];
            setFormData({
                username: user.username || '',
                email: user.email || '',
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                bio: user.profile?.bio || '',
                phoneNumber: user.phone?.number || ''
            });
        }
        setIsEditing(false);
        setMessage({ type: '', text: '' });
    };

    if (!user) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-coral mx-auto mb-4"></div>
                        <p className="text-text/60">Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

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
                                {user.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-text">{user.username}</h2>
                                <p className="text-text/60">
                                    Member since {new Date(user.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            disabled={isLoading}
                            className="flex items-center space-x-2 px-4 py-2 bg-primary-coral hover:bg-primary-salmon text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isEditing ? <FaTimes /> : <FaEdit />}
                            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                        </button>
                    </div>
                </div>

                {/* Message Display */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                        ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                        : 'bg-red-500/10 border border-red-500/20 text-red-400'
                        }`}>
                        {message.text}
                    </div>
                )}

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

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">
                                Phone Number
                            </label>
                            <div className="relative">
                                <PhoneInput
                                    country={detectCountryFromPhone(formData.phoneNumber)}
                                    value={formData.phoneNumber}
                                    onChange={(phone) => handleInputChange('phoneNumber', phone)}
                                    containerClass="!w-full"
                                    inputClass={`!w-full !h-12 !bg-background !text-text !border-text/20 !rounded-lg focus:!border-primary-coral focus:!ring-1 focus:!ring-primary-coral ${!isEditing ? '!bg-background-alt !text-text/60' : ''}`}
                                    buttonClass="!bg-background !border-text/20 !rounded-l-lg"
                                    dropdownClass="!bg-background !text-text"
                                    searchClass="!bg-background !text-text"
                                    searchPlaceholder="Search countries..."
                                    placeholder="Enter phone number"
                                    disabled={!isEditing}
                                    enableSearch={true}
                                    searchNotFound="No countries found"
                                    preferredCountries={['fr', 'us', 'gb', 'de', 'es', 'it']}
                                />
                            </div>
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
                                disabled={isLoading}
                                className="flex items-center space-x-2 px-6 py-3 bg-primary-coral hover:bg-primary-salmon text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                    <FaSave />
                                )}
                                <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={isLoading}
                                className="px-6 py-3 bg-background border border-text/20 hover:bg-background-alt text-text rounded-lg transition-colors disabled:opacity-50"
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
                        <h3 className="text-2xl font-bold text-text mb-2">
                            {isNaN(stats.daysActive) ? 0 : stats.daysActive}
                        </h3>
                        <p className="text-text/60 text-sm">Days Active</p>
                    </div>
                    <div className="bg-background-alt rounded-xl p-6 text-center">
                        <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <FaBrain className="text-2xl text-green-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-text mb-2">
                            {isNaN(stats.analysesCompleted) ? 0 : stats.analysesCompleted}
                        </h3>
                        <p className="text-text/60 text-sm">Analyses Completed</p>
                    </div>
                    <div className="bg-background-alt rounded-xl p-6 text-center">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <FaChartLine className="text-2xl text-blue-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-text mb-2">
                            {isNaN(stats.averageAccuracy) ? 0 : stats.averageAccuracy}%
                        </h3>
                        <p className="text-text/60 text-sm">Average Accuracy</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 