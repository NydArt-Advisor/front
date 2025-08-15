'use client';

import { useState, useEffect } from 'react';

const useSettings = () => {
    const [settings, setSettings] = useState({
        theme: 'auto',
        language: 'en',
        showAnimations: true,
        compactLayout: false,
        highContrastMode: false
    });

    // Load settings from localStorage
    useEffect(() => {
        const savedSettings = localStorage.getItem('nydart-settings');
        if (savedSettings) {
            try {
                const parsedSettings = JSON.parse(savedSettings);
                setSettings(prev => ({
                    ...prev,
                    ...parsedSettings
                }));
            } catch (error) {
                console.error('Error parsing saved settings:', error);
            }
        }
    }, []);

    const updateSettings = (newSettings) => {
        setSettings(prev => {
            const updated = { ...prev, ...newSettings };
            localStorage.setItem('nydart-settings', JSON.stringify(updated));
            return updated;
        });
    };

    const updateSetting = (key, value) => {
        updateSettings({ [key]: value });
    };

    return {
        settings,
        updateSettings,
        updateSetting
    };
};

export default useSettings; 