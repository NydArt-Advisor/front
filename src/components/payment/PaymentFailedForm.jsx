'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaTimesCircle, FaArrowLeft, FaRefresh } from 'react-icons/fa';
import Link from 'next/link';

export default function PaymentFailedForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        // Auto-redirect to plans page after 10 seconds
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    router.push('/dashboard/plans');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    const error = searchParams.get('error');
    const errorCode = searchParams.get('error_code');
    const sessionId = searchParams.get('session_id');

    const getErrorMessage = () => {
        if (error) return error;
        if (errorCode) {
            switch (errorCode) {
                case 'card_declined':
                    return 'Your card was declined. Please try a different payment method.';
                case 'insufficient_funds':
                    return 'Insufficient funds. Please try a different card or payment method.';
                case 'expired_card':
                    return 'Your card has expired. Please use a different card.';
                case 'incorrect_cvc':
                    return 'Incorrect CVC. Please check your card details and try again.';
                case 'processing_error':
                    return 'A processing error occurred. Please try again.';
                default:
                    return 'Payment failed. Please try again or contact support.';
            }
        }
        return 'Payment was cancelled or failed. Please try again.';
    };

    return (
        <div className="w-full max-w-md flex flex-col">
            {/* Error Icon */}
            <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <FaTimesCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold text-text mb-4 text-center">
                Payment Failed
            </h1>

            <p className="text-text/70 mb-6 text-center">
                {getErrorMessage()}
            </p>


            {/* Action Buttons */}
            <div className="space-y-3">
                <Link
                    href="/dashboard/plans"
                    className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary-coral text-white font-semibold rounded-lg hover:bg-primary-coral/90 transition-colors"
                >
                    <FaRefresh className="mr-2 w-4 h-4" />
                    Try Again
                </Link>

                <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full px-6 py-3 border border-gray-300 dark:border-gray-600 text-text font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    <FaArrowLeft className="mr-2 w-4 h-4" />
                    Back to Dashboard
                </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-text/70">
                    <strong>Need help?</strong> If you continue to have issues, please contact our support team.
                </p>
            </div>

            {/* Auto-redirect notice */}
            <p className="text-sm text-text/50 mt-6 text-center">
                Redirecting to plans page in {countdown} seconds...
            </p>
        </div>
    );
} 