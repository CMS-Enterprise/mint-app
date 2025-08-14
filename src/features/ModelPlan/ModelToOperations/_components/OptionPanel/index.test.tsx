import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';

import MTOOptionsPanel from '.';

describe('MTOOptionsPanel', () => {
  it('renders correctly', () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/123/collaboration-area/model-to-operations/matrix'
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/model-to-operations/matrix">
          <MTOOptionsPanel />
        </Route>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
