import { APIRequestContext } from "@playwright/test";
import { credentials } from "../config/credentials";
import { tokenData, loadToken } from "../config/token"; // Load token function

export async function makeApiRequest(apiContext: APIRequestContext, endpoint: string) {
  // 🔄 Load the token before making requests
  loadToken();

  // 🛠 Check if the token exists
  if (!tokenData.access_token) {
    console.error("❌ No authentication token found. Attempting to fetch a new one...");
    throw new Error("❌ No authentication token found. Run auth.test.ts first.");
  }

  const url = `${credentials.baseUrl}${endpoint}`;
  console.log(`🔄 Requesting: ${url}`);
  console.log(`🛠 Using Token: ${tokenData.token_type} ${tokenData.access_token.substring(0, 20)}... (truncated)`); // Prevents full token exposure

  try {
    const response = await apiContext.get(url, {
      headers: {
        "Accept": "application/json",
        "Authorization": `${tokenData.token_type} ${tokenData.access_token}`,
      },
    });

    console.log(`📢 Response Status: ${response.status()}`);

    if (response.status() === 401 || response.status() === 403) {
      console.error(`🚨 Unauthorized Request:`, await response.text());
      throw new Error(`❌ Unauthorized: Token might be expired or invalid. Run auth.test.ts again.`);
    }

    if (response.status() !== 200) {
      console.error(`❌ API failed:`, await response.text());
      throw new Error(`GET ${url} failed with status ${response.status()}`);
    }

    return response.json();
  } catch (error) {
    console.error("🚨 API Request Failed:", error);
    throw error;
  }
}