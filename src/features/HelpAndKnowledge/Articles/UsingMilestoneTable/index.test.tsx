import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import UsingMilestoneTable from '.';

describe('Using Milestone Table Article', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <UsingMilestoneTable />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
