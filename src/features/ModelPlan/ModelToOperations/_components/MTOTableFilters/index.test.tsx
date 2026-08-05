import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  const renderWithRouter = (
    initialEntry: string,
    props?: React.ComponentProps<typeof MTOTableFilters>
  ) => {
    const user = userEvent.setup();
    const router = createMemoryRouter(
      [
        {
          path: '/matrix',
          element: <MTOTableFilters {...props} />
        }
      ],
      {
        initialEntries: [initialEntry]
      }
    );
    render(<RouterProvider router={router} />);
    return { user };
  };

  const getSelect = () => screen.getByTestId('mto-needed-within-days');

  const showFilters = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.click(
      screen.getByText(
        i18next.t('modelToOperationsMisc:table.tableFilters.showFilters')
      )
    );
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders without errors', async () => {
    const { user } = renderWithRouter('/matrix');

    await showFilters(user);

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
    expect(screen.getByTestId('mto-hide-category-rows')).toBeInTheDocument();
  });

  it('shows category and subcategory header count in the hide-rows label', async () => {
    const { user } = renderWithRouter('/matrix', {
      categoryHeaderRowCount: 12
    });

    await showFilters(user);

    expect(
      screen.getByRole('checkbox', {
        name: i18next.t(
          'modelToOperationsMisc:table.tableFilters.hideCategoryRows',
          { count: 12 }
        )
      })
    ).toBeInTheDocument();
  });

  it('reflects hide-category-rows=true from the URL', async () => {
    const { user } = renderWithRouter('/matrix?hide-category-rows=true');

    await showFilters(user);

    expect(screen.getByTestId('mto-hide-category-rows')).toBeChecked();
  });

  it('checking the checkbox sets hide-category-rows=true and resets page', async () => {
    const { user } = renderWithRouter('/matrix?page=4');

    await showFilters(user);

    fireEvent.click(screen.getByTestId('mto-hide-category-rows'));

    expect(mockNavigate).toHaveBeenCalledWith(expect.any(Object), {
      replace: true
    });
    const { search } = mockNavigate.mock.calls[0][0] as { search: string };
    const nextParams = new URLSearchParams(search);
    expect(nextParams.get('hide-category-rows')).toBe('true');
    expect(nextParams.get('page')).toBe('1');
  });

  it('unchecking the checkbox sets hide-category-rows=false', async () => {
    const { user } = renderWithRouter('/matrix?hide-category-rows=true');

    await showFilters(user);

    fireEvent.click(screen.getByTestId('mto-hide-category-rows'));

    const { search } = mockNavigate.mock.calls[0][0] as { search: string };
    const nextParams = new URLSearchParams(search);
    expect(nextParams.get('hide-category-rows')).toBe('false');
  });

  it('disables and forces checked when a time window filter is selected', async () => {
    const { user } = renderWithRouter(
      '/matrix?needed-within-days=60&hide-category-rows=true'
    );

    await showFilters(user);

    expect(screen.getByTestId('mto-hide-category-rows')).toBeDisabled();
    expect(screen.getByTestId('mto-hide-category-rows')).toBeChecked();
  });

  it('defaults to All when no filter params are present', async () => {
    const { user } = renderWithRouter('/matrix');

    await showFilters(user);

    expect(getSelect()).toHaveValue('all');
  });

  it('reflects needed-within-days in the URL', async () => {
    const { user } = renderWithRouter('/matrix?needed-within-days=60');

    await showFilters(user);

    expect(getSelect()).toHaveValue('60');
  });

  it('maps legacy needed-within-thirty-days=true to 30 days in the select', async () => {
    const { user } = renderWithRouter('/matrix?needed-within-thirty-days=true');

    await showFilters(user);

    expect(getSelect()).toHaveValue('30');
  });

  it('selecting 30 days sets needed-within-days and resets page', async () => {
    const { user } = renderWithRouter('/matrix?page=3');

    await showFilters(user);

    fireEvent.change(getSelect(), { target: { value: '30' } });

    expect(mockNavigate).toHaveBeenCalledWith(expect.any(Object), {
      replace: true
    });
    const { search } = mockNavigate.mock.calls[0][0] as { search: string };
    const nextParams = new URLSearchParams(search);
    expect(nextParams.get('needed-within-days')).toBe('30');
    expect(nextParams.get('hide-category-rows')).toBe('true');
    expect(nextParams.get('page')).toBe('1');
  });

  it('selecting All removes filter params and resets page', async () => {
    const { user } = renderWithRouter(
      '/matrix?page=2&needed-within-days=90&hide-category-rows=true'
    );

    await showFilters(user);

    fireEvent.change(getSelect(), { target: { value: 'all' } });

    const { search } = mockNavigate.mock.calls[0][0] as { search: string };
    const nextParams = new URLSearchParams(search);
    expect(nextParams.get('needed-within-days')).toBeNull();
    expect(nextParams.get('page')).toBe('1');
  });

  it('selecting All clears legacy thirty-days param', async () => {
    const { user } = renderWithRouter(
      '/matrix?needed-within-thirty-days=true&hide-category-rows=true'
    );

    await showFilters(user);

    fireEvent.change(getSelect(), { target: { value: 'all' } });

    const { search } = mockNavigate.mock.calls[0][0] as { search: string };
    const nextParams = new URLSearchParams(search);
    expect(nextParams.get('needed-within-thirty-days')).toBeNull();
  });
});
