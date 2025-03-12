import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// ✅ Load environment variables from .env file
dotenv.config({ path: ".env" });

// ✅ Define Base URL and Authentication Token from Environment Variables
const BASE_URL = process.env.BASE_URL || "https://stage.anaconda.com/api";
const BEARER_TOKEN = process.env.BEARER_TOKEN || "";

// ✅ Define Storage State Path (for persisting authentication)
export const STORAGE_STATE_PATH = path.join(__dirname, "playwright/.auth");

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: BASE_URL, // ✅ Set Base URL from environment variables
    trace: "retain-on-failure", // ✅ Capture traces only when tests fail
    screenshot: "only-on-failure", // ✅ Capture screenshots only on test failures
    headless: true, // ✅ Run in headless mode
    extraHTTPHeaders: {
      Authorization: `Bearer ${BEARER_TOKEN}`, // ✅ Attach Bearer token for API tests
    },
  },
  projects: [
    {
      name: "chromium",
      use: {
        launchOptions: {
          args: ["--disable-web-security"],
          slowMo: 0,
          headless: false, // ✅ Allow running in non-headless mode for debugging
        },
      },
    },
  ],
});

export { BASE_URL };