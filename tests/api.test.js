const { test, expect } = require('@playwright/test');
const fs = require('fs');

// ✅ Load credentials and token
let credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
let tokenData = JSON.parse(fs.readFileSync('token.json', 'utf8'));

if (!tokenData.access_token) {
  throw new Error('❌ No access token found. Run auth.test.js first to generate one.');
}

// ✅ Function to make API requests
async function makeApiRequest(apiContext, endpoint) {
  const url = `${credentials.base_url}${endpoint}`;
  console.log(`🔄 Requesting: ${url}`);

  const response = await apiContext.get(url);
  console.log(`📢 Response Status: ${response.status()}`);

  if (response.status() !== 200) {
    console.error(`❌ API failed:`, await response.text());
    throw new Error(`GET ${url} failed with status ${response.status()}`);
  }

  return response.json();
}

test.describe('Anaconda API Tests - Account', () => {
  let apiContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      extraHTTPHeaders: {
        'Accept': 'application/json',
        'Authorization': `${tokenData.token_type} ${tokenData.access_token}`
      }
    });
  });

  test('GET /account - Fetch user account details', async () => {
    const responseBody = await makeApiRequest(apiContext, '/account');
    console.log('✅ Account API Response:', responseBody);

    expect(responseBody).toHaveProperty('user');
    expect(responseBody.user).toHaveProperty('email');
  });

  test('GET /account/features - Fetch user feature flags', async () => {
    const responseBody = await makeApiRequest(apiContext, '/account/features');
    console.log('✅ Account Features API Response:', responseBody);

    expect(responseBody).toBeInstanceOf(Object);
  });
});