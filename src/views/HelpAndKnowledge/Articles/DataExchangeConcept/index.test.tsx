import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';

import DataExchangeConceptHelpArticle from '.';

describe('Get Access Article', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={['/help-and-knowledge/data-exchange-concept']}
      >
        <Route path="/help-and-knowledge/data-exchange-concept">
          <DataExchangeConceptHelpArticle />
        </Route>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
