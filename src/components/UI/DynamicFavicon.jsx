'use client';

import { useEffect } from 'react';

const DynamicFavicon = () => {
    useEffect(() => {
        const updateFavicon = () => {
            // Check if we're in a browser environment
            if (typeof window === 'undefined') return;

            const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const faviconPath = isDarkMode
                ? '/Logo/Logo_icon_light.svg'
                : '/Logo/Logo_icon_dark.svg';

            // Use a more React-friendly approach
            const updateFaviconLink = (rel) => {
                let link = document.querySelector(`link[rel="${rel}"]`);
                if (!link) {
                    link = document.createElement('link');
                    link.rel = rel;
                    link.type = 'image/svg+xml';
                    document.head.appendChild(link);
                }

                // Only update if the path is different
                const currentPath = link.getAttribute('href');
                if (currentPath !== faviconPath) {
                    link.setAttribute('href', faviconPath);
                }
            };

            // Update both icon and shortcut icon
            updateFaviconLink('icon');
            updateFaviconLink('shortcut icon');
        };

        // Set initial favicon with a small delay to ensure DOM is ready
        const timer = setTimeout(updateFavicon, 100);

        // Listen for color scheme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = () => {
            // Add a small delay to prevent rapid updates
            clearTimeout(timer);
            setTimeout(updateFavicon, 100);
        };

        // Modern browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
        } else {
            // Fallback for older browsers
            mediaQuery.addListener(handleChange);
        }

        // Cleanup
        return () => {
            clearTimeout(timer);
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', handleChange);
            } else {
                // Fallback for older browsers
                mediaQuery.removeListener(handleChange);
            }
        };
    }, []);

    return null; // This component doesn't render anything
};

export default DynamicFavicon; 