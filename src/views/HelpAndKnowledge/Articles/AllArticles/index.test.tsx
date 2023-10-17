import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import AllArticles from '.';

describe('The AllArticles component', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter>
        <AllArticles />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
