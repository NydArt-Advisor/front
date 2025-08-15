'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaQrcode, FaShieldAlt, FaCheck } from 'react-icons/fa';

export default function TwoFactorModal({ isOpen, onClose, onSuccess, twoFactorEnabled = false }) {
    const [step, setStep] = useState(1); // 1: Setup, 2: Verify
    const [qrCode, setQrCode] = useState('');
    const [secret, setSecret] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (isOpen && step === 1 && !twoFactorEnabled) {
            generateTwoFactorSecret();
        }
    }, [isOpen, step, twoFactorEnabled]);

    const generateTwoFactorSecret = async () => {
        setIsLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/two-factor/setup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setQrCode(data.qrCode);
                setSecret(data.secret);
            } else {
                setError(data.message || 'Failed to generate 2FA setup');
            }
        } catch (error) {
            console.error('Error generating 2FA secret:', error);
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!verificationCode || verificationCode.length !== 6) {
            setError('Please enter a valid 6-digit verification code');
            return;
        }

        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/two-factor/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    code: verificationCode,
                    secret: secret
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Two-factor authentication enabled successfully!');
                setTimeout(() => {
                    onClose();
                    if (onSuccess) onSuccess();
                }, 2000);
            } else {
                setError(data.message || 'Invalid verification code');
            }
        } catch (error) {
            console.error('Error verifying 2FA code:', error);
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisable2FA = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!verificationCode || verificationCode.length !== 6) {
            setError('Please enter a valid 6-digit verification code');
            return;
        }

        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/two-factor/disable`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    code: verificationCode
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Two-factor authentication disabled successfully!');
                setTimeout(() => {
                    onClose();
                    if (onSuccess) onSuccess();
                }, 2000);
            } else {
                setError(data.message || 'Invalid verification code');
            }
        } catch (error) {
            console.error('Error disabling 2FA:', error);
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setStep(1);
            setQrCode('');
            setSecret('');
            setVerificationCode('');
            setError('');
            setSuccess('');
            onClose();
        }
    };

    const handleInputChange = (value) => {
        // Only allow numbers and limit to 6 digits
        const numericValue = value.replace(/\D/g, '').slice(0, 6);
        setVerificationCode(numericValue);
        if (error) setError('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-xl shadow-xl w-full max-w-lg max-h-[95vh] overflow-hidden">
                <div className="p-6 max-h-full overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-text">
                            {twoFactorEnabled ? 'Disable Two-Factor Authentication' : 'Two-Factor Authentication'}
                        </h2>
                        <button
                            onClick={handleClose}
                            disabled={isLoading}
                            className="text-text/60 hover:text-text transition-colors disabled:opacity-50"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>

                    {twoFactorEnabled ? (
                        // Disable 2FA flow
                        <div className="space-y-4">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FaShieldAlt className="text-xl text-red-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-text mb-2">Disable 2FA</h3>
                                <p className="text-text/60 text-sm">
                                    Enter the 6-digit code from your authenticator app to disable two-factor authentication
                                </p>
                            </div>

                            <form onSubmit={handleDisable2FA} className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-text mb-2">
                                        Verification Code
                                    </label>
                                    <input
                                        type="text"
                                        value={verificationCode}
                                        onChange={(e) => handleInputChange(e.target.value)}
                                        className="w-full px-4 py-3 border border-text/20 rounded-lg bg-background text-text focus:ring-2 focus:ring-primary-coral focus:border-transparent text-center text-xl tracking-widest"
                                        placeholder="000000"
                                        maxLength={6}
                                        disabled={isLoading}
                                        autoFocus
                                    />
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm text-red-600">{error}</p>
                                    </div>
                                )}

                                {success && (
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-sm text-green-600 flex items-center justify-center space-x-2">
                                            <FaCheck />
                                            <span>{success}</span>
                                        </p>
                                    </div>
                                )}

                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        disabled={isLoading}
                                        className="flex-1 px-4 py-2 border border-text/20 text-text rounded-lg hover:bg-background-alt transition-colors disabled:opacity-50 text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading || verificationCode.length !== 6}
                                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                                <span>Disabling...</span>
                                            </div>
                                        ) : (
                                            'Disable 2FA'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        // Enable 2FA flow
                        <>
                            {step === 1 && (
                                <div className="space-y-4">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-primary-coral/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <FaShieldAlt className="text-xl text-primary-coral" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-text mb-2">Set Up 2FA</h3>
                                        <p className="text-text/60 text-sm">
                                            Scan the QR code with your authenticator app to enable two-factor authentication
                                        </p>
                                    </div>

                                    {isLoading ? (
                                        <div className="text-center py-6">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-coral mx-auto mb-3"></div>
                                            <p className="text-text/60 text-sm">Generating QR code...</p>
                                        </div>
                                    ) : qrCode ? (
                                        <div className="space-y-3">
                                            <div className="bg-white p-3 rounded-lg border border-text/10 flex justify-center">
                                                <img
                                                    src={qrCode}
                                                    alt="QR Code for 2FA"
                                                    className="w-40 h-40 sm:w-48 sm:h-48"
                                                />
                                            </div>

                                            <div className="bg-background-alt p-3 rounded-lg">
                                                <p className="text-sm text-text/60 mb-1">Manual entry code:</p>
                                                <code className="text-xs font-mono bg-background px-2 py-1 rounded border break-all">
                                                    {secret}
                                                </code>
                                            </div>

                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                <h4 className="font-medium text-blue-800 mb-1 text-sm">📱 Recommended Apps:</h4>
                                                <ul className="text-xs text-blue-700 space-y-0.5">
                                                    <li>• Google Authenticator</li>
                                                    <li>• Microsoft Authenticator</li>
                                                    <li>• Authy</li>
                                                    <li>• 1Password</li>
                                                </ul>
                                            </div>

                                            <button
                                                onClick={() => setStep(2)}
                                                className="w-full px-4 py-2 bg-primary-coral hover:bg-primary-salmon text-white rounded-lg transition-colors text-sm"
                                            >
                                                I've Scanned the QR Code
                                            </button>
                                        </div>
                                    ) : error ? (
                                        <div className="text-center py-4">
                                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-3">
                                                <p className="text-sm text-red-600">{error}</p>
                                            </div>
                                            <button
                                                onClick={generateTwoFactorSecret}
                                                className="px-4 py-2 bg-primary-coral hover:bg-primary-salmon text-white rounded-lg transition-colors text-sm"
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <FaQrcode className="text-xl text-green-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-text mb-2">Verify Setup</h3>
                                        <p className="text-text/60 text-sm">
                                            Enter the 6-digit code from your authenticator app to complete setup
                                        </p>
                                    </div>

                                    <form onSubmit={handleVerifyCode} className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-text mb-2">
                                                Verification Code
                                            </label>
                                            <input
                                                type="text"
                                                value={verificationCode}
                                                onChange={(e) => handleInputChange(e.target.value)}
                                                className="w-full px-4 py-3 border border-text/20 rounded-lg bg-background text-text focus:ring-2 focus:ring-primary-coral focus:border-transparent text-center text-xl tracking-widest"
                                                placeholder="000000"
                                                maxLength={6}
                                                disabled={isLoading}
                                                autoFocus
                                            />
                                        </div>

                                        {error && (
                                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                                <p className="text-sm text-red-600">{error}</p>
                                            </div>
                                        )}

                                        {success && (
                                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                                <p className="text-sm text-green-600 flex items-center justify-center space-x-2">
                                                    <FaCheck />
                                                    <span>{success}</span>
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                disabled={isLoading}
                                                className="flex-1 px-4 py-2 border border-text/20 text-text rounded-lg hover:bg-background-alt transition-colors disabled:opacity-50 text-sm"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isLoading || verificationCode.length !== 6}
                                                className="flex-1 px-4 py-2 bg-primary-coral hover:bg-primary-salmon text-white rounded-lg transition-colors disabled:opacity-50 text-sm"
                                            >
                                                {isLoading ? (
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                                        <span>Verifying...</span>
                                                    </div>
                                                ) : (
                                                    'Verify & Enable'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
} 