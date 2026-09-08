"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useActionState, useEffect } from "react";
import { loginAction } from "../_actions/authAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [state, action, pending] = useActionState(loginAction, null);
  const router = useRouter();

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success(state.message || "Logged in successfully!");
      // Toast দেখানোর পর ড্যাশবোর্ডে নেভিগেট করা
      router.push("/dashboard");
      router.refresh();
    } else {
      toast.error(state.message || "Login failed");
    }
  }, [state, router]);

  return (
    <div>
      <form action={action} className="space-y-4">
        <Card className="space-y-4 p-5">
          <Input
            name="email"
            type="email"
            placeholder="Enter Your Email"
            required
          />
          <Input
            name="password"
            type="password"
            placeholder="Enter Your Password"
            required
          />
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Submitting..." : "Login"}
          </Button>
        </Card>
      </form>
    </div>
  );
};

export default LoginForm;