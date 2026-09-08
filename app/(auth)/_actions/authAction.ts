"use server";

import { cookies } from "next/headers";

export type LoginState = {
  success: boolean;
  statusCode?: number;
  message: string;
  data?: {
    token?: string;
    accessToken?: string;
  };
  token?: string;
} | null;

export const loginAction = async (
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> => {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    const payload = { email, password };

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    const token =
      result?.data?.token || result?.data?.accessToken || result?.token;

    if (res.ok && result?.success && token) {
      const cookieStore = await cookies();

      cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
        path: "/",
      });

      return {
        success: true,
        message: result?.message || "Login successful!",
        data: result?.data,
      };
    }

    return {
      success: false,
      message: result?.message || "Invalid credentials",
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong!";

    return {
      success: false,
      message: errorMessage,
    };
  }
};