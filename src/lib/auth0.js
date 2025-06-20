// lib/auth0.js
import { NextResponse } from "next/server";

import { Auth0Client } from "@auth0/nextjs-auth0/server";

// Initialize the Auth0 client
export const auth0 = new Auth0Client({
  // Options are loaded from environment variables by default
  // Ensure necessary environment variables are properly set
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  appBaseUrl: process.env.APP_BASE_URL,
  secret: process.env.AUTH0_SECRET,

  authorizationParameters: {
    // In v4, the AUTH0_SCOPE and AUTH0_AUDIENCE environment variables for API authorized applications are no longer automatically picked up by the SDK.
    // Instead, we need to provide the values explicitly.
    scope: process.env.AUTH0_SCOPE,
    audience: process.env.AUTH0_AUDIENCE,
  },

  async onCallback(error, context, session) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.tokenSet.accessToken}`,
          },
          // body: JSON.stringify({
          //   name: "test",
          // }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to register user");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
    return NextResponse.redirect(
      new URL(context.returnTo || "/", process.env.APP_BASE_URL)
    );
  },
});
