import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { commonMilestonesMock, suggestedMilestonesMock } from 'tests/mock/mto';

import MilestoneLibrary from '.';

describe('MilestoneCardGroup Component', () => {
  it('renders correctly and matches snapshot', () => {
    const { asFragment } = render(
      <MockedProvider
        mocks={[...suggestedMilestonesMock, ...commonMilestonesMock]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[
            '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/model-to-operations/milestone-library'
          ]}
        >
          <Route path="/models/:modelID/collaboration-area/model-to-operations/milestone-library">
            <MilestoneLibrary />
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );

    // Match the snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});
