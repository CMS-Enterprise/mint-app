import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render } from '@testing-library/react';

import GetAccess from '.';

describe('Get Access Article', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/how-to-get-access']}>
        <Routes>
          <Route
            path="/how-to-get-access"
            element={<GetAccess  />}
          />
        </Routes>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
