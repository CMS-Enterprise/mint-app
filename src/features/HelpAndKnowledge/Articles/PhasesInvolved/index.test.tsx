import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import PhasesInvolved from '.';

describe('PhasesInvolved', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <PhasesInvolved />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
