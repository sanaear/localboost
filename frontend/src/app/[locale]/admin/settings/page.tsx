'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import AdminUserBadge from '@/components/admin/AdminUserBadge';
import { adminFetchJson, fetchCurrentAdminUser } from '@/lib/adminApi';

type RecentSession = {
  id?: string;
  device?: string;
  ip?: string;
  lastSeen?: string;
  current?: boolean;
};

type ServerHealth = {
  status?: string;
  uptimeSeconds?: number;
  memoryMb?: number;
  heapUsedMb?: number;
  lastChecked?: string;
};

type AdminSettings = {
  maintenanceMode?: boolean;
  maxPhotosPerBusiness?: number;
  aiModerationThreshold?: number;
  aiSchedule?: string;
  twoFactorAuth?: boolean;
  passwordRotationDays?: number;
  recentSessions?: RecentSession[];
  serverHealth?: ServerHealth;
};

function formatDuration(seconds?: number) {
  const value = Number(seconds) || 0;
  const days = Math.floor(value / 86400);
  const hours = Math.floor((value % 86400) / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function formatSessionTime(value?: string) {
  if (!value) return 'Unknown';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Active now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

function describeDevice(userAgent?: string) {
  const value = userAgent || 'Current browser';
  const browser = value.includes('Edg/')
    ? 'Edge'
    : value.includes('Chrome/')
      ? 'Chrome'
      : value.includes('Firefox/')
        ? 'Firefox'
        : value.includes('Safari/')
          ? 'Safari'
          : 'Browser';
  const os = value.includes('Windows')
    ? 'Windows'
    : value.includes('Mac OS')
      ? 'macOS'
      : value.includes('Android')
        ? 'Android'
        : value.includes('iPhone') || value.includes('iPad')
          ? 'iOS'
          : 'Unknown OS';
  return `${browser} on ${os}`;
}

function extractApiMessage(err: unknown): string {
  const message = typeof (err as any)?.message === 'string' ? (err as any).message : '';
  if (!message) return '';
  try {
    const parsed = JSON.parse(message) as { message?: unknown };
    if (typeof parsed?.message === 'string' && parsed.message.trim()) return parsed.message.trim();
  } catch {
    /* ignore */
  }
  return message;
}

export default function AdminSettingsPage() {
  const t = useTranslations('admin.settings');
  const queryClient = useQueryClient();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maxPhotos, setMaxPhotos] = useState(10);
  const [moderationThreshold, setModerationThreshold] = useState(0.5);
  const [aiSchedule, setAiSchedule] = useState('daily');
  const [passwordRotation, setPasswordRotation] = useState(90);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [saveBanner, setSaveBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const [editingAdmin, setEditingAdmin] = useState<any | null>(null);
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    profile_image: '',
  });
  const [profileError, setProfileError] = useState<string | null>(null);
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [newAdminError, setNewAdminError] = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      return adminFetchJson<AdminSettings>('/admin/settings');
    },
    retry: false,
  });

  const { data: currentAdmin } = useQuery({
    queryKey: ['current-admin-user'],
    queryFn: fetchCurrentAdminUser,
    retry: false,
  });

  const { data: adminProfiles = [] } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const users = await adminFetchJson<any[]>('/users?role=admin');
      return Array.isArray(users) ? users : [];
    },
    retry: false,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      if (!editingAdmin?.id) throw new Error('Missing admin id');
      const payload: Record<string, string> = {};
      if (profileForm.first_name.trim()) payload.first_name = profileForm.first_name.trim();
      if (profileForm.last_name.trim()) payload.last_name = profileForm.last_name.trim();
      if (profileForm.email.trim()) payload.email = profileForm.email.trim();
      if (profileForm.profile_image.trim()) payload.profile_image = profileForm.profile_image.trim();
      return adminFetchJson(`/users/${editingAdmin.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['current-admin-user'] });
      setEditingAdmin(null);
      setProfileError(null);
    },
    onError: () => {
      setProfileError('Failed to update profile.');
    },
  });

  function openEditProfile(target: any) {
    const resolved = target?.id ? target : currentAdmin;
    if (!resolved?.id) return;
    setEditingAdmin(resolved);
    setProfileError(null);
    setProfileForm({
      first_name: resolved.first_name || '',
      last_name: resolved.last_name || '',
      email: resolved.email || '',
      profile_image: resolved.profile_image || '',
    });
  }

  useEffect(() => {
    if (!data) return;
    if (data.maintenanceMode !== undefined) setMaintenanceMode(data.maintenanceMode);
    if (data.maxPhotosPerBusiness !== undefined) setMaxPhotos(data.maxPhotosPerBusiness);
    if (data.aiModerationThreshold !== undefined)
      setModerationThreshold(data.aiModerationThreshold);
    if (data.aiSchedule !== undefined) setAiSchedule(data.aiSchedule);
    if (data.passwordRotationDays !== undefined) setPasswordRotation(data.passwordRotationDays);
    if (data.twoFactorAuth !== undefined) setTwoFactorEnabled(data.twoFactorAuth);
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      return adminFetchJson('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      setSaveBanner({ type: 'success', message: 'Settings saved.' });
      setTimeout(() => setSaveBanner(null), 2500);
    },
    onError: () => {
      setSaveBanner({ type: 'error', message: 'Failed to save settings.' });
      setTimeout(() => setSaveBanner(null), 3000);
    },
  });

  const createAdminMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        email: newAdminForm.email.trim(),
        password: newAdminForm.password,
        role: 'admin',
        first_name: newAdminForm.first_name.trim(),
        last_name: newAdminForm.last_name.trim(),
      };
      if (!payload.email || !payload.password) {
        throw new Error('Email and password are required');
      }
      return adminFetchJson('/users', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
      setAddingAdmin(false);
      setNewAdminError(null);
      setNewAdminForm({ first_name: '', last_name: '', email: '', password: '' });
    },
    onError: (err: any) => {
      const apiMessage = extractApiMessage(err);
      if (apiMessage.toLowerCase().includes('already')) {
        setNewAdminError('Email is already registered.');
      } else if (
        apiMessage.toLowerCase().includes('no token') ||
        apiMessage.toLowerCase().includes('not authenticated') ||
        apiMessage.toLowerCase().includes('invalid token')
      ) {
        setNewAdminError('Your admin session expired. Please log in again.');
      } else {
        setNewAdminError(apiMessage || 'Failed to create admin.');
      }
    },
  });

  function resetToDefaults() {
    setMaintenanceMode(false);
    setMaxPhotos(10);
    setModerationThreshold(0.7);
    setAiSchedule('daily');
    setPasswordRotation(90);
    setTwoFactorEnabled(false);
    setSaveBanner(null);
  }

  const currentAdminName =
    [currentAdmin?.first_name, currentAdmin?.last_name].filter(Boolean).join(' ') ||
    currentAdmin?.email ||
    'Current Admin';
  const currentAdminInitials =
    currentAdminName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'A';
  const recentSessions = data?.recentSessions ?? [];
  const serverHealth = data?.serverHealth ?? {};

  return (
    <>
      <header className="flex justify-between items-center px-8 py-6 sticky top-0 glass-panel z-30">
        <div>
          <h2 className="text-2xl font-extrabold text-primary tracking-tight">{t('title')}</h2>
          <p className="text-on-surface-variant text-sm mt-1">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-600 hover:bg-surface-container-high rounded-full transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/20">
            <AdminUserBadge />
          </div>
        </div>
      </header>

      <div className="p-8 max-w-4xl space-y-10">
        <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">tune</span>
            General Configuration
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Maintenance Mode</p>
                <p className="text-sm text-on-surface-variant">
                  Disable public access during updates
                </p>
              </div>
              <button
                className={`w-14 h-7 rounded-full transition-colors relative ${maintenanceMode ? 'bg-primary' : 'bg-surface-container-high'}`}
                onClick={() => setMaintenanceMode(!maintenanceMode)}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${maintenanceMode ? 'translate-x-8' : 'translate-x-1'}`}
                ></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Max Photos per Business</p>
                <p className="text-sm text-on-surface-variant">Limit uploads to conserve storage</p>
              </div>
              <select
                className="bg-surface-container-low border rounded-lg px-4 py-2 text-sm"
                value={maxPhotos}
                onChange={(e) => setMaxPhotos(Number(e.target.value))}
              >
                {[5, 10, 15, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">AI Moderation Threshold</p>
                <p className="text-sm text-on-surface-variant">
                  Minimum toxicity score to auto-flag
                </p>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={moderationThreshold}
                onChange={(e) => setModerationThreshold(Number(e.target.value))}
                className="w-32"
              />
              <span className="text-sm font-bold w-12 text-right">
                {moderationThreshold.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">AI Description Generation</p>
                <p className="text-sm text-on-surface-variant">Schedule for batch processing</p>
              </div>
              <select
                className="bg-surface-container-low border rounded-lg px-4 py-2 text-sm"
                value={aiSchedule}
                onChange={(e) => setAiSchedule(e.target.value)}
              >
                <option value="manual">Manual Only</option>
                <option value="hourly">Every Hour</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">security</span>
            Security & Backups
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Two-Factor Authentication</p>
                <p className="text-sm text-on-surface-variant">
                  Require 2FA for all admin accounts
                </p>
              </div>
              <button
                className={`w-14 h-7 rounded-full transition-colors relative ${twoFactorEnabled ? 'bg-primary' : 'bg-surface-container-high'}`}
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${twoFactorEnabled ? 'translate-x-8' : 'translate-x-1'}`}
                ></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Password Rotation (days)</p>
                <p className="text-sm text-on-surface-variant">Force password change interval</p>
              </div>
              <select
                className="bg-surface-container-low border rounded-lg px-4 py-2 text-sm"
                value={passwordRotation}
                onChange={(e) => setPasswordRotation(Number(e.target.value))}
              >
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
                <option value={180}>180 days</option>
                <option value={0}>Never</option>
              </select>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary">admin_panel_settings</span>
            Admin Profiles
          </h3>
          <div className="space-y-4">
            {(adminProfiles.length > 0
              ? adminProfiles
              : [
                  {
                    email: currentAdmin?.email,
                    first_name: currentAdmin?.first_name,
                    last_name: currentAdmin?.last_name,
                    role: currentAdmin?.role,
                  },
                ]
            ).map((admin: any, index: number) => {
              const name =
                [admin.first_name, admin.last_name].filter(Boolean).join(' ') ||
                admin.email ||
                (index === 0 ? currentAdminName : 'Admin');
              const initials =
                name
                  .split(/\s+/)
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part: string) => part[0]?.toUpperCase())
                  .join('') || currentAdminInitials;

              return (
                <div
                  key={admin.id ?? admin.email ?? index}
                  className="flex items-center gap-4 p-4 bg-surface-container rounded-lg"
                >
                  <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
                    <span className="text-sm font-extrabold text-on-primary-container">
                      {initials}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{name}</p>
                    <p className="text-sm text-on-surface-variant">
                      {admin.email || 'Signed-in administrator'} -{' '}
                      {admin.role === 'admin' ? 'Super Admin' : admin.role || 'Admin'}
                    </p>
                  </div>
                  <button
                    className="px-4 py-2 rounded-full border border-outline-variant text-sm font-bold hover:bg-surface-container-low transition-colors"
                    onClick={() => openEditProfile(admin)}
                    type="button"
                  >
                    Edit Profile
                  </button>
                </div>
              );
            })}
          </div>

          <button
            className="mt-6 w-full py-3 rounded-full border-2 border-dashed border-outline-variant text-sm font-bold text-on-surface-variant hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
            type="button"
            onClick={() => {
              setNewAdminError(null);
              setAddingAdmin(true);
            }}
          >
            <span className="material-symbols-outlined">add</span>
            Add New Admin
          </button>
        </section>

        <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">history</span>
            Recent Sessions
          </h3>
          <div className="space-y-4">
            {recentSessions.length > 0 ? (
              recentSessions.map((session, index) => (
                <div
                  key={session.id ?? index}
                  className="flex items-center justify-between p-4 bg-surface-container rounded-lg"
                >
                  <div>
                    <p className="font-bold">{describeDevice(session.device)}</p>
                    <p className="text-sm text-on-surface-variant">
                      IP: {session.ip || 'unknown'} - {formatSessionTime(session.lastSeen)}
                    </p>
                  </div>
                  {session.current ? (
                    <span className="text-secondary text-xs font-bold flex items-center gap-1">
                      <span className="w-2 h-2 bg-secondary rounded-full"></span>
                      Current
                    </span>
                  ) : (
                    <button className="text-error text-xs font-bold">Revoke</button>
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 bg-surface-container rounded-lg text-sm text-on-surface-variant">
                No recent sessions recorded.
              </div>
            )}
          </div>
        </section>

        <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">monitor_heart</span>
            Server Health
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="p-4 bg-surface-container rounded-lg text-center">
              <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold mb-1">
                Status
              </p>
              <p className="text-2xl font-black text-secondary capitalize">
                {serverHealth.status || 'unknown'}
              </p>
            </div>
            <div className="p-4 bg-surface-container rounded-lg text-center">
              <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold mb-1">
                Memory
              </p>
              <p className="text-2xl font-black text-secondary">
                {serverHealth.memoryMb ? `${serverHealth.memoryMb} MB` : 'N/A'}
              </p>
            </div>
            <div className="p-4 bg-surface-container rounded-lg text-center">
              <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold mb-1">
                Uptime
              </p>
              <p className="text-2xl font-black text-secondary">
                {formatDuration(serverHealth.uptimeSeconds)}
              </p>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-4 pb-12">
          <button
            className="px-8 py-3 rounded-full border border-outline-variant font-bold text-sm hover:bg-surface-container-low transition-colors"
            type="button"
            onClick={resetToDefaults}
          >
            Reset to Defaults
          </button>
          <button
            className="px-8 py-3 rounded-full bg-primary text-on-primary font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all disabled:opacity-50"
            onClick={() =>
              saveMutation.mutate({
                maintenanceMode,
                maxPhotosPerBusiness: maxPhotos,
                aiModerationThreshold: moderationThreshold,
                aiSchedule,
                passwordRotationDays: passwordRotation,
                twoFactorAuth: twoFactorEnabled,
              })
            }
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {saveBanner ? (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`rounded-xl px-5 py-3 text-sm font-bold shadow-xl border ${
              saveBanner.type === 'success'
                ? 'bg-secondary-container text-on-secondary-container border-secondary/20'
                : 'bg-error-container text-on-error-container border-error/20'
            }`}
          >
            {saveBanner.message}
          </div>
        </div>
      ) : null}

      {editingAdmin ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-surface-container-lowest p-6 shadow-2xl border border-outline-variant/20">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold">Edit Profile</h3>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Update admin details for {editingAdmin.email}
                </p>
              </div>
              <button
                className="p-2 rounded-full hover:bg-surface-container-low transition-colors"
                onClick={() => setEditingAdmin(null)}
                aria-label="Close"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  First name
                </label>
                <input
                  className="w-full rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-2 text-sm focus:ring-2 focus:ring-primary/30"
                  value={profileForm.first_name}
                  onChange={(e) =>
                    setProfileForm((current) => ({ ...current, first_name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Last name
                </label>
                <input
                  className="w-full rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-2 text-sm focus:ring-2 focus:ring-primary/30"
                  value={profileForm.last_name}
                  onChange={(e) =>
                    setProfileForm((current) => ({ ...current, last_name: e.target.value }))
                  }
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Email
                </label>
                <input
                  className="w-full rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-2 text-sm focus:ring-2 focus:ring-primary/30"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm((current) => ({ ...current, email: e.target.value }))
                  }
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Profile image URL
                </label>
                <input
                  className="w-full rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-2 text-sm focus:ring-2 focus:ring-primary/30"
                  value={profileForm.profile_image}
                  onChange={(e) =>
                    setProfileForm((current) => ({ ...current, profile_image: e.target.value }))
                  }
                />
              </div>
            </div>

            {profileError ? (
              <p className="mt-4 text-sm font-bold text-error">{profileError}</p>
            ) : null}

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-5 py-2 rounded-full border border-outline-variant font-bold text-sm hover:bg-surface-container-low transition-colors"
                onClick={() => setEditingAdmin(null)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-full bg-primary text-on-primary font-bold text-sm shadow-lg hover:shadow-xl active:scale-95 transition-all disabled:opacity-60"
                disabled={updateProfileMutation.isPending}
                onClick={() => updateProfileMutation.mutate()}
              >
                {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {addingAdmin ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-surface-container-lowest p-6 shadow-2xl border border-outline-variant/20">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold">Add New Admin</h3>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Create a new administrator account.
                </p>
              </div>
              <button
                className="p-2 rounded-full hover:bg-surface-container-low transition-colors"
                onClick={() => setAddingAdmin(false)}
                type="button"
                aria-label="Close"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  First name
                </label>
                <input
                  className="w-full rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-2 text-sm focus:ring-2 focus:ring-primary/30"
                  value={newAdminForm.first_name}
                  onChange={(e) =>
                    setNewAdminForm((current) => ({ ...current, first_name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Last name
                </label>
                <input
                  className="w-full rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-2 text-sm focus:ring-2 focus:ring-primary/30"
                  value={newAdminForm.last_name}
                  onChange={(e) =>
                    setNewAdminForm((current) => ({ ...current, last_name: e.target.value }))
                  }
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Email
                </label>
                <input
                  className="w-full rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-2 text-sm focus:ring-2 focus:ring-primary/30"
                  value={newAdminForm.email}
                  onChange={(e) =>
                    setNewAdminForm((current) => ({ ...current, email: e.target.value }))
                  }
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Password
                </label>
                <input
                  className="w-full rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-2 text-sm focus:ring-2 focus:ring-primary/30"
                  type="password"
                  value={newAdminForm.password}
                  onChange={(e) =>
                    setNewAdminForm((current) => ({ ...current, password: e.target.value }))
                  }
                />
              </div>
            </div>

            {newAdminError ? (
              <p className="mt-4 text-sm font-bold text-error">{newAdminError}</p>
            ) : null}

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-5 py-2 rounded-full border border-outline-variant font-bold text-sm hover:bg-surface-container-low transition-colors"
                onClick={() => setAddingAdmin(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-full bg-primary text-on-primary font-bold text-sm shadow-lg hover:shadow-xl active:scale-95 transition-all disabled:opacity-60"
                disabled={createAdminMutation.isPending}
                onClick={() => createAdminMutation.mutate()}
                type="button"
              >
                {createAdminMutation.isPending ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
