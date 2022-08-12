import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';

import ITToolsWarning from './index';

const modelID: string = '123';

describe('The ITToolsWarning component', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/ops-eval-and-learning'
        ]}
      >
        <Route path="/models/:modelID/task-list/ops-eval-and-learning">
          <ITToolsWarning
            route={`/models/${modelID}/task-list/it-tools/page-four`}
          />
        </Route>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
