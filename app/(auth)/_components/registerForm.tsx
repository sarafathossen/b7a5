"use client";

import React, { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { registerSchema, RegisterFormValues } from "@/schemas/authSchema";
import { registerAction } from "../_actions/authAction";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RegisterForm: React.FC = () => {
  const [state, action, pending] = useActionState(registerAction, null);
  const router = useRouter();

  const {
    register,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "CUSTOMER",
    },
  });

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success(state.message || "Registration successful!");
      router.push("/login");
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form action={action} className="space-y-4">
          
          <input type="hidden" name="role" value="CUSTOMER" />

          
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter Your Name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500 font-medium">
                {errors.name.message}
              </p>
            )}
            {state?.errors?.name && (
              <p className="text-xs text-red-500 font-medium">
                {state.errors.name[0]}
              </p>
            )}
          </div>

          
          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500 font-medium">
                {errors.email.message}
              </p>
            )}
            {state?.errors?.email && (
              <p className="text-xs text-red-500 font-medium">
                {state.errors.email[0]}
              </p>
            )}
          </div>

          
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-500 font-medium">
                {errors.password.message}
              </p>
            )}
            {state?.errors?.password && (
              <p className="text-xs text-red-500 font-medium">
                {state.errors.password[0]}
              </p>
            )}
          </div>

          
          <Button type="submit" disabled={pending} className="w-full mt-2">
            {pending ? "Creating Account..." : "Register"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;