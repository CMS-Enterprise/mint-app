import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';

import HighLevelProjectPlan from '.';

describe('High Level Project Plan Article', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={['/help-and-knowledge/high-level-project-plan']}
      >
        <Route path="/help-and-knowledge/high-level-project-plan">
          <HighLevelProjectPlan />
        </Route>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
