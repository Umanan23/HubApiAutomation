export let tokenData = {
  access_token: "",
  token_type: "Bearer",
  expires_in: 0,
  obtained_at: 0,
};

export function setToken(token: string, type: string, expires: number) {
  tokenData.access_token = token;
  tokenData.token_type = type;
  tokenData.expires_in = expires;
  tokenData.obtained_at = Date.now();
}

export function isTokenExpired() {
  const currentTime = Date.now();
  return (currentTime - tokenData.obtained_at) >= tokenData.expires_in * 1000;
}