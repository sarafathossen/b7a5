"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginAction, LoginState } from "@/app/(auth)/_actions/authAction";

export default function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    loginAction,
    null
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || "Login successful!");

      
      if (state.data?.user) {
        localStorage.setItem("user", JSON.stringify(state.data.user));
      } else if (state.role) {
        localStorage.setItem("user", JSON.stringify({ role: state.role }));
      }

      
      const role = state.role?.toUpperCase();
      if (role === "ADMIN") {
        router.push("/admin-dashboard");
      } else if (role === "PROVIDER" || role === "AUTHOR") {
        router.push("/provider-dashboard");
      } else {
        router.push("/dashboard");
      }

      router.refresh();
    } else if (state && !state.success) {
      toast.error(state.message || "Invalid credentials!");
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          name="email"
          required
          placeholder="your@email.com"
          className="w-full rounded-md border p-2.5 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Password</label>
        <input
          type="password"
          name="password"
          required
          placeholder="••••••••"
          className="w-full rounded-md border p-2.5 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-primary p-2.5 text-white font-semibold transition hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}