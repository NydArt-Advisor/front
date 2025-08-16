'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useTheme } from '@/context/ThemeContext';

const Footer = () => {
    const { isDarkMode } = useTheme();
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        Company: [
            { label: 'About Us', href: '/about' },
            { label: 'Contact', href: '/contact' },
            { label: 'Careers', href: '/careers' },
            { label: 'Blog', href: '/blog' },
        ],
        Services: [
            { label: 'Art Advisory', href: '/services/advisory' },
            { label: 'Appraisals', href: '/services/appraisals' },
            { label: 'Collections', href: '/services/collections' },
            { label: 'Exhibitions', href: '/services/exhibitions' },
        ],
        Legal: [
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Cookie Policy', href: '/cookies' },
        ],
    };

    const socialLinks = [
        { icon: FaFacebook, href: 'https://facebook.com', label: 'Facebook' },
        { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
        { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
        { icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    ];

    return (
        <footer className="bg-background border-t border-primary-slate/20 transition-colors duration-200">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center">
                            <Image
                                src={isDarkMode ? '/Logo/Logo_white.svg' : '/Logo/Logo_dark.svg'}
                                alt="NYDART Logo"
                                width={120}
                                height={40}
                                className="h-8 w-auto"
                            />
                        </Link>
                        <p className="mt-4 text-text max-w-md font-primary">
                            Empowering art collectors and enthusiasts with AI-driven insights
                            and expert guidance for their art investment journey.
                        </p>
                        {/* Social Links */}
                        <div className="mt-6 flex space-x-6">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-text/60 hover:text-primary-coral transition-colors duration-200"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-6 w-6" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Footer Links */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h3 className="text-sm font-semibold text-text tracking-wider uppercase font-secondary">
                                {title}
                            </h3>
                            <ul className="mt-4 space-y-3">
                                {links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-text/60 hover:text-primary-coral transition-colors duration-200 font-primary"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom section */}
                <div className="mt-12 pt-8 border-t border-primary-slate/20">
                    <p className="text-center text-text/60 text-sm font-primary">
                        © {currentYear} NYDART. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 