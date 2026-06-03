// filepath: src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import { multiSessionClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:3000",
  plugins: [multiSessionClient()],
});

export const { signIn, signUp, signOut, useSession, updateUser, changePassword } = authClient;
