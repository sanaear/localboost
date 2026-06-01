'use client';

import { resolveMediaUrl } from '@/lib/api';

interface Business {
  id: number;
  name: string;
  lbId?: string;
  image?: string;
  images: string[];
  owner: string;
  category: string;
  categoryColor?: string;
  categoryTextColor?: string;
  city: string;
  submittedDate: string;
  status: string;
}

interface BusinessesTableProps {
  businesses: Business[];
  onSelect: (business: Business) => void;
  selectedId: number | null;
}

const statusStyles: Record<string, string> = {
  pending: 'text-primary',
  approved: 'text-secondary',
  rejected: 'text-error',
  suspended: 'text-tertiary',
};

export default function BusinessesTable({
  businesses,
  onSelect,
  selectedId,
}: BusinessesTableProps) {
  return (
    <div className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low text-on-surface-variant uppercase text-[11px] font-bold tracking-widest">
            <th className="px-6 py-4">Business Name</th>
            <th className="px-6 py-4">Owner</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">City</th>
            <th className="px-6 py-4">Submitted Date</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-container">
          {businesses.map((business) => {
            const isSelected = business.id === selectedId;
            const imgSrc = resolveMediaUrl(business.image || business.images?.[0]);
            const statusClass =
              statusStyles[business.status?.toLowerCase()] || 'text-on-surface-variant';

            return (
              <tr
                key={business.id}
                className={`hover:bg-surface-container-low transition-colors cursor-pointer ${
                  isSelected ? 'bg-primary/5 border-l-4 border-primary' : ''
                }`}
                onClick={() => onSelect(business)}
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${
                        isSelected ? 'bg-primary-fixed' : 'bg-surface-container'
                      } overflow-hidden`}
                    >
                      {imgSrc && <img className="w-full h-full object-cover" src={imgSrc} />}
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">{business.name}</p>
                      <p className="text-xs text-on-surface-variant">
                        ID: {business.lbId || `#LB-${business.id}`}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm font-medium">{business.owner}</td>
                <td className="px-6 py-5">
                  <span className="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                    {business.category}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm">{business.city}</td>
                <td className="px-6 py-5 text-sm">{business.submittedDate}</td>
                <td className="px-6 py-5">
                  <span
                    className={`flex items-center gap-1.5 font-bold text-xs uppercase tracking-wide ${statusClass}`}
                  >
                    {business.status?.toLowerCase() === 'pending' && (
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    )}
                    {business.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button
                    className="text-primary hover:underline font-bold text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(business);
                    }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="px-6 py-4 bg-surface-container-low flex justify-between items-center border-t border-surface-variant">
        <span className="text-xs text-on-surface-variant font-medium">
          Showing {businesses.length} of {businesses.length} businesses
        </span>
        <div className="flex gap-2">
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-container-highest text-outline disabled:opacity-50"
            disabled
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-on-primary font-bold text-xs">
            1
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-highest text-on-surface font-bold text-xs">
            2
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-highest text-on-surface font-bold text-xs">
            3
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-container-highest text-outline">
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
