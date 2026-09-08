"use client";

import { useEffect, useState } from "react";
import { getAllUsers, toggleUserStatus } from "../_actions/dashboardAction";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<any[]>([]);

  const loadData = async () => {
    const data = await getAllUsers();
    setUsers(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleBlock = async (id: string, currentActiveStatus: boolean) => {
    const res = await toggleUserStatus(id, !currentActiveStatus);
    if (res.success) {
      loadData();
    } else {
      alert(res.message || "Action failed");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Control Center</h1>

      <div className="border rounded-xl overflow-hidden bg-card">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted border-b">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u) => (
              <tr key={u._id || u.id}>
                <td className="p-3">
                  <p className="font-medium">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </td>
                <td className="p-3 uppercase text-xs font-bold">{u.role}</td>
                <td className="p-3 font-semibold">
                  {u.isActive !== false ? "Active" : "Blocked"}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => handleToggleBlock(u._id || u.id, u.isActive !== false)}
                    className={`px-3 py-1 text-white rounded text-xs ${
                      u.isActive !== false ? "bg-red-600" : "bg-green-600"
                    }`}
                  >
                    {u.isActive !== false ? "Block" : "Unblock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}