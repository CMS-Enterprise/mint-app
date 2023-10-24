import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import UtilizingSolutions from '.';

describe('UtilizingSolutions', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <UtilizingSolutions />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
