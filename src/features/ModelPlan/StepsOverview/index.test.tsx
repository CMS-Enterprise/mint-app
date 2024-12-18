import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import StepsOverview from './index';

describe('The Model Plan Steps Overview static page', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <StepsOverview />
      </MemoryRouter>
    );

    expect(asFragment).toMatchSnapshot();
  });
});
