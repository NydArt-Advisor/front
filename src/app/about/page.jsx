'use client';

import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';
import Link from 'next/link';
import { FaPalette, FaBrain, FaUsers, FaShieldAlt, FaRocket, FaHeart } from 'react-icons/fa';

export default function AboutPage() {
    const { isDarkMode } = useTheme();

    const features = [
        {
            icon: FaPalette,
            title: 'AI-Powered Art Analysis',
            description: 'Get detailed insights about artworks using advanced artificial intelligence algorithms.'
        },
        {
            icon: FaBrain,
            title: 'Expert Guidance',
            description: 'Receive professional art advisory services to make informed investment decisions.'
        },
        {
            icon: FaUsers,
            title: 'Community',
            description: 'Connect with fellow art enthusiasts and collectors in our vibrant community.'
        },
        {
            icon: FaShieldAlt,
            title: 'Secure Platform',
            description: 'Your data and art collection information are protected with enterprise-grade security.'
        }
    ];

    const team = [
        {
            name: 'Daryl Nyd',
            role: 'Founder & Lead Developer',
            description: 'Passionate about bridging technology and art to create innovative solutions for art collectors.'
        },
        {
            name: 'AI Team',
            role: 'Machine Learning Specialists',
            description: 'Experts in computer vision and AI algorithms specialized in art analysis and recognition.'
        },
        {
            name: 'Art Experts',
            role: 'Art Advisory Board',
            description: 'Seasoned art professionals with decades of experience in the art market and curation.'
        }
    ];

    const stats = [
        { number: '1000+', label: 'Artworks Analyzed' },
        { number: '500+', label: 'Happy Users' },
        { number: '95%', label: 'Accuracy Rate' },
        { number: '24/7', label: 'AI Support' }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-text mb-6">
                        About <span className="text-primary-coral">NydArt</span> Advisor
                    </h1>
                    <p className="text-xl text-text/70 max-w-3xl mx-auto mb-8">
                        Empowering art collectors and enthusiasts with AI-driven insights and expert guidance
                        for their art investment journey.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link
                            href="/auth/register"
                            className="bg-primary-coral hover:bg-primary-salmon text-white px-8 py-3 rounded-lg font-medium transition-colors"
                        >
                            Get Started
                        </Link>
                        <Link
                            href="/analyze"
                            className="border border-primary-coral text-primary-coral hover:bg-primary-coral hover:text-white px-8 py-3 rounded-lg font-medium transition-colors"
                        >
                            Try Analysis
                        </Link>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 px-4 bg-background-alt">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-text mb-6">Our Mission</h2>
                            <p className="text-lg text-text/70 mb-6">
                                We believe that art should be accessible to everyone, and that technology can
                                bridge the gap between art appreciation and investment. Our mission is to
                                democratize art advisory services through cutting-edge AI technology.
                            </p>
                            <p className="text-lg text-text/70 mb-6">
                                Whether you're a seasoned collector or just starting your art journey,
                                NydArt Advisor provides the tools and insights you need to make informed
                                decisions about art investments.
                            </p>
                            <div className="flex items-center space-x-4">
                                <FaHeart className="text-primary-coral text-2xl" />
                                <span className="text-text font-medium">Art for Everyone</span>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-primary-coral to-primary-slate rounded-2xl p-8">
                                <div className="bg-background rounded-xl p-6">
                                    <h3 className="text-2xl font-bold text-text mb-4">Why Choose NydArt?</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-center space-x-3">
                                            <FaRocket className="text-primary-coral" />
                                            <span className="text-text">Instant AI-powered analysis</span>
                                        </li>
                                        <li className="flex items-center space-x-3">
                                            <FaBrain className="text-primary-coral" />
                                            <span className="text-text">Expert-level insights</span>
                                        </li>
                                        <li className="flex items-center space-x-3">
                                            <FaShieldAlt className="text-primary-coral" />
                                            <span className="text-text">Secure and private</span>
                                        </li>
                                        <li className="flex items-center space-x-3">
                                            <FaUsers className="text-primary-coral" />
                                            <span className="text-text">Community support</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-text mb-4">Our Features</h2>
                        <p className="text-lg text-text/70 max-w-2xl mx-auto">
                            Discover the powerful tools and features that make NydArt Advisor the ultimate
                            companion for art collectors and enthusiasts.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="text-center p-6 rounded-xl bg-background-alt hover:shadow-lg transition-shadow">
                                <div className="w-16 h-16 bg-primary-coral/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <feature.icon className="text-2xl text-primary-coral" />
                                </div>
                                <h3 className="text-xl font-semibold text-text mb-3">{feature.title}</h3>
                                <p className="text-text/70">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-4 bg-primary-coral">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, index) => (
                            <div key={index}>
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-white/90">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-text mb-4">Meet Our Team</h2>
                        <p className="text-lg text-text/70 max-w-2xl mx-auto">
                            Our diverse team combines expertise in technology, art, and AI to create
                            the best possible experience for our users.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <div key={index} className="text-center p-6 rounded-xl bg-background-alt">
                                <div className="w-24 h-24 bg-primary-coral/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaUsers className="text-3xl text-primary-coral" />
                                </div>
                                <h3 className="text-xl font-semibold text-text mb-2">{member.name}</h3>
                                <p className="text-primary-coral font-medium mb-3">{member.role}</p>
                                <p className="text-text/70">{member.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 bg-background-alt">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-text mb-6">
                        Ready to Start Your Art Journey?
                    </h2>
                    <p className="text-lg text-text/70 mb-8">
                        Join thousands of art enthusiasts who are already using NydArt Advisor to
                        make informed decisions about their art investments.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link
                            href="/auth/register"
                            className="bg-primary-coral hover:bg-primary-salmon text-white px-8 py-3 rounded-lg font-medium transition-colors"
                        >
                            Create Account
                        </Link>
                        <Link
                            href="/contact"
                            className="border border-primary-coral text-primary-coral hover:bg-primary-coral hover:text-white px-8 py-3 rounded-lg font-medium transition-colors"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
} 