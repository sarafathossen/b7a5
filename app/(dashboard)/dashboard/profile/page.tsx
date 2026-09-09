"use client";

import { User, Mail, Shield } from "lucide-react";

export default function CustomerProfilePage() {
  return (
    <div className="p-6 max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account Profile</h1>
        <p className="text-sm text-muted-foreground">Your personal account details.</p>
      </div>

      <div className="border rounded-xl bg-card p-6 space-y-4">
        <div className="flex items-center gap-4 pb-4 border-b">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
            C
          </div>
          <div>
            <h3 className="font-bold text-lg">Customer User</h3>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Role: Customer</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Account Type:</span>
            <span className="font-medium">Customer</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Access:</span>
            <span className="font-medium">Gear Rental & Orders</span>
          </div>
        </div>
      </div>
    </div>
  );
}