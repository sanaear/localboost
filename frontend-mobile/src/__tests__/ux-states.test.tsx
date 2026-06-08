import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import enMessages from '../../messages/en.json';
import DiscoverPage from '@/app/[locale]/discover/page';
import SavedPage from '@/app/[locale]/saved/page';
import BusinessDetailPage from '@/app/[locale]/businesses/[id]/page';
import * as queries from '@/lib/queries';

vi.mock('@/lib/queries', () => ({
  useBusinessesSearch: vi.fn(),
  useCategories: vi.fn(),
  useRegions: vi.fn(),
  useBusinessDetail: vi.fn(),
  useBusinessAverageRating: vi.fn(),
  useBusinessReviews: vi.fn(),
}));

function renderWithIntl(ui: React.ReactElement, locale = 'en') {
  return render(
    <NextIntlClientProvider locale={locale} messages={enMessages as any}>
      {ui}
    </NextIntlClientProvider>
  );
}

function resolvedParams<T>(value: T): Promise<T> {
  return Object.assign(Promise.resolve(value), { status: 'fulfilled', value });
}

describe('LB-73 UX states', () => {
  it('shows skeletons on Discover when loading', () => {
    (queries as any).useCategories.mockReturnValue({ data: [], isLoading: false, isError: false });
    (queries as any).useRegions.mockReturnValue({ data: [], isLoading: false, isError: false });
    (queries as any).useBusinessesSearch.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    });

    renderWithIntl(<DiscoverPage params={resolvedParams({ locale: 'en' })} />);
    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);
  });

  it('offers retry on Discover error and calls refetch', () => {
    const refetch = vi.fn();
    (queries as any).useCategories.mockReturnValue({ data: [], isLoading: false, isError: false });
    (queries as any).useRegions.mockReturnValue({ data: [], isLoading: false, isError: false });
    (queries as any).useBusinessesSearch.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch,
    });

    renderWithIntl(<DiscoverPage params={resolvedParams({ locale: 'en' })} />);
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(refetch).toHaveBeenCalled();
  });

  it('shows empty state on Saved when no favorites', () => {
    localStorage.clear();
    (queries as any).useBusinessesSearch.mockReturnValue({
      data: [
        {
          id: 1,
          user_id: 1,
          name: 'One',
          images: [],
          created_at: '2026-01-01',
          updated_at: '2026-01-01',
        },
      ],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderWithIntl(<SavedPage params={resolvedParams({ locale: 'en' })} />);
    expect(screen.getByText('No favorites yet')).toBeInTheDocument();
    const exploreLinks = screen.getAllByRole('link', { name: 'Explore' });
    expect(exploreLinks.some((link) => link.getAttribute('href') === '/en/discover')).toBe(true);
  });

  it('offers retry on Business detail error and calls refetch', () => {
    const refetch = vi.fn();
    (queries as any).useBusinessDetail.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch,
    });
    (queries as any).useBusinessAverageRating.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
    (queries as any).useBusinessReviews.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderWithIntl(<BusinessDetailPage params={resolvedParams({ locale: 'en', id: '1' })} />);
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(refetch).toHaveBeenCalled();
  });
});
