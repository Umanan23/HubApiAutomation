import { APIRequestContext } from "@playwright/test";
import { credentials } from "../config/credentials";
import { tokenData } from "../config/token";  // Ensure this is correctly imported

export async function makeApiRequest(apiContext: APIRequestContext, endpoint: string) {
  const url = `${credentials.baseUrl}${endpoint}`;
  console.log(`🔄 Requesting: ${url}`);
  console.log(`🛠 Using Token: ${tokenData.token_type} ${tokenData.access_token}`);

  if (!tokenData.access_token) {
    throw new Error("❌ No authentication token found. Run auth.test.ts first.");
  }

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