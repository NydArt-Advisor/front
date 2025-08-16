'use client';

import { useState, useMemo, useEffect } from 'react';
import useSubscription from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { FaCrown, FaRocket, FaStar, FaCheck, FaTimes, FaCreditCard, FaHistory, FaChartBar } from 'react-icons/fa';
import React from 'react';

export default function SubscriptionManagementPage() {
    // All hooks at the top!
    const { user, isAuthenticated } = useAuth();
    const {
        subscription,
        plans,
        usage,
        loading,
        error,
        updateSubscription,
        cancelSubscription,
        getRemainingRequests,
        getTotalRequests,
        getPlanDetails,
        isActive,
        isExpired,
        isCanceled,
        createSubscription,
        fetchCurrentSubscription
    } = useSubscription();
    const router = useRouter();
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const currentPlan = getPlanDetails();
    const remainingRequests = getRemainingRequests();
    const totalRequests = getTotalRequests();
    const usedRequests = totalRequests - remainingRequests;
    const usagePercentage = totalRequests > 0 ? (usedRequests / totalRequests) * 100 : 0;
    // Map backend plans to UI plans with icons/colors/limitations
    const uiPlans = useMemo(() => (plans || []).map(plan => {
        let icon = FaStar, color = 'bg-gray-100 text-gray-600', limitations = [];
        if (plan.name && plan.name.toLowerCase().includes('pro') && !plan.name.toLowerCase().includes('super')) {
            icon = FaRocket;
            color = 'bg-primary-coral text-white';
            limitations = ['No unlimited requests', 'No dedicated account manager'];
        } else if (plan.name && plan.name.toLowerCase().includes('super')) {
            icon = FaCrown;
            color = 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
            limitations = ['No unlimited requests (yet)'];
        } else {
            limitations = ['No advanced analytics', 'No priority support', 'Limited monthly requests'];
        }
        return {
            ...plan,
            id: plan._id || plan.id || (plan.name ? plan.name.toLowerCase() : 'unknown'),
            price: plan.price === 0 ? '€0' : `€${plan.price}`,
            period: 'month',
            icon,
            color,
            limitations,
            features: plan.features || []
        };
    }), [plans]);

    useEffect(() => {
        // Refetch subscription if redirected from Stripe
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.has('success') || params.has('canceled')) {
                fetchCurrentSubscription();
            }
        }
    }, [fetchCurrentSubscription]);

    // Only return after all hooks are called
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-coral"></div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-coral"></div>
            </div>
        );
    }

    // Subscribe/Upgrade logic
    const handleSubscribe = async (plan) => {
        setErrorMsg("");
        if (!plan || !plan.id) {
            setErrorMsg("Plan ID required. Please select a valid plan.");
            return;
        }
        if (plan.id === 'free') {
            try {
                setUpdating(true);
                await createSubscription('free', 'internal', 'eur');
                // Optionally refresh subscription state
            } catch (err) {
                setErrorMsg(err.message || 'Failed to activate free plan.');
            } finally {
                setUpdating(false);
            }
        } else {
            setSelectedPlan(plan);
            setShowPaymentModal(true);
        }
    };

    // Payment method handler
    const handlePaymentMethod = async (method) => {
        if (!selectedPlan) return;
        setShowPaymentModal(false);
        setUpdating(true);
        setErrorMsg("");
        try {
            await createSubscription(selectedPlan.id, method, 'eur');
            // Optionally refresh subscription state
        } catch (err) {
            setErrorMsg(err.message || 'Failed to subscribe.');
        } finally {
            setUpdating(false);
            setSelectedPlan(null);
        }
    };

    const handleUpgrade = async (planId) => {
        if (planId === subscription?.plan) return;

        setUpdating(true);
        try {
            await updateSubscription(planId);
            // Show success message
        } catch (error) {
            console.error('Error upgrading subscription:', error);
            // Show error message
        } finally {
            setUpdating(false);
        }
    };

    const handleCancel = async () => {
        try {
            await cancelSubscription();
            setShowCancelModal(false);
            // Show success message
        } catch (error) {
            console.error('Error canceling subscription:', error);
            // Show error message
        }
    };

    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-text mb-2">Subscription Management</h1>
                    <p className="text-text/70">Manage your subscription and view usage statistics</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Current Subscription */}
                {subscription && (
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        {/* Current Plan Card */}
                        <div className="bg-background-alt rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-text">Current Plan</h2>
                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${isActive() ? 'bg-green-100 text-green-800' :
                                    isExpired() ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {isActive() ? 'Active' : isExpired() ? 'Expired' : 'Canceled'}
                                </div>
                            </div>

                            {currentPlan && (
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${currentPlan.icon === FaStar ? 'bg-gray-100 text-gray-600' : currentPlan.icon === FaRocket ? 'bg-primary-coral text-white' : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'}`}>
                                            {(currentPlan.icon || FaStar) && React.createElement(currentPlan.icon || FaStar, { className: "text-xl" })}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-text">{currentPlan.name}</h3>
                                            <p className="text-text/70">{currentPlan.price}/month</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-sm text-text/70">Features included:</p>
                                        {currentPlan.features.slice(0, 3).map((feature, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <FaCheck className="text-green-500 text-sm" />
                                                <span className="text-sm text-text/80">{feature}</span>
                                            </div>
                                        ))}
                                        {currentPlan.features.length > 3 && (
                                            <p className="text-sm text-primary-coral">+{currentPlan.features.length - 3} more features</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Usage Statistics */}
                        <div className="bg-background-alt rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-text mb-4">Usage This Month</h2>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-text/70">AI Art Analyses</span>
                                        <span className="text-text">{usedRequests} / {totalRequests}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${usagePercentage > 80 ? 'bg-red-500' :
                                                usagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                                }`}
                                            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-background rounded-lg">
                                        <div className="text-2xl font-bold text-primary-coral">{remainingRequests}</div>
                                        <div className="text-xs text-text/70">Remaining</div>
                                    </div>
                                    <div className="text-center p-3 bg-background rounded-lg">
                                        <div className="text-2xl font-bold text-text">{usedRequests}</div>
                                        <div className="text-xs text-text/70">Used</div>
                                    </div>
                                </div>

                                {remainingRequests === 0 && (
                                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm">
                                        You've reached your monthly limit. Consider upgrading your plan for more analyses.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Available Plans Button */}
                <div className="mb-8 flex justify-center w-full">
                    <button
                        className="px-6 py-3 rounded-lg bg-primary-coral text-white font-semibold hover:bg-primary-salmon transition-colors shadow text-lg"
                        style={{ minWidth: 280 }}
                        onClick={() => router.push('/dashboard/plans')}
                    >
                        See Available Plans
                    </button>
                </div>

                {/* Subscription Actions */}
                {subscription && isActive() && (
                    <div className="bg-background-alt rounded-xl p-6 mb-8">
                        <h2 className="text-xl font-semibold text-text mb-4">Subscription Actions</h2>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => router.push('/dashboard/billing')}
                                className="flex items-center space-x-2 bg-background hover:bg-gray-100 text-text px-4 py-2 rounded-lg transition-colors"
                            >
                                <FaCreditCard />
                                <span>Billing History</span>
                            </button>
                            <button
                                onClick={() => router.push('/dashboard/payment-methods')}
                                className="flex items-center space-x-2 bg-background hover:bg-gray-100 text-text px-4 py-2 rounded-lg transition-colors"
                            >
                                <FaCreditCard />
                                <span>Payment Methods</span>
                            </button>
                            <button
                                onClick={() => setShowCancelModal(true)}
                                className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg transition-colors"
                            >
                                <FaTimes />
                                <span>Cancel Subscription</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Cancel Modal */}
                {showCancelModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-background rounded-xl p-6 max-w-md w-full mx-4">
                            <h3 className="text-xl font-semibold text-text mb-4">Cancel Subscription</h3>
                            <p className="text-text/70 mb-6">
                                Are you sure you want to cancel your subscription? You'll continue to have access until the end of your current billing period.
                            </p>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-text px-4 py-2 rounded-lg transition-colors"
                                >
                                    Keep Subscription
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    Cancel Subscription
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error message for subscribe */}
                {errorMsg && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {errorMsg}
                    </div>
                )}

                {/* Payment Method Modal */}
                {showPaymentModal && selectedPlan && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-background rounded-xl p-6 max-w-md w-full mx-4">
                            <h3 className="text-xl font-semibold text-text mb-4">Choose Payment Method</h3>
                            <p className="mb-4 text-text/70">Select a payment method for the <span className="font-bold">{selectedPlan.name}</span> plan.</p>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => handlePaymentMethod('stripe')}
                                    className="flex-1 bg-primary-coral hover:bg-primary-salmon text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    Pay with Stripe
                                </button>
                                <button
                                    onClick={() => handlePaymentMethod('paypal')}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    Pay with PayPal
                                </button>
                            </div>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="mt-6 w-full bg-gray-200 hover:bg-gray-300 text-text px-4 py-2 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 