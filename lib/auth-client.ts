// This file is needed for OAuth login such as Google and Github,So when User come and Click on Sign-in With Google or Github then user will be redirected to my app i.e SnapCast's Main page and by better-auth User will get session in cookies  

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});
