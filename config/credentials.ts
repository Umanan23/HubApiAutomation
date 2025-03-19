import dotenv from "dotenv";
dotenv.config();

export const credentials = {
  baseUrl: process.env.API_BASE_URL || "https://stage.anaconda.com/api",
  username: process.env.API_USERNAME || "",
  password: process.env.API_PASSWORD || "",
};

console.log("🔍 Debug: Loaded credentials:", credentials);