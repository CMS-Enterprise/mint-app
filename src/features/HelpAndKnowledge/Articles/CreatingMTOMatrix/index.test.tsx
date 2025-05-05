import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import CreatingMTOMatrix from '.';

describe('CreatingMTOMatrix', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <CreatingMTOMatrix />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
