'use client';

import { FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '@/context/ThemeContext';

const ThemeButton = ({ className = '' }) => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`p-2 text-text hover:text-primary-coral rounded-full transition-colors duration-200 ${className}`}
            aria-label="Toggle theme"
        >
            {isDarkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
        </button>
    );
};

export default ThemeButton; 