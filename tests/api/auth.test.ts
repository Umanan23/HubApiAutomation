import { test, expect } from "@playwright/test";
import { credentials } from "../../config/credentials";
import { setToken } from "../../config/token";

test("POST /iam/token - Generate Auth Token", async ({ request }) => {
  console.log("🔄 Requesting Authentication Token...");
  console.log("🔍 Debug: Loaded credentials:", credentials);

  let retryCount = 0;
  let response;

  while (retryCount < 3) {
    response = await request.post(`${credentials.baseUrl}/iam/token`, {
      data: {
        grant_type: "password",
        username: credentials.username,
        password: credentials.password,
      },
    });

    console.log(`📢 Response Status: ${response.status()}`);

    if (response.status() === 200) break; // Success ✅

    console.error(`❌ Authentication Failed (Attempt ${retryCount + 1}/3)`);
    retryCount++;
    await new Promise((res) => setTimeout(res, 2000)); // Wait before retrying
  }

  if (response.status() !== 200) {
    throw new Error(`❌ Authentication failed after 3 attempts - Status: ${response.status()}`);
  }

  const responseBody = await response.json();
  console.log("✅ Generated Token:", responseBody.access_token);

  setToken(responseBody.access_token, responseBody.token_type, responseBody.expires_in);
});