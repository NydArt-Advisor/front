'use client';

import { useAuth } from '@/hooks/useAuth';
import useSubscription from '@/hooks/useSubscription';
import Link from 'next/link';
import DashboardCard from '@/components/UI/DashboardCard';
import QuickActionCard from '@/components/UI/QuickActionCard';
import UsageWarning from '@/components/UI/UsageWarning';
import {
    FaPalette,
    FaChartLine,
    FaCreditCard,
    FaBell,
    FaStar,
    FaRocket,
    FaCrown,
    FaImages
} from 'react-icons/fa';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
    const { user, isAuthenticated } = useAuth();
    const {
        subscription,
        loading,
        error,
        getRemainingRequests,
        getTotalRequests,
        getUsedRequests,
        getUsagePercentage,
        getPlanDetails
    } = useSubscription();

    // Real data from database
    const [recentAnalyses, setRecentAnalyses] = useState([]);
    const [analysesLoading, setAnalysesLoading] = useState(false);
    const [analysesError, setAnalysesError] = useState(null);

    // Fetch recent analyses from database
    useEffect(() => {
        if (isAuthenticated && user?.id) {
            const fetchRecentAnalyses = async () => {
                try {
                    setAnalysesLoading(true);
                    const response = await fetch(`${process.env.NEXT_PUBLIC_DB_SERVICE_URL}/api/analyses/user?limit=5`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch analyses');
                    }

                    const data = await response.json();
                    setRecentAnalyses(data.analyses || []);
                } catch (err) {
                    setAnalysesError(err.message);
                } finally {
                    setAnalysesLoading(false);
                }
            };
            fetchRecentAnalyses();
        }
    }, [isAuthenticated, user?.id]);

    const getPlanIcon = (planId) => {
        switch (planId) {
            case 'free':
                return FaStar;
            case 'pro':
                return FaRocket;
            case 'super-pro':
                return FaCrown;
            default:
                return FaStar;
        }
    };

    const currentPlan = getPlanDetails(subscription?.plan);
    const remainingRequests = getRemainingRequests();
    const totalRequests = getTotalRequests();
    const usedRequests = getUsedRequests();
    const usagePercentage = getUsagePercentage();

    const PlanIcon = subscription ? getPlanIcon(subscription.plan) : FaStar;

    const getUsageColor = (percentage) => {
        if (percentage > 80) return 'text-red-500';
        if (percentage > 60) return 'text-yellow-500';
        return 'text-green-500';
    };

    const getUsageBarColor = (percentage) => {
        if (percentage > 80) return 'bg-red-500';
        if (percentage > 60) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    // Prometheus metrics state
    const [promMetrics, setPromMetrics] = useState('');
    const [metricsLoading, setMetricsLoading] = useState(false);
    const [metricsError, setMetricsError] = useState(null);

    useEffect(() => {
        setMetricsLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_METRICS_SERVICE_URL}/metrics`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch metrics');
                return res.text();
            })
            .then(setPromMetrics)
            .catch(err => setMetricsError(err.message))
            .finally(() => setMetricsLoading(false));
    }, []);

    // Show loading state
    if (loading && !subscription) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-coral mx-auto mb-4"></div>
                <p className="text-text/70">Loading dashboard...</p>
            </div>
        );
    }

    // Show error state
    if (error && !subscription) {
        return (
            <div className="text-center py-12">
                <div className="bg-red-50/80 border border-red-200/60 rounded-2xl p-8 max-w-md mx-auto">
                    <h2 className="text-xl font-semibold text-red-800 mb-4">Error Loading Dashboard</h2>
                    <p className="text-red-700 mb-4">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-4xl lg:text-5xl font-bold text-text mb-3 leading-tight bg-gradient-to-r from-text to-text/80 bg-clip-text">
                    Welcome back, {user?.username}!
                </h1>
                <p className="text-lg text-text/70 leading-relaxed max-w-2xl">
                    Here's what's happening with your art analysis account.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <DashboardCard
                    title="This Month"
                    value={`${usedRequests}/${totalRequests}`}
                    subtitle="Analyses Used"
                    icon={FaPalette}
                    progress={usagePercentage}
                    progressColor={getUsageColor(usagePercentage)}
                    progressBarColor={getUsageBarColor(usagePercentage)}
                />

                <DashboardCard
                    title="Current Plan"
                    value={currentPlan?.name || 'Free'}
                    subtitle={`${currentPlan?.price || '€0'}/month`}
                    icon={PlanIcon}
                />

                <DashboardCard
                    title="Average"
                    value="94%"
                    subtitle="Analysis Accuracy"
                    icon={FaChartLine}
                    iconColor="text-green-500"
                    iconBg="bg-green-500/10"
                />

                <DashboardCard
                    title="New"
                    value="3"
                    subtitle="Notifications"
                    icon={FaBell}
                    iconColor="text-blue-500"
                    iconBg="bg-blue-500/10"
                />
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <QuickActionCard
                    href="/analyze"
                    title="New Analysis"
                    description="Analyze a new artwork with AI"
                    icon={FaPalette}
                />

                <QuickActionCard
                    href="/dashboard/artworks/new"
                    title="Add Artwork"
                    description="Add a new artwork to your collection"
                    icon={FaImages}
                />

                <QuickActionCard
                    href="/dashboard/artworks"
                    title="My Artworks"
                    description="View and manage your artwork collection"
                    icon={FaImages}
                />

                <QuickActionCard
                    href="/dashboard/subscription"
                    title="Manage Subscription"
                    description="Upgrade or modify your plan"
                    icon={FaCreditCard}
                />

                <QuickActionCard
                    href="/dashboard/analyses"
                    title="View Analyses"
                    description="See your analysis history"
                    icon={FaChartLine}
                />

            </div>

            {/* Recent Analyses */}
            <div className="bg-background-alt rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-text/5 hover:border-text/10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-text">Recent Analyses</h2>
                    <Link
                        href="/dashboard/analyses"
                        className="text-primary-coral hover:text-primary-salmon font-medium text-sm transition-colors duration-300"
                    >
                        View All
                    </Link>
                </div>

                <div className="space-y-4">
                    {analysesLoading && <div>Loading analyses...</div>}
                    {analysesError && <div className="text-red-600">Error: {analysesError}</div>}
                    {!analysesLoading && !analysesError && recentAnalyses.map((analysis) => (
                        <div
                            key={analysis.id}
                            className="flex items-center justify-between p-4 bg-background rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-text/5 hover:border-text/10"
                        >
                            <div className="flex items-center space-x-4">
                                {analysis.imageUrl ? (
                                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
                                        <img
                                            src={analysis.imageUrl}
                                            alt={analysis.artworkTitle || 'Artwork'}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="w-full h-full bg-primary-coral/10 rounded-xl flex items-center justify-center" style={{ display: 'none' }}>
                                            <FaPalette className="text-primary-coral text-lg" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 bg-primary-coral/10 rounded-xl flex items-center justify-center shadow-sm">
                                        <FaPalette className="text-primary-coral text-lg" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-medium text-text">{analysis.artworkTitle || 'Untitled Artwork'}</h3>
                                    <p className="text-sm text-text/60">
                                        {new Date(analysis.date).toLocaleDateString()} • {analysis.type} Analysis
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="px-3 py-1 rounded-full text-xs font-medium shadow-sm bg-green-100 text-green-800">
                                    Completed
                                </span>
                            </div>
                        </div>
                    ))}
                    {!analysesLoading && !analysesError && recentAnalyses.length === 0 && (
                        <div className="text-center py-8">
                            <FaPalette className="text-primary-coral/50 text-4xl mx-auto mb-4" />
                            <p className="text-text/60">No analyses yet. Start by analyzing your first artwork!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Usage Warnings */}
            {remainingRequests <= 2 && remainingRequests > 0 && (
                <UsageWarning
                    type="warning"
                    title="Low Usage Remaining"
                    message={`You have ${remainingRequests} analysis${remainingRequests !== 1 ? 'es' : ''} remaining this month. Consider upgrading your plan for more analyses.`}
                />
            )}

            {remainingRequests === 0 && (
                <UsageWarning
                    type="error"
                    title="Usage Limit Reached"
                    message="You've reached your monthly analysis limit. Upgrade your plan to continue analyzing artworks."
                    actionText="Upgrade Now"
                />
            )}

            {/* Prometheus Raw Metrics Section */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4">Raw Prometheus Metrics</h2>
                {metricsLoading && <div>Loading metrics...</div>}
                {metricsError && <div className="text-red-600">Error: {metricsError}</div>}
                {!metricsLoading && !metricsError && (
                    <pre className="bg-gray-900 text-green-200 rounded-lg p-4 overflow-x-auto max-h-96 text-xs">
                        {promMetrics}
                    </pre>
                )}
            </div>
        </div>
    );
} 