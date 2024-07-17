import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';

import DataExchangeApproachHelpArticle from '.';

describe('Get Access Article', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={['/help-and-knowledge/data-exchange-approach']}
      >
        <Route path="/help-and-knowledge/data-exchange-approach">
          <DataExchangeApproachHelpArticle />
        </Route>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
