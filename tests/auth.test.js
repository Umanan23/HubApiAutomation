const { test, request } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Load credentials data
let credentials;
try {
  credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
} catch (error) {
  console.error('❌ Error: credentials.json file not found or invalid');
  throw new Error('Credentials file not found or invalid');
}

// Initialize token storage
let tokenData = {
  "access_token": "",
  "token_type": "",
  "expires_in": 0,
  "refresh_token": ""
};

// Load existing token data if available
try {
  tokenData = JSON.parse(fs.readFileSync('token.json', 'utf8'));
} catch (error) {
  console.log('ℹ️ No existing token.json found, will create a new one');
}

test('Generate and save access token', async ({ playwright }) => {
  const apiContext = await playwright.request.newContext();
  
  console.log('🔄 Requesting token from:', `${credentials.base_url}/iam/token`);
  
  const response = await apiContext.post(`${credentials.base_url}/iam/token`, {
    headers: { 'Content-Type': 'application/json' },
    data: {
      grant_type: "password",
      username: credentials.username,
      password: credentials.password
    }
  });
  
  if (response.status() !== 200) {
    console.error('❌ Failed to fetch access token:', await response.text());
    throw new Error(`Token API failed with status ${response.status()}`);
  }
  
  const responseBody = await response.json();
  console.log('✅ Token fetched successfully!');
  
  // Update token data
  tokenData.access_token = responseBody.access_token;
  tokenData.token_type = responseBody.token_type || "Bearer";
  tokenData.expires_in = responseBody.expires_in || 900;
  tokenData.refresh_token = responseBody.refresh_token || "";
  
  // Save updated token to token.json
  fs.writeFileSync('token.json', JSON.stringify(tokenData, null, 2));
  console.log('✅ Access token saved successfully to token.json!');
});