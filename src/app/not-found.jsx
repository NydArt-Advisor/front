'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaHome, FaArrowLeft, FaSearch, FaExclamationTriangle } from 'react-icons/fa';

export default function NotFound() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check authentication status without triggering auth checks
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* 404 Icon */}
                <div className="mb-8">
                    <div className="w-32 h-32 mx-auto bg-primary-coral/10 rounded-full flex items-center justify-center">
                        <FaExclamationTriangle className="text-6xl text-primary-coral" />
                    </div>
                </div>

                {/* Error Message */}
                <h1 className="text-6xl font-bold text-text mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-text mb-4">Page Not Found</h2>
                <p className="text-text/70 mb-8">
                    Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
                </p>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center w-full bg-primary-coral hover:bg-primary-salmon text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        <FaHome className="mr-2" />
                        Go to Homepage
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center w-full bg-background-alt hover:bg-background-alt/80 text-text px-6 py-3 rounded-lg font-medium transition-colors border border-text/20"
                    >
                        <FaArrowLeft className="mr-2" />
                        Go Back
                    </button>

                    {isAuthenticated && (
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center justify-center w-full bg-background-alt hover:bg-background-alt/80 text-text px-6 py-3 rounded-lg font-medium transition-colors border border-text/20"
                        >
                            Go to Dashboard
                        </Link>
                    )}


                </div>

                {/* Helpful Links */}
                <div className="mt-12 pt-8 border-t border-text/10">
                    <p className="text-sm text-text/60 mb-4">Popular pages:</p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <Link href="/about" className="text-primary-coral hover:text-primary-salmon">
                            About
                        </Link>
                        <Link href="/dashboard/subscription" className="text-primary-coral hover:text-primary-salmon">
                            Pricing
                        </Link>
                        <Link href="/analyze" className="text-primary-coral hover:text-primary-salmon">
                            Art Analysis
                        </Link>
                        {!isAuthenticated && (
                            <Link href="/auth/login" className="text-primary-coral hover:text-primary-salmon">
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 