import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import AddCustomMilestone from '.';

describe('AddCustomMilestone', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <AddCustomMilestone />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
