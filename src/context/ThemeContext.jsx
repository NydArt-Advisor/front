'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('auto');
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Load theme from localStorage
        const savedTheme = localStorage.getItem('theme') || 'auto';
        setTheme(savedTheme);

        // Load settings from localStorage
        const savedSettings = localStorage.getItem('nydart-settings');
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                if (settings.theme) {
                    setTheme(settings.theme);
                }
            } catch (error) {
                console.error('Error parsing settings:', error);
            }
        }
    }, []);

    useEffect(() => {
        // Determine if dark mode should be active
        let shouldBeDark = false;

        if (theme === 'dark') {
            shouldBeDark = true;
        } else if (theme === 'light') {
            shouldBeDark = false;
        } else if (theme === 'auto') {
            // Check system preference
            shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }

        setIsDarkMode(shouldBeDark);

        // Update document class
        document.documentElement.classList.toggle('dark', shouldBeDark);
    }, [theme]);

    const updateTheme = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        updateTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{
            theme,
            setTheme: updateTheme,
            isDarkMode,
            toggleTheme
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}; 