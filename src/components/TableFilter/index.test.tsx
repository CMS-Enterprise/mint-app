import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import setup from 'utils/testing/setup';

import GlobalClientFilter from './index';

describe('Table Filter Componenet', () => {
  it('renders without errors', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <GlobalClientFilter
          globalFilter=""
          setGlobalFilter={() => true}
          tableID="table-id"
          tableName="table-name"
          className="margin-bottom-5"
        />
      </MemoryRouter>
    );

    expect(getByTestId('table-client-filter')).toBeInTheDocument();
  });

  it('display query text in input', async () => {
    const { user } = setup(
      <MemoryRouter>
        <GlobalClientFilter
          globalFilter=""
          setGlobalFilter={() => true}
          tableID="table-id"
          tableName="table-name"
          className="margin-bottom-5"
        />
      </MemoryRouter>
    );

    await user.type(screen.getByRole('searchbox'), 'system-1');
    expect(screen.getByRole('searchbox')).toHaveValue('system-1');
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter>
        <GlobalClientFilter
          globalFilter=""
          setGlobalFilter={() => true}
          tableID="table-id"
          tableName="table-name"
          className="margin-bottom-5"
        />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
