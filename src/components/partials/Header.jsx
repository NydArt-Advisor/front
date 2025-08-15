'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaBars, FaTimes, FaBell } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import ThemeButton from '@/components/ui/ThemeButton';

const UserAvatar = ({ username }) => {
    const initial = username ? username[0].toUpperCase() : 'U';

    return (
        <div className="h-9 w-9 rounded-full bg-primary-coral text-white flex items-center justify-center text-lg font-semibold">
            {initial}
        </div>
    );
};

const Header = () => {
    const router = useRouter();
    const { user, logout, isAuthenticated } = useAuth();
    const { isDarkMode } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Add refs for the dropdown containers
    const userMenuRef = useRef(null);
    const notificationMenuRef = useRef(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Add click-outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
            if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target)) {
                setIsNotificationMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/auth/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const navigationItems = [
        { label: 'Home', href: '/' },
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'AI Advisor', href: '/analyze' },
        { label: 'About', href: '/about' },
    ];

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
        if (isNotificationMenuOpen) {
            setIsNotificationMenuOpen(false);
        }
    };

    const toggleNotificationMenu = () => {
        setIsNotificationMenuOpen(!isNotificationMenuOpen);
        if (isUserMenuOpen) {
            setIsUserMenuOpen(false);
        }
    };

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <header className="bg-background shadow-md transition-colors duration-200 min-h-[64px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-coral"></div>
            </header>
        );
    }

    return (
        <header className="bg-background shadow-md transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <Image
                            src={isDarkMode ? '/Logo/Long_logo_dark.svg' : '/Logo/Long_logo_light.svg'}
                            alt="NYDART Logo"
                            width={120}
                            height={50}
                            className="h-8 w-auto"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-text hover:text-primary-coral px-3 py-2 text-sm font-medium font-primary"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* User Menu & Theme Toggle - Desktop */}
                    <div className="hidden md:flex items-center space-x-4">
                        <ThemeButton />

                        {isAuthenticated ? (
                            <>
                                {/* Notification Button */}
                                <div className="relative" ref={notificationMenuRef}>
                                    <button
                                        onClick={toggleNotificationMenu}
                                        className="flex items-center space-x-3 text-text hover:text-primary-coral focus:outline-none relative"
                                    >
                                        <FaBell className="h-5 w-5" />
                                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                                            0
                                        </span>
                                    </button>
                                    {isNotificationMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-80 bg-background rounded-lg shadow-lg py-1 border border-text/10 z-50">
                                            <div className="px-4 py-2 border-b border-text/10">
                                                <h3 className="text-sm font-medium text-text">Notifications</h3>
                                            </div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {/* Placeholder for notifications */}
                                                <div className="px-4 py-3 text-sm text-text/60 text-center">
                                                    No new notifications
                                                </div>
                                            </div>
                                            <div className="px-4 py-2 border-t border-text/10">
                                                <button className="text-sm text-primary-coral hover:text-primary-salmon w-full text-center">
                                                    Mark all as read
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* User Menu */}
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={toggleUserMenu}
                                        className="flex items-center space-x-3 text-text hover:text-primary-coral focus:outline-none"
                                    >
                                        <UserAvatar username={user?.username} />
                                    </button>
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-background rounded-lg shadow-lg py-1 border border-text/10 z-50">
                                            <div className="px-4 py-2 border-b border-text/10">
                                                <p className="text-sm font-medium text-text">{user?.username}</p>
                                                <p className="text-xs text-text/60 truncate">{user?.email}</p>
                                            </div>
                                            <Link
                                                href="/dashboard/profile"
                                                className="block px-4 py-2 text-sm text-text hover:bg-background-alt font-primary"
                                            >
                                                Profile
                                            </Link>
                                            <Link
                                                href="/dashboard/subscription"
                                                className="block px-4 py-2 text-sm text-text hover:bg-background-alt font-primary"
                                            >
                                                Subscription
                                            </Link>
                                            <Link
                                                href="/dashboard/settings"
                                                className="block px-4 py-2 text-sm text-text hover:bg-background-alt font-primary"
                                            >
                                                Settings
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-primary"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    href="/auth/login"
                                    className="text-text hover:text-primary-coral px-3 py-2 text-sm font-medium font-primary"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="bg-primary-coral hover:bg-primary-salmon text-white px-4 py-2 rounded-lg text-sm font-medium font-primary transition-colors"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-2">
                        <ThemeButton />
                        {isAuthenticated && (
                            <button
                                onClick={toggleNotificationMenu}
                                className="text-text hover:text-primary-coral relative"
                            >
                                <FaBell className="h-6 w-6" />
                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                                    0
                                </span>
                            </button>
                        )}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-text hover:text-primary-coral"
                        >
                            {isMenuOpen ? (
                                <FaTimes className="h-6 w-6" />
                            ) : (
                                <FaBars className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-2">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block px-3 py-2 text-base font-medium text-text hover:text-primary-coral hover:bg-background-alt font-primary"
                            >
                                {item.label}
                            </Link>
                        ))}
                        {isAuthenticated && (
                            <>
                                <div className="px-3 py-2 border-t border-text/10">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-3">
                                            <UserAvatar username={user?.username} />
                                            <div>
                                                <p className="text-sm font-medium text-text">{user?.username}</p>
                                                <p className="text-xs text-text/60 truncate">{user?.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={toggleNotificationMenu}
                                            className="text-text hover:text-primary-coral relative"
                                        >
                                            <FaBell className="h-6 w-6" />
                                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                                                0
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                <Link
                                    href="/dashboard/profile"
                                    className="block px-3 py-2 text-base font-medium text-text hover:text-primary-coral hover:bg-background-alt font-primary"
                                >
                                    Profile
                                </Link>
                                <Link
                                    href="/dashboard/subscription"
                                    className="block px-3 py-2 text-base font-medium text-text hover:text-primary-coral hover:bg-background-alt font-primary"
                                >
                                    Subscription
                                </Link>
                                <Link
                                    href="/dashboard/settings"
                                    className="block px-3 py-2 text-base font-medium text-text hover:text-primary-coral hover:bg-background-alt font-primary"
                                >
                                    Settings
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-primary"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                        {isAuthenticated ? (
                            <div className="px-3 py-2 space-y-2 border-t border-text/10">
                                <Link
                                    href="/auth/login"
                                    className="block text-text hover:text-primary-coral py-2 text-base font-medium font-primary"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="block bg-primary-coral hover:bg-primary-salmon text-white px-4 py-2 rounded-lg text-base font-medium font-primary transition-colors text-center"
                                >
                                    Sign up
                                </Link>
                            </div>
                        ) : (
                            <div className="px-3 py-2 space-y-2 border-t border-text/10">
                                <Link
                                    href="/auth/login"
                                    className="block text-text hover:text-primary-coral py-2 text-base font-medium font-primary"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="block bg-primary-coral hover:bg-primary-salmon text-white px-4 py-2 rounded-lg text-base font-medium font-primary transition-colors text-center"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header; 