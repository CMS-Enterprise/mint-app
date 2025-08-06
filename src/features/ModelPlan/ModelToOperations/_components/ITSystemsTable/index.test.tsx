import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import {
  modelID,
  possibleSolutionsMock,
  solutionAndMilestoneMock
} from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import ITSystemsTable from './index';

describe('ITSystemsTable Component', () => {
  it('renders correctly and matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/collaboration-area/model-to-operations/matrix?view=solutions`
        ]}
      >
        <MockedProvider
          mocks={[...possibleSolutionsMock, ...solutionAndMilestoneMock]}
          addTypename={false}
        >
          <Route path="/models/:modelID/collaboration-area/model-to-operations/matrix">
            <MessageProvider>
              <ITSystemsTable />
            </MessageProvider>
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    // Wait for the component to finish loading
    await screen.findByText('Solution 1');

    // Match the snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});
