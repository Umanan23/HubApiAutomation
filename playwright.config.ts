import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    baseURL: "https://stage.anaconda.com/api",
    extraHTTPHeaders: {
      Accept: "application/json",
    },
  },
  timeout: 30000,
  reporter: "html",
});