'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminFetchJson } from '@/lib/adminApi';
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
}

interface UserProfileSidePanelProps {
  user: User;
  onClose: () => void;
}

export default function UserProfileSidePanel({ user, onClose }: UserProfileSidePanelProps) {
  const queryClient = useQueryClient();
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
      : 'Unknown');

  const suspendMutation = useMutation({
    mutationFn: async () => {
      const newStatus = user.status?.toLowerCase() === 'suspended' ? 'active' : 'suspended';
      return adminFetchJson<User>(`/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const promoteMutation = useMutation({
    mutationFn: async () => {
      return adminFetchJson<User>(`/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify({ role: 'admin' }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      onClose();
    },
  });

  return (
    <aside className="w-96 bg-surface-container-lowest rounded-lg shadow-xl flex flex-col overflow-hidden border border-outline-variant/10">
      <div className="p-6 bg-primary-container/10 border-b border-outline-variant/10">
        <div className="flex justify-between items-start mb-4">
          <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
            {user.role}
          </span>
          <button className="p-1 hover:bg-primary/10 rounded-full" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="text-center">
          <div className="w-24 h-24 rounded-full mx-auto overflow-hidden border-4 border-white shadow-md bg-surface-container-high">
            {imgSrc ? (
              <img className="w-full h-full object-cover" src={imgSrc} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-on-surface-variant">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h3 className="mt-4 text-xl font-headline font-extrabold text-on-surface">
            {displayName}
          </h3>
          <p className="text-on-surface-variant text-sm">{user.email}</p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              className="px-4 py-2 bg-inverse-surface text-inverse-on-surface rounded-full text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              onClick={() => suspendMutation.mutate()}
              disabled={suspendMutation.isPending}
            >
              {suspendMutation.isPending
                ? '...'
                : user.status?.toLowerCase() === 'suspended'
                  ? 'Unsuspend User'
                  : 'Suspend User'}
            </button>
            <button
              className="px-4 py-2 bg-primary text-on-primary rounded-full text-xs font-bold hover:shadow-lg transition-all disabled:opacity-50"
              onClick={() => promoteMutation.mutate()}
              disabled={user.role === 'admin' || promoteMutation.isPending}
            >
              {promoteMutation.isPending
                ? '...'
                : user.role === 'admin'
                  ? 'Already Admin'
                  : 'Promote Admin'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-surface-container rounded-lg text-center">
            <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold mb-1">
              Reviews
            </p>
            <p className="text-2xl font-black text-primary">--</p>
          </div>
          <div className="p-4 bg-surface-container rounded-lg text-center">
            <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold mb-1">
              Businesses
            </p>
            <p className="text-2xl font-black text-secondary">--</p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">info</span>
            Account Details
          </h4>
          <div className="space-y-3 p-4 bg-surface rounded-lg border border-outline-variant/10">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Role</span>
              <span className="font-bold">{user.role}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Status</span>
              <span
                className={`font-bold ${user.status?.toLowerCase() === 'active' ? 'text-secondary' : 'text-tertiary'}`}
              >
                {user.status}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Joined</span>
              <span className="font-bold">{joinDate}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">rate_review</span>
            Recent Activity
          </h4>
          <div className="text-center text-sm text-on-surface-variant py-8">
            Activity data will appear once the analytics integration is complete.
          </div>
        </div>
      </div>

      <div className="p-6 bg-surface-container-low border-t border-outline-variant/10 text-center">
        <button className="text-primary text-xs font-bold flex items-center justify-center gap-1 mx-auto hover:underline">
          View Full System Audit Log
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </aside>
  );
}
