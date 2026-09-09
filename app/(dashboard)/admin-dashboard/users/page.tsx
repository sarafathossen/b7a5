"use client";

import { useEffect, useState } from "react";
import { getAllUsersAction, updateUserStatusAction } from "../action";
import { ShieldAlert, ShieldCheck } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await getAllUsersAction();
    if (res.success) {
      setUsers(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (userObj: any) => {
    // MongoDB/Prisma আইডি সঠিকভাবে ফিল্টার করা
    const userId = userObj.id || userObj._id;

    if (!userId) {
      alert("Invalid User ID");
      return;
    }

    // status Enum বা isBlocked বুলিয়ান থেকে বর্তমান স্টেট বের করা
    const isCurrentlySuspended = userObj.status === "SUSPENDED" || Boolean(userObj.isBlocked);
    
    // বর্তমান স্টেট স্থগিত থাকলে টগল করে false (Activate) পাঠাবে, অন্যথায় true (Suspend) পাঠাবে
    const res = await updateUserStatusAction(userId, !isCurrentlySuspended);

    if (res.success) {
      alert(res.message);
      fetchUsers();
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-sm text-muted-foreground">Manage customer and provider accounts status.</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground">Loading users...</div>
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-accent/50 border-b text-muted-foreground">
              <tr>
                <th className="p-4">User ID</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => {
                const userId = u.id || u._id;
                // ইউজার সাসপেন্ড আছে কিনা তা নিশ্চিত করা
                const isSuspended = u.status === "SUSPENDED" || Boolean(u.isBlocked);

                return (
                  <tr key={userId} className="hover:bg-accent/20">
                    <td className="p-4 font-mono text-xs">{userId}</td>
                    <td className="p-4 font-medium">{u.email || u.name || "N/A"}</td>
                    <td className="p-4 uppercase text-xs font-semibold">{u.role || "CUSTOMER"}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${isSuspended ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"}`}>
                        {isSuspended ? "Suspended" : "Active"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleBlock(u)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 ${
                          isSuspended ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-red-600 text-white hover:bg-red-700"
                        }`}
                      >
                        {isSuspended ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                        {isSuspended ? "Activate" : "Suspend"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}