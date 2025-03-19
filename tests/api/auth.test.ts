import { test, expect, chromium } from "@playwright/test";
import { credentials } from "../../config/credentials";
import { setToken } from "../../config/token";

test("POST /iam/token - Generate Auth Token", async () => {
  console.log("🔄 Requesting Authentication Token...");

  // Use a real browser (non-headless mode)
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Send authentication request
    const response = await page.request.post(`${credentials.baseUrl}/iam/token`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        grant_type: "password",
        username: credentials.username,
        password: credentials.password,
      },
    });

    console.log(`📢 Response Status: ${response.status()}`);

    if (response.status() !== 200) {
      const errorBody = await response.text();
      console.error(`❌ Authentication Failed:`, errorBody);
      throw new Error(`Failed to fetch auth token - Status: ${response.status()}\nResponse Body: ${errorBody}`);
    }

    const responseBody = await response.json();
    console.log("✅ Generated Token:", responseBody.access_token);

    // Save Token for Later Use
    setToken(responseBody.access_token, responseBody.token_type, responseBody.expires_in);
  } catch (error) {
    console.error("🚨 Unexpected Error During Auth Token Request:", error);
    throw error;
  } finally {
    await browser.close();
  }
});