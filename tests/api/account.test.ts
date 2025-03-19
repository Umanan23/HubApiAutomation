import { test, expect } from "@playwright/test";
import { makeApiRequest } from "../../services/apiService";
import { tokenData, loadToken } from "../../config/token";

test.describe("Anaconda API Tests - Account", () => {
  let apiContext: any;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext();
  });

  async function verifyApiResponse(endpoint: string, expectedProperties: string[]) {
    console.log(`🔄 Requesting: ${endpoint}`);

    try {
      const responseBody = await makeApiRequest(apiContext, endpoint);
      console.log(`✅ API Response for ${endpoint}:`, responseBody);

      // ✅ Ensure response contains expected properties
      expect(responseBody).toBeDefined();
      expectedProperties.forEach(property => {
        expect(responseBody).toHaveProperty(property);
      });

      console.log(`🟢 Verified API ${endpoint} successfully!`);
    } catch (error) {
      console.error(`🚨 Error in API ${endpoint}:`, error);
      throw new Error(`❌ API ${endpoint} failed. Check logs for details.`);
    }
  }

  test("GET /account - Fetch user account details", async () => {
    await verifyApiResponse("/account", ["user", "user.email"]);
  });

  test("GET /account/features - Fetch user feature flags", async () => {
    await verifyApiResponse("/account/features", []);
  });

  test("GET /account/notebooks - Fetch Notebooks User Info", async () => {
    await verifyApiResponse("/account/notebooks", [
      "id",
      "first_name",
      "last_name",
      "email",
      "notebooks_service_subscription"
    ]);
  });

  test("GET /account/notebooks/pythonanywhere/api-key - Fetch Notebook PythonAnywhere API Key", async () => {
    await verifyApiResponse("/account/notebooks/pythonanywhere/api-key", []);
  });
});