"use client";

import { useState, useEffect } from "react";
import { Users, Shield, Edit2, Trash2, UserPlus, X, Check } from "lucide-react";
import type { Profile, Role } from "@/lib/permissions";

const ROLES: { value: Role; label: string; color: string }[] = [
  { value: "super_admin", label: "Super Admin", color: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400" },
  { value: "editor", label: "Editor", color: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400" },
  { value: "journalist", label: "Journalist", color: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" },
  { value: "photographer", label: "Photographer", color: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400" },
  { value: "social_manager", label: "Social Manager", color: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400" },
];

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ username: "", email: "", display_name: "", role: "journalist" as Role });

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inviteForm),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => [...prev, data.user]);
        setShowInvite(false);
        setInviteForm({ username: "", email: "", display_name: "", role: "journalist" });
      }
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {}
  };

  const handleStatusToggle = async (user: Profile) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)));
      }
    } catch {}
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Team Members</h1>
          <p className="text-sm text-gray-500 mt-0.5">{users.length} users</p>
        </div>
        <button onClick={() => setShowInvite(true)}
          className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <UserPlus size={16} />
          Invite Member
        </button>
      </div>

      {showInvite && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowInvite(false)}>
          <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white">Invite Team Member</h3>
              <button onClick={() => setShowInvite(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Username</label>
                <input type="text" required value={inviteForm.username} onChange={(e) => setInviteForm({ ...inviteForm, username: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Email</label>
                <input type="email" required value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Display Name</label>
                <input type="text" required value={inviteForm.display_name} onChange={(e) => setInviteForm({ ...inviteForm, display_name: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Role</label>
                <select value={inviteForm.role} onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as Role })}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand">
                  {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">
                Add Member
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500 text-sm">Loading users...</div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-zinc-800">
                {["Name", "Email", "Role", "Articles", "Status", ""].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((m) => {
                const roleConfig = ROLES.find((r) => r.value === m.role) ?? ROLES[0];
                return (
                  <tr key={m.id} className="border-b border-gray-100 dark:border-zinc-800 last:border-0 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
                          <Users size={14} className="text-gray-500" />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{m.display_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">{m.email}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1 w-fit ${roleConfig.color}`}>
                        <Shield size={10} />
                        {roleConfig.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">{m.article_count ?? 0}</td>
                    <td className="px-5 py-3">
                      <button onClick={() => handleStatusToggle(m)}
                        className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                          m.status === "active"
                            ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                            : "bg-gray-100 dark:bg-zinc-800 text-gray-500"
                        }`}>
                        {m.status === "active" ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleDelete(m.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-12 text-gray-500 text-sm">No users found.</div>
          )}
        </div>
      )}
    </div>
  );
}
