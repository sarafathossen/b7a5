"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation"; // ১. redirect ইম্পোর্ট করুন

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

export const loginAction = async (prevstate: LoginState, formData: FormData): Promise<LoginState> => {
    let isSuccess = false;

    try {
        const email = formData.get("email");
        const password = formData.get("password");

        const payload = {
            email,
            password,
        };

        const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await res.json();
        const token = result?.data?.token || result?.data?.accessToken || result?.token;

        if (result?.success && token) {
            const cookieStore = await cookies();
            
            cookieStore.set("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24,
                sameSite: "lax",
                path: "/",
            });

            isSuccess = true;
        }
        
        // try-catch এর বাইরে redirect করার সুবিধার্থে মান রাখা হলো
        if (!isSuccess) {
            return result;
        }

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Something went wrong!";
        
        return {
            success: false,
            message: errorMessage
        };
    }

    // ২. কুকি সেট হওয়ার পর ড্যাশবোর্ডে রিডাইরেক্ট করুন (try-catch ব্লকের বাইরে)
    if (isSuccess) {
        redirect("/dashboard"); // আপনার কাঙ্ক্ষিত রুট দিন (যেমন: /, /dashboard)
    }

    return null;
}