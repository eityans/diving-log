"use client";
import { redirect } from "next/navigation";
import { getAccessToken } from "@auth0/nextjs-auth0";

export default async function RegisterUser() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    redirect("/");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: "test",
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to register user");
    }
  } catch (error) {
    console.error("Registration error:", error);
  }

  redirect("/");
}
