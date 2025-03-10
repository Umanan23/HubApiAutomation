import { APIRequestContext } from "@playwright/test";
import { credentials } from "../config/credentials";
import { setToken } from "../config/token";  // ✅ Correct import

export async function makeApiRequest(apiContext: APIRequestContext, endpoint: string) {
  const url = `${credentials.baseUrl}${endpoint}`;
  console.log(`🔄 Requesting: ${url}`);

  // ✅ Get latest token dynamically
  const tokenData = { token_type: "Bearer", access_token: "your_access_token" }; // Replace with actual token data retrieval logic

  const response = await apiContext.get(url, {
    headers: {
      "Accept": "application/json",
      "Authorization": `${tokenData.token_type} ${tokenData.access_token}`,
    },
  });

  console.log(`📢 Response Status: ${response.status()}`);

  if (response.status() !== 200) {
    console.error(`❌ API failed:`, await response.text());
    throw new Error(`GET ${url} failed with status ${response.status()}`);
  }

  return response.json();
}
