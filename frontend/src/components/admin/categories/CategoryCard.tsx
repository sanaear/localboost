'use client';

interface Category {
  id: string;
  name: string;
  icon: string;
  businessCount: number;
  translations: {
    ar: string;
    fr: string;
    es: string;
  };
  color: 'primary' | 'secondary' | 'tertiary';
  isEditing?: boolean;
}

interface CategoryCardProps {
  category: Category;
  onEdit?: (_category: Category) => void;
  onDelete?: (_category: Category) => void;
}

const colorClasses = {
  primary: {
    bg: 'bg-primary-container',
    text: 'text-on-primary-container',
    badge: 'bg-primary/10 text-primary',
    ring: 'ring-2 ring-primary/20',
  },
  secondary: {
    bg: 'bg-secondary-container',
    text: 'text-on-secondary-container',
    badge: 'bg-secondary/10 text-secondary',
    ring: '',
  },
  tertiary: {
    bg: 'bg-tertiary-container',
    text: 'text-on-tertiary-container',
    badge: 'bg-tertiary/10 text-tertiary',
    ring: '',
  },
};

export default function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const colorClass = colorClasses[category.color];

  return (
    <div
      className={`group bg-surface-container-lowest p-8 rounded-lg shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden ${category.isEditing ? colorClass.ring : ''}`}
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 opacity-5"
        style={{
          backgroundColor:
            category.color === 'primary'
              ? '#EBA020'
              : category.color === 'secondary'
                ? '#2E7D32'
                : '#6B21A8',
        }}
      ></div>

      <div className="relative z-10">
        <div
          className={`w-14 h-14 ${colorClass.bg} flex items-center justify-center rounded-2xl mb-6`}
        >
          <span className={`material-symbols-outlined ${colorClass.text} text-3xl`}>
            {category.icon}
          </span>
        </div>

        <h4 className="text-xl font-extrabold mb-4">{category.name}</h4>

        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-xs border-b border-outline-variant/10 pb-1">
            <span className="text-slate-400">Arabic</span>
            <span className="font-bold">{category.translations.ar}</span>
          </div>
          <div className="flex justify-between text-xs border-b border-outline-variant/10 pb-1">
            <span className="text-slate-400">French</span>
            <span className="font-bold">{category.translations.fr}</span>
          </div>
          <div className="flex justify-between text-xs border-b border-outline-variant/10 pb-1">
            <span className="text-slate-400">Spanish</span>
            <span className="font-bold">{category.translations.es}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className={`px-3 py-1 ${colorClass.badge} text-[10px] font-bold rounded-full`}>
            {category.businessCount} Businesses
          </span>
          {category.isEditing ? (
            <span className="text-primary text-[10px] font-black uppercase tracking-tighter">
              Editing...
            </span>
          ) : (
            <div className="flex items-center gap-1">
              <button
                className="p-2 text-slate-400 hover:text-primary transition-colors"
                onClick={() => onEdit?.(category)}
                aria-label={`Edit ${category.name}`}
              >
                <span className="material-symbols-outlined">edit</span>
              </button>
              <button
                className="p-2 text-slate-400 hover:text-tertiary transition-colors"
                onClick={() => onDelete?.(category)}
                aria-label={`Delete ${category.name}`}
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
