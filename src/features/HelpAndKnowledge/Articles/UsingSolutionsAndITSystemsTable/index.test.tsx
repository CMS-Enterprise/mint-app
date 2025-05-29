import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import UsingSolutionsAndITSystemsTable from '.';

describe('UsingSolutionsAndITSystemsTable', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <UsingSolutionsAndITSystemsTable />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
