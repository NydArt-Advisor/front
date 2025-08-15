'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const features = [
    {
        title: 'Comprehensive Analysis',
        description: 'Get detailed feedback on technique, composition, color theory, and more.',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
        )
    },
    {
        title: 'AI-Powered Insights',
        description: 'Advanced artificial intelligence provides professional-level artwork evaluation.',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        )
    },
    {
        title: 'Personalized Feedback',
        description: 'Choose from multiple analysis types to focus on specific aspects of your artwork.',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
        )
    },
    {
        title: 'Learning Resources',
        description: 'Get personalized recommendations for improving your artistic skills.',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        )
    }
];

const HomePage = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-coral/20 to-transparent dark:from-primary-coral/10" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center">
                        <motion.h1
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            Elevate Your Art with
                            <span className="text-primary-coral"> AI-Powered </span>
                            Feedback
                        </motion.h1>
                        <motion.p
                            className="mt-6 text-xl text-text/70 max-w-3xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            Get professional-level analysis and feedback on your artwork using advanced AI technology.
                            Understand your strengths and areas for improvement with detailed insights.
                        </motion.p>
                        <motion.div
                            className="mt-10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Link
                                href="/analyze"
                                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-coral hover:bg-primary-salmon transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Analyze Your Art
                                <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-background-alt">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-text">Why Choose NydArt Advisor?</h2>
                        <p className="mt-4 text-lg text-text/70">
                            Our AI-powered platform provides comprehensive artwork analysis to help you grow as an artist.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                className="relative p-6 bg-background rounded-xl border border-text/10 hover:border-primary-coral/50 transition-colors duration-200"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className="text-primary-coral mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-text mb-2">{feature.title}</h3>
                                <p className="text-text/70">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-background-alt rounded-2xl p-8 md:p-12 lg:p-16 border border-text/10">
                        <div className="text-center max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold text-text mb-6">
                                Ready to Improve Your Artwork?
                            </h2>
                            <p className="text-lg text-text/70 mb-8">
                                Start getting professional-level feedback on your artwork today.
                                Upload your first piece and receive detailed analysis within minutes.
                            </p>
                            <div className="space-x-4">
                                <Link
                                    href="/analyze"
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-coral hover:bg-primary-salmon transition-colors duration-200"
                                >
                                    Try It Free
                                </Link>
                                <Link
                                    href="/auth/login"
                                    className="inline-flex items-center px-6 py-3 border border-text/10 text-base font-medium rounded-lg text-text hover:bg-background transition-colors duration-200"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage; 