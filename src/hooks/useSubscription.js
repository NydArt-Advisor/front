import { useState, useEffect, useCallback } from 'react';
import paymentApiService from '@/services/paymentApi.service';

export default function useSubscription() {
    const [subscription, setSubscription] = useState(null);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch available plans
    const fetchPlans = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await paymentApiService.getPlans();
            setPlans(response.data || []);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching plans:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch current subscription
    const fetchCurrentSubscription = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await paymentApiService.getCurrentSubscription();
            setSubscription(response.data || null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching current subscription:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Create subscription
    const createSubscription = useCallback(async (planId, paymentMethod, currency = 'eur', metadata = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await paymentApiService.createSubscription(planId, paymentMethod, currency, metadata);
            
            // Update local state
            if (response.data?.subscription) {
                setSubscription(response.data.subscription);
            }
            
            return response;
        } catch (err) {
            setError(err.message);
            console.error('Error creating subscription:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Update subscription
    const updateSubscription = useCallback(async (subscriptionId, updates) => {
        try {
            setLoading(true);
            setError(null);
            const response = await paymentApiService.updateSubscription(subscriptionId, updates);
            
            // Refresh current subscription
            await fetchCurrentSubscription();
            
            return response;
        } catch (err) {
            setError(err.message);
            console.error('Error updating subscription:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchCurrentSubscription]);

    // Cancel subscription
    const cancelSubscription = useCallback(async (subscriptionId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await paymentApiService.cancelSubscription(subscriptionId);
            
            // Refresh current subscription
            await fetchCurrentSubscription();
            
            return response;
        } catch (err) {
            setError(err.message);
            console.error('Error cancelling subscription:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchCurrentSubscription]);

    // Get subscription usage
    const getSubscriptionUsage = useCallback(async (subscriptionId) => {
        try {
            setError(null);
            const response = await paymentApiService.getSubscriptionUsage(subscriptionId);
            return response.data;
        } catch (err) {
            setError(err.message);
            console.error('Error fetching subscription usage:', err);
            throw err;
        }
    }, []);

    // Get billing history
    const getBillingHistory = useCallback(async (subscriptionId, page = 1, limit = 10) => {
        try {
            setError(null);
            const response = await paymentApiService.getBillingHistory(subscriptionId, page, limit);
            return response.data;
        } catch (err) {
            setError(err.message);
            console.error('Error fetching billing history:', err);
            throw err;
        }
    }, []);

    // Helper functions for subscription data
    const getPlanDetails = useCallback((planId) => {
        return plans.find(plan => plan.id === planId) || null;
    }, [plans]);

    const getRemainingRequests = useCallback(() => {
        if (!subscription) return 0;
        return Math.max(0, subscription.requestsTotal - subscription.requestsUsed);
    }, [subscription]);

    const getTotalRequests = useCallback(() => {
        return subscription?.requestsTotal || 0;
    }, [subscription]);

    const getUsedRequests = useCallback(() => {
        return subscription?.requestsUsed || 0;
    }, [subscription]);

    const getUsagePercentage = useCallback(() => {
        if (!subscription || subscription.requestsTotal === 0) return 0;
        return (subscription.requestsUsed / subscription.requestsTotal) * 100;
    }, [subscription]);

    // Subscription status helpers
    const isActive = useCallback(() => {
        return subscription && subscription.status === 'active';
    }, [subscription]);

    const isExpired = useCallback(() => {
        if (!subscription) return false;
        if (subscription.status === 'expired') return true;
        if (subscription.currentPeriodEnd) {
            const now = new Date();
            const end = new Date(subscription.currentPeriodEnd);
            return end < now;
        }
        return false;
    }, [subscription]);

    const isCanceled = useCallback(() => {
        return subscription && subscription.status === 'canceled';
    }, [subscription]);

    // Initialize data on mount
    useEffect(() => {
        fetchPlans();
        fetchCurrentSubscription();
    }, [fetchPlans, fetchCurrentSubscription]);

    return {
        // State
        subscription,
        plans,
        loading,
        error,
        
        // Actions
        fetchPlans,
        fetchCurrentSubscription,
        createSubscription,
        updateSubscription,
        cancelSubscription,
        getSubscriptionUsage,
        getBillingHistory,
        
        // Helper functions
        getPlanDetails,
        getRemainingRequests,
        getTotalRequests,
        getUsedRequests,
        getUsagePercentage,
        isActive,
        isExpired,
        isCanceled,
        
        // Clear error
        clearError: () => setError(null)
    };
} 