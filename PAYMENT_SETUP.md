# Payment Service Integration Setup

## Environment Configuration

Create a `.env.local` file in the frontend directory with the following variables:

```env
# Payment Service Configuration
NEXT_PUBLIC_PAYMENT_SERVICE_URL=http://localhost:3004

# Authentication Service Configuration (if needed)
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3001

# Frontend Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## JWT Token Storage

The payment service expects JWT tokens to be stored in either:
- `localStorage.getItem('token')`
- `sessionStorage.getItem('token')`

Make sure your authentication service stores the JWT token in one of these locations.

## API Endpoints

The frontend now connects to the following payment service endpoints:

### Subscriptions
- `GET /api/subscriptions/plans` - Get available plans
- `GET /api/subscriptions/current` - Get user's current subscription
- `POST /api/subscriptions` - Create new subscription
- `PUT /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Cancel subscription
- `GET /api/subscriptions/:id/usage` - Get usage data
- `GET /api/subscriptions/:id/billing` - Get billing history

### Payments
- `POST /api/payments/intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/payments/refund` - Create refund
- `GET /api/payments/methods` - Get payment methods
- `POST /api/payments/methods` - Add payment method
- `DELETE /api/payments/methods/:id` - Remove payment method
- `GET /api/payments/history` - Get payment history

### Health Check
- `GET /health` - Service health check

## Usage

The frontend now uses the `useSubscription` hook which provides:

```javascript
const {
    subscription,        // Current subscription data
    plans,              // Available plans
    loading,            // Loading state
    error,              // Error state
    createSubscription, // Create new subscription
    updateSubscription, // Update subscription
    cancelSubscription, // Cancel subscription
    getRemainingRequests, // Get remaining requests
    getTotalRequests,   // Get total requests
    getUsedRequests,    // Get used requests
    getUsagePercentage, // Get usage percentage
    getPlanDetails      // Get plan details
} = useSubscription();
```

## Testing the Connection

1. Start the payment service:
   ```bash
   cd payment-services-DarylNyd
   npm install
   npm run dev
   ```

2. Start the frontend:
   ```bash
   cd front-DarylNyd/front
   npm run dev
   ```

3. Check the health endpoint:
   ```
   http://localhost:3004/health
   ```

4. Test subscription plans endpoint:
   ```
   http://localhost:3004/api/subscriptions/plans
   ```

## Authentication

Make sure your authentication service provides JWT tokens that include:
- `id` - User ID
- `email` - User email
- `username` - Username

The payment service validates these tokens and uses the user information for subscription management.

## Error Handling

The frontend now includes proper error handling for:
- Network errors
- Authentication errors
- Payment processing errors
- Subscription management errors

Error messages are displayed to users and logged to the console for debugging. 