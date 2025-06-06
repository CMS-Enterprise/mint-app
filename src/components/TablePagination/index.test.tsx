import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import TablePagination from './index';

describe('TablePagination', () => {
  it('renders without errors', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <TablePagination
          gotoPage={() => null}
          previousPage={() => null}
          nextPage={() => null}
          canNextPage={false}
          pageIndex={0}
          pageOptions={[]}
          canPreviousPage={false}
          pageCount={0}
          pageSize={0}
          setPageSize={() => null}
          page={[]}
          data-testid="table-pagination"
        />
      </MemoryRouter>
    );

    expect(getByTestId('table-pagination')).toBeInTheDocument();
  });

  it('render previous and next buttons', async () => {
    const { asFragment } = render(
      <MemoryRouter>
        {' '}
        <TablePagination
          gotoPage={() => null}
          previousPage={() => null}
          nextPage={() => null}
          canNextPage
          pageIndex={10}
          pageOptions={Array(1000)}
          canPreviousPage
          pageCount={0}
          pageSize={0}
          setPageSize={() => null}
          page={[]}
          data-testid="table-pagination"
        />
      </MemoryRouter>
    );

    expect(await screen.findByLabelText('Previous page')).toBeInTheDocument();
    expect(await screen.findByLabelText('Next page')).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });
});
