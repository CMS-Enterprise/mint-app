import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  modelID,
  possibleSolutionsMock,
  solutionAndMilestoneMock
} from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import ReadOnlyMTOSolutions from './index';

describe('Read view MTO milestones', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/read-view/milestones`]}
      >
        <MockedProvider
          mocks={[...solutionAndMilestoneMock, ...possibleSolutionsMock]}
          addTypename={false}
        >
          <Route path="/models/:modelID/read-view/milestones">
            <MessageProvider>
              <ReadOnlyMTOSolutions modelID={modelID} />
            </MessageProvider>
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Ready for review')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Solution 1')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
