'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import AdminUserBadge from '@/components/admin/AdminUserBadge';
import CategoryCard from '@/components/admin/categories/CategoryCard';
import { adminFetchJson } from '@/lib/adminApi';

interface Category {
  id: number;
  name?: string;
  name_en?: string;
  name_fr?: string;
  name_ar?: string;
  name_es?: string;
  icon?: string;
  business_count?: number;
  color?: string;
}

type CategoryForm = {
  name_en: string;
  name_fr: string;
  name_ar: string;
  name_es: string;
  icon: string;
};

const emptyForm: CategoryForm = {
  name_en: '',
  name_fr: '',
  name_ar: '',
  name_es: '',
  icon: 'category',
};

export default function CategoriesPage() {
  const t = useTranslations('admin.categories');
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories', search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      const query = params.toString();
      return adminFetchJson(`/categories${query ? `?${query}` : ''}`);
    },
    retry: false,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name_en: form.name_en.trim(),
        name_fr: form.name_fr.trim(),
        name_ar: form.name_ar.trim(),
        name_es: form.name_es.trim(),
        icon: form.icon.trim() || 'category',
      };
      if (!payload.name_en && !payload.name_fr && !payload.name_ar && !payload.name_es) {
        throw new Error('Add at least one translated category name.');
      }

      if (editingCategory) {
        return adminFetchJson(`/categories/${editingCategory.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      }

      return adminFetchJson('/categories', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: async () => {
      closeForm();
      await queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
    onError: (error) => {
      setFormError(error instanceof Error ? error.message : 'Unable to save category.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (category: Category) =>
      adminFetchJson(`/categories/${category.id}`, { method: 'DELETE' }),
    onSuccess: async () => {
      setDeleteTarget(null);
      await queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
  });

  const totalBusinesses = Array.isArray(categories)
    ? categories.reduce((sum: number, c: Category) => sum + (c.business_count || 0), 0)
    : 472;

  function openCreate() {
    setEditingCategory(null);
    setForm(emptyForm);
    setFormError(null);
    setShowCreateModal(true);
  }

  function openEdit(category: Category) {
    setEditingCategory(category);
    setForm({
      name_en: category.name_en || category.name || '',
      name_fr: category.name_fr || '',
      name_ar: category.name_ar || '',
      name_es: category.name_es || '',
      icon: category.icon || 'category',
    });
    setFormError(null);
    setShowCreateModal(true);
  }

  function closeForm() {
    setShowCreateModal(false);
    setEditingCategory(null);
    setForm(emptyForm);
    setFormError(null);
  }

  return (
    <>
      <header className="flex justify-between items-center px-8 py-6 sticky top-0 glass-panel z-30">
        <div className="flex items-center gap-8">
          <h2 className="text-2xl font-extrabold text-primary tracking-tight">{t('title')}</h2>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
              search
            </span>
            <input
              className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-primary-container transition-all"
              placeholder={t('searchPlaceholder')}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
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

      <div className="px-12 py-8">
        <div className="flex justify-between items-end mb-12">
          <div className="max-w-xl">
            <h3 className="text-3xl font-bold mb-2 text-on-surface">Digital Catalog Structure</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Organize your LocalBoost directory into meaningful clusters. Manage multi-language
              translations and visual identifiers for each business vertical.
            </p>
          </div>
          <button
            className="bg-primary hover:bg-primary-container text-on-primary px-8 py-4 rounded-full font-bold shadow-lg flex items-center gap-2 active:scale-95 transition-all"
            onClick={openCreate}
          >
            <span className="material-symbols-outlined">add</span>
            {t('addNewCategory')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.isArray(categories) &&
            categories.map((category: Category) => (
              <CategoryCard
                key={category.id}
                category={{
                  id: String(category.id),
                  name: category.name_en || category.name || 'Unnamed',
                  icon: category.icon || 'category',
                  businessCount: category.business_count || 0,
                  translations: {
                    ar: category.name_ar || '',
                    fr: category.name_fr || '',
                    es: category.name_es || '',
                  },
                  color: (category.color as 'primary' | 'secondary' | 'tertiary') || 'primary',
                  isEditing: editingCategory?.id === category.id,
                }}
                onEdit={() => openEdit(category)}
                onDelete={() => setDeleteTarget(category)}
              />
            ))}
        </div>

        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#1A1C1B] text-white p-10 rounded-xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-tertiary font-black text-xs uppercase tracking-widest mb-4">
                Total Reach
              </p>
              <h5 className="text-4xl font-extrabold mb-2">{totalBusinesses}</h5>
              <p className="text-slate-400 text-sm">Active businesses across all categories.</p>
            </div>
            <div className="absolute bottom-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-9xl">analytics</span>
            </div>
          </div>

          <div className="col-span-2 bg-surface-container-low p-10 rounded-xl flex items-center gap-12">
            <div className="w-1/3 h-48 rounded-lg overflow-hidden relative">
              <img
                className="w-full h-full object-cover"
                data-alt="vibrant Moroccan souk scene with colorful ceramics and traditional lanterns under warm atmospheric lighting"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8w30TMFBePJE_udrEV09fMkJ5_dsqmooBhDPGbnQwh_OSwH9ZjgA9aEKdROKLIM4G2qcXomjCreSbI2n018L_HP4N2cVLYCSSj_BmuHy0dfx3IaY3hK0sNzlUkTo4K8s-O2JIoVCWLr7k1lGTTDGNQwpZ5pQU4Yspx5mGDmwHvxP9J1LllO-Ql25rkrosJXP3boLOdLU-6aSpO0EQ_QyQ_I7ditDZne1k5Y_y6-bRjcZHSdVF75cnTYqQ1UjVmTdsZXVwVZZme48"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
            </div>

            <div className="flex-1">
              <h5 className="text-2xl font-bold mb-4">Promote Local Culture</h5>
              <p className="text-on-surface-variant mb-6 text-sm leading-relaxed">
                Each category you create helps tourists find authentic experiences. LocalBoost's
                2030 vision aims to digitize 1,000+ local artisans before the global festivities.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Artisans Growing
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Food Trends Up
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {showCreateModal ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              saveMutation.mutate();
            }}
            className="w-full max-w-2xl rounded-2xl bg-surface p-7 shadow-2xl"
          >
            <div className="mb-6 flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                  {editingCategory ? 'Edit category' : t('addNewCategory')}
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-on-surface">
                  {editingCategory ? editingCategory.name_en || editingCategory.name : 'New catalog category'}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="grid h-10 w-10 place-items-center rounded-full bg-surface-container-low text-outline hover:text-primary"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                ['name_en', 'English name'],
                ['name_fr', 'French name'],
                ['name_ar', 'Arabic name'],
                ['name_es', 'Spanish name'],
              ].map(([key, label]) => (
                <label key={key} className="block">
                  <span className="text-[11px] font-black uppercase tracking-[0.14em] text-outline">
                    {label}
                  </span>
                  <input
                    value={form[key as keyof CategoryForm]}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, [key]: event.target.value }))
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-outline-variant/30 bg-surface-container-low px-4 text-sm font-semibold outline-none focus:border-primary"
                  />
                </label>
              ))}
              <label className="block md:col-span-2">
                <span className="text-[11px] font-black uppercase tracking-[0.14em] text-outline">
                  Material icon name
                </span>
                <input
                  value={form.icon}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, icon: event.target.value }))
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-outline-variant/30 bg-surface-container-low px-4 text-sm font-semibold outline-none focus:border-primary"
                  placeholder="restaurant, local_cafe, spa, store"
                />
              </label>
            </div>

            {formError ? <p className="mt-4 text-sm font-bold text-tertiary">{formError}</p> : null}

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-full bg-surface-container-low px-5 py-3 text-sm font-bold text-on-surface-variant"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="rounded-full bg-primary px-6 py-3 text-sm font-black text-on-primary shadow-lg disabled:opacity-60"
              >
                {saveMutation.isPending ? 'Saving...' : 'Save category'}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-surface p-7 shadow-2xl">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-tertiary-container text-on-tertiary-container">
              <span className="material-symbols-outlined">delete</span>
            </div>
            <h3 className="mt-5 text-2xl font-extrabold text-on-surface">Delete category?</h3>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant">
              Businesses in "{deleteTarget.name_en || deleteTarget.name}" will stay in LocalBoost
              and become uncategorized.
            </p>
            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-full bg-surface-container-low px-5 py-3 text-sm font-bold text-on-surface-variant"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(deleteTarget)}
                className="rounded-full bg-tertiary px-6 py-3 text-sm font-black text-white shadow-lg disabled:opacity-60"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
