import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import AddCustomSolution from '.';

describe('AddCustomSolution', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <AddCustomSolution />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
