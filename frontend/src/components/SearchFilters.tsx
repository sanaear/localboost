'use client';

import { useState } from 'react';
import { SearchFilters as SearchFiltersType } from '@/lib/api';

interface SearchFiltersProps {
  onSearch: (filters: SearchFiltersType) => void;
}

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFiltersType>({});

  const handleChange = (key: keyof SearchFiltersType, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">Advanced Search</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search by name or description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={filters.q || ''}
            onChange={(e) => handleChange('q', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            type="text"
            placeholder="City"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={filters.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Rating</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={filters.rating || ''}
            onChange={(e) =>
              handleChange('rating', e.target.value ? Number(e.target.value) : undefined)
            }
          >
            <option value="">Any</option>
            <option value="5">5 Stars</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="1">1+ Star</option>
          </select>
        </div>
      </div>
    </div>
  );
}
