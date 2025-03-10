import { test, expect, request } from "@playwright/test";
import { makeApiRequest } from "../../services/apiService";
import { tokenData } from "../../config/token";

test.describe("Anaconda API Tests - Account", () => {
  let apiContext: any;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext();
  });

  test("GET /account - Fetch user account details", async () => {
    const responseBody = await makeApiRequest(apiContext, "/account");
    console.log("✅ Account API Response:", responseBody);

    expect(responseBody).toHaveProperty("user");
    expect(responseBody.user).toHaveProperty("email");
  });

  test("GET /account/features - Fetch user feature flags", async () => {
    const responseBody = await makeApiRequest(apiContext, "/account/features");
    console.log("✅ Account Features API Response:", responseBody);

    expect(responseBody).toBeInstanceOf(Object);
  });
});