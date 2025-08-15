# Google OAuth Setup Guide

## 🔧 **Step 1: Create Google OAuth Credentials**

### 1. Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Sign in with your Google account

### 2. Create a New Project (if you don't have one)
- Click on the project dropdown at the top
- Click "New Project"
- Name it something like "NydArt Advisor"
- Click "Create"

### 3. Enable Google+ API
- Go to "APIs & Services" > "Library"
- Search for "Google+ API" or "Google Identity"
- Click on it and click "Enable"

### 4. Create OAuth 2.0 Credentials
- Go to "APIs & Services" > "Credentials"
- Click "Create Credentials" > "OAuth 2.0 Client IDs"
- Choose "Web application" as the application type
- Name: "NydArt Advisor Web Client"

### 5. Configure OAuth Consent Screen
- You'll be prompted to configure the OAuth consent screen
- Choose "External" user type
- Fill in the required information:
  - App name: "NydArt Advisor"
  - User support email: Your email
  - Developer contact information: Your email
- Add scopes: `email`, `profile`
- Add test users (your email) if needed

### 6. Set Authorized Redirect URIs
In the OAuth 2.0 client configuration, add these redirect URIs:
```
http://localhost:5002/auth/google/callback
http://localhost:3000/auth-success
```

### 7. Get Your Credentials
After creating, you'll get:
- **Client ID** (looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)
- **Client Secret** (looks like: `GOCSPX-abcdefghijklmnopqrstuvwxyz`)

## 🔧 **Step 2: Update Environment Variables**

### Authentication Service (.env file in `autenthication-service-DarylNyd`)
```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here

# Other required variables
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
SESSION_SECRET=your_session_secret
DB_SERVICE_URL=http://localhost:5001/api
CLIENT_URL=http://localhost:3000
NODE_ENV=development
PORT=5002
```

### Frontend (.env.local file in `front-DarylNyd/front`)
```env
# Service URLs
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:5002
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:5000
NEXT_PUBLIC_PAYMENT_SERVICE_URL=http://localhost:3004
NEXT_PUBLIC_DB_SERVICE_URL=http://localhost:5001
```

## 🔧 **Step 3: Run Database Migration**

If you have existing users, run the migration to add the required fields:

```bash
cd bdd-services-DarylNyd
npm run migrate
```

## 🔧 **Step 4: Start Your Services**

1. **Database Service:**
   ```bash
   cd bdd-services-DarylNyd
   npm run dev
   ```

2. **Authentication Service:**
   ```bash
   cd autenthication-service-DarylNyd
   npm run dev
   ```

3. **Frontend:**
   ```bash
   cd front-DarylNyd/front
   npm run dev
   ```

## 🔧 **Step 5: Test Google OAuth**

1. Go to http://localhost:3000/auth/login
2. Click "Continue With Google"
3. You should be redirected to Google's OAuth consent screen
4. After authorization, you'll be redirected back to the app

## 🚨 **Troubleshooting**

### Common Issues:

1. **"Account is not active" error:**
   - Run the database migration: `npm run migrate`
   - Restart your services

2. **"Invalid redirect URI" error:**
   - Make sure the redirect URIs in Google Console match exactly
   - Check that your CLIENT_URL environment variable is correct

3. **"OAuth credentials not provided" error:**
   - Make sure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set in your .env file
   - Restart the authentication service

4. **"Cannot connect to backend server" error:**
   - Make sure all services are running
   - Check that the ports match your environment variables

### Debug Steps:

1. Check browser console for errors
2. Check authentication service logs
3. Verify environment variables are loaded correctly
4. Test the OAuth endpoints directly:
   - http://localhost:5002/auth/google (should redirect to Google)
   - http://localhost:5002/health (should return service status)

## 🔒 **Security Notes**

- Never commit your .env files to version control
- Use different OAuth credentials for development and production
- In production, use HTTPS URLs for redirect URIs
- Regularly rotate your OAuth secrets

## 🚀 **Production Deployment**

For production, update the redirect URIs in Google Console to:
```
https://yourdomain.com/auth-success
https://yourdomain.com/auth-error
```

And update your environment variables accordingly. 