// Validate and set the API URL with proper fallback
const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;
if (!AUTH_SERVICE_URL) {
    console.error('❌ NEXT_PUBLIC_AUTH_SERVICE_URL environment variable is not set!');
    console.error('💡 Please set NEXT_PUBLIC_AUTH_SERVICE_URL in your .env.local file');
    console.error('   Example: NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:5002');
}

const API_URL = AUTH_SERVICE_URL ? `${AUTH_SERVICE_URL}/auth` : 'http://localhost:5002/auth';

class AuthService {
    static async getCurrentUser() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_URL}/me`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    throw new Error('Session expired. Please login again.');
                }
                throw new Error('Failed to get current user');
            }

            const userData = await response.json();
            return userData;
        } catch (error) {
            console.error('Error in getCurrentUser:', error);
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

            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            return response.ok;
        } catch (error) {
            console.error('Error during logout:', error);
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            return false;
        }
    }

    static async checkAuthStatus() {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            
            if (!token) {
                return { isAuthenticated: false, user: null };
            }

            const user = await this.getCurrentUser();
            return { isAuthenticated: true, user };
        } catch (error) {
            console.error('Error checking auth status:', error);
            return { isAuthenticated: false, user: null };
        }
    }

    static async updateProfile(profileData) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_URL}/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || 'Failed to update profile');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating profile:', error);
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

export default AuthService;