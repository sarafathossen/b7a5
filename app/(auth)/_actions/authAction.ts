"use server";

import { cookies } from "next/headers";
import { registerSchema } from "@/schemas/authSchema";
import { jwtDecode } from "jwt-decode";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface DecodedToken {
    role?: string;
    userRole?: string;
    roleName?: string;
    [key: string]: any;
}

// ==================== LOGIN ACTION ===================
export type LoginState = {
    success: boolean;
    statusCode?: number;
    message: string;
    data?: {
        token?: string;
        accessToken?: string;
        user?: {
            role?: string;
            roleName?: string;
            [key: string]: any;
        };
        role?: string;
        roleName?: string;
    };
    token?: string;
    role?: string;
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
            result?.data?.token ||
            result?.data?.accessToken ||
            result?.token ||
            result?.accessToken;

        let extractedRole: string | undefined = undefined;

        // ১. প্রথমে টোকেন ডিকোড করে রোল বের করার চেষ্টা করা
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                extractedRole =
                    decoded?.roleName || decoded?.role || decoded?.userRole;
            } catch {
                // Token decode fallback
            }
        }

        // ২. যদি টোকেনে না থাকে তবে রেসপন্স অবজেক্ট থেকে নেওয়া
        if (!extractedRole) {
            extractedRole =
                result?.data?.user?.role ||
                result?.data?.user?.roleName ||
                result?.user?.role ||
                result?.user?.roleName ||
                result?.data?.role ||
                result?.data?.roleName ||
                result?.role;
        }

        const userRole = extractedRole
            ? String(extractedRole).trim().toUpperCase()
            : "CUSTOMER";

        if (res.ok && (result?.success || token)) {
            const cookieStore = await cookies();

            if (token) {
                cookieStore.set("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 60 * 60 * 24,
                    sameSite: "lax",
                    path: "/",
                });
            }

            cookieStore.set("user_role", userRole, {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24,
                sameSite: "lax",
                path: "/",
            });

            return {
                success: true,
                message: result?.message || "Login successful!",
                data: result?.data || result,
                role: userRole,
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

// ==================== REGISTER ACTION ====================
export type RegisterState = {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
} | null;

export const registerAction = async (
    prevState: RegisterState,
    formData: FormData
): Promise<RegisterState> => {
    try {
        const rawRole = formData.get("role")?.toString() || "CUSTOMER";

        const rawData = {
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
            role: rawRole.trim().toUpperCase(),
        };

        const validatedData = registerSchema.safeParse(rawData);

        if (!validatedData.success) {
            return {
                success: false,
                message: "Validation failed. Please check your inputs.",
                errors: validatedData.error.flatten().fieldErrors,
            };
        }

        const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(validatedData.data),
        });

        const result = await res.json();

        if (res.ok && result?.success) {
            return {
                success: true,
                message: result?.message || "Account created successfully!",
            };
        }

        return {
            success: false,
            message: result?.message || "Registration failed. Try again.",
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

// ==================== LOGOUT ACTION ====================
export const logoutAction = async () => {
    const cookieStore = await cookies();

    cookieStore.delete("token");
    cookieStore.delete("user_role");

    return { success: true };
};


