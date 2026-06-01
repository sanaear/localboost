import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import enMessages from '../../messages/en.json';
import BusinessDetailPage from '@/app/[locale]/businesses/[id]/page';
import SavedPage from '@/app/[locale]/saved/page';
import { useFavorites } from '@/lib/favorites';
import * as queries from '@/lib/queries';

vi.mock('@/lib/queries', () => ({
  useBusinessDetail: vi.fn(),
  useBusinessAverageRating: vi.fn(),
  useBusinessReviews: vi.fn(),
  useBusinessesSearch: vi.fn(),
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

function mockBusinessQueries() {
  (queries as any).useBusinessDetail.mockReturnValue({
    data: {
      id: 1,
      user_id: 1,
      name: 'Test Business',
      city: 'Fès',
      images: [],
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
      category: { id: 1, name_en: 'Category' },
      user: { id: 1, role: 'merchant', email: 'merchant@localboost.test', address: 'Medina' },
    },
    isLoading: false,
    isError: false,
  });

  (queries as any).useBusinessAverageRating.mockReturnValue({
    data: { average: 4.5, count: 12 },
    isLoading: false,
    isError: false,
  });

  (queries as any).useBusinessReviews.mockReturnValue({
    data: [],
    isLoading: false,
    isError: false,
  });
}

function setClipboardMock() {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  });
  return writeText;
}

describe('LB-73 favorites + share', () => {
  it('toggles favorite on business detail and persists to localStorage', async () => {
    localStorage.clear();
    mockBusinessQueries();

    renderWithIntl(<BusinessDetailPage params={resolvedParams({ locale: 'en', id: '1' })} />);

    const outlineIcon = await screen.findByText('favorite_border');
    const favoriteButton = outlineIcon.closest('button');
    expect(favoriteButton).toBeTruthy();

    fireEvent.click(favoriteButton as HTMLButtonElement);

    await waitFor(() => {
      expect(screen.getByText('favorite')).toBeInTheDocument();
    });

    expect(JSON.parse(localStorage.getItem('lb:favorites:v1') ?? '[]')).toEqual([1]);

    const filledIcon = screen.getByText('favorite');
    fireEvent.click(filledIcon.closest('button') as HTMLButtonElement);

    await waitFor(() => {
      expect(screen.getByText('favorite_border')).toBeInTheDocument();
    });

    expect(JSON.parse(localStorage.getItem('lb:favorites:v1') ?? '[]')).toEqual([]);
  });

  it('shares business via copy link and WhatsApp', async () => {
    localStorage.clear();
    mockBusinessQueries();
    const writeText = setClipboardMock();
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    renderWithIntl(<BusinessDetailPage params={resolvedParams({ locale: 'en', id: '1' })} />);

    fireEvent.click(screen.getByText('share').closest('button') as HTMLButtonElement);
    fireEvent.click(screen.getByText('Copy link').closest('button') as HTMLButtonElement);

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(`${window.location.origin}/en/businesses/1`);
      expect(screen.getByText('Link copied')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('share').closest('button') as HTMLButtonElement);
    fireEvent.click(screen.getByText('WhatsApp').closest('button') as HTMLButtonElement);

    await waitFor(() => {
      expect(openSpy).toHaveBeenCalled();
    });

    const lastCall = openSpy.mock.calls[openSpy.mock.calls.length - 1]?.[0] as string;
    expect(lastCall.startsWith('https://wa.me/?text=')).toBe(true);

    openSpy.mockRestore();
  });

  it('shows saved favorites and allows removal from Saved page', async () => {
    localStorage.setItem('lb:favorites:v1', JSON.stringify([1, 2]));

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
        {
          id: 2,
          user_id: 1,
          name: 'Two',
          images: [],
          created_at: '2026-01-01',
          updated_at: '2026-01-01',
        },
        {
          id: 3,
          user_id: 1,
          name: 'Three',
          images: [],
          created_at: '2026-01-01',
          updated_at: '2026-01-01',
        },
      ],
      isLoading: false,
      isError: false,
    });

    renderWithIntl(<SavedPage params={resolvedParams({ locale: 'en' })} />);

    expect(screen.getAllByText('View details')).toHaveLength(2);

    const removeButtons = screen
      .getAllByText('favorite')
      .map((node) => node.closest('button'))
      .filter(Boolean);
    fireEvent.click(removeButtons[0] as HTMLButtonElement);

    await waitFor(() => {
      expect(screen.getAllByText('View details')).toHaveLength(1);
    });

    const stored = JSON.parse(localStorage.getItem('lb:favorites:v1') ?? '[]') as number[];
    expect(stored).toHaveLength(1);
  });

  it('syncs local favorites with API when authenticated', async () => {
    localStorage.clear();
    localStorage.setItem('lb:favorites:v1', JSON.stringify([1]));
    localStorage.setItem('lb:token', 'test-token');

    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = input.toString();
      if (url.endsWith('/favorites') && (!init?.method || init.method === 'GET')) {
        return new Response(JSON.stringify([2]), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        });
      }
      if (url.endsWith('/favorites') && init?.method === 'PUT') {
        return new Response(JSON.stringify({ favorites: [1, 2] }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        });
      }
      return new Response(null, { status: 204 });
    });

    vi.stubGlobal('fetch', fetchMock as any);

    function Harness() {
      const { favoriteIds } = useFavorites();
      return <div data-testid="ids">{favoriteIds.join(',')}</div>;
    }

    render(<Harness />);

    await waitFor(() => {
      expect(screen.getByTestId('ids')).toHaveTextContent('1,2');
    });

    expect(fetchMock).toHaveBeenCalled();
  });
});
