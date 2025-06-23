import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import { ModelStatus } from 'gql/generated/graphql';

import CollaborationStatusBanner from './index';

describe('CollaborationStatusBanner', () => {
  it('renders all main elements', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <Route>
          <CollaborationStatusBanner
            modelID="abc123"
            status={ModelStatus.PLAN_DRAFT}
            mostRecentEdit="2023-10-01T12:00:00Z"
            className="test-class"
          />
        </Route>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
