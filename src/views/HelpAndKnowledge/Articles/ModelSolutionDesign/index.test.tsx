import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import ModelSolutionDesign from '.';

describe('ModelSolutionDesign', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <ModelSolutionDesign />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
