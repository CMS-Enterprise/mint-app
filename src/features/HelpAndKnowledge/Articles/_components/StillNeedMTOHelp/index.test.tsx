import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import StillNeedMTOHelp from '.';

describe('StillNeedMTOHelp', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <StillNeedMTOHelp />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
