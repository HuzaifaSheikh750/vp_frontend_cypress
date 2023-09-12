export const config = {
  appId: import.meta.env.VITE_APP_ID || "",
  redirectUri: import.meta.env.VITE_REDIRECT_URI || "",
  scopes: ["user.read"],
  authority: "https://login.microsoftonline.com/common"
};
