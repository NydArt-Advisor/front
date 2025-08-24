'use client';

import React, { useState } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { FaEye, FaEyeSlash, FaFont, FaFontSize, FaPalette, FaPause, FaPlay, FaUndo } from 'react-icons/fa';

const AccessibilitySettings = ({ isOpen, onClose }) => {
    const {
        highContrastMode,
        fontSize,
        reducedMotion,
        showFocusIndicators,
        toggleHighContrast,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
        toggleReducedMotion,
        toggleFocusIndicators,
        resetAccessibilitySettings,
        getFontSizeLabel,
        getContrastLabel,
        getMotionLabel
    } = useAccessibility();

    // Check if dark mode is active
    const isDarkMode = typeof window !== 'undefined' &&
        (document.documentElement.classList.contains('dark') ||
            window.matchMedia('(prefers-color-scheme: dark)').matches);

    const [activeTab, setActiveTab] = useState('general');

    if (!isOpen) return null;

    // Simple test version
    return (
        <div className="accessibility-settings-modal">
            <div className="modal-backdrop" onClick={onClose} />
            <div className={`modal-content ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                <div className={`modal-header ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h2 className="text-xl font-bold">Accessibility Settings</h2>
                    <button
                        onClick={onClose}
                        className={`close-button ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                        aria-label="Close accessibility settings"
                    >
                        ×
                    </button>
                </div>
                <div className="modal-body">
                    <div className="space-y-4">
                        <div className={`accessibility-section ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                            <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Current Settings</h3>
                            <div className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <p><strong>Font Size:</strong> {fontSize}%</p>
                                <p><strong>High Contrast:</strong> {highContrastMode ? 'On' : 'Off'}</p>
                                <p><strong>Reduced Motion:</strong> {reducedMotion ? 'On' : 'Off'}</p>
                                <p><strong>Focus Indicators:</strong> {showFocusIndicators ? 'On' : 'Off'}</p>
                            </div>
                        </div>

                        <div className={`accessibility-section ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                            <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={toggleHighContrast}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {highContrastMode ? 'Disable' : 'Enable'} High Contrast
                                </button>
                                <button
                                    onClick={toggleReducedMotion}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {reducedMotion ? 'Disable' : 'Enable'} Reduced Motion
                                </button>
                                <button
                                    onClick={increaseFontSize}
                                    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={fontSize >= 200}
                                >
                                    Increase Font Size
                                </button>
                                <button
                                    onClick={decreaseFontSize}
                                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={fontSize <= 75}
                                >
                                    Decrease Font Size
                                </button>
                            </div>
                        </div>

                        <div className={`accessibility-section ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                These settings help make the application more accessible for users with different needs.
                                Changes are saved automatically and will persist across sessions.
                            </p>
                        </div>
                    </div>
                </div>

                <div className={`modal-footer ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <button
                        onClick={resetAccessibilitySettings}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                        Reset All Settings
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-primary-coral text-white rounded hover:bg-primary-salmon transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );


};

export default AccessibilitySettings;
