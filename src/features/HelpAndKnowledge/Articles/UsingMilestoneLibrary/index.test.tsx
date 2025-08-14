import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import UsingMilestoneLibrary from '.';

describe('UsingMilestoneLibrary', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <UsingMilestoneLibrary />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
