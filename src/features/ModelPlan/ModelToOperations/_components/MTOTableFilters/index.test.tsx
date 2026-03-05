import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import i18next from 'i18next';

import MTOTableFilters from './index';

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

  const getNeededWithinThirtyDaysLabel = (count: number) =>
    `${i18next.t(
      'modelToOperationsMisc:table.tableFilters.neededWithinThirtyDays'
    )} (${count})`;

  it('renders the table filters label and checkbox', () => {
    renderWithRouter('/matrix');

    expect(
      screen.getByText(
        i18next.t('modelToOperationsMisc:table.tableFilters.tableFilters')
      )
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(getNeededWithinThirtyDaysLabel(0))
    ).toBeInTheDocument();
  });

  it('renders checkbox unchecked when needed-within-thirty-days param is absent', () => {
    renderWithRouter('/matrix');

    const checkbox = screen.getByRole('checkbox', {
      name: getNeededWithinThirtyDaysLabel(0)
    });
    expect(checkbox).not.toBeChecked();
  });

  it('renders checkbox unchecked when needed-within-thirty-days is false', () => {
    renderWithRouter('/matrix?needed-within-thirty-days=false');

    const checkbox = screen.getByRole('checkbox', {
      name: getNeededWithinThirtyDaysLabel(0)
    });
    expect(checkbox).not.toBeChecked();
  });

  it('renders checkbox checked when needed-within-thirty-days is true', () => {
    renderWithRouter('/matrix?needed-within-thirty-days=true');

    const checkbox = screen.getByRole('checkbox', {
      name: getNeededWithinThirtyDaysLabel(0)
    });
    expect(checkbox).toBeChecked();
  });

  it('displays milestone count in label', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/matrix',
          element: <MTOTableFilters milestonesNeededWithin30DaysCount={5} />
        }
      ],
      { initialEntries: ['/matrix'] }
    );
    render(<RouterProvider router={router} />);

    expect(
      screen.getByLabelText(getNeededWithinThirtyDaysLabel(5))
    ).toBeInTheDocument();
  });

  it('toggles filter and resets page when checkbox is clicked from unchecked', () => {
    renderWithRouter('/matrix?page=3');

    const checkbox = screen.getByRole('checkbox', {
      name: getNeededWithinThirtyDaysLabel(0)
    });

    fireEvent.click(checkbox);

    // Memory router updates in-memory location, so component re-renders with new search
    expect(checkbox).toBeChecked();
  });

  it('toggles filter off when checkbox is clicked from checked', () => {
    renderWithRouter('/matrix?needed-within-thirty-days=true&page=2');

    const checkbox = screen.getByRole('checkbox', {
      name: getNeededWithinThirtyDaysLabel(0)
    });

    fireEvent.click(checkbox);

    expect(checkbox).not.toBeChecked();
  });
});
