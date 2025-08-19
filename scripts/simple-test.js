#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

function runSimpleTest() {
  console.log('🧪 Running Frontend (Next.js) Tests...\n');
  
  const jestPath = path.join(__dirname, '../node_modules/.bin/jest');
  const isWindows = process.platform === 'win32';
  const jestCommand = isWindows ? `${jestPath}.cmd` : jestPath;
  
  const fs = require('fs');
  if (!fs.existsSync(jestCommand)) {
    console.error('❌ Jest not found. Please install dependencies first:');
    console.error('   npm install');
    process.exit(1);
  }

  const testProcess = spawn(jestCommand, [
    '--testPathPatterns=src/__tests__',
    '--verbose',
    '--coverage',
    '--watchAll=false'
  ], {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  testProcess.on('close', (code) => {
    if (code === 0) {
      console.log('\n✅ All Frontend tests passed!');
    } else {
      console.log(`\n❌ Frontend tests failed with code ${code}`);
      process.exit(code);
    }
  });

  testProcess.on('error', (error) => {
    console.error('❌ Failed to run Frontend tests:', error.message);
    process.exit(1);
  });
}

if (require.main === module) {
  runSimpleTest();
}

module.exports = { runSimpleTest };
