'use client';

import React, { useState } from 'react';
import { useAccessibility } from '@/context/AccessibilityContext';

const AccessibilityTester = () => {
    const [testResults, setTestResults] = useState([]);
    const { highContrastMode, fontSize, reducedMotion, showFocusIndicators } = useAccessibility();

    const runAccessibilityTests = () => {
        const results = [];

        // Test 1: Check if main content has proper ID
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            results.push({
                test: 'Main Content ID',
                status: 'PASS',
                message: 'Main content has proper ID for skip navigation'
            });
        } else {
            results.push({
                test: 'Main Content ID',
                status: 'FAIL',
                message: 'Main content missing ID for skip navigation'
            });
        }

        // Test 2: Check if navigation has proper ID
        const navigation = document.getElementById('main-navigation');
        if (navigation) {
            results.push({
                test: 'Navigation ID',
                status: 'PASS',
                message: 'Navigation has proper ID for skip navigation'
            });
        } else {
            results.push({
                test: 'Navigation ID',
                status: 'FAIL',
                message: 'Navigation missing ID for skip navigation'
            });
        }

        // Test 3: Check for images with alt text
        const images = document.querySelectorAll('img');
        const imagesWithoutAlt = Array.from(images).filter(img => !img.alt);
        if (imagesWithoutAlt.length === 0) {
            results.push({
                test: 'Image Alt Text',
                status: 'PASS',
                message: 'All images have alt text'
            });
        } else {
            results.push({
                test: 'Image Alt Text',
                status: 'FAIL',
                message: `${imagesWithoutAlt.length} images missing alt text`
            });
        }

        // Test 4: Check for form labels
        const inputs = document.querySelectorAll('input, select, textarea');
        const inputsWithoutLabels = Array.from(inputs).filter(input => {
            const id = input.id;
            if (!id) return true;
            const label = document.querySelector(`label[for="${id}"]`);
            return !label;
        });
        if (inputsWithoutLabels.length === 0) {
            results.push({
                test: 'Form Labels',
                status: 'PASS',
                message: 'All form inputs have associated labels'
            });
        } else {
            results.push({
                test: 'Form Labels',
                status: 'FAIL',
                message: `${inputsWithoutLabels.length} form inputs missing labels`
            });
        }

        // Test 5: Check for proper heading structure
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let headingStructureValid = true;
        let previousLevel = 0;

        Array.from(headings).forEach(heading => {
            const level = parseInt(heading.tagName.charAt(1));
            if (level > previousLevel + 1) {
                headingStructureValid = false;
            }
            previousLevel = level;
        });

        if (headingStructureValid) {
            results.push({
                test: 'Heading Structure',
                status: 'PASS',
                message: 'Heading structure is logical and hierarchical'
            });
        } else {
            results.push({
                test: 'Heading Structure',
                status: 'FAIL',
                message: 'Heading structure has gaps or is not hierarchical'
            });
        }

        // Test 6: Check for proper ARIA labels
        const elementsWithAriaLabel = document.querySelectorAll('[aria-label]');
        const elementsWithAriaLabelledby = document.querySelectorAll('[aria-labelledby]');
        const totalAriaElements = elementsWithAriaLabel.length + elementsWithAriaLabelledby.length;

        if (totalAriaElements > 0) {
            results.push({
                test: 'ARIA Labels',
                status: 'PASS',
                message: `${totalAriaElements} elements have ARIA labels`
            });
        } else {
            results.push({
                test: 'ARIA Labels',
                status: 'WARN',
                message: 'No ARIA labels found - consider adding them for better accessibility'
            });
        }

        // Test 7: Check for proper button and link text
        const buttons = document.querySelectorAll('button');
        const links = document.querySelectorAll('a');
        const emptyButtons = Array.from(buttons).filter(btn => !btn.textContent.trim() && !btn.getAttribute('aria-label'));
        const emptyLinks = Array.from(links).filter(link => !link.textContent.trim() && !link.getAttribute('aria-label'));

        if (emptyButtons.length === 0 && emptyLinks.length === 0) {
            results.push({
                test: 'Interactive Elements',
                status: 'PASS',
                message: 'All buttons and links have accessible text or labels'
            });
        } else {
            results.push({
                test: 'Interactive Elements',
                status: 'FAIL',
                message: `${emptyButtons.length} buttons and ${emptyLinks.length} links missing accessible text`
            });
        }

        // Test 8: Check current accessibility settings
        results.push({
            test: 'High Contrast Mode',
            status: highContrastMode ? 'ACTIVE' : 'INACTIVE',
            message: highContrastMode ? 'High contrast mode is enabled' : 'High contrast mode is disabled'
        });

        results.push({
            test: 'Font Size',
            status: 'ACTIVE',
            message: `Current font size: ${fontSize}%`
        });

        results.push({
            test: 'Reduced Motion',
            status: reducedMotion ? 'ACTIVE' : 'INACTIVE',
            message: reducedMotion ? 'Reduced motion is enabled' : 'Reduced motion is disabled'
        });

        results.push({
            test: 'Focus Indicators',
            status: showFocusIndicators ? 'ACTIVE' : 'INACTIVE',
            message: showFocusIndicators ? 'Focus indicators are enabled' : 'Focus indicators are disabled'
        });

        setTestResults(results);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PASS':
            case 'ACTIVE':
                return 'text-green-600';
            case 'FAIL':
                return 'text-red-600';
            case 'WARN':
                return 'text-yellow-600';
            case 'INACTIVE':
                return 'text-gray-600';
            default:
                return 'text-gray-600';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PASS':
            case 'ACTIVE':
                return '✅';
            case 'FAIL':
                return '❌';
            case 'WARN':
                return '⚠️';
            case 'INACTIVE':
                return '⏸️';
            default:
                return 'ℹ️';
        }
    };

    return (
        <div className="accessibility-tester p-6 bg-background border border-text/10 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Accessibility Tester</h2>

            <button
                onClick={runAccessibilityTests}
                className="mb-6 px-4 py-2 bg-primary-coral text-white rounded-lg hover:bg-primary-salmon transition-colors"
                aria-label="Run accessibility tests"
            >
                Run Accessibility Tests
            </button>

            {testResults.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Test Results</h3>

                    <div className="grid gap-4">
                        {testResults.map((result, index) => (
                            <div
                                key={index}
                                className={`p-4 border rounded-lg ${result.status === 'PASS' || result.status === 'ACTIVE'
                                        ? 'border-green-200 bg-green-50'
                                        : result.status === 'FAIL'
                                            ? 'border-red-200 bg-red-50'
                                            : result.status === 'WARN'
                                                ? 'border-yellow-200 bg-yellow-50'
                                                : 'border-gray-200 bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-lg">{getStatusIcon(result.status)}</span>
                                        <span className={`font-medium ${getStatusColor(result.status)}`}>
                                            {result.test}
                                        </span>
                                    </div>
                                    <span className={`text-sm font-medium ${getStatusColor(result.status)}`}>
                                        {result.status}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm text-text/70">{result.message}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Accessibility Summary</h4>
                        <p className="text-sm text-blue-700">
                            This tester checks for basic accessibility compliance. For comprehensive testing,
                            use tools like axe-core, WAVE, or screen readers like NVDA, JAWS, or VoiceOver.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccessibilityTester;
