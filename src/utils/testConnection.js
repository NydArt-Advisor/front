const testConnections = async () => {
    const results = {
        authService: null,
        databaseService: null,
        token: null
    };

    try {
        // Test Auth Service
        console.log('Testing Auth Service connection...');
        try {
            const authResponse = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/auth/health`);
            if (!authResponse.ok) {
                throw new Error(`Auth service responded with status: ${authResponse.status}`);
            }
            const authData = await authResponse.json();
            results.authService = {
                status: authResponse.status,
                data: authData
            };
            console.log('Auth Service response:', authData);
        } catch (authError) {
            console.error('Auth Service test failed:', authError);
            results.authService = {
                error: authError.message
            };
        }

        // Check token if exists (only on client side)
        if (typeof window !== 'undefined' && window.localStorage) {
            const token = localStorage.getItem('token');
            if (token) {
                results.token = {
                    exists: true,
                    length: token.length,
                    format: token.split('.').length === 3 ? 'valid JWT format' : 'invalid format'
                };
                console.log('Token found:', results.token);
            } else {
                results.token = { exists: false };
                console.log('No token found in localStorage');
            }
        } else {
            results.token = { exists: false, reason: 'localStorage not available' };
            console.log('localStorage not available (SSR)');
        }

        return results;
    } catch (error) {
        console.error('Connection test failed:', error);
        return {
            ...results,
            error: error.message
        };
    }
};

export default testConnections; 