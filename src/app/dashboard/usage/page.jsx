'use client';

import useSubscription from '@/hooks/useSubscription';
import DashboardHeader from '@/components/UI/DashboardHeader';
import DashboardCard from '@/components/UI/DashboardCard';
import DashboardSection from '@/components/UI/DashboardSection';
import { FaChartBar, FaCalendar, FaPalette, FaTrendingUp, FaTrendingDown } from 'react-icons/fa';

export default function UsagePage() {
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

    // Mock data for demonstration (will be replaced with real API calls)
    const monthlyUsage = [
        { month: 'Jan', analyses: 12, accuracy: 94 },
        { month: 'Feb', analyses: 18, accuracy: 96 },
        { month: 'Mar', analyses: 15, accuracy: 92 },
        { month: 'Apr', analyses: 22, accuracy: 95 },
        { month: 'May', analyses: 19, accuracy: 93 },
        { month: 'Jun', analyses: 25, accuracy: 97 }
    ];

    const topArtworks = [
        { name: 'Mona Lisa', artist: 'Leonardo da Vinci', accuracy: 98, date: '2024-01-15' },
        { name: 'Starry Night', artist: 'Vincent van Gogh', accuracy: 96, date: '2024-01-14' },
        { name: 'The Scream', artist: 'Edvard Munch', accuracy: 94, date: '2024-01-13' },
        { name: 'Girl with a Pearl Earring', artist: 'Johannes Vermeer', accuracy: 93, date: '2024-01-12' },
        { name: 'The Persistence of Memory', artist: 'Salvador Dalí', accuracy: 91, date: '2024-01-11' }
    ];

    const currentPlan = getPlanDetails(subscription?.plan);
    const remainingRequests = getRemainingRequests();
    const totalRequests = getTotalRequests();
    const usedRequests = getUsedRequests();
    const usagePercentage = getUsagePercentage();

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

    // Show loading state
    if (loading && !subscription) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-coral mx-auto mb-4"></div>
                <p className="text-text/70">Loading usage data...</p>
            </div>
        );
    }

    // Show error state
    if (error && !subscription) {
        return (
            <div className="text-center py-12">
                <div className="bg-red-50/80 border border-red-200/60 rounded-2xl p-8 max-w-md mx-auto">
                    <h2 className="text-xl font-semibold text-red-800 mb-4">Error Loading Usage Data</h2>
                    <p className="text-red-700 mb-4">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <DashboardHeader
                title="Usage & Statistics"
                subtitle="Track your AI art analysis usage and performance metrics"
            />

            {/* Current Usage Overview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <DashboardCard
                    title="This Month"
                    value={usedRequests}
                    subtitle="Analyses Used"
                    icon={FaPalette}
                    progress={usagePercentage}
                    progressColor={getUsageColor(usagePercentage)}
                    progressBarColor={getUsageBarColor(usagePercentage)}
                />

                <DashboardCard
                    title="Remaining"
                    value={remainingRequests}
                    subtitle="Analyses Left"
                    icon={FaTrendingUp}
                    iconColor="text-green-500"
                    iconBg="bg-green-500/10"
                />

                <DashboardCard
                    title="Average"
                    value="94.2%"
                    subtitle="Accuracy Rate"
                    icon={FaChartBar}
                    iconColor="text-blue-500"
                    iconBg="bg-blue-500/10"
                />

                <DashboardCard
                    title="Total"
                    value="111"
                    subtitle="Analyses Completed"
                    icon={FaCalendar}
                    iconColor="text-purple-500"
                    iconBg="bg-purple-500/10"
                />
            </div>

            {/* Monthly Usage Chart */}
            <DashboardSection title="Monthly Usage Trend" className="mb-8">
                <div className="space-y-4">
                    {monthlyUsage.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4">
                            <div className="w-16 text-sm font-medium text-text">{item.month}</div>
                            <div className="flex-1">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-text/60 font-medium">{item.analyses} analyses</span>
                                    <span className="text-text/60 font-medium">{item.accuracy}% accuracy</span>
                                </div>
                                <div className="w-full bg-gray-200/50 rounded-full h-2.5 shadow-inner">
                                    <div
                                        className="h-2.5 bg-primary-coral rounded-full transition-all duration-500 ease-out shadow-sm"
                                        style={{ width: `${(item.analyses / 30) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </DashboardSection>

            {/* Top Performing Analyses */}
            <DashboardSection title="Top Performing Analyses" className="mb-8">
                <div className="space-y-4">
                    {topArtworks.map((artwork, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-background rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-text/5 hover:border-text/10">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-primary-coral/10 rounded-xl flex items-center justify-center shadow-sm">
                                    <span className="text-primary-coral font-bold text-lg">{index + 1}</span>
                                </div>
                                <div>
                                    <h3 className="font-medium text-text">{artwork.name}</h3>
                                    <p className="text-sm text-text/60">by {artwork.artist}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <div className="text-sm font-bold text-text">{artwork.accuracy}%</div>
                                    <div className="text-xs text-text/60 font-medium">Accuracy</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-text/60 font-medium">{artwork.date}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </DashboardSection>

            {/* Usage Insights */}
            <div className="grid md:grid-cols-2 gap-6">
                <DashboardSection title="Usage Insights">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-background rounded-xl shadow-sm">
                            <span className="text-text/60 font-medium">Most Active Day</span>
                            <span className="font-semibold text-text">Wednesday</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-background rounded-xl shadow-sm">
                            <span className="text-text/60 font-medium">Peak Usage Time</span>
                            <span className="font-semibold text-text">2:00 PM - 4:00 PM</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-background rounded-xl shadow-sm">
                            <span className="text-text/60 font-medium">Favorite Art Style</span>
                            <span className="font-semibold text-text">Renaissance</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-background rounded-xl shadow-sm">
                            <span className="text-text/60 font-medium">Average Session</span>
                            <span className="font-semibold text-text">3.2 analyses</span>
                        </div>
                    </div>
                </DashboardSection>

                <DashboardSection title="Performance Metrics">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-background rounded-xl shadow-sm">
                            <span className="text-text/60 font-medium">Processing Speed</span>
                            <span className="font-semibold text-green-500">2.3s avg</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-background rounded-xl shadow-sm">
                            <span className="text-text/60 font-medium">Success Rate</span>
                            <span className="font-semibold text-green-500">99.8%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-background rounded-xl shadow-sm">
                            <span className="text-text/60 font-medium">Error Rate</span>
                            <span className="font-semibold text-red-500">0.2%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-background rounded-xl shadow-sm">
                            <span className="text-text/60 font-medium">User Satisfaction</span>
                            <span className="font-semibold text-green-500">4.8/5</span>
                        </div>
                    </div>
                </DashboardSection>
            </div>

            {/* Usage Recommendations */}
            {remainingRequests <= 5 && (
                <div className="mt-8 bg-yellow-50/80 border border-yellow-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center shadow-sm">
                            <FaTrendingDown className="text-yellow-500 text-lg" />
                        </div>
                        <h3 className="font-semibold text-yellow-800 text-lg">Usage Recommendation</h3>
                    </div>
                    <p className="text-yellow-700 text-sm mb-4 leading-relaxed">
                        You're approaching your monthly limit. Consider upgrading your plan to continue enjoying unlimited art analysis features.
                    </p>
                    <button className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-md hover:scale-105">
                        Upgrade Plan
                    </button>
                </div>
            )}
        </div>
    );
} 