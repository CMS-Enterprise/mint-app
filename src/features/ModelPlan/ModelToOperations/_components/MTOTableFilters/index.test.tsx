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

  const getCheckbox = () =>
    screen.getByRole('checkbox', { name: new RegExp('\\(\\d+\\)$') });

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
    expect(getCheckbox()).toBeInTheDocument();
  });

  it('when checkbox is checked, unchecking it sets params to false', () => {
    renderWithRouter('/matrix?needed-within-thirty-days=true');

    const checkbox = getCheckbox();
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);

    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        search: expect.stringContaining('needed-within-thirty-days=false')
      }),
      { replace: true }
    );
  });

  it('when params is false, checkbox is unchecked', () => {
    renderWithRouter('/matrix?needed-within-thirty-days=false');
    expect(getCheckbox()).not.toBeChecked();
  });
});
