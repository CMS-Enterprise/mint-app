import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import ModelSolutionImplementation from '.';

describe('ModelSolutionImplementation', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <ModelSolutionImplementation />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
