'use client';

import React, { useState, useEffect } from 'react';

const SkipNavigation = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show skip links when user presses Tab
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Tab') {
                setIsVisible(true);
            }
        };

        const handleClick = () => {
            setIsVisible(false);
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('click', handleClick);
        };
    }, []);

    const skipLinks = [
        { href: '#main-content', text: 'Skip to main content' },
        { href: '#main-navigation', text: 'Skip to navigation' },
        { href: '#search', text: 'Skip to search' },
        { href: '#footer', text: 'Skip to footer' }
    ];

    if (!isVisible) return null;

    return (
        <div
            className="skip-navigation"
            role="navigation"
            aria-label="Skip navigation"
        >
            {skipLinks.map((link, index) => (
                <a
                    key={index}
                    href={link.href}
                    className="skip-link"
                    onClick={() => {
                        // Focus the target element after navigation
                        setTimeout(() => {
                            const target = document.querySelector(link.href);
                            if (target) {
                                target.focus();
                                target.scrollIntoView({ behavior: 'smooth' });
                            }
                        }, 100);
                    }}
                >
                    {link.text}
                </a>
            ))}
        </div>
    );
};

export default SkipNavigation;
