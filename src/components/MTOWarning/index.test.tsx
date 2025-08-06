import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render } from '@testing-library/react';

import MTOWarning from './index';

describe('The MTOWarning component', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/ops-eval-and-learning'
        ]}
      >
        <Routes>
          <Route
            path="/models/:modelID/collaboration-area/task-list/ops-eval-and-learning"
            element={<MTOWarning id="test-id" />}
          />
        </Routes>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
