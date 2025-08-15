"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FaCrown, FaRocket, FaStar } from "react-icons/fa";
import paymentApiService from '@/services/paymentApi.service';
import PlanCard from '@/components/UI/PlanCard';
import PlanComparisonTable from '@/components/UI/PlanComparisonTable';
import useSubscription from '@/hooks/useSubscription';

export default function PlansPage() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [subscribingPlanId, setSubscribingPlanId] = useState(null);
    const [successMsg, setSuccessMsg] = useState("");
    const { createSubscription, fetchCurrentSubscription } = useSubscription();

    useEffect(() => {
        async function fetchPlans() {
            setLoading(true);
            try {
                const response = await paymentApiService.getPlans();
                setPlans(response.data || []);
            } catch (err) {
                setError(err.message || "Error loading plans");
            } finally {
                setLoading(false);
            }
        }
        fetchPlans();
    }, []);

    useEffect(() => {
        // Refetch subscription if redirected from Stripe
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.has('success') || params.has('canceled')) {
                fetchCurrentSubscription();
            }
        }
    }, [fetchCurrentSubscription]);

    // Map plans to UI with icons/colors
    const uiPlans = useMemo(() => (plans || []).map(plan => {
        let icon = FaStar, color = "bg-gray-100 text-gray-600 border border-gray-200", highlight = false;
        if (plan.name && plan.name.toLowerCase().includes("pro")) {
            icon = FaRocket;
            color = "bg-primary-coral text-white border-2 border-primary-coral shadow-lg";
            highlight = true;
        } else if (plan.name && plan.name.toLowerCase().includes("ultra")) {
            icon = FaCrown;
            color = "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-2 border-purple-400 shadow-lg";
            highlight = true;
        } else if (plan.name && plan.name.toLowerCase().includes("premium")) {
            icon = FaRocket;
            color = "bg-primary-coral text-white border-2 border-primary-coral shadow-lg";
            highlight = true;
        }
        // Use backend planId if available, else fallback
        const planId = plan.planId || plan.id || (plan.name ? plan.name.toLowerCase() : 'unknown');
        return {
            ...plan,
            planId,
            id: planId,
            price: plan.price === 0 ? "€0" : `€${plan.price}`,
            icon,
            color,
            highlight,
            features: plan.features || [],
        };
    }), [plans]);

    // Collect all unique features for the comparison table
    const allFeatures = useMemo(() => {
        const set = new Set();
        uiPlans.forEach(plan => plan.features.forEach(f => set.add(f)));
        return Array.from(set);
    }, [uiPlans]);

    // Handle plan subscription
    const planIdMap = {
        Free: 'free',
        Basic: 'pro',
        Pro: 'super-pro'
    };
    const handleSubscribe = async (plan) => {
        setError("");
        setSuccessMsg("");
        setSubscribingPlanId(plan.id);
        try {
            const planId = planIdMap[plan.name] || plan.name.toLowerCase();
            const response = await createSubscription(planId, 'stripe', 'eur');
            if (response.data?.checkoutUrl) {
                window.location.href = response.data.checkoutUrl;
                return;
            }
            setSuccessMsg(`You have successfully subscribed to the ${plan.name} plan!`);
        } catch (err) {
            setError(err.message || 'Failed to subscribe.');
        } finally {
            setSubscribingPlanId(null);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-text mb-2">Our Plans</h1>
                <p className="text-center text-text/70 mb-10">
                    Choose the plan that best fits your needs and optimize your experience with NydArt Advisor.
                </p>
                {successMsg && (
                    <div className="mb-6 text-center text-green-600 font-semibold">{successMsg}</div>
                )}
                {/* Plan Cards */}
                <div className="flex flex-col md:flex-row gap-8 justify-center mb-12">
                    {uiPlans.map((plan, idx) => (
                        <PlanCard
                            key={plan.id}
                            icon={plan.icon}
                            name={plan.name}
                            description={plan.description}
                            price={plan.price}
                            highlight={plan.highlight}
                            color={plan.color}
                            buttonText={subscribingPlanId === plan.id ? "Processing..." : (plan.price === "€0" ? "Your Current Plan" : `Switch to ${plan.name}`)}
                            onClick={() => handleSubscribe(plan)}
                            disabled={!!subscribingPlanId}
                        />
                    ))}
                </div>
                {/* Feature Comparison Table */}
                <PlanComparisonTable plans={uiPlans} allFeatures={allFeatures} />
            </div>
        </div>
    );
} 