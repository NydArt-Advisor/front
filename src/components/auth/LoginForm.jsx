'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ThemeButton from '@/components/ui/ThemeButton';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';

const LoginForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
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
        email: '',
        password: '',
        twoFactorCode: ''
    });
    const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
    const [step, setStep] = useState(1); // 1: email/password, 2: 2FA code

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (step === 1) {
                // First step: email and password
                const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // Login successful
                    await login(formData);
                    router.push('/dashboard');
                } else if (response.status === 400 && data.requiresTwoFactor) {
                    // 2FA required
                    setRequiresTwoFactor(true);
                    setStep(2);
                    setError('');
                } else {
                    setError(data.message || 'Invalid email or password');
                }
            } else {
                // Second step: 2FA code
                const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                        twoFactorCode: formData.twoFactorCode
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // Login successful with 2FA
                    await login(formData);
                    router.push('/dashboard');
                } else {
                    setError(data.message || 'Invalid two-factor authentication code');
                }
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        const authServiceUrl = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;
        window.location.href = `${authServiceUrl}/auth/google`;
    };

    const handleBack = () => {
        setStep(1);
        setRequiresTwoFactor(false);
        setFormData(prev => ({ ...prev, twoFactorCode: '' }));
        setError('');
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

            <h1 className="text-3xl font-bold mb-2 text-text">
                {step === 1 ? 'Welcome Back' : 'Two-Factor Authentication'}
            </h1>
            <p className="text-text/60 mb-8">
                {step === 1
                    ? 'Welcome to NydArt dashboard Community'
                    : 'Enter the 6-digit code from your authenticator app'
                }
            </p>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {step === 1 && (
                <>
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
                </>
            )}

            {step === 2 && (
                <div className="mb-6">
                    <button
                        onClick={handleBack}
                        className="flex items-center text-text/60 hover:text-text transition-colors mb-4"
                    >
                        ← Back to login
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                {step === 1 ? (
                    <>
                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                        />

                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="rounded border-text/10 bg-background text-primary-coral focus:ring-primary-coral"
                                />
                                <label htmlFor="remember" className="ml-2 text-sm text-text/60">
                                    Remember Me
                                </label>
                            </div>
                            <Link
                                href="/auth/forgot-password"
                                className="text-sm text-text hover:text-primary-coral transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </>
                ) : (
                    <Input
                        label="Two-Factor Authentication Code"
                        type="text"
                        name="twoFactorCode"
                        value={formData.twoFactorCode}
                        onChange={handleChange}
                        required
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        autoFocus
                    />
                )}

                <div className="mt-auto">
                    <Button
                        type="submit"
                        className="w-full bg-primary-coral hover:bg-primary-salmon text-white"
                        loading={loading}
                    >
                        {step === 1 ? 'Log in' : 'Verify & Log in'}
                    </Button>

                    {step === 1 && (
                        <p className="text-center text-sm text-text/60 mt-6">
                            Don't have an account?{' '}
                            <Link
                                href="/auth/register"
                                className="text-text hover:text-primary-coral transition-colors font-medium"
                            >
                                Sign up
                            </Link>
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default LoginForm; 