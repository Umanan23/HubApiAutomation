import { test, expect } from "@playwright/test";
import { credentials } from "../../config/credentials";
import { setToken } from "../../config/token";

test("POST /iam/token - Generate Auth Token", async ({ request }) => {
  console.log("🔄 Requesting Authentication Token...");

  try {
    const response = await request.post(`${credentials.baseUrl}/iam/token`, {
      data: {
        grant_type: "password",
        username: credentials.username,
        password: credentials.password,
      },
    });

    console.log(`📢 Response Status: ${response.status()}`);

    if (response.status() !== 200) {
      console.error("❌ Authentication Failed:", await response.text());
      throw new Error(`Failed to fetch auth token - Status: ${response.status()}`);
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