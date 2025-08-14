import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import StepsOverview from '.';

describe('StepsOverview', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <StepsOverview />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
