import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import GlobalClientFilter from './index';

describe('Table Filter Componenet', () => {
  it('renders without errors', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <GlobalClientFilter
              globalFilter=""
              setGlobalFilter={() => true}
              tableID="table-id"
              tableName="table-name"
              className="margin-bottom-5"
            />
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { getByTestId } = render(<RouterProvider router={router} />);

    expect(getByTestId('table-client-filter')).toBeInTheDocument();
  });

  it('display query text in input', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <GlobalClientFilter
              globalFilter="system-1"
              setGlobalFilter={() => true}
              tableID="table-id"
              tableName="table-name"
              className="margin-bottom-5"
            />
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    render(<RouterProvider router={router} />);

    expect(screen.getByRole('searchbox')).toHaveValue('system-1');
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <GlobalClientFilter
              globalFilter=""
              setGlobalFilter={() => true}
              tableID="table-id"
              tableName="table-name"
              className="margin-bottom-5"
            />
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { asFragment } = render(<RouterProvider router={router} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
