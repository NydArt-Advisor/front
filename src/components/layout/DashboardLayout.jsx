'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    FaHome,
    FaUser,
    FaCog,
    FaCreditCard,
    FaBell,
    FaChartBar,
    FaHistory,
    FaPalette,
    FaBars,
    FaTimes,
    FaSignOutAlt
} from 'react-icons/fa';

const SidebarItem = ({ href, icon: Icon, label, isActive, onClick }) => (
    <Link
        href={href}
        onClick={onClick}
        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
            ? 'bg-primary-coral text-white shadow-md shadow-primary-coral/25'
            : 'text-text hover:bg-background hover:text-primary-coral hover:shadow-sm'
            }`}
    >
        <Icon className={`text-lg transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-text/60 group-hover:text-primary-coral'}`} />
        <span className="font-medium">{label}</span>
    </Link>
);

export default function DashboardLayout({ children }) {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [mounted, isAuthenticated, router]);

    const sidebarItems = [
        {
            href: '/dashboard',
            icon: FaHome,
            label: 'Dashboard'
        },
        {
            href: '/dashboard/profile',
            icon: FaUser,
            label: 'Profile'
        },
        {
            href: '/dashboard/subscription',
            icon: FaCreditCard,
            label: 'Subscription'
        },
        {
            href: '/dashboard/usage',
            icon: FaChartBar,
            label: 'Usage & Stats'
        },
        {
            href: '/dashboard/analyses',
            icon: FaPalette,
            label: 'My Analyses'
        },
        {
            href: '/dashboard/notifications',
            icon: FaBell,
            label: 'Notifications'
        },
        {
            href: '/dashboard/billing',
            icon: FaHistory,
            label: 'Billing History'
        },
        {
            href: '/dashboard/settings',
            icon: FaCog,
            label: 'Settings'
        }
    ];

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/auth/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (!mounted || !isAuthenticated) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-coral"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-1">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-72 bg-background-alt/95 backdrop-blur-sm border-r border-text/10 transform transition-all duration-300 ease-in-out shadow-xl lg:shadow-none
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-text/10 bg-gradient-to-br from-background-alt to-background-alt/80">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-coral to-primary-salmon text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-primary-coral/25">
                                    {user?.username?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-text text-lg">{user?.username}</h3>
                                    <p className="text-sm text-text/60">{user?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="lg:hidden text-text/60 hover:text-text p-2 rounded-lg hover:bg-background transition-all duration-300"
                            >
                                <FaTimes className="text-lg" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 p-4 space-y-2">
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== '/dashboard' && pathname.startsWith(item.href));

                            return (
                                <SidebarItem
                                    key={item.href}
                                    href={item.href}
                                    icon={item.icon}
                                    label={item.label}
                                    isActive={isActive}
                                    onClick={() => setIsSidebarOpen(false)}
                                />
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-text/10">
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300 hover:shadow-sm group"
                        >
                            <FaSignOutAlt className="text-lg group-hover:scale-110 transition-transform duration-300" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col bg-gradient-to-br from-background to-background/95">
                {/* Mobile Header */}
                <div className="lg:hidden p-4 border-b border-text/10 bg-background/80 backdrop-blur-sm shadow-sm">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="text-text hover:text-primary-coral p-2 rounded-lg hover:bg-background-alt transition-all duration-300"
                        >
                            <FaBars className="text-xl" />
                        </button>
                        <h1 className="text-lg font-semibold text-text">Dashboard</h1>
                        <div className="w-10" /> {/* Spacer for centering */}
                    </div>
                </div>

                {/* Page Content */}
                <div className="flex-1 p-6">
                    {children}
                </div>
            </main>
        </div>
    );
} 