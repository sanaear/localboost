'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchCurrentAdminUser } from '@/lib/adminApi';
import { resolveMediaUrl } from '@/lib/api';

interface AdminUserBadgeProps {
  showText?: boolean;
  avatarSize?: 'sm' | 'md';
  className?: string;
}

function getDisplayName(user: Awaited<ReturnType<typeof fetchCurrentAdminUser>> | undefined) {
  if (!user) return 'Admin User';
  return [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email || 'Admin User';
}

export default function AdminUserBadge({
  showText = true,
  avatarSize = 'md',
  className = '',
}: AdminUserBadgeProps) {
  const { data: user } = useQuery({
    queryKey: ['current-admin-user'],
    queryFn: fetchCurrentAdminUser,
    retry: false,
  });

  const displayName = getDisplayName(user);
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
  const sizeClass = avatarSize === 'sm' ? 'h-8 w-8 text-xs' : 'h-10 w-10 text-sm';
  const avatarSrc = resolveMediaUrl(user?.profile_image);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showText ? (
        <div className="text-right">
          <p className="text-xs font-bold text-on-surface">{displayName}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-tighter">
            {user?.role === 'admin' ? 'Super Admin' : user?.role || 'Admin'}
          </p>
        </div>
      ) : null}
      {avatarSrc ? (
        <img
          alt="Admin Profile Avatar"
          className={`${sizeClass} rounded-full border-2 border-primary-container object-cover`}
          src={avatarSrc}
        />
      ) : (
        <div
          aria-label="Admin Profile Avatar"
          className={`${sizeClass} grid place-items-center rounded-full border-2 border-primary-container bg-primary-container font-extrabold text-on-primary-container`}
        >
          {initials || 'A'}
        </div>
      )}
    </div>
  );
}
