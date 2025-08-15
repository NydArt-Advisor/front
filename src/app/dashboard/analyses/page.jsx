import DashboardHeader from '@/components/UI/DashboardHeader';
import AnalysesList from '@/components/analysis/AnalysesList';

export const metadata = {
    title: 'My Analyses - NydArt Advisor',
    description: 'View and manage your artwork analyses',
};

export default function AnalysesPage() {
    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader
                title="My Analyses"
                subtitle="View and manage your artwork analyses"
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <AnalysesList />
            </div>
        </div>
    );
} 