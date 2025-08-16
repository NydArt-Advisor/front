import DashboardLayout from '@/components/layout/DashboardLayout';

export const metadata = {
    title: 'Dashboard - NydArt Advisor',
    description: 'Manage your artwork analyses and account settings',
};

export default function Layout({ children }) {
    return <DashboardLayout>{children}</DashboardLayout>;
} 