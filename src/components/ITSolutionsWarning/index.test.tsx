import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';

import ITSolutionsWarning from './index';

describe('The ITSolutionsWarning component', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/ops-eval-and-learning'
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/task-list/ops-eval-and-learning">
          <ITSolutionsWarning id="test-id" onClick={() => null} />
        </Route>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
