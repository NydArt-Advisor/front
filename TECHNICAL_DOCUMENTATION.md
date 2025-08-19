# Frontend Service - Technical Documentation

## Table of Contents
1. [Service Overview](#service-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Installation & Setup](#installation--setup)
5. [Configuration](#configuration)
6. [API Reference](#api-reference)
7. [Deployment Guide](#deployment-guide)
8. [User Manual](#user-manual)
9. [Update Manual](#update-manual)
10. [Monitoring & Troubleshooting](#monitoring--troubleshooting)
11. [Security Considerations](#security-considerations)
12. [Testing](#testing)

## Service Overview

The Frontend Service is a modern, responsive web application built with Next.js 14 that serves as the user interface for the NydArt Advisor application. It provides an intuitive and accessible interface for users to interact with AI-powered art analysis, manage their accounts, and access various features of the platform.

### Key Features
- **AI Art Analysis**: Upload and analyze artwork using AI
- **User Authentication**: Secure login, registration, and account management
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Accessibility**: WCAG 2.1 AA compliant with comprehensive accessibility features
- **Internationalization**: Multi-language support
- **Real-time Updates**: Live feedback and notifications
- **Payment Integration**: Stripe and PayPal payment processing
- **Theme Support**: Light and dark mode
- **Performance Optimized**: Fast loading and smooth interactions

### Service Responsibilities
- Provide user interface for all application features
- Handle user authentication and session management
- Manage file uploads and image processing
- Display AI analysis results and recommendations
- Process payments and subscriptions
- Provide accessibility features and settings
- Support multiple languages and locales

## Technology Stack

### Core Technologies
- **Framework**: Next.js 14.1.0 (React 18.2.0)
- **Language**: JavaScript (ES6+) / JSX
- **Styling**: Tailwind CSS 3.3.0
- **Build Tool**: Webpack (Next.js built-in)

### UI & UX Libraries
- **Animation**: Framer Motion 11.0.3
- **Icons**: React Icons 5.5.0
- **File Upload**: React Dropzone 14.2.3
- **Phone Input**: React Phone Input 2 2.15.1
- **Utilities**: clsx 2.1.1

### Development & Testing
- **Testing Framework**: Jest 30.0.5
- **Testing Library**: React Testing Library 16.3.0
- **Accessibility Testing**: jest-axe 10.0.0, @axe-core/react 4.10.2
- **Linting**: ESLint 8.56.0
- **Environment**: jest-environment-jsdom 30.0.5

### Build & Deployment
- **Package Manager**: npm
- **Environment**: dotenv 17.0.1
- **CSS Processing**: PostCSS, Autoprefixer
- **Typography**: @tailwindcss/typography 0.5.16

## Architecture

### Service Structure
```
front/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── layout.jsx         # Root layout component
│   │   ├── page.jsx           # Home page
│   │   ├── globals.css        # Global styles
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # User dashboard
│   │   ├── analyze/           # AI analysis pages
│   │   ├── payment/           # Payment pages
│   │   ├── about/             # About page
│   │   └── [locale]/          # Internationalization
│   ├── components/            # Reusable components
│   │   ├── UI/               # Base UI components
│   │   ├── layout/           # Layout components
│   │   ├── partials/         # Partial components
│   │   ├── auth/             # Authentication components
│   │   ├── accessibility/    # Accessibility components
│   │   └── forms/            # Form components
│   ├── context/              # React Context providers
│   │   ├── AuthContext.jsx   # Authentication context
│   │   ├── ThemeContext.jsx  # Theme management
│   │   └── AccessibilityContext.jsx # Accessibility settings
│   ├── services/             # API service layer
│   │   ├── auth.service.js   # Authentication API
│   │   ├── ai.service.js     # AI analysis API
│   │   ├── payment.service.js # Payment API
│   │   └── notification.service.js # Notification API
│   ├── hooks/                # Custom React hooks
│   ├── utils/                # Utility functions
│   ├── styles/               # Additional styles
│   ├── config/               # Configuration files
│   ├── messages/             # Internationalization messages
│   ├── providers/            # Service providers
│   └── __tests__/            # Test files
├── public/                   # Static assets
├── package.json
├── next.config.mjs          # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── jest.config.js           # Jest configuration
└── .env                     # Environment variables
```

### Data Flow
1. **User Interaction**: User interacts with UI components
2. **State Management**: React state and context manage application state
3. **API Calls**: Service layer makes HTTP requests to backend services
4. **Data Processing**: Components process and display data
5. **User Feedback**: UI updates with loading states and error handling

### Service Dependencies
- **Auth Service**: User authentication and session management
- **AI Service**: Art analysis and AI processing
- **Payment Service**: Payment processing and subscriptions
- **Notification Service**: Email and SMS notifications
- **Database Service**: User data and analytics
- **Metrics Service**: User engagement tracking

## Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Modern web browser
- Backend services running (for full functionality)

### Installation Steps

1. **Clone and Navigate**
   ```bash
   cd front
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Verify Installation**
   ```bash
   npm test
   ```

### Development Setup

#### Local Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

#### Testing Setup
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

## Configuration

### Environment Variables

#### Server Configuration
```env
# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

#### Backend Service URLs
```env
# Service URLs
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:5002
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:3004
NEXT_PUBLIC_PAYMENT_SERVICE_URL=http://localhost:4004
NEXT_PUBLIC_NOTIFICATION_SERVICE_URL=http://localhost:4003
NEXT_PUBLIC_DB_SERVICE_URL=http://localhost:5001
NEXT_PUBLIC_METRICS_SERVICE_URL=http://localhost:5005
```

#### Payment Configuration
```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret

# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_secret
```

#### Authentication Configuration
```env
# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
FACEBOOK_APP_ID=your_facebook_app_id
```

#### Feature Flags
```env
# Feature Toggles
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_PAYMENTS=true
NEXT_PUBLIC_ENABLE_ACCESSIBILITY=true
```

### Configuration Files

#### Next.js Configuration (`next.config.mjs`)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration options
  experimental: {
    appDir: true
  },
  images: {
    domains: ['your-domain.com']
  }
};

export default nextConfig;
```

#### Tailwind Configuration (`tailwind.config.js`)
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          coral: '#FF6B6B',
          salmon: '#FF8E8E'
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
```

## API Reference

### Service Layer

#### Authentication Service (`src/services/auth.service.js`)
```javascript
// Login user
const login = async (email, password) => {
  const response = await fetch(`${AUTH_SERVICE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

// Register user
const register = async (userData) => {
  const response = await fetch(`${AUTH_SERVICE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};
```

#### AI Service (`src/services/ai.service.js`)
```javascript
// Analyze image
const analyzeImage = async (imageFile, token) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await fetch(`${AI_SERVICE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  return response.json();
};
```

#### Payment Service (`src/services/payment.service.js`)
```javascript
// Create payment intent
const createPaymentIntent = async (amount, currency, token) => {
  const response = await fetch(`${PAYMENT_SERVICE_URL}/payments/create-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ amount, currency })
  });
  return response.json();
};
```

### Component API

#### Authentication Components
```jsx
// Login Form
<LoginForm onSubmit={handleLogin} />

// Registration Form
<RegisterForm onSubmit={handleRegister} />

// Password Reset
<ForgotPasswordForm onSubmit={handlePasswordReset} />
```

#### AI Analysis Components
```jsx
// Image Upload
<ImageUpload onUpload={handleImageUpload} />

// Analysis Results
<AnalysisResults results={analysisData} />

// Progress Indicator
<AnalysisProgress progress={progress} />
```

#### Accessibility Components
```jsx
// Accessibility Settings
<AccessibilitySettings isOpen={isOpen} onClose={handleClose} />

// Skip Navigation
<SkipNavigation />

// High Contrast Toggle
<HighContrastToggle />
```

## Deployment Guide

### Production Deployment

#### Environment Setup
1. **Set Production Environment**
   ```bash
   NODE_ENV=production
   ```

2. **Configure Production Variables**
   - Use production service URLs
   - Set production API keys
   - Configure CDN and image domains

3. **Build Optimization**
   ```bash
   npm run build
   npm start
   ```

#### Deployment Options

##### Vercel Deployment (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Set environment variables in Vercel dashboard
```

##### Docker Deployment
```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
ENV NODE_ENV production

CMD ["node", "server.js"]
```

##### Traditional Server Deployment
```bash
# Build application
npm run build

# Start production server
npm start

# Use PM2 for process management
pm2 start npm --name "frontend" -- start
```

#### Health Checks
```bash
# Check application health
curl https://your-frontend-domain.com/api/health

# Check build status
npm run build

# Check bundle analysis
npm run analyze
```

### Performance Optimization

#### Next.js Optimizations
```javascript
// next.config.mjs
const nextConfig = {
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    domains: ['your-domain.com'],
    formats: ['image/webp', 'image/avif']
  },
  
  // Enable experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion']
  }
};
```

#### Bundle Analysis
```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Analyze bundle
npm run analyze
```

## User Manual

### For Developers

#### Component Development
```jsx
// Create new component
import React from 'react';

const MyComponent = ({ prop1, prop2 }) => {
  return (
    <div className="my-component">
      <h1>{prop1}</h1>
      <p>{prop2}</p>
    </div>
  );
};

export default MyComponent;
```

#### State Management
```jsx
// Using React Context
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { user, login, logout } = useAuth();
  
  return (
    <div>
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>
  );
};
```

#### API Integration
```jsx
// Using service layer
import { authService } from '../services/auth.service';

const LoginForm = () => {
  const handleSubmit = async (formData) => {
    try {
      const response = await authService.login(formData.email, formData.password);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

### For System Administrators

#### Service Management
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test
```

#### Performance Monitoring
```bash
# Check bundle size
npm run build

# Analyze performance
npm run analyze

# Monitor memory usage
node --inspect npm start
```

#### Log Monitoring
```bash
# View application logs
tail -f logs/frontend.log

# Monitor errors
grep "ERROR" logs/frontend.log

# Monitor performance
grep "performance" logs/frontend.log
```

## Update Manual

### Version Updates

#### Minor Updates
1. **Backup Configuration**
   ```bash
   cp .env .env.backup
   cp package.json package.json.backup
   ```

2. **Update Dependencies**
   ```bash
   npm update
   ```

3. **Test Changes**
   ```bash
   npm test
   npm run build
   ```

4. **Deploy Updates**
   ```bash
   # For Vercel
   vercel --prod
   
   # For traditional deployment
   npm run build
   pm2 restart frontend
   ```

#### Major Updates
1. **Review Changelog**
   - Check breaking changes
   - Review new features
   - Verify compatibility

2. **Staging Deployment**
   - Deploy to staging environment
   - Run full test suite
   - Verify all features work

3. **Production Deployment**
   - Schedule maintenance window
   - Deploy with rollback plan
   - Monitor closely after deployment

### Configuration Updates

#### Environment Variables
1. **Update Service URLs**
   ```bash
   # Update backend service URLs
   NEXT_PUBLIC_AUTH_SERVICE_URL=new_auth_url
   NEXT_PUBLIC_AI_SERVICE_URL=new_ai_url
   ```

2. **Update API Keys**
   ```bash
   # Update payment keys
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=new_stripe_key
   ```

3. **Restart Application**
   ```bash
   # Restart development server
   npm run dev
   
   # Restart production server
   pm2 restart frontend
   ```

## Monitoring & Troubleshooting

### Key Metrics

#### Performance Metrics
- **Page Load Time**: Time to first byte and full page load
- **Bundle Size**: JavaScript and CSS bundle sizes
- **Core Web Vitals**: LCP, FID, CLS metrics
- **Error Rate**: JavaScript errors and failed requests

#### User Experience Metrics
- **User Engagement**: Page views, session duration
- **Feature Usage**: Most used features and pages
- **Accessibility**: Accessibility compliance score
- **Mobile Performance**: Mobile-specific metrics

### Common Issues

#### Build Failures
**Symptoms:**
- Build errors during deployment
- Missing dependencies
- Configuration errors

**Solutions:**
1. Check Node.js version compatibility
2. Clear npm cache and reinstall dependencies
3. Verify environment variables
4. Check for syntax errors in code

#### Performance Issues
**Symptoms:**
- Slow page loading
- High bundle sizes
- Poor Core Web Vitals scores

**Solutions:**
1. Optimize images and assets
2. Implement code splitting
3. Use dynamic imports
4. Optimize third-party scripts

#### Authentication Issues
**Symptoms:**
- Login failures
- Session timeouts
- OAuth errors

**Solutions:**
1. Check JWT token validity
2. Verify OAuth configuration
3. Check CORS settings
4. Review authentication flow

### Debugging Tools

#### Browser Developer Tools
```javascript
// Enable debug logging
localStorage.setItem('debug', 'true');

// Check network requests
// Open DevTools > Network tab

// Monitor performance
// Open DevTools > Performance tab
```

#### Next.js Debugging
```bash
# Enable Next.js debugging
DEBUG=* npm run dev

# Check build output
npm run build

# Analyze bundle
npm run analyze
```

#### Error Monitoring
```javascript
// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Send to error monitoring service
});

// Unhandled promise rejection
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
  // Send to error monitoring service
});
```

## Security Considerations

### Frontend Security

#### Input Validation
- Client-side validation for user inputs
- Sanitization of user-generated content
- XSS prevention through proper escaping

#### Authentication Security
- Secure token storage (HttpOnly cookies)
- Token refresh mechanisms
- Session timeout handling

#### API Security
- HTTPS enforcement
- CORS configuration
- Rate limiting on client side

### Data Protection

#### User Data
- Minimal data collection
- Secure data transmission
- Privacy policy compliance

#### Payment Security
- PCI DSS compliance
- Secure payment form handling
- Tokenization of payment data

### Content Security

#### CSP Implementation
```javascript
// next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
          }
        ]
      }
    ];
  }
};
```

#### Security Headers
```javascript
// Security headers configuration
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];
```

## Testing

### Test Categories

#### Unit Tests
- Component rendering tests
- Utility function tests
- Hook testing
- Service layer tests

#### Integration Tests
- API integration tests
- Authentication flow tests
- Payment flow tests
- User journey tests

#### Accessibility Tests
- WCAG compliance tests
- Screen reader compatibility
- Keyboard navigation tests
- Color contrast tests

### Running Tests

#### Full Test Suite
```bash
npm test
```

#### Specific Test Categories
```bash
# Unit tests only
npm test -- --testPathPattern=unit

# Integration tests only
npm test -- --testPathPattern=integration

# Accessibility tests only
npm test -- --testPathPattern=accessibility
```

#### Test Coverage
```bash
npm run test:coverage
```

### Test Configuration

#### Jest Configuration (`jest.config.js`)
```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
```

#### Test Examples
```javascript
// Component test
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import MyComponent from './MyComponent';

expect.extend(toHaveNoViolations);

test('renders without accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// Service test
import { authService } from '../services/auth.service';

test('login service works correctly', async () => {
  const mockResponse = { success: true, token: 'test-token' };
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockResponse),
    })
  );

  const result = await authService.login('test@example.com', 'password');
  expect(result).toEqual(mockResponse);
});
```

### Continuous Integration

#### GitHub Actions
```yaml
name: Frontend Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run test:coverage
      - run: npm run build
```

#### Test Reports
- Coverage reports generated
- Accessibility violation reports
- Performance test results
- Bundle size analysis

---

## Support & Maintenance

### Documentation Updates
- Keep this documentation current
- Update component examples
- Maintain troubleshooting guides

### Regular Maintenance
- Monitor performance metrics
- Update dependencies regularly
- Review security configurations
- Backup configurations

### Contact Information
- Technical issues: Create GitHub issue
- Security concerns: Contact security team
- General questions: Check documentation first

---

*Last Updated: January 2024*
*Version: 1.0.0*
