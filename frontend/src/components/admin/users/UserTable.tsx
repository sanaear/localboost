"use client";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "Tourist" | "Shop Owner" | "Admin";
  joinDate: string;
  status: "Active" | "Suspended";
  isSelected?: boolean;
}

const users: User[] = [
  {
    id: "1",
    name: "Amine Alami",
    email: "amine.alami@example.ma",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtxtZ7mokQ_WjGsGZXX99S2R--dg8njXm1sYi8l1MU4qGA_sz0UCohjG-32GGMcHRq5HxlMEjSMIGbPwU7mUU4ojj76cSDjRtQc04sDTC5LE6FaouY2d_nsq_sbaUd1qewTY4Kr2mmZxjbOnfdI77UbEonjSCcSyqbvewPdBfYOL348RBmp9uhvxA5VSLwee6JkR-j5n89W6qrxeGV5HRBeUbLeqEFtMob4eD5-14MZGkIv5ZCCcKTbOD8RqhCJqFDAz8FmWCNAEA",
    role: "Shop Owner",
    joinDate: "Oct 12, 2023",
    status: "Active",
    isSelected: true,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@travel.com",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQqnGQkWcqv04_esKmWeFfC3zb-971IVjpv1h9iBbf-D-qNsJtKTLKTl5raXB_tBPtJujGu3310RMIj-QfjYoLQ9i30yq-NYN3oU9lfNhWgtsEKbpnQdvycrh0h6FsaX5664gtQpSayR99YaOgIah-8cDBBNBrb1OTkxjWkbBEzotgNL7pS6YqyxTaiyDObQYkUmPC62UNarW1QP9YeusrwWqqc-4T8ulE9ASohsoXoGhRexmo6mXKMK2pb2zPMAjbxVkfei9MbPM",
    role: "Tourist",
    joinDate: "Nov 05, 2023",
    status: "Active",
  },
  {
    id: "3",
    name: "Omar Kassimi",
    email: "o.kassimi@local.ma",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_7T6IG0pzDAVTg_bcCH5HxmAkBO1UH3_zAevcBFZAyaUcOCt_cht_Vd4S_t8sup53S0minbQ1Q0JvSsbBuMIGcXMRqZjmqEubWZF2l_PwSYPEeNuQvI22O3SpraykVY1EQ7nGvR1aUv3EeGhjRZqum0FNBQyArI7FeIezdCzR-STbMAM02PdiWnIZ-JFM5DDm_9vjY0L_33SrgRDp-Xkd-stRC73kUeGAQ_lhFmhdYmzlZEy2o8oCgQdRhIaOW5zFNLFHUI6csQ0",
    role: "Shop Owner",
    joinDate: "Jan 18, 2024",
    status: "Suspended",
  },
];

export default function UserTable() {
  return (
    <section className="flex-1">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-headline font-bold text-on-surface">
            User Management
          </h2>
          <p className="text-on-surface-variant mt-1">
            Manage and audit the LocalBoost community members.
          </p>
        </div>
        <div className="flex gap-3">
          <select className="bg-surface-container-lowest border-outline-variant/20 rounded-lg text-sm px-4 py-2 focus:ring-primary">
            <option>All Roles</option>
            <option>Tourist</option>
            <option>Shop Owner</option>
            <option>Admin</option>
          </select>
          <select className="bg-surface-container-lowest border-outline-variant/20 rounded-lg text-sm px-4 py-2 focus:ring-primary">
            <option>Active Status</option>
            <option>Suspended</option>
          </select>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-widest font-bold">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Join Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {users.map((user) => (
              <tr
                key={user.id}
                className={`hover:bg-surface-container-low transition-colors ${user.isSelected ? "bg-primary/5 border-l-4 border-primary" : "hover:bg-primary/5"} cursor-pointer`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      data-alt="User avatar"
                      src={user.avatar}
                    />
                    <div>
                      <p className="font-bold text-on-surface">{user.name}</p>
                      <p className="text-xs text-on-surface-variant">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${user.role === "Shop Owner" ? "bg-secondary-container text-on-secondary-container" : "bg-surface-variant text-on-surface-variant"}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">
                  {user.joinDate}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`flex items-center gap-1.5 font-bold text-xs uppercase ${user.status === "Active" ? "text-secondary" : "text-tertiary"}`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${user.status === "Active" ? "bg-secondary" : "bg-tertiary"}`}
                    ></span>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-primary hover:bg-primary-container/20 rounded-full">
                      <span className="material-symbols-outlined text-sm">visibility</span>
                    </button>
                    <button className="p-2 text-tertiary hover:bg-tertiary-container/20 rounded-full">
                      <span className="material-symbols-outlined text-sm">
                        {user.status === "Suspended" ? "settings_backup_restore" : "block"}
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
