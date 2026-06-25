import { Users, Shield, Edit2, Trash2, UserPlus } from "lucide-react";

const teamMembers = [
  { name: "Admin User", email: "admin@kefelmedia.com", role: "Super Admin", articles: 45, status: "Active" },
  { name: "Sarah Williams", email: "sarah@kefelmedia.com", role: "Editor", articles: 28, status: "Active" },
  { name: "James Mukasa", email: "james@kefelmedia.com", role: "Journalist", articles: 34, status: "Active" },
  { name: "Grace Nakato", email: "grace@kefelmedia.com", role: "Journalist", articles: 22, status: "Active" },
  { name: "Peter Okello", email: "peter@kefelmedia.com", role: "Photographer", articles: 15, status: "Inactive" },
];

export default function UsersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Team Members</h1>
          <p className="text-sm text-gray-500 mt-0.5">{teamMembers.length} users</p>
        </div>
        <button className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <UserPlus size={16} />
          Invite Member
        </button>
      </div>

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
            {teamMembers.map((m) => (
              <tr key={m.email} className="border-b border-gray-100 dark:border-zinc-800 last:border-0">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
                      <Users size={14} className="text-gray-500" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{m.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-gray-500">{m.email}</td>
                <td className="px-5 py-3">
                  <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 flex items-center gap-1 w-fit">
                    <Shield size={10} />
                    {m.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-gray-500">{m.articles}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                    m.status === "Active" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-gray-100 dark:bg-zinc-800 text-gray-500"
                  }`}>{m.status}</span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-blue-500"><Edit2 size={14} /></button>
                    <button className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
