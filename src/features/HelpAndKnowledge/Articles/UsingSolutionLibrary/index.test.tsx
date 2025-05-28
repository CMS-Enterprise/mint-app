import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import UsingSolutionLibrary from '.';

describe('UsingSolutionLibrary', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <UsingSolutionLibrary />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
