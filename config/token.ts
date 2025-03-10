export let tokenData = {
  access_token: "",
  token_type: "Bearer",
  expires_in: 0,
};

export function setToken(token: string, type: string, expires: number) {
  tokenData.access_token = token;
  tokenData.token_type = type;
  tokenData.expires_in = expires;
}