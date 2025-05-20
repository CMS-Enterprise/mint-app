import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import StartingMTOMatrix from '.';

describe('StartingMTOMatrix', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <StartingMTOMatrix />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
