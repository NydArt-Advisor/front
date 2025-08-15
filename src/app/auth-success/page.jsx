'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';

export default function AuthSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { loginWithToken } = useAuth();
    const { isDarkMode } = useTheme();
    const [status, setStatus] = useState('processing');
    const processingRef = useRef(false);

    useEffect(() => {
        const handleAuthSuccess = async () => {
            // Prevent multiple calls
            if (processingRef.current) {
                return;
            }

            processingRef.current = true;

            try {
                const token = searchParams.get('token');
                const error = searchParams.get('error');

                if (error) {
                    console.error('OAuth error:', error);
                    // Redirect to login with error message
                    router.push(`/auth/login?error=${encodeURIComponent('Authentication failed. Please try again.')}`);
                    return;
                }

                if (!token) {
                    console.error('No token received');
                    // Redirect to login with error message
                    router.push(`/auth/login?error=${encodeURIComponent('No authentication token received. Please try again.')}`);
                    return;
                }

                // Login with the received token
                await loginWithToken(token);
                setStatus('success');

                // Redirect to dashboard after successful login
                setTimeout(() => {
                    router.push('/dashboard');
                }, 1000);

            } catch (error) {
                console.error('Error processing OAuth callback:', error);
                // Redirect to login with error message
                router.push(`/auth/login?error=${encodeURIComponent('Failed to complete authentication. Please try again.')}`);
            } finally {
                processingRef.current = false;
            }
        };

        handleAuthSuccess();
    }, [searchParams, loginWithToken, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <div className="mb-8">
                    <Image
                        src={isDarkMode ? '/Logo/Long_logo_dark.svg' : '/Logo/Long_logo_light.svg'}
                        alt="NYDART Logo"
                        width={150}
                        height={50}
                        className="h-12 w-auto mx-auto"
                    />
                </div>

                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-coral mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-text mb-2">Completing Sign In</h2>
                <p className="text-text/60">Please wait while we complete your authentication...</p>
            </div>
        </div>
    );
} 