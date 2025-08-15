'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';

export default function PaymentSuccessForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        // Auto-redirect to dashboard after 5 seconds
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    router.push('/dashboard');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    const sessionId = searchParams.get('session_id');
    const planName = searchParams.get('plan') || 'your plan';

    return (
        <div className="w-full max-w-md flex flex-col">
            {/* Success Icon */}
            <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
            </div>

            {/* Success Message */}
            <h1 className="text-2xl font-bold text-text mb-4 text-center">
                Payment Successful!
            </h1>

            <p className="text-text/70 mb-6 text-center">
                Thank you for subscribing to the <span className="font-semibold text-primary-coral">{planName}</span> plan.
                Your subscription is now active and you can start using all the features.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary-coral text-white font-semibold rounded-lg hover:bg-primary-coral/90 transition-colors"
                >
                    Go to Dashboard
                    <FaArrowRight className="ml-2 w-4 h-4" />
                </Link>

                <button
                    onClick={() => router.push('/dashboard/subscription')}
                    className="w-full px-6 py-3 border border-gray-300 dark:border-gray-600 text-text font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    View Subscription Details
                </button>
            </div>

            {/* Auto-redirect notice */}
            <p className="text-sm text-text/50 mt-6 text-center">
                Redirecting to dashboard in {countdown} seconds...
            </p>
        </div>
    );
} 