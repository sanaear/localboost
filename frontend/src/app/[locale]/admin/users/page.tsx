'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import AdminUserBadge from '@/components/admin/AdminUserBadge';
import UserTable from '@/components/admin/users/UserTable';
import UserProfileSidePanel from '@/components/admin/users/UserProfileSidePanel';
import { adminFetchJson } from '@/lib/adminApi';

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  joinDate?: string;
  created_at?: string;
  status: string;
  isSelected?: boolean;
  profile_image?: string;
  first_name?: string;
  last_name?: string;
}

export default function UsersPage() {
  const t = useTranslations('admin.users');
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  function mapUser(raw: any): User {
    return {
      id: raw.id,
      name:
        raw.name ||
        `${raw.first_name || ''} ${raw.last_name || ''}`.trim() ||
        raw.email ||
        'Unknown',
      email: raw.email,
      avatar: raw.profile_image || undefined,
      role: raw.role,
      created_at: raw.created_at,
      status: raw.status || 'active',
      isSelected: false,
    };
  }

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users', search, roleFilter, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      if (roleFilter) params.set('role', roleFilter);
      if (statusFilter) params.set('status', statusFilter);
      const query = params.toString();
      const raw = await adminFetchJson(`/users${query ? `?${query}` : ''}`);
      return Array.isArray(raw) ? raw.map(mapUser) : [];
    },
    retry: false,
  });

  const statusMutation = useMutation({
    mutationFn: async (user: User) => {
      const nextStatus = user.status?.toLowerCase() === 'suspended' ? 'active' : 'suspended';
      return adminFetchJson<User>(`/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: nextStatus }),
      });
    },
    onSuccess: (updated: User) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setSelectedUser((current) => (current?.id === updated.id ? { ...current, ...updated } : current));
    },
  });

  return (
    <>
      <div className="absolute inset-0 zellige-pattern pointer-events-none"></div>

      <header className="sticky top-0 z-40 bg-[#F9F9F7] flex justify-between items-center px-8 py-4 w-full shadow-sm border-b border-surface-container-low">
        <div className="flex items-center gap-8">
          <div className="relative group">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <span className="material-symbols-outlined">search</span>
            </span>
            <input
              className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm w-80 focus:ring-2 focus:ring-primary-container transition-all"
              placeholder={t('searchPlaceholder')}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-600 hover:bg-[#F4F4F2] rounded-full transition-colors active:scale-95">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-slate-600 hover:bg-[#F4F4F2] rounded-full transition-colors active:scale-95">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="h-8 w-[1px] bg-surface-container-low mx-2"></div>
          <AdminUserBadge showText={false} avatarSize="sm" />
        </div>
      </header>

      <div className="p-8 max-w-7xl mx-auto flex gap-8">
        <UserTable
          users={users}
          onSelect={setSelectedUser}
          selectedId={selectedUser?.id ?? null}
          onToggleStatus={(user) => statusMutation.mutate(user)}
          statusActionUserId={statusMutation.variables?.id ?? null}
          roleFilter={roleFilter}
          statusFilter={statusFilter}
          onRoleFilterChange={(value) => {
            setRoleFilter(value);
            setSelectedUser(null);
          }}
          onStatusFilterChange={(value) => {
            setStatusFilter(value);
            setSelectedUser(null);
          }}
        />
        {selectedUser && (
          <UserProfileSidePanel user={selectedUser} onClose={() => setSelectedUser(null)} />
        )}
      </div>
    </>
  );
}
