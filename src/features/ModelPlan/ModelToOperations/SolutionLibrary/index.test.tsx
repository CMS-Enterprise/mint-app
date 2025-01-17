import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { commonSolutionsMock } from 'tests/mock/mto';
import { possibleSolutionsMock } from 'tests/mock/solutions';

import MessageProvider from 'contexts/MessageContext';

import SolutionLibrary from '.';

describe('SolutionLibrary Component', () => {
  it('renders correctly and matches snapshot', () => {
    const { asFragment } = render(
      <MockedProvider
        mocks={[...commonSolutionsMock, ...possibleSolutionsMock]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[
            '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/model-to-operations/solution-library'
          ]}
        >
          <Route path="/models/:modelID/collaboration-area/model-to-operations/solution-library">
            <MessageProvider>
              <SolutionLibrary />
            </MessageProvider>
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );

    // Match the snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});
