import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import UsingTableActions from '.';

describe('Using Milestone Table Article', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <UsingTableActions />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
