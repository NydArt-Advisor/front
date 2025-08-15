import dotenv from 'dotenv';
dotenv.config();
const API_URL = 'http://localhost:5002/auth';
import testConnections from '@/utils/testConnection';

// Debug helper
const debug = {
    log: (message, data) => {
        console.log(`[Auth Debug] ${message}`, data || '');
    },
    error: (message, error) => {
        console.error(`[Auth Debug] ${message}`, error);
    }
};

class AuthService {
    static async testConnection() {
        try {
            debug.log('Testing all service connections...');
            const results = await testConnections();
            
            // Log detailed results
            debug.log('Connection test results:', {
                authService: results.authService?.error ? 'Failed' : 'OK',
                databaseService: results.databaseService?.error ? 'Failed' : 'OK',
                token: results.token?.exists ? 'Present' : 'Not found'
            });

            // Check if services are responding
            const authServiceOk = !results.authService?.error;
            const databaseServiceOk = !results.databaseService?.error;
            
            if (!authServiceOk) {
                debug.error('Auth Service not available:', results.authService?.error);
            }
            if (!databaseServiceOk) {
                debug.error('Database Service not available:', results.databaseService?.error);
            }

            return authServiceOk && databaseServiceOk;
        } catch (error) {
            debug.error('Connection test failed', error);
            return false;
        }
    }

    static async register({ username, email, password, phone }) {
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ username, email, password, phone }),
                credentials: 'include',
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || 'Registration failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Error during registration:', error);
            throw error;
        }
    }

    static async login({ email, password }) {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || 'Login failed');
            }

            const data = await response.json();
            // Store the token in localStorage and sessionStorage for persistence
            if (data.token) {
                localStorage.setItem('token', data.token);
                sessionStorage.setItem('token', data.token);
            }
            return data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }

    static async logout() {
        try {
            const response = await fetch(`${API_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || 'Logout failed');
            }

            // Clear the token from localStorage
            localStorage.removeItem('token');
            return await response.json();
        } catch (error) {
            console.error('Error during logout:', error);
            // Clear token even if logout fails
            localStorage.removeItem('token');
            throw error;
        }
    }

    static async getCurrentUser() {
        try {
            debug.log('Starting getCurrentUser request');
            const token = localStorage.getItem('token');
            if (!token) {
                debug.error('No token found in localStorage');
                throw new Error('No authentication token found');
            }

            debug.log('Token found, length:', token.length);
            
            // Add timeout to prevent hanging requests
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // Increased timeout to 10 seconds

            const requestUrl = `${API_URL}/me`;
            debug.log('Making request to:', requestUrl);
            
            const response = await fetch(requestUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            debug.log('Response received', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries())
            });

            if (!response.ok) {
                // Log the error response for debugging
                const errorText = await response.text();
                debug.error('Error response details:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText
                });

                if (response.status === 401) {
                    debug.log('Token expired, attempting refresh');
                    try {
                        const refreshResult = await this.refreshToken();
                        if (!refreshResult.token) {
                            throw new Error('Token refresh failed');
                        }
                        debug.log('Token refreshed successfully, retrying request');
                        return await this.getCurrentUser();
                    } catch (refreshError) {
                        debug.error('Token refresh failed', refreshError);
                        localStorage.removeItem('token');
                        throw new Error('Session expired. Please login again.');
                    }
                }
                
                if (response.status === 404) {
                    throw new Error('User not found');
                }
                
                if (response.status === 429) {
                    debug.error('Rate limit exceeded');
                    throw new Error('Too many requests. Please wait a moment and try again.');
                }
                
                if (response.status === 500) {
                    debug.error('Server error details:', errorText);
                    throw new Error('Server error occurred. Please try again later.');
                }

                try {
                    const error = JSON.parse(errorText);
                    throw new Error(error.message || `Failed to get current user (${response.status})`);
                } catch (parseError) {
                    throw new Error(`Server error: ${response.status} ${response.statusText}`);
                }
            }

            const userData = await response.json();
            debug.log('User data received', { 
                hasId: !!userData?.id,
                hasEmail: !!userData?.email,
                fields: Object.keys(userData)
            });

            if (!userData || !userData.id) {
                debug.error('Invalid user data received', userData);
                throw new Error('Invalid user data received');
            }

            return userData;
        } catch (error) {
            if (error.name === 'AbortError') {
                debug.error('Request timed out');
                throw new Error('Request timed out');
            }
            debug.error('Error in getCurrentUser', error);
            throw error;
        }
    }

    static async refreshToken() {
        try {
            const response = await fetch(`${API_URL}/refresh-token`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || 'Token refresh failed');
            }

            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            return data;
        } catch (error) {
            console.error('Error refreshing token:', error);
            throw error;
        }
    }

    static async forgotPassword(email) {
        try {
            const response = await fetch(`${API_URL}/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || 'Failed to send password reset email');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in forgot password:', error);
            throw error;
        }
    }

    static async resetPassword(token, newPassword) {
        try {
            const response = await fetch(`${API_URL}/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ token, newPassword }),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || 'Password reset failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Error resetting password:', error);
            throw error;
        }
    }
}

// Test the connection when the service is loaded (only on client side)
if (typeof window !== 'undefined') {
    AuthService.testConnection().then(isConnected => {
        debug.log('Initial connection test result:', isConnected);
    });
}

export default AuthService; 