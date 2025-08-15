'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { FaEye, FaDownload, FaTrash, FaPalette, FaCalendar, FaExclamationTriangle } from 'react-icons/fa';
import DashboardCard from '@/components/UI/DashboardCard';
import Modal from '@/components/UI/Modal';

export default function AnalysesList() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, analysis: null });

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login');
            return;
        }

        fetchAnalyses();
    }, [isAuthenticated, router]);

    const fetchAnalyses = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_DB_SERVICE_URL}/api/analyses/user`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch analyses');
            }

            const data = await response.json();
            setAnalyses(data.analyses || []);
        } catch (err) {
            console.error('AnalysesList: Error fetching analyses:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleViewAnalysis = (analysis) => {
        router.push(`/dashboard/analyses/${analysis.id}`);
    };

    const handleDownloadAnalysis = (analysis) => {
        const content = `
Analysis Report
==============

Artwork: ${analysis.artworkTitle}
Type: ${analysis.type}
Date: ${new Date(analysis.date).toLocaleDateString()}

Technical Quality:
${analysis.results?.technicalQuality || 'N/A'}

Strengths:
${analysis.results?.strengths || 'N/A'}

Areas for Improvement:
${analysis.results?.areasForImprovement || 'N/A'}

Suggestions:
${analysis.results?.suggestions?.join('\n') || 'N/A'}

Composition:
${analysis.results?.composition || 'N/A'}

Color Theory:
${analysis.results?.colorTheory || 'N/A'}

Style Context:
${analysis.results?.styleContext || 'N/A'}

Learning Resources:
${analysis.learningResources?.map(resource => `- ${resource.title}: ${resource.description}`).join('\n') || 'N/A'}
        `;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${analysis.artworkTitle}-analysis.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDeleteAnalysis = (analysis) => {
        setDeleteModal({ isOpen: true, analysis });
    };

    const confirmDelete = async () => {
        if (!deleteModal.analysis) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_DB_SERVICE_URL}/api/analyses/${deleteModal.analysis.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                setAnalyses(analyses.filter(a => a.id !== deleteModal.analysis.id));
                setDeleteModal({ isOpen: false, analysis: null });
            } else {
                throw new Error('Failed to delete analysis');
            }
        } catch (err) {
            setError(err.message);
            console.error('Error deleting analysis:', err);
            setDeleteModal({ isOpen: false, analysis: null });
        }
    };

    const cancelDelete = () => {
        setDeleteModal({ isOpen: false, analysis: null });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-coral"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {/* Analyses Grid */}
            {analyses.length === 0 ? (
                <div className="text-center py-16">
                    <div className="bg-background-alt rounded-2xl p-12 shadow-sm border border-text/10 max-w-md mx-auto">
                        <div className="w-20 h-20 bg-primary-coral/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaPalette className="text-3xl text-primary-coral" />
                        </div>
                        <h3 className="text-xl font-semibold text-text mb-3">No analyses yet</h3>
                        <p className="text-text/60 mb-8 leading-relaxed">
                            You haven't analyzed any artworks yet. Start by uploading an image to get AI-powered feedback on your artwork.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => router.push('/analyze')}
                                className="w-full px-6 py-3 bg-primary-coral text-white rounded-lg hover:bg-primary-coral/90 transition-colors font-medium"
                            >
                                Analyze Your First Artwork
                            </button>
                            <p className="text-xs text-text/50">
                                Get detailed feedback on composition, color theory, and technique
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {analyses.map((analysis) => {
                        return (
                            <div key={analysis.id} className="bg-background-alt rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-text/5 hover:border-text/10">
                                {/* Artwork Image */}
                                <div className="relative mb-4">
                                    <img
                                        src={analysis.imageUrl}
                                        alt={analysis.artworkTitle}
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <span className="px-2 py-1 bg-primary-coral text-white text-xs rounded-full">
                                            {analysis.type}
                                        </span>
                                    </div>
                                </div>

                                {/* Analysis Info */}
                                <div className="space-y-3">
                                    <div>
                                        <h3 className="font-semibold text-text mb-1">
                                            {analysis.artworkTitle}
                                        </h3>
                                        <p className="text-sm text-text/60 flex items-center">
                                            <FaCalendar className="mr-1" />
                                            {new Date(analysis.date).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {/* Quick Preview */}
                                    <div className="text-sm text-text/70 line-clamp-3">
                                        {analysis.results?.technicalQuality?.substring(0, 150)}...
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-2">
                                        <button
                                            onClick={() => handleViewAnalysis(analysis)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-coral text-white text-sm rounded-lg hover:bg-primary-coral/90 transition-colors"
                                        >
                                            <FaEye />
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDownloadAnalysis(analysis)}
                                            className="px-3 py-2 bg-background-alt text-text text-sm rounded-lg hover:bg-background-hover transition-colors"
                                        >
                                            <FaDownload />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAnalysis(analysis)}
                                            className="px-3 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )
            }

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={cancelDelete}
                title="Delete Analysis"
                size="sm"
            >
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaExclamationTriangle className="text-red-600 text-2xl" />
                    </div>

                    <h3 className="text-lg font-semibold text-text mb-2">
                        Delete Analysis?
                    </h3>

                    <p className="text-text/70 mb-6">
                        Are you sure you want to delete the analysis for "{deleteModal.analysis?.artworkTitle}"?
                        This action cannot be undone.
                    </p>

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={cancelDelete}
                            className="px-6 py-2 bg-background-alt text-text rounded-lg hover:bg-background-hover transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
} 