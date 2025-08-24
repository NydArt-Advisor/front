'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (!context) {
        throw new Error('useAccessibility must be used within an AccessibilityProvider');
    }
    return context;
};

export const AccessibilityProvider = ({ children }) => {
    // Accessibility state
    const [highContrastMode, setHighContrastMode] = useState(false);
    const [fontSize, setFontSize] = useState(100); // percentage
    const [reducedMotion, setReducedMotion] = useState(false);
    const [showFocusIndicators, setShowFocusIndicators] = useState(true);

    // Load preferences from localStorage on mount
    useEffect(() => {
        const savedHighContrast = localStorage.getItem('accessibility-highContrast');
        const savedFontSize = localStorage.getItem('accessibility-fontSize');
        const savedReducedMotion = localStorage.getItem('accessibility-reducedMotion');
        const savedFocusIndicators = localStorage.getItem('accessibility-focusIndicators');

        if (savedHighContrast !== null) {
            setHighContrastMode(JSON.parse(savedHighContrast));
        }
        if (savedFontSize !== null) {
            setFontSize(JSON.parse(savedFontSize));
        }
        if (savedReducedMotion !== null) {
            setReducedMotion(JSON.parse(savedReducedMotion));
        }
        if (savedFocusIndicators !== null) {
            setShowFocusIndicators(JSON.parse(savedFocusIndicators));
        }

        // Check system preferences
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mediaQuery.matches && savedReducedMotion === null) {
            setReducedMotion(true);
        }
    }, []);

    // Save preferences to localStorage
    useEffect(() => {
        localStorage.setItem('accessibility-highContrast', JSON.stringify(highContrastMode));
    }, [highContrastMode]);

    useEffect(() => {
        localStorage.setItem('accessibility-fontSize', JSON.stringify(fontSize));
    }, [fontSize]);

    useEffect(() => {
        localStorage.setItem('accessibility-reducedMotion', JSON.stringify(reducedMotion));
    }, [reducedMotion]);

    useEffect(() => {
        localStorage.setItem('accessibility-focusIndicators', JSON.stringify(showFocusIndicators));
    }, [showFocusIndicators]);

    // Apply accessibility styles to document
    useEffect(() => {
        const root = document.documentElement;

        // Apply high contrast mode
        if (highContrastMode) {
            root.classList.add('high-contrast-mode');
        } else {
            root.classList.remove('high-contrast-mode');
        }

        // Apply font size
        root.style.fontSize = `${fontSize}%`;

        // Apply reduced motion
        if (reducedMotion) {
            root.classList.add('reduced-motion');
        } else {
            root.classList.remove('reduced-motion');
        }

        // Apply focus indicators
        if (showFocusIndicators) {
            root.classList.add('show-focus-indicators');
        } else {
            root.classList.remove('show-focus-indicators');
        }
    }, [highContrastMode, fontSize, reducedMotion, showFocusIndicators]);

    // Toggle functions
    const toggleHighContrast = () => {
        setHighContrastMode(!highContrastMode);
    };

    const increaseFontSize = () => {
        setFontSize(prev => Math.min(prev + 25, 200)); // Max 200%
    };

    const decreaseFontSize = () => {
        setFontSize(prev => Math.max(prev - 25, 75)); // Min 75%
    };

    const resetFontSize = () => {
        setFontSize(100);
    };

    const toggleReducedMotion = () => {
        setReducedMotion(!reducedMotion);
    };

    const toggleFocusIndicators = () => {
        setShowFocusIndicators(!showFocusIndicators);
    };

    // Reset all accessibility settings
    const resetAccessibilitySettings = () => {
        setHighContrastMode(false);
        setFontSize(100);
        setReducedMotion(false);
        setShowFocusIndicators(true);
    };

    const value = {
        // State
        highContrastMode,
        fontSize,
        reducedMotion,
        showFocusIndicators,

        // Actions
        toggleHighContrast,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
        toggleReducedMotion,
        toggleFocusIndicators,
        resetAccessibilitySettings,

        // Utility functions
        getFontSizeLabel: () => {
            if (fontSize === 100) return 'Normal';
            if (fontSize === 125) return 'Large';
            if (fontSize === 150) return 'Extra Large';
            if (fontSize === 175) return 'Very Large';
            if (fontSize === 200) return 'Maximum';
            return `${fontSize}%`;
        },

        getContrastLabel: () => {
            return highContrastMode ? 'High Contrast' : 'Standard';
        },

        getMotionLabel: () => {
            return reducedMotion ? 'Reduced Motion' : 'Full Motion';
        }
    };

    return (
        <AccessibilityContext.Provider value={value}>
            {children}
        </AccessibilityContext.Provider>
    );
};
