import DashboardHeader from '@/components/UI/DashboardHeader';
import AnalysisDetail from '@/components/analysis/AnalysisDetail';

export const metadata = {
    title: 'Analysis Detail - NydArt Advisor',
    description: 'View detailed analysis of your artwork',
};

export default function AnalysisDetailPage() {
    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader
                title="Analysis Detail"
                subtitle="View detailed analysis of your artwork"
            />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <AnalysisDetail />
            </div>
        </div>
    );
} 