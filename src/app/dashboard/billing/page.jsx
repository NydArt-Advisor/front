'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import useSubscription from '@/hooks/useSubscription';
import { useRouter } from 'next/navigation';
import { FaDownload, FaEye, FaCreditCard, FaCalendar, FaEuroSign } from 'react-icons/fa';
import Link from 'next/link';

export default function BillingHistoryPage() {
    const { user, isAuthenticated } = useAuth();
    const { getBillingHistory } = useSubscription();
    const router = useRouter();
    const [billingHistory, setBillingHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login');
            return;
        }

        const fetchBillingHistory = async () => {
            try {
                setLoading(true);
                const history = await getBillingHistory();
                setBillingHistory(history);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching billing history:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBillingHistory();
    }, [isAuthenticated, router, getBillingHistory]);

    if (!isAuthenticated) {
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-coral"></div>
            </div>
        );
    }

    // Mock billing history data for demonstration
    const mockBillingHistory = [
        {
            id: 'inv_001',
            date: '2024-01-15',
            amount: 20.00,
            status: 'paid',
            plan: 'Pro',
            description: 'Pro Plan - January 2024',
            invoiceUrl: '#'
        },
        {
            id: 'inv_002',
            date: '2023-12-15',
            amount: 20.00,
            status: 'paid',
            plan: 'Pro',
            description: 'Pro Plan - December 2023',
            invoiceUrl: '#'
        },
        {
            id: 'inv_003',
            date: '2023-11-15',
            amount: 20.00,
            status: 'paid',
            plan: 'Pro',
            description: 'Pro Plan - November 2023',
            invoiceUrl: '#'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-text mb-2">Billing History</h1>
                    <p className="text-text/70">View your past invoices and payment history</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Billing Summary */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-background-alt rounded-xl p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <FaEuroSign className="text-2xl text-primary-coral" />
                            <h3 className="text-lg font-semibold text-text">Total Spent</h3>
                        </div>
                        <p className="text-3xl font-bold text-text">€60.00</p>
                        <p className="text-text/60 text-sm">Last 3 months</p>
                    </div>
                    <div className="bg-background-alt rounded-xl p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <FaCreditCard className="text-2xl text-primary-coral" />
                            <h3 className="text-lg font-semibold text-text">Active Plan</h3>
                        </div>
                        <p className="text-xl font-semibold text-text">Pro</p>
                        <p className="text-text/60 text-sm">€20.00/month</p>
                    </div>
                    <div className="bg-background-alt rounded-xl p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <FaCalendar className="text-2xl text-primary-coral" />
                            <h3 className="text-lg font-semibold text-text">Next Billing</h3>
                        </div>
                        <p className="text-xl font-semibold text-text">February 15, 2024</p>
                        <p className="text-text/60 text-sm">€20.00</p>
                    </div>
                </div>

                {/* Billing History Table */}
                <div className="bg-background-alt rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-text/10">
                        <h2 className="text-xl font-semibold text-text">Invoice History</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-background">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text/60 uppercase tracking-wider">
                                        Invoice
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text/60 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text/60 uppercase tracking-wider">
                                        Plan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text/60 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text/60 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text/60 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-text/10">
                                {mockBillingHistory.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-background/50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-text">{invoice.id}</div>
                                                <div className="text-sm text-text/60">{invoice.description}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                                            {formatDate(invoice.date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-coral/10 text-primary-coral">
                                                {invoice.plan}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text">
                                            €{invoice.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => window.open(invoice.invoiceUrl, '_blank')}
                                                    className="text-primary-coral hover:text-primary-salmon"
                                                    title="View Invoice"
                                                >
                                                    <FaEye className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => window.open(invoice.invoiceUrl, '_blank')}
                                                    className="text-primary-coral hover:text-primary-salmon"
                                                    title="Download Invoice"
                                                >
                                                    <FaDownload className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Empty State */}
                {mockBillingHistory.length === 0 && (
                    <div className="text-center py-12">
                        <FaCreditCard className="mx-auto h-12 w-12 text-text/40" />
                        <h3 className="mt-2 text-sm font-medium text-text">No billing history</h3>
                        <p className="mt-1 text-sm text-text/60">
                            You haven't made any payments yet.
                        </p>
                    </div>
                )}

                {/* Back to Subscription */}
                <div className="mt-8 text-center">
                    <Link
                        href="/dashboard/subscription"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-primary-coral bg-primary-coral/10 hover:bg-primary-coral/20 transition-colors"
                    >
                        Back to Subscription Management
                    </Link>
                </div>
            </div>
        </div>
    );
} 