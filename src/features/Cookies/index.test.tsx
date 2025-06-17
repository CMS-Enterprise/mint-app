import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import Cookies from '.';

describe('Cookies', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <Cookies />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
