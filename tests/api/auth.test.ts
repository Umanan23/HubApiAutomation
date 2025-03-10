import { test, expect } from "@playwright/test";
import { credentials } from "../../config/credentials";
import { setToken } from "../../config/token";

test("POST /iam/token - Generate Auth Token", async ({ request }) => {
  console.log("🔄 Requesting Authentication Token...");

  const response = await request.post(`${credentials.baseUrl}/iam/token`, {
    headers: {
      "Accept": "application/json",
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
    console.error("❌ Authentication Failed:", await response.text());
    throw new Error(`Failed to fetch auth token - Status: ${response.status()}`);
  }

  const responseBody = await response.json();
  console.log("✅ Generated Token:", responseBody.access_token);

  if (!responseBody.access_token) {
    throw new Error("❌ No access token received from API.");
  }

  // Save Token for Later Use
  setToken(responseBody.access_token, responseBody.token_type, responseBody.expires_in);
});