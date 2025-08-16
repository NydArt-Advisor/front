'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import ThemeButton from '@/components/UI/ThemeButton';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';

const RegisterForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { register } = useAuth();
    const { isDarkMode } = useTheme();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Check for error messages from URL parameters (OAuth errors)
    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam) {
            setError(decodeURIComponent(errorParam));
        }
    }, [searchParams]);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: {
            number: '',
            countryCode: ''
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhoneChange = (value, country) => {
        setFormData(prev => ({
            ...prev,
            phone: {
                number: value,
                countryCode: country.countryCode.toUpperCase()
            }
        }));
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...registerData } = formData;
            await register(registerData);
            router.push('/dashboard');
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        // Redirect to Google OAuth endpoint
        const authServiceUrl = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;
        window.location.href = `${authServiceUrl}/auth/google`;
    };

    return (
        <div className="w-full max-w-md min-h-[600px] flex flex-col">
            {/* Logo and Theme Toggle */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                    <Image
                        src={isDarkMode ? '/Logo/Long_logo_dark.svg' : '/Logo/Long_logo_light.svg'}
                        alt="NYDART Logo"
                        width={120}
                        height={40}
                        className="h-8 w-auto"
                    />
                </div>
                <ThemeButton />
            </div>

            <h1 className="text-3xl font-bold mb-2 text-text">Welcome NYDART</h1>
            <p className="text-text/60 mb-8">Welcome to NydArt dashboard Community</p>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Google Sign In Button */}
            <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-2 bg-background border border-text/10 rounded-lg p-3 mb-6 hover:bg-text/5 transition-colors"
            >
                <FcGoogle className="text-2xl" />
                <span className="text-text">Continue With Google</span>
            </button>

            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-text/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-background text-text/60">Or</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 flex-1">
                <Input
                    label="Username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Choose a username"
                />

                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                />

                {/* Phone Number Input */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-text">
                        Phone Number (Optional)
                    </label>
                    <PhoneInput
                        country={'fr'}
                        value={formData.phone.number}
                        onChange={handlePhoneChange}
                        containerClass="!w-full"
                        inputClass="!w-full !h-11 !bg-background !text-text !border-text/10 !rounded-lg focus:!border-primary-coral focus:!ring-1 focus:!ring-primary-coral"
                        buttonClass="!bg-background !border-text/10 !rounded-l-lg"
                        dropdownClass="!bg-background !text-text"
                        searchClass="!bg-background !text-text"
                    />
                </div>

                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a password"
                />

                <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                />

                <div className="flex items-center mb-6">
                    <input
                        type="checkbox"
                        id="remember"
                        className="rounded border-text/10 bg-background text-primary-coral focus:ring-primary-coral"
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-text/60">
                        Remember Me
                    </label>
                </div>

                <div className="mt-auto">
                    <Button
                        type="submit"
                        className="w-full bg-primary-coral hover:bg-primary-salmon text-white"
                        loading={loading}
                    >
                        Register
                    </Button>

                    <p className="text-center text-sm text-text/60 mt-6">
                        Already have an account?{' '}
                        <Link
                            href="/auth/login"
                            className="text-text hover:text-primary-coral transition-colors font-medium"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm; 