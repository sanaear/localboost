'use client';

import { resolveMediaUrl } from '@/lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  profile_image?: string;
  first_name?: string;
  last_name?: string;
  role: string;
  joinDate?: string;
  created_at?: string;
  status: string;
  isSelected?: boolean;
}

interface UserTableProps {
  users: User[];
  onSelect: (_user: User) => void;
  selectedId: number | null;
  onToggleStatus?: (_user: User) => void;
  statusActionUserId?: number | null;
  roleFilter: string;
  statusFilter: string;
  onRoleFilterChange: (_value: string) => void;
  onStatusFilterChange: (_value: string) => void;
}

function getRoleStyle(role: string): string {
  const r = role?.toLowerCase() || '';
  if (r.includes('owner') || r === 'merchant')
    return 'bg-secondary-container text-on-secondary-container';
  if (r === 'admin') return 'bg-primary-container text-on-primary-container';
  return 'bg-surface-variant text-on-surface-variant';
}

function getStatusStyle(status: string): { text: string; dot: string } {
  const s = status?.toLowerCase() || '';
  if (s === 'active') return { text: 'text-secondary', dot: 'bg-secondary' };
  if (s === 'suspended') return { text: 'text-tertiary', dot: 'bg-tertiary' };
  return { text: 'text-on-surface-variant', dot: 'bg-outline-variant' };
}

export default function UserTable({
  users,
  onSelect,
  selectedId,
  onToggleStatus,
  statusActionUserId,
  roleFilter,
  statusFilter,
  onRoleFilterChange,
  onStatusFilterChange,
}: UserTableProps) {
  return (
    <section className="flex-1">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-headline font-bold text-on-surface">User Management</h2>
          <p className="text-on-surface-variant mt-1">
            Manage and audit the LocalBoost community members.
          </p>
        </div>
        <div className="flex gap-3">
          <select
            className="bg-surface-container-lowest border-outline-variant/20 rounded-lg text-sm px-4 py-2 focus:ring-primary"
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="tourist">Tourist</option>
            <option value="merchant">Shop Owner</option>
            <option value="admin">Admin</option>
          </select>
          <select
            className="bg-surface-container-lowest border-outline-variant/20 rounded-lg text-sm px-4 py-2 focus:ring-primary"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
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
            {users.map((user) => {
              const isSelected = user.id === selectedId;
              const imgSrc = resolveMediaUrl(user.avatar || user.profile_image);
              const displayName =
                user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown';
              const joinDate =
                user.joinDate ||
                (user.created_at
                  ? new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'N/A');
              const st = getStatusStyle(user.status);

              return (
                <tr
                  key={user.id}
                  className={`hover:bg-surface-container-low transition-colors ${isSelected ? 'bg-primary/5 border-l-4 border-primary' : 'hover:bg-primary/5'} cursor-pointer`}
                  onClick={() => onSelect(user)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high">
                        {imgSrc ? (
                          <img className="w-full h-full object-cover" src={imgSrc} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-on-surface-variant">
                            {displayName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{displayName}</p>
                        <p className="text-xs text-on-surface-variant">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getRoleStyle(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{joinDate}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`flex items-center gap-1.5 font-bold text-xs uppercase ${st.text}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${st.dot}`}></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        className="p-2 text-primary hover:bg-primary-container/20 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(user);
                        }}
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                      </button>
                      <button
                        className="p-2 text-tertiary hover:bg-tertiary-container/20 rounded-full"
                        aria-label={
                          user.status?.toLowerCase() === 'suspended'
                            ? `Unsuspend ${displayName}`
                            : `Suspend ${displayName}`
                        }
                        disabled={statusActionUserId === user.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleStatus?.(user);
                        }}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {statusActionUserId === user.id
                            ? 'progress_activity'
                            : user.status?.toLowerCase() === 'suspended'
                            ? 'settings_backup_restore'
                            : 'block'}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
