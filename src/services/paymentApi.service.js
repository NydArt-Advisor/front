const PAYMENT_SERVICE_URL = process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL || 'http://:3004';

class PaymentApiService {
    constructor() {
        this.baseURL = PAYMENT_SERVICE_URL;
    }

    // Get auth token from localStorage or wherever it's stored
    getAuthToken() {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token') || sessionStorage.getItem('token');
        }
        return null;
    }

    // Create headers with authentication
    getHeaders() {
        const token = this.getAuthToken();
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }

    // Generic API call method
    async apiCall(endpoint, options = {}) {
        try {
            const url = `${this.baseURL}${endpoint}`;
            const config = {
                headers: this.getHeaders(),
                ...options
            };

            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('Payment API Error:', error);
            throw error;
        }
    }

    // Subscription endpoints
    async getPlans() {
        return this.apiCall('/api/subscriptions/plans');
    }

    async getCurrentSubscription() {
        return this.apiCall('/api/subscriptions/current');
    }

    async createSubscription(planId, paymentMethod, currency = 'eur', metadata = {}) {
        return this.apiCall('/api/subscriptions', {
            method: 'POST',
            body: JSON.stringify({
                planId,
                paymentMethod,
                currency,
                metadata
            })
        });
    }

    async updateSubscription(subscriptionId, updates) {
        return this.apiCall(`/api/subscriptions/${subscriptionId}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    }

    async cancelSubscription(subscriptionId) {
        return this.apiCall(`/api/subscriptions/${subscriptionId}`, {
            method: 'DELETE'
        });
    }

    async getSubscriptionUsage(subscriptionId) {
        return this.apiCall(`/api/subscriptions/${subscriptionId}/usage`);
    }

    async getBillingHistory(subscriptionId, page = 1, limit = 10) {
        return this.apiCall(`/api/subscriptions/${subscriptionId}/billing?page=${page}&limit=${limit}`);
    }

    // Payment endpoints
    async createPaymentIntent(amount, currency = 'eur', paymentMethod = 'stripe', metadata = {}) {
        return this.apiCall('/api/payments/intent', {
            method: 'POST',
            body: JSON.stringify({
                amount,
                currency,
                paymentMethod,
                metadata
            })
        });
    }

    async confirmPayment(paymentIntentId, paymentMethod) {
        return this.apiCall('/api/payments/confirm', {
            method: 'POST',
            body: JSON.stringify({
                paymentIntentId,
                paymentMethod
            })
        });
    }

    async createRefund(paymentIntentId, amount, reason = 'requested_by_customer', paymentMethod) {
        return this.apiCall('/api/payments/refund', {
            method: 'POST',
            body: JSON.stringify({
                paymentIntentId,
                amount,
                reason,
                paymentMethod
            })
        });
    }

    async getPaymentMethods() {
        return this.apiCall('/api/payments/methods');
    }

    async addPaymentMethod(paymentMethodData) {
        return this.apiCall('/api/payments/methods', {
            method: 'POST',
            body: JSON.stringify(paymentMethodData)
        });
    }

    async removePaymentMethod(methodId) {
        return this.apiCall(`/api/payments/methods/${methodId}`, {
            method: 'DELETE'
        });
    }

    async getPaymentHistory(page = 1, limit = 10) {
        return this.apiCall(`/api/payments/history?page=${page}&limit=${limit}`);
    }

    async getPaymentDetails(paymentId) {
        return this.apiCall(`/api/payments/${paymentId}`);
    }

    // Health check
    async healthCheck() {
        return this.apiCall('/health');
    }
}

// Create and export a singleton instance
const paymentApiService = new PaymentApiService();
export default paymentApiService; 