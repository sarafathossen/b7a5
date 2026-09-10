"use client";

import { useEffect, useState } from "react";
import { getAllUsersAction, updateUserStatusAction, updateUserRoleAction } from "../action"; 
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { toast } from "sonner"; 

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
    const userId = userObj.id || userObj._id;

    if (!userId) {
      toast.error("Invalid User ID");
      return;
    }

    const isCurrentlySuspended = userObj.status === "SUSPENDED" || Boolean(userObj.isBlocked);
    const res = await updateUserStatusAction(userId, !isCurrentlySuspended);

    if (res.success) {
      toast.success(res.message || "User status updated successfully");
      fetchUsers();
    } else {
      toast.error(res.message || "Failed to update status");
    }
  };

  
  const handleRoleChange = async (userId: string, newRole: string) => {
    const res = await updateUserRoleAction(userId, newRole);

    if (res.success) {
      toast.success(res.message || "User role updated successfully");
      fetchUsers();
    } else {
      toast.error(res.message || "Failed to update user role");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-sm text-muted-foreground">Manage user accounts, status, and system roles.</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground">Loading users...</div>
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-accent/50 border-b text-muted-foreground">
              <tr>
                <th className="p-4">User ID</th>
                <th className="p-4">Email / Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => {
                const userId = u.id || u._id;
                const isSuspended = u.status === "SUSPENDED" || Boolean(u.isBlocked);

                return (
                  <tr key={userId} className="hover:bg-accent/20">
                    <td className="p-4 font-mono text-xs">{userId}</td>
                    <td className="p-4 font-medium">{u.email || u.name || "N/A"}</td>
                    
                    
                    <td className="p-4">
                      <select
                        value={u.role || "CUSTOMER"}
                        onChange={(e) => handleRoleChange(userId, e.target.value)}
                        className="p-1.5 border rounded-lg text-xs bg-background cursor-pointer font-semibold uppercase"
                      >
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="PROVIDER">PROVIDER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>

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