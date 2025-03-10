import * as fs from "fs";

export let tokenData = {
  access_token: "",
  token_type: "Bearer",
  expires_in: 0,
};

export function setToken(token: string, type: string, expires: number) {
  tokenData.access_token = token;
  tokenData.token_type = type;
  tokenData.expires_in = expires;

  // Save token to file
  fs.writeFileSync("./config/token.json", JSON.stringify(tokenData, null, 2));
}

export function loadToken() {
  try {
    const savedToken = fs.readFileSync("./config/token.json", "utf8");
    tokenData = JSON.parse(savedToken);
  } catch (error) {
    console.warn("⚠️ No token file found, running auth.test.ts might be required.");
  }
}