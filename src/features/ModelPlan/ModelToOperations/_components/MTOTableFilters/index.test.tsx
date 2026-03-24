import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import i18next from 'i18next';
import { vi } from 'vitest';

import MTOTableFilters from './index';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('MTOTableFilters', () => {
  const renderWithRouter = (initialEntry: string) => {
    const router = createMemoryRouter(
      [
        {
          path: '/matrix',
          element: <MTOTableFilters />
        }
      ],
      {
        initialEntries: [initialEntry]
      }
    );
    return render(<RouterProvider router={router} />);
  };

  const getSelect = () => screen.getByTestId('mto-needed-within-days');

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders without errors', () => {
    renderWithRouter('/matrix');

    expect(
      screen.getByText(
        i18next.t('modelToOperationsMisc:table.tableFilters.tableFilters')
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        i18next.t('modelToOperationsMisc:table.tableFilters.neededWithin')
      )
    ).toBeInTheDocument();
    expect(getSelect()).toBeInTheDocument();
  });

  it('defaults to All when no filter params are present', () => {
    renderWithRouter('/matrix');
    expect(getSelect()).toHaveValue('all');
  });

  it('reflects needed-within-days in the URL', () => {
    renderWithRouter('/matrix?needed-within-days=60');
    expect(getSelect()).toHaveValue('60');
  });

  it('maps legacy needed-within-thirty-days=true to 30 days in the select', () => {
    renderWithRouter('/matrix?needed-within-thirty-days=true');
    expect(getSelect()).toHaveValue('30');
  });

  it('selecting 30 days sets needed-within-days and resets page', () => {
    renderWithRouter('/matrix?page=3');

    fireEvent.change(getSelect(), { target: { value: '30' } });

    expect(mockNavigate).toHaveBeenCalledWith(expect.any(Object), {
      replace: true
    });
    const { search } = mockNavigate.mock.calls[0][0] as { search: string };
    const nextParams = new URLSearchParams(search);
    expect(nextParams.get('needed-within-days')).toBe('30');
    expect(nextParams.get('page')).toBe('1');
  });

  it('selecting All removes filter params and resets page', () => {
    renderWithRouter('/matrix?page=2&needed-within-days=90');

    fireEvent.change(getSelect(), { target: { value: 'all' } });

    const { search } = mockNavigate.mock.calls[0][0] as { search: string };
    const nextParams = new URLSearchParams(search);
    expect(nextParams.get('needed-within-days')).toBeNull();
    expect(nextParams.get('page')).toBe('1');
  });

  it('selecting All clears legacy thirty-days param', () => {
    renderWithRouter('/matrix?needed-within-thirty-days=true');

    fireEvent.change(getSelect(), { target: { value: 'all' } });

    const { search } = mockNavigate.mock.calls[0][0] as { search: string };
    const nextParams = new URLSearchParams(search);
    expect(nextParams.get('needed-within-thirty-days')).toBeNull();
  });
});
