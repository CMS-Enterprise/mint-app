import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18next from 'i18next';
import { categoryMock, modelID } from 'tests/mock/mto';
import MockedProvider from 'tests/MockedProvider';

import MTOTableFilters, { DATE_FILTER_PARAM } from './index';

describe('MTOTableFilters', () => {
  let router: ReturnType<typeof createMemoryRouter>;

  const renderWithRouter = (
    params: string,
    props?: React.ComponentProps<typeof MTOTableFilters>
  ) => {
    const user = userEvent.setup();
    router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
          element: (
            <MTOTableFilters
              searchQuery=""
              setSearchQuery={() => {}}
              {...props}
            />
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations${params}`
        ]
      }
    );

    render(
      <MockedProvider mocks={[...categoryMock]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    return { user };
  };

  const waitForDataToLoad = async () => {
    await waitFor(() => {
      expect(screen.queryByTestId('page-loading')).not.toBeInTheDocument();
    });
  };

  const getRouterSearchParams = (): URLSearchParams => {
    return new URLSearchParams(router.state.location.search);
  };

  const getSelect = () => screen.getByTestId('mto-needed-within-days');

  const showFilters = async (user: ReturnType<typeof userEvent.setup>) => {
    await waitForDataToLoad();
    const showBtn = screen.queryByText(
      i18next.t('modelToOperationsMisc:table.tableFilters.showFilters')
    );
    if (showBtn) {
      await user.click(showBtn);
    }
  };

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
      categoryHeaderRowCount: 12,
      searchQuery: '',
      setSearchQuery: () => {}
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

    await user.click(screen.getByTestId('mto-hide-category-rows'));

    const searchParams = getRouterSearchParams();
    expect(searchParams.get('hide-category-rows')).toBe('true');
    expect(searchParams.get('page')).toBe('1');
  });

  it('unchecking the checkbox sets hide-category-rows=false', async () => {
    const { user } = renderWithRouter('/matrix?hide-category-rows=true');

    await showFilters(user);

    await user.click(screen.getByTestId('mto-hide-category-rows'));

    const searchParams = getRouterSearchParams();
    expect(searchParams.get('hide-category-rows')).toBe('false');
  });

  it('disables and forces checked when a time window filter is selected', async () => {
    const { user } = renderWithRouter(
      `/matrix?${DATE_FILTER_PARAM}=NEXT_30_DAYS&hide-category-rows=true`
    );

    await showFilters(user);

    expect(screen.getByTestId('mto-hide-category-rows')).toBeDisabled();
    expect(screen.getByTestId('mto-hide-category-rows')).toBeChecked();
  });

  it('defaults to ALL_TIME when no filter params are present', async () => {
    const { user } = renderWithRouter('/matrix');

    await showFilters(user);

    expect(getSelect()).toHaveValue('ALL_TIME');
  });

  it('reflects needed-by-date-range in the URL', async () => {
    const { user } = renderWithRouter(
      `/matrix?${DATE_FILTER_PARAM}=NEXT_30_DAYS`
    );

    await showFilters(user);

    expect(getSelect()).toHaveValue('NEXT_30_DAYS');
  });

  it('selecting NEXT_30_DAYS sets needed-by-date-range and resets page', async () => {
    const { user } = renderWithRouter('/matrix?page=3');

    await showFilters(user);

    await user.selectOptions(getSelect(), 'NEXT_30_DAYS');

    const searchParams = getRouterSearchParams();
    expect(searchParams.get(DATE_FILTER_PARAM)).toBe('NEXT_30_DAYS');
    expect(searchParams.get('hide-category-rows')).toBe('true');
    expect(searchParams.get('page')).toBe('1');
  });

  it('selecting ALL_TIME removes filter params and resets page', async () => {
    const { user } = renderWithRouter(
      `/matrix?page=2&${DATE_FILTER_PARAM}=NEXT_30_DAYS&hide-category-rows=true`
    );

    await showFilters(user);

    await user.selectOptions(getSelect(), 'ALL_TIME');

    const searchParams = getRouterSearchParams();
    expect(searchParams.get(DATE_FILTER_PARAM)).toBeNull();
    expect(searchParams.get('page')).toBe('1');
  });

  it('renders the search input with initial searchQuery value', async () => {
    const { user } = renderWithRouter('/matrix', {
      searchQuery: 'initial query',
      setSearchQuery: () => {}
    });

    await showFilters(user);

    expect(screen.getByRole('searchbox')).toHaveValue('initial query');
  });

  it('calls setSearchQuery when the user types in the search input', async () => {
    const setSearchQuery = vi.fn();
    const { user } = renderWithRouter('/matrix', {
      searchQuery: '',
      setSearchQuery
    });

    await showFilters(user);

    await user.type(screen.getByRole('searchbox'), 'test query');

    expect(setSearchQuery).toHaveBeenCalled();
  });

  it('clears the search query when input is emptied', async () => {
    const setSearchQuery = vi.fn();
    const { user } = renderWithRouter('/matrix', {
      searchQuery: 'existing',
      setSearchQuery
    });

    await showFilters(user);

    await user.clear(screen.getByRole('searchbox'));

    expect(setSearchQuery).toHaveBeenCalledWith('');
  });
});
