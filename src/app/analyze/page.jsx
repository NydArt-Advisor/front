'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import components with ssr: false to prevent hydration mismatch
const ImageUpload = dynamic(() => import('@/components/ui/ImageUpload'), { ssr: false });
const AnalysisResults = dynamic(() => import('@/components/ui/AnalysisResults'), { ssr: false });
const AnalysisSkeleton = dynamic(() => import('@/components/ui/AnalysisSkeleton'), { ssr: false });

const API_URL = 'http://localhost:5000';

// Image compression function
const compressImage = async (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Calculate new dimensions (max 1200px width/height while maintaining aspect ratio)
                let width = img.width;
                let height = img.height;
                const maxDimension = 1200;

                if (width > maxDimension || height > maxDimension) {
                    if (width > height) {
                        height = (height / width) * maxDimension;
                        width = maxDimension;
                    } else {
                        width = (width / height) * maxDimension;
                        height = maxDimension;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    resolve(new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    }));
                }, 'image/jpeg', 0.8); // 80% quality
            };
        };
    });
};

export default function AnalyzePage() {
    const [mounted, setMounted] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [analysisType, setAnalysisType] = useState('general');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [recentAnalyses, setRecentAnalyses] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('recentAnalyses');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    // Handle mounting to prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Memoize the API URL check to prevent unnecessary re-renders
    const checkServerHealth = useMemo(() => {
        let lastCheck = 0;
        let lastResult = null;
        const cacheTime = 30000; // 30 seconds

        return async () => {
            const now = Date.now();
            if (lastResult && now - lastCheck < cacheTime) {
                return lastResult;
            }

            try {
                const response = await fetch(`${API_URL}/health`);
                lastCheck = now;
                lastResult = response.ok;
                return response.ok;
            } catch (err) {
                lastCheck = now;
                lastResult = false;
                return false;
            }
        };
    }, []);

    const handleImageSelect = useCallback(async (file) => {
        try {
            const compressedFile = await compressImage(file);
            setSelectedFile(compressedFile);
            setError(null);
        } catch (err) {
            setError('Failed to process image. Please try again.');
        }
    }, []);

    const handleAnalysisTypeChange = useCallback((type) => {
        setAnalysisType(type);
    }, []);

    const handleAnalyze = useCallback(async () => {
        if (!selectedFile) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            // Check server health (using cached result if available)
            const isServerHealthy = await checkServerHealth();
            if (!isServerHealthy) {
                throw new Error('Cannot connect to backend server. Please ensure it is running on port 5000');
            }

            const formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('analysis_type', analysisType);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            const response = await fetch(`${API_URL}/api/ai/analyze`, {
                method: 'POST',
                body: formData,
                signal: controller.signal,
                mode: 'cors',
                credentials: 'same-origin',
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const data = await response.json();

            // Default suggestions if none provided or less than 3
            const defaultSuggestions = [
                "Consider experimenting with different techniques to add more depth to your work",
                "Try exploring varied color palettes to enhance the overall mood",
                "Focus on developing more contrast in key areas",
                "Practice different styles to expand your artistic range"
            ];

            // Ensure we have 3-4 suggestions
            let suggestions = data.suggestions || [];
            if (suggestions.length < 3) {
                suggestions = [...suggestions, ...defaultSuggestions.slice(0, 4 - suggestions.length)];
            }

            // Structure the technical assessment content
            const technicalAssessment = {
                quality: data.technical_quality || data.analysis || "The artwork shows good technical execution with attention to detail.",
                strengths: data.strengths || "The piece demonstrates strong fundamentals in composition and technique.",
                improvements: data.areas_for_improvement || "Consider focusing on enhancing depth and contrast in future works."
            };

            const newResults = {
                style: data.style || "AI Analysis Results",
                technicalAssessment: Object.values(technicalAssessment).join('\n\n'),
                composition: data.composition || "The composition shows thoughtful arrangement of elements.",
                colorTheory: data.color_theory || "The color palette effectively conveys the intended mood.",
                styleAndContext: data.style_context || "The artwork demonstrates a clear artistic vision.",
                improvements: suggestions.slice(0, 4), // Ensure max 4 suggestions
                learning_resources: data.learning_resources || [
                    {
                        title: "Fundamental Art Techniques",
                        description: "Learn essential techniques to improve your artistic skills",
                        type: "Tutorial",
                        difficulty: "Intermediate"
                    }
                ]
            };

            console.log('Structured Analysis Results:', {
                technicalAssessment: technicalAssessment,
                suggestions: suggestions
            });

            setResults(newResults);

            // Update recent analyses and save to localStorage
            const updatedAnalyses = [{
                id: Date.now(),
                timestamp: new Date().toLocaleString(),
                image: URL.createObjectURL(selectedFile),
                type: analysisType,
                results: newResults
            }, ...recentAnalyses.slice(0, 4)];

            setRecentAnalyses(updatedAnalyses);
            localStorage.setItem('recentAnalyses', JSON.stringify(updatedAnalyses));

        } catch (err) {
            console.error('Analysis error:', err);
            setError(err.message || 'Failed to analyze image. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    }, [selectedFile, analysisType, recentAnalyses, checkServerHealth]);

    const handleReanalyze = useCallback(() => {
        handleAnalyze();
    }, [handleAnalyze]);

    const handleViewPreviousAnalysis = useCallback((analysis) => {
        setResults(analysis.results);
    }, []);

    if (!mounted) {
        return null; // or a loading spinner
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        <h1 className="text-2xl font-semibold text-text">
                            AI Artwork Analysis
                        </h1>

                        {/* Free Trial Notice */}
                        <div className="bg-primary-coral/10 border border-primary-coral/20 rounded-lg p-4">
                            <h2 className="text-lg font-medium text-text mb-1">
                                Free Trial
                            </h2>
                            <p className="text-sm text-text/70">
                                You can analyze artworks without an account, but registered users get 5 free analyses per month plus subscription options for unlimited access.
                            </p>
                        </div>

                        {/* Analysis Type Selection */}
                        <AnimatePresence mode="wait">
                            <div>
                                <h2 className="text-base font-medium text-text mb-4">
                                    What kind of feedback would you like?
                                </h2>
                                <ImageUpload
                                    onImageSelect={handleImageSelect}
                                    analysisType={analysisType}
                                    onAnalysisTypeChange={handleAnalysisTypeChange}
                                    isAnalyzed={!!results}
                                />
                            </div>
                        </AnimatePresence>

                        {selectedFile && !isAnalyzing && !results && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <button
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing}
                                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2
                                        ${isAnalyzing
                                            ? 'bg-primary-coral/75 cursor-not-allowed'
                                            : 'bg-primary-coral hover:bg-primary-salmon hover:shadow-lg transform hover:-translate-y-0.5'} 
                                        text-white relative overflow-hidden`}
                                >
                                    <span className={`flex items-center transition-all duration-200 ${isAnalyzing ? 'opacity-0' : 'opacity-100'}`}>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        Analyze Artwork
                                    </span>
                                    {isAnalyzing && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-primary-600">
                                            <div className="flex items-center space-x-2">
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Analyzing...</span>
                                            </div>
                                        </div>
                                    )}
                                </button>
                            </motion.div>
                        )}

                        {isAnalyzing && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-primary-coral/10 border border-primary-coral/20 rounded-lg p-4"
                                >
                                    <div className="flex items-center justify-center space-x-3">
                                        <div className="flex items-center space-x-2">
                                            <div className="animate-pulse h-2 w-2 rounded-full bg-primary-coral"></div>
                                            <div className="animate-pulse h-2 w-2 rounded-full bg-primary-coral" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="animate-pulse h-2 w-2 rounded-full bg-primary-coral" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                        <span className="text-sm font-medium text-text">
                                            AI is analyzing your artwork...
                                        </span>
                                    </div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <AnalysisSkeleton />
                                </motion.div>
                            </>
                        )}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"
                            >
                                <div className="flex items-center">
                                    <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium text-red-400">
                                            {error}
                                        </p>
                                        {error.includes('Cannot connect to backend server') && (
                                            <p className="text-xs text-red-300 mt-1">
                                                Please make sure the backend server is running with: npm run dev
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <AnimatePresence mode="wait">
                            {results && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <AnalysisResults results={results} onReanalyze={handleReanalyze} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Recent Analyses Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-background rounded-lg shadow-md border border-text/10 p-6">
                            <h2 className="text-lg font-medium text-text mb-4">
                                Recent Analyses
                            </h2>
                            {recentAnalyses.length > 0 ? (
                                <div className="space-y-4">
                                    {recentAnalyses.map((analysis) => (
                                        <motion.div
                                            key={analysis.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="bg-background-alt rounded-lg p-4 cursor-pointer hover:bg-background-hover transition-colors border border-text/5"
                                            onClick={() => handleViewPreviousAnalysis(analysis)}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="h-16 w-16 relative rounded-lg overflow-hidden">
                                                    <img
                                                        src={analysis.image}
                                                        alt="Analyzed artwork"
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-text">
                                                        {analysis.type} Analysis
                                                    </p>
                                                    <p className="text-xs text-text/60">
                                                        {analysis.timestamp}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-text/60">
                                    No analyses yet. Upload an artwork to get started!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 