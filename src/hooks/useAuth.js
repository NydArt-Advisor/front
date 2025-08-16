'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '@/services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const initAuth = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Check if we have a token
                const token = localStorage.getItem('token');
                if (!token) {
                    setUser(null);
                    return;
                }

                await checkAuth();
            } catch (error) {
                console.error('Auth initialization failed:', error);
                setError(error.message);
                
                // Only clear token for authentication-specific errors
                const shouldClearToken = error.message.includes('Session expired') || 
                                       error.message.includes('Token expired') ||
                                       error.message.includes('Invalid token') ||
                                       error.message.includes('Unauthorized') ||
                                       error.message.includes('Forbidden') ||
                                       error.message.includes('Failed to get current user');
                
                if (shouldClearToken) {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            } finally {
                setLoading(false);
                setInitialized(true);
            }
        };

        initAuth();
    }, []);

    const checkAuth = async () => {
        try {
            console.log('Checking authentication...');
            setError(null);
            const userData = await AuthService.getCurrentUser();
            setUser(userData);
            return userData;
        } catch (error) {
            console.error('Auth check failed:', error);
            
            // Handle network errors gracefully
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                console.warn('Network error during auth check - this is normal if backend services are not running');
                setUser(null);
                return null;
            }
            
            // Only clear user state for authentication-specific errors
            const isAuthError = error.message.includes('Session expired') || 
                              error.message.includes('Token expired') ||
                              error.message.includes('Invalid token') ||
                              error.message.includes('Unauthorized') ||
                              error.message.includes('Forbidden') ||
                              error.message.includes('No authentication token found') ||
                              error.message.includes('Failed to get current user');
            
            if (isAuthError) {
                setUser(null);
                localStorage.removeItem('token');
            }
            
            setError(error.message);
            
            // Only throw if it's not a "No token" error
            if (!error.message.includes('No authentication token found')) {
                throw error;
            }
        }
    };

    const login = async (credentials) => {
        try {
            setLoading(true);
            setError(null);
            const response = await AuthService.login(credentials);
            if (response.user) {
                setUser(response.user);
            } else {
                throw new Error('Invalid login response');
            }
            return response;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            const response = await AuthService.register(userData);
            setUser(response.user);
            return response;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            setError(null);
            await AuthService.logout();
            setUser(null);
            localStorage.removeItem('token');
        } catch (error) {
            setError(error.message);
            // Still clear user state even if logout fails
            setUser(null);
            localStorage.removeItem('token');
            throw error;
        }
    };

    const forgotPassword = async (email) => {
        try {
            setError(null);
            return await AuthService.forgotPassword(email);
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    const resetPassword = async (token, newPassword) => {
        try {
            setError(null);
            return await AuthService.resetPassword(token, newPassword);
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    const loginWithToken = async (token) => {
        try {
            setLoading(true);
            setError(null);
            
            // Store the token
            localStorage.setItem('token', token);
            
            // Add a small delay to prevent rapid successive calls
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Get user data with the token
            const userData = await AuthService.getCurrentUser();
            setUser(userData);
            
            return userData;
        } catch (error) {
            console.error('Login with token failed:', error);
            setError(error.message);
            localStorage.removeItem('token');
            setUser(null);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateUser = (userData) => {
        setUser(userData);
    };

    const value = {
        user,
        loading,
        error,
        initialized,
        login,
        loginWithToken,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateUser,
        isAuthenticated: !!user,
    };

    // Show loading state only during initial load
    if (loading && !initialized) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-coral"></div>
        </div>;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default useAuth; 