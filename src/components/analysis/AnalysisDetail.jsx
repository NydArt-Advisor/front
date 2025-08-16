'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import { FaArrowLeft, FaDownload, FaShare, FaPalette, FaCalendar, FaEye, FaBook, FaYoutube } from 'react-icons/fa';

export default function AnalysisDetail() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const params = useParams();
    const [analysis, setAnalysis] = useState(null);
    const [artwork, setArtwork] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login');
            return;
        }

        fetchAnalysis();
    }, [isAuthenticated, router, params.id]);

    const fetchAnalysis = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_DB_SERVICE_URL}/api/analyses/${params.id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Analysis not found');
            }

            const data = await response.json();
            setAnalysis(data.analysis);
            setArtwork(data.artwork);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching analysis:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        const content = `
Analysis Report
==============

Artwork: ${artwork?.title}
Type: ${analysis?.type}
Date: ${new Date(analysis?.date).toLocaleDateString()}

Technical Quality:
${analysis?.results?.technicalQuality || 'N/A'}

Strengths:
${analysis?.results?.strengths || 'N/A'}

Areas for Improvement:
${analysis?.results?.areasForImprovement || 'N/A'}

Suggestions:
${analysis?.results?.suggestions?.join('\n') || 'N/A'}

Composition:
${analysis?.results?.composition || 'N/A'}

Color Theory:
${analysis?.results?.colorTheory || 'N/A'}

Style Context:
${analysis?.results?.styleContext || 'N/A'}

Learning Resources:
${analysis?.learningResources?.map(resource => `- ${resource.title}: ${resource.description}`).join('\n') || 'N/A'}
        `;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${artwork?.title}-analysis.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `Analysis of ${artwork?.title}`,
                text: `Check out this AI analysis of my artwork: ${artwork?.title}`,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-coral"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <FaPalette className="mx-auto text-4xl text-text/40 mb-4" />
                <h3 className="text-lg font-medium text-text mb-2">Analysis Not Found</h3>
                <p className="text-text/60 mb-6">{error}</p>
                <button
                    onClick={() => router.push('/dashboard/analyses')}
                    className="px-6 py-3 bg-primary-coral text-white rounded-lg hover:bg-primary-coral/90 transition-colors"
                >
                    Back to Analyses
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex gap-2">
                <button
                    onClick={() => router.push('/dashboard/analyses')}
                    className="px-4 py-2 bg-background-alt text-text rounded-lg hover:bg-background-hover transition-colors flex items-center gap-2"
                >
                    <FaArrowLeft />
                    Back
                </button>
                <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-background-alt text-text rounded-lg hover:bg-background-hover transition-colors flex items-center gap-2"
                >
                    <FaDownload />
                    Download
                </button>
                <button
                    onClick={handleShare}
                    className="px-4 py-2 bg-primary-coral text-white rounded-lg hover:bg-primary-coral/90 transition-colors flex items-center gap-2"
                >
                    <FaShare />
                    Share
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Artwork Image */}
                <div className="bg-background-alt rounded-2xl p-6 shadow-sm border border-text/10">
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-text">Artwork</h2>
                        <div className="relative">
                            <img
                                src={artwork?.imageUrl}
                                alt={artwork?.title}
                                className="w-full h-96 object-cover rounded-lg"
                            />
                            <div className="absolute top-4 right-4">
                                <span className="px-3 py-1 bg-primary-coral text-white text-sm rounded-full">
                                    {analysis?.type}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-medium text-text">{artwork?.title}</h3>
                            <p className="text-text/60">{artwork?.description}</p>
                            <div className="flex items-center gap-4 text-sm text-text/60">
                                <span className="flex items-center gap-1">
                                    <FaCalendar />
                                    {new Date(analysis?.date).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <FaEye />
                                    {analysis?.type} Analysis
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analysis Details */}
                <div className="space-y-6">
                    {/* Technical Quality */}
                    {analysis?.results?.technicalQuality && (
                        <div className="bg-background-alt rounded-2xl p-6 shadow-sm border border-text/10">
                            <h3 className="text-lg font-semibold text-text mb-3">Technical Quality</h3>
                            <p className="text-text/80 leading-relaxed">
                                {analysis.results.technicalQuality}
                            </p>
                        </div>
                    )}

                    {/* Strengths */}
                    {analysis?.results?.strengths && (
                        <div className="bg-background-alt rounded-2xl p-6 shadow-sm border border-text/10">
                            <h3 className="text-lg font-semibold text-text mb-3">Strengths</h3>
                            <p className="text-text/80 leading-relaxed">
                                {analysis.results.strengths}
                            </p>
                        </div>
                    )}

                    {/* Areas for Improvement */}
                    {analysis?.results?.areasForImprovement && (
                        <div className="bg-background-alt rounded-2xl p-6 shadow-sm border border-text/10">
                            <h3 className="text-lg font-semibold text-text mb-3">Areas for Improvement</h3>
                            <p className="text-text/80 leading-relaxed">
                                {analysis.results.areasForImprovement}
                            </p>
                        </div>
                    )}

                    {/* Suggestions */}
                    {analysis?.results?.suggestions && analysis.results.suggestions.length > 0 && (
                        <div className="bg-background-alt rounded-2xl p-6 shadow-sm border border-text/10">
                            <h3 className="text-lg font-semibold text-text mb-3">Suggestions</h3>
                            <ul className="space-y-2">
                                {analysis.results.suggestions.map((suggestion, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-primary-coral rounded-full mt-2 flex-shrink-0"></span>
                                        <span className="text-text/80">{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Composition */}
                    {analysis?.results?.composition && (
                        <div className="bg-background-alt rounded-2xl p-6 shadow-sm border border-text/10">
                            <h3 className="text-lg font-semibold text-text mb-3">Composition</h3>
                            <p className="text-text/80 leading-relaxed">
                                {analysis.results.composition}
                            </p>
                        </div>
                    )}

                    {/* Color Theory */}
                    {analysis?.results?.colorTheory && (
                        <div className="bg-background-alt rounded-2xl p-6 shadow-sm border border-text/10">
                            <h3 className="text-lg font-semibold text-text mb-3">Color Theory</h3>
                            <p className="text-text/80 leading-relaxed">
                                {analysis.results.colorTheory}
                            </p>
                        </div>
                    )}

                    {/* Style Context */}
                    {analysis?.results?.styleContext && (
                        <div className="bg-background-alt rounded-2xl p-6 shadow-sm border border-text/10">
                            <h3 className="text-lg font-semibold text-text mb-3">Style & Context</h3>
                            <p className="text-text/80 leading-relaxed">
                                {analysis.results.styleContext}
                            </p>
                        </div>
                    )}

                    {/* Learning Resources */}
                    {analysis?.learningResources && analysis.learningResources.length > 0 && (
                        <div className="bg-background-alt rounded-2xl p-6 shadow-sm border border-text/10">
                            <h3 className="text-lg font-semibold text-text mb-3">Learning Resources</h3>
                            <div className="space-y-3">
                                {analysis.learningResources.map((resource, index) => (
                                    <div key={index} className="p-3 bg-background rounded-lg">
                                        <div className="flex items-start gap-3">
                                            {resource.type === 'youtube' ? (
                                                <FaYoutube className="text-red-500 text-lg flex-shrink-0 mt-1" />
                                            ) : (
                                                <FaBook className="text-primary-coral text-lg flex-shrink-0 mt-1" />
                                            )}
                                            <div className="flex-1">
                                                <h4 className="font-medium text-text">{resource.title}</h4>
                                                <p className="text-sm text-text/60 mb-2">{resource.description}</p>
                                                {resource.url && (
                                                    <a
                                                        href={resource.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary-coral text-sm hover:underline"
                                                    >
                                                        View Resource
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 