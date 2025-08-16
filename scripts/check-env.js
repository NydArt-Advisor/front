#!/usr/bin/env node

/**
 * Environment Variable Checker for Frontend
 * Validates that all required environment variables are set
 */

const fs = require('fs');
const path = require('path');

// Required environment variables for frontend
const requiredEnvVars = [
    'NEXT_PUBLIC_AUTH_SERVICE_URL',
    'NEXT_PUBLIC_AI_SERVICE_URL',
    'NEXT_PUBLIC_DB_SERVICE_URL',
    'NEXT_PUBLIC_PAYMENT_SERVICE_URL',
    'NEXT_PUBLIC_NOTIFICATION_SERVICE_URL',
    'NEXT_PUBLIC_METRICS_SERVICE_URL'
];

function checkEnvironmentVariables() {
    console.log('🔍 Checking environment variables...\n');
    
    // Try to load .env file
    const envPath = path.join(__dirname, '../.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
        console.log('✅ Found .env file');
    } else {
        console.log('⚠️  No .env file found');
    }
    
    let allValid = true;
    const missingVars = [];
    const presentVars = [];
    
    for (const envVar of requiredEnvVars) {
        // Check if variable is in .env file
        const envRegex = new RegExp(`^${envVar}=(.+)$`, 'm');
        const match = envContent.match(envRegex);
        
        if (match && match[1] && match[1].trim() !== '') {
            const value = match[1].trim();
            console.log(`✅ ${envVar}: ${value}`);
            presentVars.push(envVar);
        } else {
            console.log(`❌ ${envVar}: NOT SET`);
            missingVars.push(envVar);
            allValid = false;
        }
    }
    
    console.log('\n📊 Summary:');
    console.log(`✅ Present: ${presentVars.length}/${requiredEnvVars.length}`);
    console.log(`❌ Missing: ${missingVars.length}/${requiredEnvVars.length}`);
    
    if (!allValid) {
        console.log('\n🔧 To fix missing variables:');
        console.log('1. Create or update your .env file in the front/ directory');
        console.log('2. Add the missing variables:');
        missingVars.forEach(varName => {
            console.log(`   ${varName}=http://localhost:XXXX`);
        });
        console.log('\n💡 Example .env file:');
        console.log('NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:5002');
        console.log('NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:5000');
        console.log('NEXT_PUBLIC_DB_SERVICE_URL=http://localhost:5001');
        console.log('NEXT_PUBLIC_PAYMENT_SERVICE_URL=http://localhost:3004');
        console.log('NEXT_PUBLIC_NOTIFICATION_SERVICE_URL=http://localhost:4003');
        console.log('NEXT_PUBLIC_METRICS_SERVICE_URL=http://localhost:5005');
        
        process.exit(1);
    } else {
        console.log('\n🎉 All environment variables are properly configured!');
    }
}

if (require.main === module) {
    checkEnvironmentVariables();
}

module.exports = { checkEnvironmentVariables };
