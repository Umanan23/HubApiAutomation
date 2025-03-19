import { test, expect } from "@playwright/test";
import { credentials } from "../../config/credentials";
import { setToken } from "../../config/token";

test("POST /iam/token - Generate Auth Token", async ({ request }) => {
  console.log("🔄 Requesting Authentication Token...");

  // ✅ Debugging: Check if credentials are being loaded
  console.log("🔍 Debug: Loaded credentials:", credentials);

  try {
    const response = await request.post(`${credentials.baseUrl}/iam/token`, {
      headers: {
        "Content-Type": "application/json",  // ✅ Ensure correct content type
      },
      data: {
        grant_type: "password",
        username: credentials.username,
        password: credentials.password,
      },
    });

    console.log(`📢 Response Status: ${response.status()}`);

    // ✅ Debugging: Log full response in case of failure
    if (response.status() !== 200) {
      const errorBody = await response.text();
      console.error(`❌ Authentication Failed:`, errorBody);
      
      // ✅ Throwing detailed error message for CI debugging
      throw new Error(`Failed to fetch auth token - Status: ${response.status()}\nResponse Body: ${errorBody}`);
    }

    const responseBody = await response.json();
    console.log("✅ Generated Token:", responseBody.access_token);

    // ✅ Save Token for Later Use
    setToken(responseBody.access_token, responseBody.token_type, responseBody.expires_in);
  } catch (error) {
    console.error("🚨 Unexpected Error During Auth Token Request:", error);
    throw error;
  }
});